import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, icon: Icon, hint, accent }: StatCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#1f1f1f] p-5 transition-colors hover:border-white/20">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm text-white/50">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white truncate">
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-white/40">{hint}</p> : null}
        </div>
        <div
          className={
            accent
              ? "flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#FF4500]/15 text-[#FF4500]"
              : "flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/70"
          }
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
