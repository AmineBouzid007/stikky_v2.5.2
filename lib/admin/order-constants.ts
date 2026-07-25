import type { OrderStatus, Order } from "@/lib/types";

export interface AdminOrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  size: string | null;
  frame: string | null;
}

export interface AdminOrder extends Order {
  order_items: AdminOrderItem[];
}

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
