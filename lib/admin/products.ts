import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";

export async function getAdminProducts(): Promise<Product[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[admin/products] failed to fetch products:", error?.message);
    return [];
  }

  return data as Product[];
}
