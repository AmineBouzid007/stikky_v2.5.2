"use client";

import { Menu, Search, UserCircle } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  adminName?: string | null;
  adminEmail?: string | null;
}

export default function Header({ onMenuClick, adminName, adminEmail }: HeaderProps) {
  const displayName = adminName || "Admin";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-[#171717]/95 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="text-white/70 hover:text-white lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <h1 className="hidden text-base font-semibold text-white lg:block">
        Stikky Admin
      </h1>

      <div className="relative ml-auto max-w-sm flex-1 sm:ml-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
        <input
          type="search"
          placeholder="Search orders, products..."
          className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#FF4500]/60 focus:ring-1 focus:ring-[#FF4500]/60"
        />
      </div>

      <div className="flex items-center gap-2 pl-2 sm:pl-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-tight text-white">{displayName}</p>
          {adminEmail ? (
            <p className="text-xs leading-tight text-white/40">{adminEmail}</p>
          ) : null}
        </div>
        <div className="flex size-9 items-center justify-center rounded-full bg-white/5 text-white/70">
          <UserCircle className="size-6" />
        </div>
      </div>
    </header>
  );
}
