"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/admin/order-constants";

export interface UpdateOrderStatusResult {
  success: boolean;
  error?: string;
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
): Promise<UpdateOrderStatusResult> {
  if (!ORDER_STATUSES.includes(status)) {
    return { success: false, error: "Invalid status." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error("[admin/orders] failed to update status:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/dashboard");

  return { success: true };
}
