"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuthUser, refreshAuthUser } from "@/lib/auth";
import { canAccessRoute } from "@/lib/permissions";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;
      if (!token) {
        const to = `/login?redirect=${encodeURIComponent(pathname || "/")}`;
        router.replace(to);
        return;
      }

      // Refresh user permissions from server on mount (ensures fresh data)
      try {
        await refreshAuthUser();
        // Small delay to ensure localStorage is updated
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (err) {
        console.error("Failed to refresh user on mount:", err);
      }

      // Get user after refresh
      const user =
        typeof window !== "undefined" ? getAuthUser<{ role?: string }>() : null;
      const role = user?.role || "customer";

      const isAdminRoute = pathname?.startsWith("/admin");
      const isCustomerRoute = pathname?.startsWith("/dashboard");

      // Check if user is admin or superAdmin
      const isAdmin = role === "admin" || role === "superAdmin";

      // If non-admin tries to access admin pages, send to customer dashboard
      if (isAdminRoute && !isAdmin) {
        router.replace("/dashboard");
        return;
      }

      // If admin/superAdmin lands on customer dashboard, prefer admin area
      if (isCustomerRoute && isAdmin) {
        router.replace("/admin/dashboard");
        return;
      }

      // Check permissions for admin routes (only for admin role, superAdmin bypasses)
      if (isAdminRoute && pathname) {
        const hasAccess = canAccessRoute(pathname);
        if (!hasAccess) {
          // Try to find an accessible page (excluding the current one)
          console.warn(
            `Access denied to ${pathname} - insufficient permissions`,
          );
          const accessibleRoutes = [
            "/admin/user-management",
            "/admin/service-plans",
            "/admin/website-content",
            "/admin/dashboard",
          ];
          const accessibleRoute = accessibleRoutes.find(
            (route) => route !== pathname && canAccessRoute(route),
          );
          if (accessibleRoute) {
            router.replace(accessibleRoute);
          } else {
            // If no accessible route found and current path is dashboard, show error on dashboard
            // Otherwise, redirect to dashboard (will show error if no access)
            if (pathname === "/admin/dashboard") {
              // Stay on dashboard to show access denied message
              setChecking(false);
              setReady(true);
            } else {
              router.replace("/admin/dashboard");
            }
          }
          return;
        }
      }

      setChecking(false);
      setReady(true);
    };

    checkAccess();
  }, [pathname, router]);

  if (checking || !ready) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#F8F8F8] overflow-hidden">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#401B60] border-r-transparent"></div>
          <p className="text-[14px] text-[#6F6C90]">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
