package routes

import (
	"github.com/gin-gonic/gin"

	"real-time-order-tracking/backend/internal/handler"
)

func Setup(
	router *gin.Engine,
	orderHandler *handler.OrderHandler,
	sseHandler *handler.SSEHandler,
) {

	api := router.Group("/api")

	{
		api.GET("/orders", orderHandler.GetOrders)

		api.POST("/orders", orderHandler.CreateOrder)

		api.GET("/orders/:id", orderHandler.GetOrder)

		api.PATCH(
			"/orders/:id/status",
			orderHandler.UpdateStatus,
		)

		api.POST(
			"/orders/:id/cancel",
			orderHandler.CancelOrder,
		)

		api.GET(
			"/orders/:id/history",
			orderHandler.GetHistory,
		)

		api.GET(
			"/orders/events",
			sseHandler.Stream,
		)
	}
}
