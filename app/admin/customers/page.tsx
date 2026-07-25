import { getCustomers } from "@/lib/admin/customers";
import { formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Customers</h1>
        <p className="mt-1 text-sm text-white/50">
          {customers.length} customer{customers.length === 1 ? "" : "s"}, derived from order
          history.
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#1f1f1f] p-10 text-center text-white/40">
          No customers yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1f1f1f]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Orders</th>
                  <th className="px-4 py-3 font-medium">Total Spent</th>
                  <th className="px-4 py-3 font-medium">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.key}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3 font-medium text-white">{customer.name}</td>
                    <td className="px-4 py-3 text-white/60">
                      <div>{customer.phone}</div>
                      <div className="text-xs text-white/40">{customer.email}</div>
                    </td>
                    <td className="px-4 py-3 text-white/60">{customer.ordersCount}</td>
                    <td className="px-4 py-3 font-medium text-white">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {formatDate(customer.lastOrderDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
