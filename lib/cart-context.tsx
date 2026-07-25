"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "stikky_cart_v1";
const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_FLAT = 7;

function sameVariant(item: CartItem, productId: string, size: string, frame: string | null) {
  return item.productId === productId && item.size === size && (item.frame ?? null) === (frame ?? null);
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, frame: string | null) => void;
  updateQuantity: (productId: string, size: string, frame: string | null, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  lastAdded: CartItem | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartItem | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt cart data
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => sameVariant(i, item.productId, item.size, item.frame ?? null));
      if (existing) {
        return prev.map((i) =>
          sameVariant(i, item.productId, item.size, item.frame ?? null)
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    setLastAdded(item);
    setIsOpen(true);
  };

  const removeItem = (productId: string, size: string, frame: string | null) => {
    setItems((prev) => prev.filter((i) => !sameVariant(i, productId, size, frame)));
  };

  const updateQuantity = (productId: string, size: string, frame: string | null, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size, frame);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (sameVariant(i, productId, size, frame) ? { ...i, quantity } : i))
    );
  };

  const clear = () => setItems([]);

  const { count, subtotal, shipping, total } = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    const total = subtotal + shipping;
    return { count, subtotal, shipping, total };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        count,
        subtotal,
        shipping,
        total,
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        lastAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export { FREE_SHIPPING_THRESHOLD };
