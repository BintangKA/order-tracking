package models

import "time"

type OrderStatus string

const (
	StatusPending    OrderStatus = "PENDING"
	StatusAssigned   OrderStatus = "ASSIGNED"
	StatusInProgress OrderStatus = "IN_PROGRESS"
	StatusDone       OrderStatus = "DONE"
	StatusCancelled  OrderStatus = "CANCELLED"
)

type Order struct {
	ID           uint64      `json:"id"`
	OrderNumber  string      `json:"order_number"`
	CustomerName string      `json:"customer_name"`
	Service      string      `json:"service"`
	Status       OrderStatus `json:"status"`
	Version      uint        `json:"version"`
	CreatedAt    time.Time   `json:"created_at"`
	UpdatedAt    time.Time   `json:"updated_at"`
}
