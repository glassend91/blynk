"use client";

import { useEffect, useState } from "react";
import { getAuthUser } from "./auth";

export type PermissionKey =
    | "user.view"
    | "user.invite"
    | "user.edit"
    | "user.delete"
    | "roles.create"
    | "plans.view"
    | "plans.create"
    | "plans.delete"
    | "plans.publish"
    | "tech.manage"
    | "web.edit"
    | "seo.manage"
    | "analytics.view"
    | "testimonials.manage"
    | "profiles.view"
    | "notes.manage"
    | "tickets.manage"
    | "services.manage"
    | "sim.manage"
    | "billing.credits_refunds"
    | "can_manage_customer_payment_details"
    | "sys.settings"
    | "sys.logs";

export type Permissions = Record<PermissionKey, boolean>;

type AuthUser = {
    permissions?: Permissions;
    role?: string;
};

/**
 * Get current user's permissions from localStorage
 */
export function getUserPermissions(): Permissions | null {
    const user = getAuthUser<AuthUser>();
    return user?.permissions || null;
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(permission: PermissionKey): boolean {
    const user = getAuthUser<AuthUser>();

    // SuperAdmin bypasses all permission checks - has full access
    if (user?.role === "superAdmin") {
        return true;
    }

    // Only apply permission checks for admin role
    if (user?.role !== "admin") {
        return false;
    }

    const permissions = getUserPermissions();
    if (!permissions) {
        return false;
    }

    return permissions[permission] === true;
}

/**
 * Check if user has any of the given permissions
 */
export function hasAnyPermission(permissions: PermissionKey[]): boolean {
    return permissions.some((perm) => hasPermission(perm));
}

/**
 * Check if user has all of the given permissions
 */
export function hasAllPermissions(permissions: PermissionKey[]): boolean {
    return permissions.every((perm) => hasPermission(perm));
}

/**
 * Permission mapping for menu items
 */
export const MENU_PERMISSIONS: Record<string, PermissionKey | PermissionKey[]> = {
    "/admin/dashboard": "analytics.view", // Dashboard requires analytics.view permission
    "/admin/user-management": "user.view",
    "/admin/staff-members": "user.view",
    "/admin/role-management": "roles.create",
    "/admin/service-plans": "plans.view",
    "/admin/website-content": "web.edit",
    "/admin/testimonials": "testimonials.manage",
    "/admin/technician-network": "tech.manage",
    "/admin/sim-orders": "sim.manage",
    "/admin/support-tickets": "tickets.manage",
    "/admin/customer-verification": "profiles.view",
    "/admin/customer-notes": "notes.manage",
    "/admin/customer-plans": "services.manage",
    "/admin/system-settings": "sys.settings",
};

/**
 * Check if a route is accessible based on permissions
 */
export function canAccessRoute(route: string): boolean {
    const user = getAuthUser<AuthUser>();

    // If no user, deny access
    if (!user) {
        return false;
    }

    // SuperAdmin has access to everything
    if (user.role === "superAdmin") {
        return true;
    }

    // Only apply permission checks for admin role
    if (user.role !== "admin") {
        return false;
    }

    // If admin user but no permissions loaded yet, deny access (wait for permissions to load)
    if (!user.permissions || Object.keys(user.permissions).length === 0) {
        return false;
    }

    const requiredPerms = MENU_PERMISSIONS[route];

    // If no permission required, allow access
    if (!requiredPerms || (Array.isArray(requiredPerms) && requiredPerms.length === 0)) {
        return true;
    }

    // If array, check if user has any of the permissions
    if (Array.isArray(requiredPerms)) {
        return hasAnyPermission(requiredPerms);
    }

    // Single permission check
    return hasPermission(requiredPerms);
}

/**
 * React hook to check permissions (re-renders when permissions change)
 */
export function usePermission(permission: PermissionKey): boolean {
    const [hasPerm, setHasPerm] = useState(() => hasPermission(permission));

    useEffect(() => {
        const checkPermission = () => {
            setHasPerm(hasPermission(permission));
        };

        checkPermission();
        const interval = setInterval(checkPermission, 1000);

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'auth_user') {
                checkPermission();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [permission]);

    return hasPerm;
}

