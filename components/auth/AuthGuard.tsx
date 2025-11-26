"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAuthUser } from "@/lib/auth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
        if (!token) {
            const to = `/login?redirect=${encodeURIComponent(pathname || "/")}`;
            router.replace(to);
            return;
        }

        // Optional: role-based routing guard
        const user = typeof window !== "undefined" ? getAuthUser<{ role?: string }>() : null;
        const role = user?.role || "customer";

        const isAdminRoute = pathname?.startsWith("/admin");
        const isCustomerRoute = pathname?.startsWith("/dashboard");

        // If non-admin tries to access admin pages, send to customer dashboard
        if (isAdminRoute && role !== "admin") {
            router.replace("/dashboard");
            return;
        }

        // If admin lands on customer dashboard, prefer admin area
        if (isCustomerRoute && role === "admin") {
            router.replace("/admin/dashboard");
            return;
        }

        setReady(true);
    }, [pathname, router]);

    if (!ready) return null;
    return <>{children}</>;
}


