"use client";

import { useMemo, useState } from "react";
import TableHeader from "./_local/components/TableHeader";
import UsersTable from "./_local/components/UsersTable";
import InviteUserModal from "./_local/components/InviteUserModal";
import { initialUsers, Role, Status, UserRow } from "./_local/data";

export default function UserManagementPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | "All Roles">("All Roles");
  const [status, setStatus] = useState<Status | "All Status">("All Status");
  const [openInvite, setOpenInvite] = useState(false);
  const [rows, setRows] = useState<UserRow[]>(initialUsers);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const q = query.trim().toLowerCase();
      const byQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q);
      const byRole = role === "All Roles" || r.role === role;
      const byStatus = status === "All Status" || r.status === status;
      return byQuery && byRole && byStatus;
    });
  }, [rows, query, role, status]);

  return (
    <section className="space-y-6">
      {/* Page heading matches layout */}
      <header className="space-y-1">
        <h1 className="text-[26px] font-bold leading-[28px] text-[#0A0A0A]">User Management</h1>
        <p className="text-[16px] leading-[21px] text-[#6F6C90]">
          Manage staff access and permissions for your telecommunications platform.
        </p>
      </header>

      {/* Search + Filters + CTA */}
      <TableHeader
        query={query}
        onQuery={setQuery}
        role={role}
        onRole={setRole}
        status={status}
        onStatus={setStatus}
        onInvite={() => setOpenInvite(true)}
      />

      {/* Data table */}
      <UsersTable rows={filtered} />

      {/* Invite modal */}
      <InviteUserModal
        open={openInvite}
        onClose={() => setOpenInvite(false)}
        onInvite={(newUser) => {
          setRows((prev) => [{ id: prev.length + 1, ...newUser }, ...prev]);
          setOpenInvite(false);
        }}
      />
    </section>
  );
}
