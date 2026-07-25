import Image from "next/image";

import { getAdminProducts } from "@/lib/admin/products";
import { formatPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

const LOW_STOCK_THRESHOLD = 5;

export default async function ProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Products</h1>
        <p className="mt-1 text-sm text-white/50">
          {products.length} product{products.length === 1 ? "" : "s"} in your catalog.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-[#1f1f1f] p-10 text-center text-white/40">
          No products found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1f1f1f]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-white/40">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const lowStock = product.stock <= LOW_STOCK_THRESHOLD;
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-white/5">
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <span className="font-medium text-white">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/60 capitalize">{product.category}</td>
                      <td className="px-4 py-3 text-white/60 capitalize">
                        {product.product_type}
                      </td>
                      <td className="px-4 py-3 font-medium text-white">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            lowStock
                              ? "inline-flex rounded-md border border-red-500/30 bg-red-500/15 px-2 py-1 text-xs font-medium text-red-400"
                              : "text-white/60"
                          }
                        >
                          {product.stock}
                          {lowStock ? " · low" : ""}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
