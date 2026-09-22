package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"real-time-order-tracking/backend/internal/models"
	"real-time-order-tracking/backend/internal/realtime"
	"real-time-order-tracking/backend/internal/repository"
)

var (
	ErrOrderNotFound       = errors.New("order not found")
	ErrInvalidTransition   = errors.New("invalid status transition")
	ErrOrderAlreadyChanged = errors.New("order has already been changed")
	ErrOrderCancelled      = errors.New("order is already cancelled")
	ErrOrderCompleted      = errors.New("order is already completed")
	ErrDuplicateEvent      = errors.New("event has already been processed")
)

type CreateOrderInput struct {
	CustomerName string `json:"customer_name"`
	Service      string `json:"service"`
}

type UpdateStatusInput struct {
	Status    models.OrderStatus `json:"status"`
	EventID   string             `json:"event_id"`
	ActorType string             `json:"actor_type"`
	ActorID   string             `json:"actor_id"`
}

type OrderService struct {
	orderRepo *repository.OrderRepository
	eventRepo *repository.EventRepository
	hub       *realtime.Hub
}

func NewOrderService(
	orderRepo *repository.OrderRepository,
	eventRepo *repository.EventRepository,
	hub *realtime.Hub,
) *OrderService {

	return &OrderService{
		orderRepo: orderRepo,
		eventRepo: eventRepo,
		hub:       hub,
	}
}

func (s *OrderService) CreateOrder(
	ctx context.Context,
	input CreateOrderInput,
) (*models.Order, error) {

	if input.CustomerName == "" {
		return nil, errors.New("customer_name is required")
	}

	if input.Service == "" {
		return nil, errors.New("service is required")
	}

	orderNumber := fmt.Sprintf(
		"ORD-%d",
		time.Now().UnixNano(),
	)

	order, err := s.orderRepo.Create(
		ctx,
		orderNumber,
		input.CustomerName,
		input.Service,
	)

	if err != nil {
		return nil, err
	}

	return order, nil
}

func (s *OrderService) GetOrders(
	ctx context.Context,
) ([]models.Order, error) {

	return s.orderRepo.FindAll(ctx)
}

func (s *OrderService) GetOrder(
	ctx context.Context,
	id uint64,
) (*models.Order, error) {

	order, err := s.orderRepo.FindByID(ctx, id)

	if err != nil {
		if repository.IsNotFound(err) {
			return nil, ErrOrderNotFound
		}

		return nil, err
	}

	return order, nil
}

func (s *OrderService) UpdateStatus(
	ctx context.Context,
	id uint64,
	input UpdateStatusInput,
) (*models.Order, error) {

	if input.EventID == "" {
		return nil, errors.New("event_id is required")
	}

	if input.ActorType == "" {
		input.ActorType = "SYSTEM"
	}

	order, err := s.GetOrder(ctx, id)

	if err != nil {
		return nil, err
	}

	// Idempotency check.
	// Jika event yang sama dikirim kembali,
	// kita tidak memprosesnya sebagai perubahan baru.
	existingEvents, err := s.eventRepo.FindByOrderID(ctx, id)

	if err != nil {
		return nil, err
	}

	for _, event := range existingEvents {
		if event.EventID == input.EventID {
			return order, nil
		}
	}

	if !isValidTransition(
		order.Status,
		input.Status,
	) {
		return nil, ErrInvalidTransition
	}

	tx, err := s.orderRepo.BeginTx(ctx)

	if err != nil {
		return nil, err
	}

	defer tx.Rollback()

	success, err := s.orderRepo.UpdateStatus(
		ctx,
		tx,
		id,
		order.Version,
		input.Status,
	)

	if err != nil {
		return nil, err
	}

	if !success {
		return nil, ErrOrderAlreadyChanged
	}

	newVersion := order.Version + 1

	actorID := input.ActorID

	event := &models.OrderEvent{
		OrderID:        id,
		EventID:        input.EventID,
		PreviousStatus: &order.Status,
		NewStatus:      input.Status,
		Version:        newVersion,
		ActorType:      input.ActorType,
		ActorID:        &actorID,
	}

	err = s.eventRepo.Create(
		ctx,
		tx,
		event,
	)

	if err != nil {
		if repository.IsDuplicateError(err) {
			return nil, ErrDuplicateEvent
		}

		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	updatedOrder, err := s.GetOrder(ctx, id)

	if err != nil {
		return nil, err
	}

	s.hub.Publish(
		realtime.Event{
			ID:      input.EventID,
			Type:    "order.updated",
			OrderID: id,
			Data:    updatedOrder,
		},
	)

	return updatedOrder, nil
}

func (s *OrderService) CancelOrder(
	ctx context.Context,
	id uint64,
	eventID string,
	actorID string,
) (*models.Order, error) {

	if eventID == "" {
		return nil, errors.New("event_id is required")
	}

	order, err := s.GetOrder(ctx, id)

	if err != nil {
		return nil, err
	}

	if order.Status == models.StatusCancelled {
		return nil, ErrOrderCancelled
	}

	if order.Status == models.StatusDone {
		return nil, ErrOrderCompleted
	}

	return s.UpdateStatus(
		ctx,
		id,
		UpdateStatusInput{
			Status:    models.StatusCancelled,
			EventID:   eventID,
			ActorType: "CUSTOMER",
			ActorID:   actorID,
		},
	)
}

func (s *OrderService) GetHistory(
	ctx context.Context,
	id uint64,
) ([]models.OrderEvent, error) {

	_, err := s.GetOrder(ctx, id)

	if err != nil {
		return nil, err
	}

	return s.eventRepo.FindByOrderID(
		ctx,
		id,
	)
}

func isValidTransition(
	current models.OrderStatus,
	next models.OrderStatus,
) bool {

	switch current {

	case models.StatusPending:
		return next == models.StatusAssigned ||
			next == models.StatusCancelled

	case models.StatusAssigned:
		return next == models.StatusInProgress ||
			next == models.StatusCancelled

	case models.StatusInProgress:
		return next == models.StatusDone ||
			next == models.StatusCancelled

	case models.StatusDone:
		return false

	case models.StatusCancelled:
		return false

	default:
		return false
	}
}
