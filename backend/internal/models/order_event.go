package models

import "time"

type OrderEvent struct {
	ID             uint64       `json:"id"`
	OrderID        uint64       `json:"order_id"`
	EventID        string       `json:"event_id"`
	PreviousStatus *OrderStatus `json:"previous_status"`
	NewStatus      OrderStatus  `json:"new_status"`
	Version        uint         `json:"version"`
	ActorType      string       `json:"actor_type"`
	ActorID        *string      `json:"actor_id"`
	CreatedAt      time.Time    `json:"created_at"`
}
