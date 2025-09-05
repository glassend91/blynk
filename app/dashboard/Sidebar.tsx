"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: "home" },
  { href: "/dashboard/account", label: "Account Management", icon: "person" },
  { href: "/dashboard/billing", label: "Billing & Invoices", icon: "bill" },
  { href: "/dashboard/services", label: "Service Management", icon: "wifi" },
  { href: "/dashboard/tickets", label: "Support Tickets", icon: "chat" },
  { href: "/dashboard/payment-method", label: "Payment Methods", icon: "card" },
  { href: "/dashboard/usage", label: "Data Usage", icon: "chart" },
  { href: "/dashboard/service-diagnostics", label: "Service Diagnostics", icon: "alert" },
];

function Icon({ name }: { name: string }) {
  switch (name) {
    case "home":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z" stroke="currentColor" strokeWidth="1.5"/></svg>;
    case "person":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 21c1.8-4 6.2-5 8-5s6.2 1 8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "bill":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 8h8M8 12h8M8 16h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "wifi":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 8.5C6.5 4.5 17.5 4.5 22 8.5M5 12c4-3 10-3 14 0M8.5 15.5c2-1.5 5-1.5 7 0M12 19.5h0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    case "chat":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 8.5c0-3 2-5 6-5h6c4 0 6 2 6 5v5c0 3-2 5-6 5h-.8a1 1 0 0 0-.8.4l-1.9 2.5c-.6.8-1.3.8-1.9 0l-2-2.5a1 1 0 0 0-.8-.4H9c-4 0-6-2-6-5v-5Z" stroke="currentColor" strokeWidth="1.5"/></svg>;
    case "card":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 9h20" stroke="currentColor" strokeWidth="1.5"/></svg>;
    case "chart":
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 20V6M10 20V10M16 20v-8M22 20V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    default:
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2 2 12l10 10 10-10L12 2Z" stroke="currentColor" strokeWidth="1.5"/></svg>;
  }
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[230px] shrink-0 border-r border-[#EEEAF4] bg-white">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#EEEAF4]">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/6fb75eb88f22c13e4a96e9aa89f994b1c316a459?width=474"
          alt="Blynk"
          className="h-9 w-auto"
        />
      </div>

      <nav className="px-6 py-4 space-y-2">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={[
                "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[14px] font-semibold",
                active
                  ? "bg-[#3F205F] text-white"
                  : "text-[#0A0A0A] hover:bg-[#F4F3F7]",
              ].join(" ")}
            >
              <span className={active ? "text-white" : "text-[#8E8AA3]"}>
                <Icon name={it.icon} />
              </span>
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-6 py-4">
        <button className="flex w-full items-center gap-3 rounded-[10px] bg-[#FFF1F1] px-3 py-2.5 text-[14px] font-semibold text-[#C63D3D]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 17l5-5-5-5M20 12H9" stroke="#C63D3D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" stroke="#C63D3D" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
