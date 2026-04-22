"use client";

import { useEffect, useMemo, useState } from "react";
import Tabs from "./_local/components/Tabs";
import RolesOverview from "./_local/components/RolesOverview";
import PermissionMatrix from "./_local/components/PermissionMatrix";
import CreateRoleModal from "./_local/components/CreateRoleModal";
import ViewRoleUsersModal from "./_local/components/ViewRoleUsersModal";
import { permissionGroups } from "./_local/data";
import type { Role } from "./_local/types";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "@/lib/services/roles";
import { refreshAuthUser } from "@/lib/auth";

export default function RoleManagementPage() {
  const [tab, setTab] = useState<"overview" | "matrix">("overview");
  const [roles, setRoles] = useState<Role[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [loading, setLoading] = useState(false);

  // View users modal state
  const [openViewUsers, setOpenViewUsers] = useState(false);
  const [viewRole, setViewRole] = useState<{ id: string; name: string } | null>(
    null,
  );

  const matrix = useMemo(() => permissionGroups, []);

  useEffect(() => {
    let isMounted = true;
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const data = await getRoles();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setRoles(data);
        }
      } catch (e) {
        console.error("Failed to load roles", e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRoles();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteRole(id);
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error("Failed to delete role", e);
    }
  };

  const handleCreate = async (role: Omit<Role, "id">) => {
    try {
      const created = await createRole(role);
      setRoles((prev) => [created, ...prev]);
      setOpenCreate(false);
    } catch (e) {
      console.error("Failed to create role", e);
    }
  };

  const handlePermissionToggle = async (
    roleId: string,
    permissionKey: string,
    value: boolean,
  ) => {
    try {
      // Find the role to update
      const role = roles.find((r) => r.id === roleId);
      if (!role) return;

      // Update permissions object
      const updatedPermissions = {
        ...role.permissions,
        [permissionKey]: value,
      };

      // Optimistically update UI
      setRoles((prev) =>
        prev.map((r) =>
          r.id === roleId ? { ...r, permissions: updatedPermissions } : r,
        ),
      );

      // Update on backend
      await updateRole(roleId, { permissions: updatedPermissions });

      // Refresh current user's permissions immediately after role update
      // This ensures permissions are updated in real-time without logout/login
      try {
        await refreshAuthUser();
        // Force a small delay to ensure localStorage is updated
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (refreshError) {
        console.error(
          "Failed to refresh user permissions after role update:",
          refreshError,
        );
      }
    } catch (e) {
      console.error("Failed to update permission", e);
      // Revert on error - reload roles from server
      try {
        const data = await getRoles();
        if (Array.isArray(data) && data.length > 0) {
          setRoles(data);
        }
      } catch (reloadError) {
        console.error("Failed to reload roles after error", reloadError);
      }
    }
  };

  const handleLimitChange = async (roleId: string, value: number) => {
    try {
      // Optimistically update UI
      setRoles((prev) =>
        prev.map((r) =>
          r.id === roleId ? { ...r, monthlyCreditLimit: value } : r,
        ),
      );

      // Update on backend
      await updateRole(roleId, { monthlyCreditLimit: value });
    } catch (e) {
      console.error("Failed to update credit limit", e);
      // Revert on error
      const data = await getRoles();
      if (Array.isArray(data) && data.length > 0) {
        setRoles(data);
      }
    }
  };

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-[26px] font-bold leading-[28px] text-[#0A0A0A]">
          Roles & Permissions
        </h1>
        <p className="text-[16px] leading-[21px] text-[#6F6C90]">
          Manage user roles and their access permissions.
        </p>
      </header>

      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { key: "overview", label: "Roles Overview" },
              { key: "matrix", label: "Permission Details" },
            ]}
          />
          <button
            onClick={() => setOpenCreate(true)}
            className="h-[40px] rounded-[8px] bg-[#401B60] px-4 text-[14px] font-semibold text-white"
          >
            Create Role
          </button>
        </div>

        {tab === "overview" ? (
          <RolesOverview
            roles={roles}
            onEdit={() => setTab("matrix")}
            onRemove={handleDelete}
            onViewUsers={(id, name) => {
              setViewRole({ id, name });
              setOpenViewUsers(true);
            }}
          />
        ) : (
          <PermissionMatrix
            roles={roles}
            groups={matrix}
            onPermissionToggle={handlePermissionToggle}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>

      <CreateRoleModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreate}
        groups={matrix}
      />

      <ViewRoleUsersModal
        open={openViewUsers}
        onClose={() => setOpenViewUsers(false)}
        roleId={viewRole?.id || ""}
        roleName={viewRole?.name || ""}
      />
    </section>
  );
}
