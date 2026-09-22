package repository

import (
	"context"
	"database/sql"
	"strings"

	"real-time-order-tracking/backend/internal/models"
)

type OrderRepository struct {
	db *sql.DB
}

func NewOrderRepository(db *sql.DB) *OrderRepository {
	return &OrderRepository{
		db: db,
	}
}

func (r *OrderRepository) Create(
	ctx context.Context,
	orderNumber string,
	customerName string,
	service string,
) (*models.Order, error) {

	query := `
		INSERT INTO orders (
			order_number,
			customer_name,
			service,
			status,
			version
		)
		VALUES (?, ?, ?, ?, 1)
	`

	result, err := r.db.ExecContext(
		ctx,
		query,
		orderNumber,
		customerName,
		service,
		models.StatusPending,
	)

	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	return r.FindByID(ctx, uint64(id))
}

func (r *OrderRepository) FindAll(
	ctx context.Context,
) ([]models.Order, error) {

	query := `
		SELECT
			id,
			order_number,
			customer_name,
			service,
			status,
			version,
			created_at,
			updated_at
		FROM orders
		ORDER BY created_at DESC
	`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	orders := make([]models.Order, 0)

	for rows.Next() {
		var order models.Order

		err := rows.Scan(
			&order.ID,
			&order.OrderNumber,
			&order.CustomerName,
			&order.Service,
			&order.Status,
			&order.Version,
			&order.CreatedAt,
			&order.UpdatedAt,
		)

		if err != nil {
			return nil, err
		}

		orders = append(orders, order)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return orders, nil
}

func (r *OrderRepository) FindByID(
	ctx context.Context,
	id uint64,
) (*models.Order, error) {

	query := `
		SELECT
			id,
			order_number,
			customer_name,
			service,
			status,
			version,
			created_at,
			updated_at
		FROM orders
		WHERE id = ?
	`

	var order models.Order

	err := r.db.QueryRowContext(
		ctx,
		query,
		id,
	).Scan(
		&order.ID,
		&order.OrderNumber,
		&order.CustomerName,
		&order.Service,
		&order.Status,
		&order.Version,
		&order.CreatedAt,
		&order.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &order, nil
}

func (r *OrderRepository) UpdateStatus(
	ctx context.Context,
	tx *sql.Tx,
	id uint64,
	currentVersion uint,
	newStatus models.OrderStatus,
) (bool, error) {

	query := `
		UPDATE orders
		SET
			status = ?,
			version = version + 1
		WHERE
			id = ?
			AND version = ?
	`

	result, err := tx.ExecContext(
		ctx,
		query,
		newStatus,
		id,
		currentVersion,
	)

	if err != nil {
		return false, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return false, err
	}

	return rowsAffected == 1, nil
}

func (r *OrderRepository) BeginTx(
	ctx context.Context,
) (*sql.Tx, error) {
	return r.db.BeginTx(ctx, nil)
}

func IsNotFound(err error) bool {
	return err == sql.ErrNoRows
}

func IsDuplicateError(err error) bool {
	if err == nil {
		return false
	}

	return strings.Contains(err.Error(), "Duplicate entry")
}