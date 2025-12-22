"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAuthToken, getAuthUser } from "@/lib/auth";
import { canAccessRoute } from "@/lib/permissions";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="px-[15px] text-[12px] font-semibold uppercase tracking-[0.6px] text-[#6F6C90]">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Item({ label, href, show = true }: { label: string; href: string; show?: boolean }) {
  const pathname = usePathname();

  // Active if exact match OR user is in a nested route under this href
  const isActive = pathname === href || pathname.startsWith(href + "/");

  if (!show) return null;

  return (
    <Link
      href={href}
      className={[
        "mx-[14px] flex items-center gap-[11px] rounded-[8.75px] px-[11px] py-2 text-[14px] font-semibold",
        isActive ? "bg-[#401B60] text-white" : "text-[#6F6C90] hover:bg-[#F5F4F8]",
      ].join(" ")}
      aria-current={isActive ? "page" : undefined}
    >
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar({ width = 234 }: { width?: number }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [routeAccess, setRouteAccess] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    const loadUser = () => {
      const u = getAuthUser();
      setUser(u);

      // Calculate route access after user is loaded
      if (u) {
        const access: Record<string, boolean> = {};
        const routes = [
          "/admin/dashboard",
          "/admin/user-management",
          "/admin/staff-members",
          "/admin/role-management",
          "/admin/service-plans",
          "/admin/website-content",
          "/admin/testimonials",
          "/admin/technician-network",
          "/admin/sim-orders",
          "/admin/support-tickets",
          "/admin/customer-verification",
          "/admin/customer-notes",
          "/admin/customer-plans",
          "/admin/system-settings",
        ];
        routes.forEach(route => {
          access[route] = canAccessRoute(route);
        });
        // Customer Dashboard has access if user can access any of the customer-related routes
        access["/admin/customer-dashboard"] =
          canAccessRoute("/admin/customer-verification") ||
          canAccessRoute("/admin/customer-notes") ||
          canAccessRoute("/admin/customer-plans");
        setRouteAccess(access);
      }
    };
    loadUser();

    // Listen for storage changes and custom refresh events
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if (e instanceof StorageEvent && e.key === 'auth_user') {
        loadUser();
      } else if (e instanceof CustomEvent && e.type === 'authUserRefreshed') {
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('authUserRefreshed', handleStorageChange as EventListener);

    // Refresh permissions periodically (every 30 seconds)
    const interval = setInterval(() => {
      const { refreshAuthUser } = require("@/lib/auth");
      refreshAuthUser().catch(() => { });
    }, 30000);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('authUserRefreshed', handleStorageChange as EventListener);
      clearInterval(interval);
    };
  }, []);

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen border-r border-[#DFDBE3] bg-white"
      style={{ width }}
    >
      {/* Logo row */}
      <div className="flex h-[89px] items-center border-b border-[#DFDBE3] px-[15px]">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/6fb75eb88f22c13e4a96e9aa89f994b1c316a459?width=474"
          alt="Blynk"
          className="h-[41px] w-[194px]"
        />
      </div>

      {/* Sections */}
      <div className="flex h-[calc(100%-153px)] flex-col gap-6 overflow-auto px-[1px] py-[18px]">
        <Section title="Overview">
          <Item
            label="Dashboard"
            href="/admin/dashboard"
            show={mounted ? (routeAccess["/admin/dashboard"] ?? true) : true}
          />
        </Section>

        <Section title="Management">
          <Item
            label="User Management"
            href="/admin/user-management"
            show={mounted ? (routeAccess["/admin/user-management"] ?? true) : true}
          />
          <Item
            label="Staff Members"
            href="/admin/staff-members"
            show={mounted ? (routeAccess["/admin/staff-members"] ?? true) : true}
          />
          <Item
            label="Role Management"
            href="/admin/role-management"
            show={mounted ? (routeAccess["/admin/role-management"] ?? true) : true}
          />
        </Section>

        <Section title="Content">
          <Item label="Service Plan" href="/admin/service-plans" show={mounted ? (routeAccess["/admin/service-plans"] ?? true) : true} />
          <Item label="Website Content" href="/admin/website-content" show={mounted ? (routeAccess["/admin/website-content"] ?? true) : true} />
          <Item label="Testimonial" href="/admin/testimonials" show={mounted ? (routeAccess["/admin/testimonials"] ?? true) : true} />
        </Section>

        <Section title="Operations">
          <Item label="Technician Network" href="/admin/technician-network" show={mounted ? (routeAccess["/admin/technician-network"] ?? true) : true} />
          <Item label="SIM Orders" href="/admin/sim-orders" show={mounted ? (routeAccess["/admin/sim-orders"] ?? true) : true} />
          <Item label="Support Tickets" href="/admin/support-tickets" show={mounted ? (routeAccess["/admin/support-tickets"] ?? true) : true} />
          <Item label="Customer Dashboard" href="/admin/customer-dashboard" show={mounted ? (routeAccess["/admin/customer-dashboard"] ?? true) : true} />
        </Section>

        <Section title="System">
          <Item label="System Settings" href="/admin/system-settings" show={mounted ? (routeAccess["/admin/system-settings"] ?? true) : true} />
        </Section>
      </div>

      {/* Sign out */}
      <div className="absolute bottom-0 w-full bg-[#FFF0F0] px-[14px] py-[15px]">
        <button
          type="button"
          onClick={() => { clearAuthToken(); router.push("/login"); }}
          className="flex w-[205px] items-center gap-[11.5px] rounded-[8.75px] px-[10.5px] py-[7px] text-[16px] font-semibold text-[#FF0000]"
        >
          <svg width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden>
            <path
              d="M12.164 13.146 15.81 9.5 12.164 5.854"
              stroke="#FF0000"
              strokeWidth="1.45833"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.812 9.5H7.063"
              stroke="#FF0000"
              strokeWidth="1.45833"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7.063 16.063H4.146a1.46 1.46 0 0 1-1.459-1.459V4.396a1.46 1.46 0 0 1 1.459-1.459H7.063"
              stroke="#FF0000"
              strokeWidth="1.45833"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
