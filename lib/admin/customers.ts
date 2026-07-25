import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";

export interface AdminCustomer {
  key: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

/**
 * There's no dedicated customers table — customers are derived by grouping
 * orders by email/phone. This keeps the dashboard useful without requiring
 * any schema changes.
 */
export async function getCustomers(): Promise<AdminCustomer[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("customer_name, email, phone, total, created_at")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[admin/customers] failed to fetch orders:", error?.message);
    return [];
  }

  const byKey = new Map<string, AdminCustomer>();

  for (const order of data) {
    const key = (order.email || order.phone || order.customer_name || "unknown").toLowerCase();
    const existing = byKey.get(key);

    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += Number(order.total ?? 0);
      if (order.created_at > existing.lastOrderDate) {
        existing.lastOrderDate = order.created_at;
      }
    } else {
      byKey.set(key, {
        key,
        name: order.customer_name ?? "—",
        email: order.email ?? "—",
        phone: order.phone ?? "—",
        ordersCount: 1,
        totalSpent: Number(order.total ?? 0),
        lastOrderDate: order.created_at,
      });
    }
  }

  return Array.from(byKey.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}
