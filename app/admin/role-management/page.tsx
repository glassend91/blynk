"use client";

import { useMemo, useState } from "react";
import Tabs from "./_local/components/Tabs";
import RolesOverview from "./_local/components/RolesOverview";
import PermissionMatrix from "./_local/components/PermissionMatrix";
import CreateRoleModal from "./_local/components/CreateRoleModal";
import { rolesSeed, permissionGroups } from "./_local/data";
import type { Role } from "./_local/types";

export default function RoleManagementPage() {
  const [tab, setTab] = useState<"overview" | "matrix">("overview");
  const [roles, setRoles] = useState<Role[]>(rolesSeed);
  const [openCreate, setOpenCreate] = useState(false);

  const matrix = useMemo(() => permissionGroups, []);

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-[26px] font-bold leading-[28px] text-[#0A0A0A]">Roles & Permissions</h1>
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
            onEdit={(id) => setTab("matrix")}
            onRemove={(id) => setRoles((prev) => prev.filter((r) => r.id !== id))}
          />
        ) : (
          <PermissionMatrix roles={roles} groups={matrix} />
        )}
      </div>

      <CreateRoleModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={(role) => {
          setRoles((prev) => [{ ...role, id: prev.length + 1 }, ...prev]);
          setOpenCreate(false);
        }}
        groups={matrix}
      />
    </section>
  );
}
