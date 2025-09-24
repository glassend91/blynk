"use client";

import { useEffect, useState } from "react";
import { Role } from "../data";

type Props = {
  open: boolean;
  onClose: () => void;
  onInvite: (u: { name: string; email: string; role: Role; status: "Pending"; lastLogin: string; created: string }) => void;
};

export default function InviteUserModal({ open, onClose, onInvite }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("Technical Support");

  useEffect(() => {
    if (!open) {
      setEmail("");
      setName("");
      setRole("Technical Support");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white p-6 shadow-2xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">Invite New User</h2>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="mb-5 text-[14px] text-[#6F6C90]">
          Send an invitation to a new team member. They will receive an email to set up their account.
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@telco.com"
              className="w-full rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none placeholder-[#6F6C90]"
            />
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              className="w-full rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none placeholder-[#6F6C90]"
            />
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">Initial Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full appearance-none rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none"
            >
              <option>Administrator</option>
              <option>Support Manager</option>
              <option>Content Editor</option>
              <option>Technical Support</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="h-[44px] flex-1 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F3F1F6]"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onInvite({
                name: name || "Invited User",
                email: email || "user@telco.com",
                role,
                status: "Pending",
                lastLogin: "Never",
                created: new Date().toISOString().slice(0, 10),
              })
            }
            className="h-[44px] flex-1 rounded-[10px] bg-[#401B60] text-[14px] font-semibold text-white hover:opacity-95"
          >
            Send Invitation
          </button>
        </div>
      </div>
    </div>
  );
}
