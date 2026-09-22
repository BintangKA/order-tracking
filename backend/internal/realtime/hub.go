package realtime

import (
	"encoding/json"
	"sync"
)

type Event struct {
	ID      string `json:"id"`
	Type    string `json:"type"`
	OrderID uint64 `json:"order_id"`
	Data    any    `json:"data"`
}

type Client struct {
	Channel chan Event
}

type Hub struct {
	mu      sync.RWMutex
	clients map[*Client]struct{}
}

func NewHub() *Hub {
	return &Hub{
		clients: make(map[*Client]struct{}),
	}
}

func (h *Hub) Subscribe() *Client {
	client := &Client{
		Channel: make(chan Event, 20),
	}

	h.mu.Lock()
	h.clients[client] = struct{}{}
	h.mu.Unlock()

	return client
}

func (h *Hub) Unsubscribe(client *Client) {
	h.mu.Lock()

	if _, exists := h.clients[client]; exists {
		delete(h.clients, client)
		close(client.Channel)
	}

	h.mu.Unlock()
}

func (h *Hub) Publish(event Event) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	for client := range h.clients {
		select {
		case client.Channel <- event:
		default:
			// Jika client terlalu lambat,
			// event tidak memenuhi buffer.
		}
	}
}

func (e Event) JSON() ([]byte, error) {
	return json.Marshal(e)
}
