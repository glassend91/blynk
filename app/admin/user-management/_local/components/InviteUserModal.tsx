"use client";

import { useEffect, useState } from "react";
import { Role, UserRow } from "../data";
import apiClient from "@/lib/apiClient";

type Props = {
  open: boolean;
  onClose: () => void;
  onInvite: (u: UserRow) => void;
};

const roleOptions: Role[] = ["Administrator", "Support Manager", "Content Editor", "Technical Support"];

export default function InviteUserModal({ open, onClose, onInvite }: Props) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<Role>("Technical Support");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail("");
      setFirstName("");
      setLastName("");
      setRole("Technical Support");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      setError("First name, last name, and email are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const payload = {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role,
      };
      const { data } = await apiClient.post<{ success: boolean; user: UserRow }>("/auth/createUserByAdmin", payload);

      if (data?.success && data.user) {
        onInvite(data.user);
        onClose();
        return;
      }

      setError("Failed to invite user. Please try again.");
    } catch (err: any) {
      setError(err?.message || "Failed to invite user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter first name"
                className="w-full rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none placeholder-[#6F6C90]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter last name"
                className="w-full rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none placeholder-[#6F6C90]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">Initial Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full appearance-none rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none"
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="h-[44px] flex-1 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F3F1F6]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="h-[44px] flex-1 rounded-[10px] bg-[#401B60] text-[14px] font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
