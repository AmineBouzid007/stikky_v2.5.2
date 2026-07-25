"use client";

import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";

export function CartDrawer() {
  const { items, isOpen, close, open, removeItem, updateQuantity, count, subtotal, shipping, total } =
    useCart();
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <Sheet open={isOpen} onOpenChange={(next) => (next ? open() : close())}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 gap-0 bg-background">
        <SheetHeader className="border-b border-foreground/10 px-6 py-5">
          <SheetTitle className="font-display text-xl flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Your cart {count > 0 && <span className="text-muted-foreground font-mono text-sm">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <p className="text-muted-foreground text-sm">Your cart is empty.</p>
            <Button
              onClick={close}
              asChild
              className="bg-stikky-orange hover:brightness-110 text-white rounded-full h-11 px-6"
            >
              <Link href="/collections">Browse the collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto divide-y divide-foreground/10 px-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.frame ?? "none"}`} className="flex gap-4 py-5">
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={close}
                    className="w-16 h-16 shrink-0 overflow-hidden bg-secondary/40 border border-foreground/10"
                  >
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={close}
                        className="text-sm font-medium hover:text-stikky-orange transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId, item.size, item.frame)}
                        aria-label="Remove item"
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mt-1 uppercase">{item.size}{item.frame ? ` · ${item.frame}` : ""}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-foreground/15 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.frame, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 flex items-center justify-center hover:text-stikky-orange transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.frame, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="w-7 h-7 flex items-center justify-center hover:text-stikky-orange transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-mono">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-foreground/10 px-6 py-6 space-y-4">
              {remainingForFreeShipping > 0 ? (
                <p className="text-xs font-mono text-stikky-orange">
                  Add {formatPrice(remainingForFreeShipping)} more for free shipping
                </p>
              ) : (
                <p className="text-xs font-mono text-stikky-orange">You've unlocked free shipping</p>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-display text-xl pt-2 border-t border-foreground/10">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="grid gap-2 pt-2">
                <Button
                  asChild
                  onClick={close}
                  className="w-full bg-stikky-orange hover:brightness-110 text-white rounded-full h-12"
                >
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button
                  asChild
                  onClick={close}
                  variant="outline"
                  className="w-full rounded-full h-12 border-foreground/15"
                >
                  <Link href="/cart">View cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
