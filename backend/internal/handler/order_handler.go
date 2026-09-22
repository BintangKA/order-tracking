package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"real-time-order-tracking/backend/internal/service"
)

type OrderHandler struct {
	orderService *service.OrderService
}

func NewOrderHandler(
	orderService *service.OrderService,
) *OrderHandler {

	return &OrderHandler{
		orderService: orderService,
	}
}

func (h *OrderHandler) CreateOrder(c *gin.Context) {

	var input service.CreateOrderInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid request body",
			"error":   err.Error(),
		})

		return
	}

	order, err := h.orderService.CreateOrder(
		c.Request.Context(),
		input,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})

		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "order created successfully",
		"data":    order,
	})
}

func (h *OrderHandler) GetOrders(c *gin.Context) {

	orders, err := h.orderService.GetOrders(
		c.Request.Context(),
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "failed to get orders",
			"error":   err.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": orders,
	})
}

func (h *OrderHandler) GetOrder(c *gin.Context) {

	id, err := strconv.ParseUint(
		c.Param("id"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid order id",
		})

		return
	}

	order, err := h.orderService.GetOrder(
		c.Request.Context(),
		id,
	)

	if err != nil {
		if err == service.ErrOrderNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"message": err.Error(),
			})

			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": order,
	})
}

func (h *OrderHandler) UpdateStatus(c *gin.Context) {

	id, err := strconv.ParseUint(
		c.Param("id"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid order id",
		})

		return
	}

	var input service.UpdateStatusInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid request body",
			"error":   err.Error(),
		})

		return
	}

	order, err := h.orderService.UpdateStatus(
		c.Request.Context(),
		id,
		input,
	)

	if err != nil {
		switch err {

		case service.ErrOrderNotFound:
			c.JSON(http.StatusNotFound, gin.H{
				"message": err.Error(),
			})

		case service.ErrInvalidTransition:
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"message": err.Error(),
			})

		case service.ErrOrderAlreadyChanged:
			c.JSON(http.StatusConflict, gin.H{
				"message": err.Error(),
			})

		case service.ErrDuplicateEvent:
			c.JSON(http.StatusConflict, gin.H{
				"message": err.Error(),
			})

		default:
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": err.Error(),
			})
		}

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "order status updated successfully",
		"data":    order,
	})
}

func (h *OrderHandler) CancelOrder(c *gin.Context) {

	id, err := strconv.ParseUint(
		c.Param("id"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid order id",
		})

		return
	}

	var request struct {
		EventID string `json:"event_id"`
		ActorID string `json:"actor_id"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid request body",
			"error":   err.Error(),
		})

		return
	}

	order, err := h.orderService.CancelOrder(
		c.Request.Context(),
		id,
		request.EventID,
		request.ActorID,
	)

	if err != nil {
		switch err {

		case service.ErrOrderNotFound:
			c.JSON(http.StatusNotFound, gin.H{
				"message": err.Error(),
			})

		case service.ErrOrderCompleted,
			service.ErrOrderCancelled:
			c.JSON(http.StatusUnprocessableEntity, gin.H{
				"message": err.Error(),
			})

		default:
			c.JSON(http.StatusInternalServerError, gin.H{
				"message": err.Error(),
			})
		}

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "order cancelled successfully",
		"data":    order,
	})
}

func (h *OrderHandler) GetHistory(c *gin.Context) {

	id, err := strconv.ParseUint(
		c.Param("id"),
		10,
		64,
	)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid order id",
		})

		return
	}

	history, err := h.orderService.GetHistory(
		c.Request.Context(),
		id,
	)

	if err != nil {
		if err == service.ErrOrderNotFound {
			c.JSON(http.StatusNotFound, gin.H{
				"message": err.Error(),
			})

			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": history,
	})
}
