"use client";

import { useEffect, useState } from "react";
import { getRoleUsers, type RoleUser } from "@/lib/services/roles";

type Props = {
  open: boolean;
  onClose: () => void;
  roleId: string;
  roleName: string;
};

export default function ViewRoleUsersModal({
  open,
  onClose,
  roleId,
  roleName,
}: Props) {
  const [users, setUsers] = useState<RoleUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && roleId) {
      const fetchUsers = async () => {
        try {
          setLoading(true);
          const data = await getRoleUsers(roleId);
          setUsers(data);
        } catch (e) {
          console.error("Failed to fetch users for role", e);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    }
  }, [open, roleId]);

  if (!open) return null;

  return (
    <div
      className="fixed z-50 flex items-center justify-center"
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
          zIndex: 50,
        }}
        onClick={onClose}
      />
      <div
        className="fixed w-full max-w-2xl rounded-[16px] bg-white p-6 shadow-xl"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 51,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#0A0A0A]">
              Users assigned to {roleName}
            </h2>
            <p className="text-[14px] text-[#6F6C90]">
              Showing all staff members currently assigned this role.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full border border-[#DFDBE3] text-[#6F6C90] hover:bg-gray-50"
          >
            ×
          </button>
        </div>

        <div className="mt-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="py-10 text-center text-[14px] text-[#6F6C90]">
              Loading users...
            </div>
          ) : users.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#F5F5F7] text-[12px] uppercase tracking-wider text-[#8E8CA2]">
                  <th className="pb-3 pr-4 font-semibold">User</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Assigned On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F7]">
                {users.map((user) => (
                  <tr key={user.id} className="text-[14px]">
                    <td className="py-4 pr-4">
                      <div className="font-semibold text-[#0A0A0A]">
                        {user.name}
                      </div>
                      <div className="text-[12px] text-[#6F6C90]">
                        {user.email}
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`rounded-full px-2 py-1 text-[12px] font-medium ${
                          user.status === "Active"
                            ? "bg-[#E6FFFA] text-[#047857]"
                            : user.status === "Pending"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 text-[#6F6C90]">{user.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-10 text-center text-[14px] text-[#6F6C90]">
              No users found for this role.
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[10px] bg-[#401B60] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
