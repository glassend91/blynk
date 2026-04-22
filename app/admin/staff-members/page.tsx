"use client";

import { useEffect, useMemo, useState } from "react";

import TableHeader from "../user-management/_local/components/TableHeader";
import UsersTable from "../user-management/_local/components/UsersTable";
import InviteUserModal from "../user-management/_local/components/InviteUserModal";
import {
  allStatuses,
  Role,
  Status,
  UserRow,
} from "../user-management/_local/data";
import apiClient from "@/lib/apiClient";
import { usePermission } from "@/lib/permissions";
import { getRoles } from "@/lib/services/roles";

export default function StaffMembersPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | "All Roles">("All Roles");
  const [status, setStatus] = useState<Status | "All Status">("All Status");
  const [openInvite, setOpenInvite] = useState(false);
  const canInvite = usePermission("user.invite");
  const canEdit = usePermission("user.edit");
  const canDelete = usePermission("user.delete");
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [viewUser, setViewUser] = useState<UserRow | null>(null);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<Status>("Active");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<Role>("Support Manager");
  const [editPassword, setEditPassword] = useState("");
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          apiClient.get<{ success: boolean; users: UserRow[] }>("/auth/users"),
          getRoles().catch(() => []),
        ]);

        if (
          usersResponse.data?.success &&
          Array.isArray(usersResponse.data.users)
        ) {
          setRows(usersResponse.data.users);
        }

        if (Array.isArray(rolesResponse) && rolesResponse.length > 0) {
          const roleNames = rolesResponse.map((r) => r.name as Role);
          setAvailableRoles(roleNames);
        }
      } catch (err) {
        console.error("Failed to load users or roles", err);
      }
      setLoading(false);
    }

    load();
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = viewUser || editUser || deleteUser;
    if (isModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [viewUser, editUser, deleteUser]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      // Only show staff members (exclude customers - role !== 'Customer')
      const isStaff = r.role !== "Customer";
      if (!isStaff) return false;

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
        <h1 className="text-[26px] font-bold leading-[28px] text-[#0A0A0A]">
          Staff Members
        </h1>
        <p className="text-[16px] leading-[21px] text-[#6F6C90]">
          Manage staff access and permissions for your telecommunications
          platform.
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
        availableRoles={availableRoles}
        isCustomerOnly={false}
      />

      {/* Data table */}
      {loading ? (
        <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 text-[14px] text-[#6F6C90]">
          Loading staff members...
        </div>
      ) : (
        <UsersTable
          rows={filtered}
          onView={(u) => setViewUser(u)}
          onEdit={
            canEdit
              ? (u) => {
                  setEditUser(u);
                  setEditName(u.name);
                  setEditEmail(u.email);
                  setEditRole(u.role);
                  setEditStatus(u.status);
                  setEditPassword(""); // Clear password field on edit open
                }
              : undefined
          }
          onDelete={
            canDelete
              ? (u) => {
                  setDeleteUser(u);
                }
              : undefined
          }
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
          availableRoles={availableRoles}
        />
      )}

      {/* View user details modal */}
      {viewUser && (
        <div
          className="fixed z-40 flex items-center justify-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
            width: "100vw",
            height: "100vh",
          }}
        >
          <div
            className="fixed bg-black/70"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 40,
            }}
            onClick={() => setViewUser(null)}
          />
          <div
            className="fixed w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 41,
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0A0A0A]">
                Staff Member Details
              </h2>
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
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">
                  Name
                </div>
                <div>{viewUser.name}</div>
              </div>
              <div>
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">
                  Email
                </div>
                <div>{viewUser.email}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">
                    Role
                  </div>
                  <div>{viewUser.role}</div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">
                    Status
                  </div>
                  <div>{viewUser.status}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">
                    Last Login
                  </div>
                  <div>{viewUser.lastLogin}</div>
                </div>
                <div>
                  <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">
                    Created
                  </div>
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
        <div
          className="fixed z-40 flex items-center justify-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
            width: "100vw",
            height: "100vh",
          }}
        >
          <div
            className="fixed bg-black/70"
            onClick={() => setEditUser(null)}
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 40,
            }}
          />
          <div
            className="fixed w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 41,
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0A0A0A]">
                Edit Staff Member
              </h2>
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
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onSubmit={async (e) => {
                e.preventDefault();
                if (!editUser?.userId) {
                  setEditUser(null);
                  return;
                }
                try {
                  setEditLoading(true);
                  const payload: any = {
                    name: editName,
                    email: editEmail,
                    role: editRole,
                    status: editStatus,
                  };
                  if (editPassword) {
                    payload.password = editPassword;
                  }

                  const { data } = await apiClient.put<{
                    success: boolean;
                    user: UserRow;
                  }>(`/auth/users/${editUser.userId}`, payload);

                  if (data?.success && data.user) {
                    const updated = data.user;
                    setRows((prev) =>
                      prev.map((r) =>
                        r.userId &&
                        updated.userId &&
                        r.userId === updated.userId
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
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">
                  Name
                </div>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border border-[#DFDBE3] px-3 py-2 text-[14px] outline-none"
                />
              </div>
              <div>
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">
                  Email
                </div>
                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="mt-1 w-full rounded-[10px] border border-[#DFDBE3] px-3 py-2 text-[14px] outline-none"
                />
              </div>
              <div>
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">
                  Role
                </div>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as Role)}
                  className="mt-1 w-full rounded-[10px] border border-[#DFDBE3] px-3 py-2 text-[14px] outline-none"
                >
                  {availableRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">
                  Status
                </div>
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

              <div>
                <div className="text-[12px] uppercase tracking-wide text-[#6F6C90]">
                  New Password (optional)
                </div>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Enter to change password"
                  className="mt-1 w-full rounded-[10px] border border-[#DFDBE3] px-3 py-2 text-[14px] outline-none"
                />
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
        <div
          className="fixed z-40 flex items-center justify-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
            width: "100vw",
            height: "100vh",
          }}
        >
          <div
            className="fixed bg-black/70"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 40,
            }}
            onClick={() => setDeleteUser(null)}
          />
          <div
            className="fixed w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 41,
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#0A0A0A]">
                Delete Staff Member
              </h2>
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
              <span className="font-semibold text-[#0A0A0A]">
                {deleteUser.name}
              </span>
              ? This is a soft delete and the user will no longer appear in this
              list.
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
                    setRows((prev) =>
                      prev.filter((r) => r.userId !== deleteUser.userId),
                    );
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
