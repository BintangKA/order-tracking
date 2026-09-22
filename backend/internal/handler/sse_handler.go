package handler

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"

	"real-time-order-tracking/backend/internal/realtime"
)

type SSEHandler struct {
	hub *realtime.Hub
}

func NewSSEHandler(
	hub *realtime.Hub,
) *SSEHandler {

	return &SSEHandler{
		hub: hub,
	}
}

func (h *SSEHandler) Stream(c *gin.Context) {

	client := h.hub.Subscribe()

	defer h.hub.Unsubscribe(client)

	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("X-Accel-Buffering", "no")

	// Initial connection event.
	fmt.Fprint(
		c.Writer,
		"event: connected\n",
	)

	fmt.Fprint(
		c.Writer,
		"data: {\"message\":\"SSE connected\"}\n\n",
	)

	c.Writer.Flush()

	ticker := time.NewTicker(20 * time.Second)

	defer ticker.Stop()

	for {
		select {

		case <-c.Request.Context().Done():
			return

		case event, ok := <-client.Channel:

			if !ok {
				return
			}

			data, err := event.JSON()

			if err != nil {
				continue
			}

			fmt.Fprintf(
				c.Writer,
				"id: %s\n",
				event.ID,
			)

			fmt.Fprintf(
				c.Writer,
				"event: %s\n",
				event.Type,
			)

			fmt.Fprintf(
				c.Writer,
				"data: %s\n\n",
				data,
			)

			c.Writer.Flush()

		case <-ticker.C:

			// Heartbeat agar connection tidak dianggap idle
			// oleh proxy/load balancer.
			fmt.Fprint(
				c.Writer,
				": heartbeat\n\n",
			)

			c.Writer.Flush()
		}
	}
}
