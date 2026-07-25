import OrdersTable from "@/components/admin/orders-table";
import { getOrders } from "@/lib/admin/orders";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Orders</h1>
        <p className="mt-1 text-sm text-white/50">
          {orders.length} order{orders.length === 1 ? "" : "s"} total. Update status as
          orders are confirmed, shipped, and delivered.
        </p>
      </div>

      <OrdersTable orders={orders} editable />
    </div>
  );
}
