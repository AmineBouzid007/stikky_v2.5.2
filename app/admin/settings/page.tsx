import { Store, Truck, Bell, ShieldCheck } from "lucide-react";

const SETTINGS_SECTIONS = [
  {
    icon: Store,
    title: "Store Information",
    description: "Store name, contact email, and currency (TND) used across the site.",
  },
  {
    icon: Truck,
    title: "Shipping",
    description: "Shipping fee and delivery regions for Cash on Delivery orders.",
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Email or SMS alerts for new orders and low stock.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Access",
    description: "Manage who has access to this dashboard.",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-sm text-white/50">
          Store configuration. These panels are placeholders — let me know which one you&apos;d
          like wired up first.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.title}
              className="rounded-xl border border-white/10 bg-[#1f1f1f] p-5"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-[#FF4500]">
                <Icon className="size-5" />
              </div>
              <h2 className="mt-4 font-medium text-white">{section.title}</h2>
              <p className="mt-1 text-sm text-white/50">{section.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
