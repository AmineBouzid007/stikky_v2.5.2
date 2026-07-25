import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminOrder } from "@/lib/admin/order-constants";

export type { AdminOrder, AdminOrderItem } from "@/lib/admin/order-constants";
export { ORDER_STATUSES } from "@/lib/admin/order-constants";

/**
 * Fetches orders (newest first) with their line items joined in, using the
 * service-role client so it isn't limited by the customer-facing RLS policy
 * (orders_select_own only lets a shopper see their own orders).
 */
export async function getOrders(limit?: number): Promise<AdminOrder[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from("orders")
    .select(
      "*, order_items(id, product_name, quantity, price, size, frame)",
    )
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) {
    console.error("[admin/orders] failed to fetch orders:", error?.message);
    return [];
  }

  return data as unknown as AdminOrder[];
}

export async function getOrderById(id: string): Promise<AdminOrder | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(id, product_name, quantity, price, size, frame)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as AdminOrder;
}
