export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  lowStockProducts: number;
}

export interface DashboardOrder {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  total: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  payment_status:
    | "unpaid"
    | "paid"
    | "refunded"
    | "failed";
  created_at: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  image_url: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: DashboardOrder[];
  lowStock: LowStockProduct[];
}
