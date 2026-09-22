import type { SSEOrderEvent } from "../types/order";

const SSE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/api$/, "") + "/api/orders/events";

export function createOrderEventSource() {
  return new EventSource(SSE_URL);
}

export function parseOrderEvent(event: MessageEvent): SSEOrderEvent | null {
  try {
    return JSON.parse(event.data);
  } catch (error) {
    console.error("Failed to parse SSE event:", error);

    return null;
  }
}
