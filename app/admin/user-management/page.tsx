"use client";

import { useEffect, useMemo, useState } from "react";

import TableHeader from "./_local/components/TableHeader";
import UsersTable from "./_local/components/UsersTable";
import { allStatuses, Role, Status, UserRow } from "./_local/data";
import apiClient from "@/lib/apiClient";
import { usePermission } from "@/lib/permissions";
import { getRoles } from "@/lib/services/roles";

export default function UserManagementPage() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | "All Roles">("All Roles");
  const [status, setStatus] = useState<Status | "All Status">("All Status");
  const canEdit = usePermission("user.edit");
  const canDelete = usePermission("user.delete");
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [viewUser, setViewUser] = useState<UserRow | null>(null);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [chargeUser, setChargeUser] = useState<UserRow | null>(null);
  const [invoicesUser, setInvoicesUser] = useState<UserRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editStatus, setEditStatus] = useState<Status>("Active");
  const [deleteUser, setDeleteUser] = useState<UserRow | null>(null);
  const [chargeAmount, setChargeAmount] = useState("");
  const [chargeDescription, setChargeDescription] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [chargeLoading, setChargeLoading] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          apiClient.get<{ success: boolean; users: UserRow[] }>("/auth/users"),
          getRoles().catch(() => []),
        ]);

        if (usersResponse.data?.success && Array.isArray(usersResponse.data.users)) {
          setRows(usersResponse.data.users);
        }

        if (Array.isArray(rolesResponse) && rolesResponse.length > 0) {
          const roleNames = rolesResponse.map((r) => r.name as Role);
          setAvailableRoles(roleNames);
        }
      } catch (err) {
        console.error("Failed to load users or roles", err);
        // Optional: if you still want a fallback, uncomment the next line
        // setRows(initialUsers);
      }
      setLoading(false);
    }

    load();
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    const isModalOpen = viewUser || editUser || deleteUser || chargeUser || invoicesUser;
    if (isModalOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [viewUser, editUser, deleteUser]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      // Only show customers (role === 'Customer')
      const isCustomer = r.role === "Customer";
      if (!isCustomer) return false;

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
        <h1 className="text-[26px] font-bold leading-[28px] text-[#0A0A0A]">Customer Management</h1>
        <p className="text-[16px] leading-[21px] text-[#6F6C90]">
          Manage customer accounts for your telecommunications platform.
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
        availableRoles={availableRoles}
        isCustomerOnly={true}
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
          onCharge={(u) => {
            setChargeUser(u);
            setChargeAmount("");
            setChargeDescription("");
          }}
          onInvoices={async (u) => {
            setInvoicesUser(u);
            setInvoicesLoading(true);
            try {
              const { data } = await apiClient.get(`/billing/admin/customers/${u.userId}/invoices`);
              if (data?.success) {
                setInvoices(data.data.invoices || []);
              }
            } catch (err) {
              console.error("Failed to fetch invoices", err);
            } finally {
              setInvoicesLoading(false);
            }
          }}
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
            width: '100vw',
            height: '100vh'
          }}
        >
          <div
            className="fixed bg-black/70"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 40
            }}
            onClick={() => setViewUser(null)}
          />
          <div
            className="fixed w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 41
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
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
        <div
          className="fixed z-40 flex items-center justify-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <div
            className="fixed bg-black/70"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 40
            }}
            onClick={() => setEditUser(null)}
          />
          <div
            className="fixed w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 41
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
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
        <div
          className="fixed z-40 flex items-center justify-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <div
            className="fixed bg-black/70"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 40
            }}
            onClick={() => setDeleteUser(null)}
          />
          <div
            className="fixed w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 41
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
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

      {/* Manual Charge Modal */}
      {chargeUser && (
        <div
          className="fixed z-40 flex items-center justify-center font-sans text-[14px]"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <div
            className="fixed bg-black/70"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 40
            }}
            onClick={() => !chargeLoading && setChargeUser(null)}
          />
          <div
            className="fixed w-full max-w-md rounded-[16px] bg-white p-6 shadow-xl"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 41
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-[18px] font-bold text-[#0A0A0A]">Manual Charge</h2>
                <p className="text-[13px] text-[#6F6C90]">Customer: {chargeUser.name}</p>
              </div>
              <button
                type="button"
                onClick={() => !chargeLoading && setChargeUser(null)}
                className="h-7 w-7 rounded-full border border-[#DFDBE3] text-[#6F6C90] hover:bg-gray-50 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!chargeUser?.userId || !chargeAmount || !chargeDescription) return;

                const amountNum = parseFloat(chargeAmount);
                if (isNaN(amountNum) || amountNum <= 0) {
                  alert("Please enter a valid positive amount.");
                  return;
                }

                try {
                  setChargeLoading(true);
                  const { data } = await apiClient.post(`/billing/admin/customers/${chargeUser.userId}/manual-charge`, {
                    amount: amountNum,
                    description: chargeDescription
                  });

                  if (data?.success) {
                    alert("Charge processed successfully!");
                    setChargeUser(null);
                  } else {
                    alert(data?.message || "Failed to process charge.");
                  }
                } catch (err: any) {
                  console.error("Manual charge failed", err);
                  const msg = err.response?.data?.message || err.message || "An error occurred.";
                  alert(`Error: ${msg}`);
                } finally {
                  setChargeLoading(false);
                }
              }}
            >
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wide text-[#6F6C90] mb-1">
                  Charge Amount (AUD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6C90] font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={chargeAmount}
                    onChange={(e) => setChargeAmount(e.target.value)}
                    required
                    disabled={chargeLoading}
                    className="w-full rounded-[10px] border border-[#DFDBE3] pl-7 pr-3 py-2 text-[15px] font-medium text-[#0A0A0A] outline-none focus:border-[#401B60] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-wide text-[#6F6C90] mb-1">
                  Description / Note
                </label>
                <textarea
                  placeholder="e.g. Late payment fee, custom setup fee..."
                  value={chargeDescription}
                  onChange={(e) => setChargeDescription(e.target.value)}
                  required
                  disabled={chargeLoading}
                  className="w-full rounded-[10px] border border-[#DFDBE3] px-3 py-2 text-[14px] outline-none focus:border-[#401B60] transition-colors min-h-[80px]"
                />
              </div>

              <div className="bg-[#FBFAFD] rounded-[10px] p-4 text-[13px] text-[#6F6C90] border border-[#F0EEF3]">
                <p><strong>Note:</strong> This will immediately charge the customer's default payment method on file and generate a paid invoice.</p>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={chargeLoading}
                  onClick={() => setChargeUser(null)}
                  className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={chargeLoading || !chargeAmount || !chargeDescription}
                  className="rounded-[10px] bg-[#19BF66] px-6 py-2 text-[14px] font-bold text-white shadow-md hover:bg-[#15A357] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {chargeLoading ? "Processing..." : `Charge $${parseFloat(chargeAmount || '0').toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Invoices Modal */}
      {invoicesUser && (
        <div
          className="fixed z-40 flex items-center justify-center font-sans text-[14px]"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <div
            className="fixed bg-black/70"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 40
            }}
            onClick={() => setInvoicesUser(null)}
          />
          <div
            className="fixed w-full max-w-2xl rounded-[16px] bg-white p-6 shadow-xl"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 41
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-[18px] font-bold text-[#0A0A0A]">Customer Invoices</h2>
                <p className="text-[13px] text-[#6F6C90]">User: {invoicesUser.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setInvoicesUser(null)}
                className="h-7 w-7 rounded-full border border-[#DFDBE3] text-[#6F6C90] hover:bg-gray-50 flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {invoicesLoading ? (
                <div className="py-10 text-center text-[#6F6C90]">Loading invoices...</div>
              ) : invoices.length === 0 ? (
                <div className="py-10 text-center text-[#6F6C90]">No invoices found for this customer.</div>
              ) : (
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-[#F8F8F8] text-[12px] text-[#6F6C90] uppercase tracking-wider">
                    <tr className="[&>th]:px-4 [&>th]:py-3 text-left">
                      <th>Invoice #</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0EEF3]">
                    {invoices.map((inv) => (
                      <tr key={inv._id} className="hover:bg-[#FBFAFD] [&>td]:px-4 [&>td]:py-3">
                        <td className="font-medium font-mono text-[13px]">{inv.invoiceNumber}</td>
                        <td className="text-[#6F6C90]">{new Date(inv.billingPeriod?.startDate).toLocaleDateString()}</td>
                        <td className="font-semibold text-[#0A0A0A]">${inv.total?.toFixed(2)}</td>
                        <td>
                          <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full ${inv.status === 'paid' ? 'bg-[#E7F9EF] text-[#19BF66]' :
                            inv.status === 'refunded' ? 'bg-[#FEEBEB] text-[#E0342F]' :
                              inv.status === 'cancelled' ? 'bg-[#F0EEF3] text-[#6F6C90]' :
                                'bg-[#FEF3C7] text-[#D97706]'
                            }`}>
                            {inv.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="text-right">
                          {inv.status === 'paid' && (
                            <button
                              onClick={async () => {
                                if (!confirm(`Are you sure you want to refund invoice ${inv.invoiceNumber}?`)) return;
                                try {
                                  setInvoicesLoading(true);
                                  const { data } = await apiClient.post(`/billing/admin/invoices/${inv._id}/refund`, {
                                    reason: "Admin initiated refund from portal"
                                  });
                                  if (data?.success) {
                                    alert("Refund processed successfully!");
                                    // Refresh invoices
                                    const { data: refreshData } = await apiClient.get(`/billing/admin/customers/${invoicesUser.userId}/invoices`);
                                    if (refreshData?.success) setInvoices(refreshData.data.invoices || []);
                                  }
                                } catch (err: any) {
                                  alert("Refund failed: " + (err.response?.data?.message || err.message));
                                } finally {
                                  setInvoicesLoading(false);
                                }
                              }}
                              className="text-[12px] font-bold text-[#E0342F] hover:underline"
                            >
                              REFUND
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setInvoicesUser(null)}
                className="rounded-[10px] border border-[#DFDBE3] px-6 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
