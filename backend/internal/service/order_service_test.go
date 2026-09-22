package service

import (
	"testing"

	"real-time-order-tracking/backend/internal/models"
)

func TestIsValidTransition(t *testing.T) {
	tests := []struct {
		name     string
		current  models.OrderStatus
		next     models.OrderStatus
		expected bool
	}{
		// From PENDING
		{"PENDING to ASSIGNED", models.StatusPending, models.StatusAssigned, true},
		{"PENDING to CANCELLED", models.StatusPending, models.StatusCancelled, true},
		{"PENDING to IN_PROGRESS", models.StatusPending, models.StatusInProgress, false},
		{"PENDING to DONE", models.StatusPending, models.StatusDone, false},

		// From ASSIGNED
		{"ASSIGNED to IN_PROGRESS", models.StatusAssigned, models.StatusInProgress, true},
		{"ASSIGNED to CANCELLED", models.StatusAssigned, models.StatusCancelled, true},
		{"ASSIGNED to PENDING", models.StatusAssigned, models.StatusPending, false},
		{"ASSIGNED to DONE", models.StatusAssigned, models.StatusDone, false},

		// From IN_PROGRESS
		{"IN_PROGRESS to DONE", models.StatusInProgress, models.StatusDone, true},
		{"IN_PROGRESS to CANCELLED", models.StatusInProgress, models.StatusCancelled, true},
		{"IN_PROGRESS to ASSIGNED", models.StatusInProgress, models.StatusAssigned, false},
		{"IN_PROGRESS to PENDING", models.StatusInProgress, models.StatusPending, false},

		// From DONE (terminal)
		{"DONE to any", models.StatusDone, models.StatusCancelled, false},
		{"DONE to PENDING", models.StatusDone, models.StatusPending, false},

		// From CANCELLED (terminal)
		{"CANCELLED to any", models.StatusCancelled, models.StatusPending, false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := isValidTransition(tt.current, tt.next)
			if result != tt.expected {
				t.Errorf("isValidTransition(%s, %s) = %v, expected %v", tt.current, tt.next, result, tt.expected)
			}
		})
	}
}
