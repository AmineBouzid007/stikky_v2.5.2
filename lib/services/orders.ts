// -----------------------------------------------------------------------------
// Order service layer. Checkout should call placeOrder() and never touch
// Supabase or localStorage directly — this is the seam that lets the site
// run with zero setup (localStorage) and upgrade to a real database
// (Supabase, with atomic stock checks) by just setting env vars.
// -----------------------------------------------------------------------------

import { createClient as createBrowserSupabase } from "@/lib/supabase/client";
import { isDatabaseConfigured } from "@/lib/supabase/config";
import { createOrder as createLocalOrder } from "@/lib/local-store";
import type { CartItem } from "@/lib/types";

export interface PlaceOrderCustomer {
  full_name: string;
  phone: string;
  email: string;
  country: string;
  address: string;
  city: string;
  governorate: string;
  postal_code: string;
}

export interface PlaceOrderInput {
  customer: PlaceOrderCustomer;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  notes?: string;
}

export interface PlaceOrderResult {
  id: string;
  source: "database" | "local";
}

export class OutOfStockError extends Error {}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  if (isDatabaseConfigured()) {
    try {
      const supabase = createBrowserSupabase();
      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase.rpc("place_order", {
        order_payload: {
          user_id: userData.user?.id ?? null,
          customer_name: input.customer.full_name,
          phone: input.customer.phone,
          email: input.customer.email,
          country: input.customer.country,
          address: input.customer.address,
          city: input.customer.city,
          governorate: input.customer.governorate,
          postal_code: input.customer.postal_code,
          notes: input.notes ?? null,
          subtotal: input.subtotal,
          shipping: input.shipping,
          total: input.total,
        },
        items_payload: input.items.map((item) => ({
          // Static/local fallback products use ids like "seed-0-slug", which
          // aren't real product rows — only pass through real DB uuids.
          product_id: /^[0-9a-f-]{36}$/i.test(item.productId) ? item.productId : null,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          frame: item.frame ?? null,
          image_url: item.image_url,
        })),
      });

      if (error) {
        if (error.message?.includes("insufficient_stock")) {
          throw new OutOfStockError(error.message.split(":")[1] ?? "One item");
        }
        throw error;
      }

      return { id: data as string, source: "database" };
    } catch (err) {
      if (err instanceof OutOfStockError) throw err;
      // Any other failure (network, misconfigured project, etc.) — degrade
      // to local storage rather than losing the order entirely.
      console.error("[orders] Supabase order failed, falling back to local storage:", err);
    }
  }

  const order = createLocalOrder({
    customer: input.customer,
    items: input.items,
    subtotal: input.subtotal,
    shipping: input.shipping,
    total: input.total,
    payment_method: "cod",
    notes: input.notes,
  });
  return { id: order.id, source: "local" };
}
