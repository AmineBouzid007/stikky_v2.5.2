"use client";

import { useState } from "react";

import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";

interface AdminShellProps {
  children: React.ReactNode;
  adminName?: string | null;
  adminEmail?: string | null;
}

export default function AdminShell({ children, adminName, adminEmail }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#171717] text-white">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header
          onMenuClick={() => setMobileOpen(true)}
          adminName={adminName}
          adminEmail={adminEmail}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
