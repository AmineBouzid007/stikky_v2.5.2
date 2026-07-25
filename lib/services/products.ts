// -----------------------------------------------------------------------------
// Product service layer.
//
// This is the ONLY place the UI should go for product/category data going
// forward. It talks to Supabase when the project is configured with real
// credentials, and transparently falls back to the static local catalog
// (lib/products.ts) otherwise — so the site keeps working with zero setup,
// and swapping in a live database is just setting two env vars.
//
// UI components/pages should import from here, never from
// lib/supabase/* directly, and never run queries themselves.
// -----------------------------------------------------------------------------
import "server-only";

import { createClient as createServerSupabase } from "@/lib/supabase/server";
import * as staticCatalog from "@/lib/products";
import type { CategoryMeta } from "@/lib/products";
import type { Product, ProductType } from "@/lib/types";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

async function queryProducts(build: (q: any) => any): Promise<Product[] | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await build(supabase.from("products").select("*"));
    if (error || !data) return null;
    return data as Product[];
  } catch {
    // Network/config issue — degrade gracefully instead of breaking the page.
    return null;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const live = await queryProducts((q) => q.order("created_at", { ascending: false }));
  return live ?? staticCatalog.getAllProducts();
}

export async function getProductsByType(type: ProductType): Promise<Product[]> {
  const live = await queryProducts((q) => q.eq("product_type", type));
  return live ?? staticCatalog.getProductsByType(type);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (isDatabaseConfigured()) {
    try {
      const supabase = await createServerSupabase();
      const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
      if (!error && data) return data as Product;
    } catch {
      // fall through to static catalog
    }
  }
  return staticCatalog.getProductBySlug(slug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const live = await queryProducts((q) => q.eq("is_featured", true).limit(limit));
  return live ?? staticCatalog.getFeaturedProducts(limit);
}

export async function getBestsellers(limit = 4): Promise<Product[]> {
  const live = await queryProducts((q) => q.eq("is_bestseller", true).limit(limit));
  return live ?? staticCatalog.getBestsellers(limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (isDatabaseConfigured()) {
    const sameCategory = await queryProducts((q) =>
      q.eq("product_type", product.product_type).eq("category", product.category).neq("id", product.id).limit(limit)
    );
    if (sameCategory && sameCategory.length > 0) return sameCategory;
  }
  return staticCatalog.getRelatedProducts(product, limit);
}

// Category taxonomy rarely changes and is used by client components (nav
// mega-menu) that can't await a server call, so it stays on the static
// catalog for now. Swap this for a live `categories` table read once the
// admin dashboard (Priority 5) can actually manage categories.
export function getCategories(type: ProductType): CategoryMeta[] {
  return staticCatalog.getCategories(type);
}

export function getCategoryMeta(type: ProductType, slug: string): CategoryMeta | undefined {
  return staticCatalog.getCategoryMeta(type, slug);
}

export const formatPrice = staticCatalog.formatPrice;
