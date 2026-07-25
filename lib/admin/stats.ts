import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { DashboardStats } from "@/lib/types/dashboard";

const LOW_STOCK_THRESHOLD = 5;

/**
 * Aggregate stats for the dashboard home. Uses the service-role client so
 * it can see every order/product regardless of RLS (the orders table only
 * has an "own rows" select policy for customers, so the anon key can't be
 * used here — see the note in lib/supabase/admin.ts).
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createAdminClient();

  const [ordersRes, productsRes] = await Promise.all([
    supabase.from("orders").select("id,status,total"),
    supabase.from("products").select("id,stock"),
  ]);

  const orders = ordersRes.data ?? [];
  const products = productsRes.data ?? [];

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total ?? 0), 0);
  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => Number(p.stock ?? 0) <= LOW_STOCK_THRESHOLD,
  ).length;

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    deliveredOrders,
    totalProducts,
    lowStockProducts,
  };
}
