package repository

import (
	"context"
	"database/sql"

	"real-time-order-tracking/backend/internal/models"
)

type EventRepository struct {
	db *sql.DB
}

func NewEventRepository(db *sql.DB) *EventRepository {
	return &EventRepository{
		db: db,
	}
}

func (r *EventRepository) Create(
	ctx context.Context,
	tx *sql.Tx,
	event *models.OrderEvent,
) error {

	query := `
		INSERT INTO order_events (
			order_id,
			event_id,
			previous_status,
			new_status,
			version,
			actor_type,
			actor_id
		)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`

	_, err := tx.ExecContext(
		ctx,
		query,
		event.OrderID,
		event.EventID,
		event.PreviousStatus,
		event.NewStatus,
		event.Version,
		event.ActorType,
		event.ActorID,
	)

	return err
}

func (r *EventRepository) FindByOrderID(
	ctx context.Context,
	orderID uint64,
) ([]models.OrderEvent, error) {

	query := `
		SELECT
			id,
			order_id,
			event_id,
			previous_status,
			new_status,
			version,
			actor_type,
			actor_id,
			created_at
		FROM order_events
		WHERE order_id = ?
		ORDER BY version ASC
	`

	rows, err := r.db.QueryContext(
		ctx,
		query,
		orderID,
	)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	events := make([]models.OrderEvent, 0)

	for rows.Next() {
		var event models.OrderEvent

		err := rows.Scan(
			&event.ID,
			&event.OrderID,
			&event.EventID,
			&event.PreviousStatus,
			&event.NewStatus,
			&event.Version,
			&event.ActorType,
			&event.ActorID,
			&event.CreatedAt,
		)

		if err != nil {
			return nil, err
		}

		events = append(events, event)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return events, nil
}
