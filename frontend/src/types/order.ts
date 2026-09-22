export type OrderStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELLED";

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  service: string;
  status: OrderStatus;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface OrderEvent {
  id: number;
  order_id: number;
  event_id: string;
  previous_status: OrderStatus | null;
  new_status: OrderStatus;
  version: number;
  actor_type: string;
  actor_id: string | null;
  created_at: string;
}

export interface CreateOrderPayload {
  customer_name: string;
  service: string;
}

export interface UpdateStatusPayload {
  status: OrderStatus;
  event_id?: string;
  actor_type?: string;
  actor_id?: string;
}

export interface CancelOrderPayload {
  event_id: string;
  actor_id: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface SSEOrderEvent {
  id: string;
  type: string;
  order_id: number;
  data: Order;
}
