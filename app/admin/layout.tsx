import type React from "react";

import AdminShell from "@/components/admin/admin-shell";
import { getAdminUser } from "@/lib/admin/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();

  return (
    <AdminShell adminName={admin?.fullName} adminEmail={admin?.email}>
      {children}
    </AdminShell>
  );
}
