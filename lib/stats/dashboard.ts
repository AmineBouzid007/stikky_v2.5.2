import { createClient } from "@/lib/supabase/server";


export async function getDashboardStats() {
  const supabase = await createClient();


  const [
    orders,
    products,
    revenue,
    pending
  ] = await Promise.all([

    supabase
      .from("orders")
      .select("id,status,total,created_at,customer_name")
      .order("created_at", {
        ascending:false
      }),


    supabase
      .from("products")
      .select("id"),


    supabase
      .from("orders")
      .select("total"),


    supabase
      .from("orders")
      .select("id")
      .eq("status","pending")

  ]);


  return {

    orders:
      orders.data ?? [],


    totalOrders:
      orders.data?.length ?? 0,


    totalProducts:
      products.data?.length ?? 0,


    revenue:
      revenue.data?.reduce(
        (sum,item)=>
          sum + Number(item.total),
        0
      ) ?? 0,


    pendingOrders:
      pending.data?.length ?? 0,

  };

}
