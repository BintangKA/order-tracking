package main

import (
	"log"

	"github.com/gin-gonic/gin"

	"github.com/gin-contrib/cors"
	"real-time-order-tracking/backend/internal/config"
	"real-time-order-tracking/backend/internal/database"
	"real-time-order-tracking/backend/internal/handler"
	"real-time-order-tracking/backend/internal/realtime"
	"real-time-order-tracking/backend/internal/repository"
	"real-time-order-tracking/backend/internal/routes"
	"real-time-order-tracking/backend/internal/service"
)

func main() {

	// Load configuration.
	cfg := config.Load()

	// Connect MySQL.
	db, err := database.Connect(cfg)

	if err != nil {
		log.Fatal("Failed to connect database:", err)
	}

	defer db.Close()

	log.Println("MySQL connected successfully")

	// Realtime SSE hub.
	hub := realtime.NewHub()

	// Repository.
	orderRepository := repository.NewOrderRepository(db)

	eventRepository := repository.NewEventRepository(db)

	// Service.
	orderService := service.NewOrderService(
		orderRepository,
		eventRepository,
		hub,
	)

	// Handler.
	orderHandler := handler.NewOrderHandler(
		orderService,
	)

	sseHandler := handler.NewSSEHandler(
		hub,
	)

	// Gin.
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))
	
	// Routes.
	routes.Setup(
		router,
		orderHandler,
		sseHandler,
	)

	log.Println(
		"Server running on http://localhost:" + cfg.AppPort,
	)

	if err := router.Run(":" + cfg.AppPort); err != nil {
		log.Fatal(err)
	}
}
