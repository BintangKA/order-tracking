import type { SSEOrderEvent } from "../types/order";

function getSseUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
  const baseUrl = apiUrl.replace(/\/api\/?$/, "");
  return `${baseUrl}/api/orders/events`;
}

export function createOrderEventSource() {
  return new EventSource(getSseUrl());
}

export function parseOrderEvent(event: MessageEvent): SSEOrderEvent | null {
  try {
    return JSON.parse(event.data);
  } catch (error) {
    console.error("Failed to parse SSE event:", error);

    return null;
  }
}
