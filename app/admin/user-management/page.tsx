"use client";

import { useEffect, useMemo, useState } from "react";

import TableHeader from "./_local/components/TableHeader";
import UsersTable from "./_local/components/UsersTable";
import InviteUserModal from "./_local/components/InviteUserModal";
import { allStatuses, Role, Status, UserRow } from "./_local/data";
import apiClient from "@/lib/apiClient";
import { usePermission } from "@/lib/permissions";

export default function UserManagementPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | "All Roles">("All Roles");
  const [status, setStatus] = useState<Status | "All Status">("All Status");
  const [openInvite, setOpenInvite] = useState(false);
  const canInvite = usePermission("user.invite");
  const canEdit = usePermission("user.edit");
  const canDelete = usePermission("user.delete");
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewUser, setViewUser] = useState<UserRow | null>(null);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<Status>("Active");
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await apiClient.get<{ success: boolean; users: UserRow[] }>("/auth/users");
        if (data?.success && Array.isArray(data.users)) {
          setRows(data.users);
        }
      } catch (err) {
        console.error("Failed to load users", err);
        // Optional: if you still want a fallback, uncomment the next line
        // setRows(initialUsers);
      }
      setLoading(false);
    }

    load();
  }, []);

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
        onInvite={canInvite ? () => setOpenInvite(true) : undefined}
      />

      {/* Data table */}
      {loading ? (
        <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 text-[14px] text-[#6F6C90]">
          Loading users...
        </div>
      ) : (
        <UsersTable
          rows={filtered}
          onView={(u) => setViewUser(u)}
          onEdit={canEdit ? (u) => {
            setEditUser(u);
            setEditName(u.name);
            setEditStatus(u.status);
          } : undefined}
          onDelete={canDelete ? (u) => {
            setDeleteUser(u);
          } : undefined}
        />
      )}

      {/* Invite modal - only show if user has permission */}
      {canInvite && (
        <InviteUserModal
          open={openInvite}
          onClose={() => setOpenInvite(false)}
          onInvite={(newUser) => {
            setRows((prev) => {
              const next = [newUser, ...prev];
              return next.map((row, index) => ({ ...row, id: index + 1 }));
            });
            setOpenInvite(false);
          }}
        />
      )}

      {/* View user details modal */}
      {viewUser && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0A0A0A]">User Details</h2>
              <button
                type="button"
                onClick={() => setViewUser(null)}
                className="h-7 w-7 rounded-full border border-[#DFDBE3] text-[#6F6C90]"
              >
                ×
              </button>
            </div>
            <div className="space-y-3 text-[14px] text-[#0A0A0A]">
              <div>
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">Name</div>
                <div>{viewUser.name}</div>
              </div>
              <div>
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">Email</div>
                <div>{viewUser.email}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">Role</div>
                  <div>{viewUser.role}</div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">Status</div>
                  <div>{viewUser.status}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">Last Login</div>
                  <div>{viewUser.lastLogin}</div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">Created</div>
                  <div>{viewUser.created}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewUser(null)}
                className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit user modal - only show if user has permission */}
      {editUser && canEdit && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0A0A0A]">Edit User</h2>
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="h-7 w-7 rounded-full border border-[#DFDBE3] text-[#6F6C90]"
              >
                ×
              </button>
            </div>
            <form
              className="space-y-4 text-[14px]"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editUser?.userId) {
                  setEditUser(null);
                  return;
                }
                try {
                  setEditLoading(true);
                  const { data } = await apiClient.put<{
                    success: boolean;
                    user: UserRow;
                  }>(`/auth/users/${editUser.userId}`, {
                    name: editName,
                    status: editStatus,
                  });

                  if (data?.success && data.user) {
                    const updated = data.user;
                    setRows((prev) =>
                      prev.map((r) =>
                        r.userId && updated.userId && r.userId === updated.userId
                          ? { ...updated, id: r.id }
                          : r,
                      ),
                    );
                  }
                  setEditUser(null);
                } catch (err) {
                  console.error("Failed to update user", err);
                } finally {
                  setEditLoading(false);
                }
              }}
            >
              <div>
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">Name</div>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border border-[#DFDBE3] px-3 py-2 text-[14px] outline-none"
                />
              </div>
              <div>
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">Email</div>
                <input
                  value={editUser.email}
                  disabled
                  className="mt-1 w-full rounded-[10px] border border-[#DFDBE3] bg-[#F5F5F7] px-3 py-2 text-[14px] text-[#6F6C90] outline-none"
                />
              </div>
              <div>
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">Role</div>
                <input
                  value={editUser.role}
                  disabled
                  className="mt-1 w-full rounded-[10px] border border-[#DFDBE3] bg-[#F5F5F7] px-3 py-2 text-[14px] text-[#6F6C90] outline-none"
                />
              </div>
              <div>
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">Status</div>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Status)}
                  className="mt-1 w-full rounded-[10px] border border-[#DFDBE3] px-3 py-2 text-[14px] outline-none"
                >
                  {allStatuses
                    .filter((s) => s !== "All Status")
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal - only show if user has permission */}
      {deleteUser && canDelete && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0A0A0A]">Delete User</h2>
              <button
                type="button"
                onClick={() => setDeleteUser(null)}
                className="h-7 w-7 rounded-full border border-[#DFDBE3] text-[#6F6C90]"
              >
                ×
              </button>
            </div>
            <p className="text-[14px] text-[#6F6C90]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#0A0A0A]">{deleteUser.name}</span>? This is a soft
              delete and the user will no longer appear in this list.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteUser(null)}
                className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={async () => {
                  if (!deleteUser?.userId) {
                    setDeleteUser(null);
                    return;
                  }
                  try {
                    setDeleteLoading(true);
                    await apiClient.delete(`/auth/users/${deleteUser.userId}`);
                    setRows((prev) => prev.filter((r) => r.userId !== deleteUser.userId));
                  } catch (err) {
                    console.error("Failed to delete user", err);
                  } finally {
                    setDeleteLoading(false);
                    setDeleteUser(null);
                  }
                }}
                className="rounded-[10px] bg-[#E0342F] px-4 py-2 text-[14px] font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
