"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { canAccessRoute } from "@/lib/permissions";

type PermissionGuardProps = {
    children: React.ReactNode;
    requiredPermission?: string;
    fallbackPath?: string;
};

/**
 * Component-level permission guard
 * Use this to protect specific sections or pages
 */
export default function PermissionGuard({
    children,
    requiredPermission,
    fallbackPath = "/admin/dashboard"
}: PermissionGuardProps) {
    const router = useRouter();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
        // Get current pathname
        const pathname = window.location.pathname;

        // Check access based on route or specific permission
        const access = requiredPermission
            ? canAccessRoute(requiredPermission)
            : canAccessRoute(pathname);

        setHasAccess(access);

        if (!access) {
            console.warn(`Permission denied for ${pathname}`);
            router.replace(fallbackPath);
        }
    }, [requiredPermission, fallbackPath, router]);

    if (hasAccess === null) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#401B60] border-r-transparent"></div>
                    <p className="text-[14px] text-[#6F6C90]">Checking permissions...</p>
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return null; // Will redirect via useEffect
    }

    return <>{children}</>;
}

