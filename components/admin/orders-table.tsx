"use client";

import { useState, useTransition } from "react";

import type { OrderStatus } from "@/lib/types";
import type { AdminOrder } from "@/lib/admin/order-constants";
import { ORDER_STATUSES } from "@/lib/admin/order-constants";
import { updateOrderStatusAction } from "@/app/admin/orders/actions";
import { formatPrice } from "@/lib/products";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  processing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/15 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface OrdersTableProps {
  orders: AdminOrder[];
  editable?: boolean;
}

export default function OrdersTable({ orders, editable = false }: OrdersTableProps) {
  const [localOrders, setLocalOrders] = useState(orders);
  const [pendingId, startTransition] = useTransition();
  const [errorFor, setErrorFor] = useState<string | null>(null);

  if (localOrders.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-[#1f1f1f] p-10 text-center text-white/40">
        No orders yet.
      </div>
    );
  }

  function handleStatusChange(orderId: string, status: OrderStatus) {
    const previous = localOrders;
    setLocalOrders((current) =>
      current.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );
    setErrorFor(null);

    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, status);
      if (!result.success) {
        setLocalOrders(previous);
        setErrorFor(orderId);
      }
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1f1f1f]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">Address</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {localOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3 font-mono text-xs text-white/50">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-white">{order.customer_name}</td>
                <td className="px-4 py-3 text-white/60">
                  <div>{order.phone}</div>
                  <div className="text-xs text-white/40">{order.email}</div>
                </td>
                <td className="px-4 py-3 text-white/60">
                  <div className="max-w-[180px] truncate">{order.address}</div>
                  <div className="text-xs text-white/40">
                    {order.city}, {order.governorate}
                  </div>
                </td>
                <td className="px-4 py-3 text-white/60">
                  <div className="max-w-[200px] truncate">
                    {order.order_items?.length
                      ? order.order_items
                          .map((item) => `${item.product_name} x${item.quantity}`)
                          .join(", ")
                      : "—"}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-white">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-3">
                  {editable ? (
                    <select
                      value={order.status}
                      disabled={pendingId}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as OrderStatus)
                      }
                      className={`rounded-md border px-2 py-1 text-xs font-medium outline-none disabled:opacity-50 ${STATUS_STYLES[order.status]}`}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status} className="bg-[#1f1f1f] text-white">
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                  )}
                  {errorFor === order.id ? (
                    <p className="mt-1 text-xs text-red-400">Update failed</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-white/50">{formatDate(order.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
