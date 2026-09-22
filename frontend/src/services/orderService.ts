import api from "./api";

import type {
  ApiResponse,
  CancelOrderPayload,
  CreateOrderPayload,
  Order,
  OrderEvent,
  UpdateStatusPayload,
} from "../types/order";

export async function getOrders(): Promise<Order[]> {
  const response = await api.get<ApiResponse<Order[]>>("/orders");

  return response.data.data;
}

export async function getOrder(id: number): Promise<Order> {
  const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);

  return response.data.data;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const response = await api.post<ApiResponse<Order>>("/orders", payload);

  return response.data.data;
}

export async function updateOrderStatus(
  id: number,
  payload: UpdateStatusPayload,
): Promise<Order> {
  const response = await api.patch<ApiResponse<Order>>(
    `/orders/${id}/status`,
    payload,
  );

  return response.data.data;
}

export async function cancelOrder(
  id: number,
  payload: CancelOrderPayload,
): Promise<Order> {
  const response = await api.post<ApiResponse<Order>>(
    `/orders/${id}/cancel`,
    payload,
  );

  return response.data.data;
}

export async function getOrderHistory(id: number): Promise<OrderEvent[]> {
  const response = await api.get<ApiResponse<OrderEvent[]>>(
    `/orders/${id}/history`,
  );

  return response.data.data;
}
