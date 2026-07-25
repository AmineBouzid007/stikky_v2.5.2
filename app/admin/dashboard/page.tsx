import { ShoppingBag, Clock, CheckCircle2, Wallet } from "lucide-react";
import Link from "next/link";

import StatCard from "@/components/admin/stat-card";
import OrdersTable from "@/components/admin/orders-table";
import { getDashboardStats } from "@/lib/admin/stats";
import { getOrders } from "@/lib/admin/orders";
import { formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    getOrders(5),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">
          Overview of your store&apos;s orders and revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingBag}
          accent
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders.toLocaleString()}
          icon={Clock}
        />
        <StatCard
          label="Completed Orders"
          value={stats.deliveredOrders.toLocaleString()}
          icon={CheckCircle2}
        />
        <StatCard
          label="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={Wallet}
          accent
        />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-[#FF4500] hover:text-[#FF4500]/80"
          >
            View all
          </Link>
        </div>
        <OrdersTable orders={recentOrders} />
      </div>
    </div>
  );
}
