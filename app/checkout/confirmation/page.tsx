"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Truck } from "lucide-react";
import { Navigation } from "@/components/landing/navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { Button } from "@/components/ui/button";
import { getOrders, type LocalOrder } from "@/lib/local-store";
import { createClient as createBrowserSupabase } from "@/lib/supabase/client";
import { isDatabaseConfigured } from "@/lib/supabase/config";
import { formatPrice } from "@/lib/products";

async function fetchDatabaseOrder(orderId: string): Promise<LocalOrder | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    const supabase = createBrowserSupabase();
    const { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).maybeSingle();
    if (error || !order) return null;
    const { data: items } = await supabase.from("order_items").select("*").eq("order_id", orderId);
    return { ...order, items: items ?? [] } as LocalOrder;
  } catch {
    return null;
  }
}

function ConfirmationView() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<LocalOrder | null | undefined>(undefined);

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      return;
    }
    const local = getOrders().find((o) => o.id === orderId);
    if (local) {
      setOrder(local);
      return;
    }
    fetchDatabaseOrder(orderId).then(setOrder);
  }, [orderId]);

  if (order === undefined) return null;

  if (!order) {
    return (
      <main className="relative min-h-screen overflow-x-hidden bg-background">
        <Navigation />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-40 pb-24 lg:pt-48 lg:pb-32 text-center">
          <h1 className="text-4xl font-display mb-6">We couldn&apos;t find that order</h1>
          <Button asChild className="bg-stikky-orange hover:brightness-110 text-white rounded-full h-12 px-8">
            <Link href="/collections">Browse the collection</Link>
          </Button>
        </div>
        <FooterSection />
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background">
      <Navigation />
      <div className="max-w-[900px] mx-auto px-6 lg:px-12 pt-40 pb-24 lg:pt-48 lg:pb-32">
        <div className="text-center mb-16">
          <CheckCircle2 className="w-14 h-14 text-stikky-orange mx-auto mb-6" />
          <h1 className="text-4xl lg:text-5xl font-display tracking-tight mb-4">Order confirmed</h1>
          <p className="text-muted-foreground">
            Thanks, {order.customer_name.split(" ")[0]} — order <span className="font-mono text-foreground">{order.id}</span> is in.
          </p>
          <div className="inline-flex items-center gap-2 mt-6 border border-stikky-orange bg-stikky-orange/10 px-5 py-3 text-sm">
            <Truck className="w-4 h-4 text-stikky-orange" />
            Pay {formatPrice(order.total)} in cash when it arrives
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          <div className="border border-foreground/10 p-6">
            <h2 className="font-display text-lg mb-4">Shipping to</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {order.customer_name}
              <br />
              {order.address}
              <br />
              {order.city}, {order.governorate} {order.postal_code}
              <br />
              {order.country}
              <br />
              {order.phone}
            </p>
          </div>
          <div className="border border-foreground/10 p-6">
            <h2 className="font-display text-lg mb-4">Order summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-display text-lg pt-2 border-t border-foreground/10">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-foreground/10 pt-8 space-y-4 mb-12">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="w-14 h-14 shrink-0 overflow-hidden bg-secondary/40 border border-foreground/10">
                {item.image_url && (
                  <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{item.product_name}</p>
                <p className="text-xs text-muted-foreground font-mono">{item.size}{item.frame ? ` · ${item.frame}` : ""} × {item.quantity}</p>
              </div>
              <span className="text-sm">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild variant="outline" className="rounded-full h-12 px-8 border-foreground/15">
            <Link href="/account?tab=orders">Track this order</Link>
          </Button>
          <Button asChild className="bg-stikky-orange hover:brightness-110 text-white rounded-full h-12 px-8">
            <Link href="/collections">Keep shopping</Link>
          </Button>
        </div>
      </div>
      <FooterSection />
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationView />
    </Suspense>
  );
}
