"use client";

import { useEffect, useState } from "react";
import { Role, UserRow } from "../data";
import apiClient from "@/lib/apiClient";
import { hasPermission } from "@/lib/permissions";
import { Select } from "./TableHeader";

type Props = {
  open: boolean;
  onClose: () => void;
  onInvite: (u: UserRow) => void;
  availableRoles: Role[];
};

export default function InviteUserModal({ open, onClose, onInvite, availableRoles }: Props) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<Role>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setEmail("");
      setFirstName("");
      setLastName("");
      setRole("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll position
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  // Set initial role when roles are available
  useEffect(() => {
    if (availableRoles.length > 0 && !role) {
      setRole(availableRoles[0]);
    }
  }, [availableRoles, role]);

  if (!open) return null;

  // Check permission before allowing submission
  const canInvite = hasPermission("user.invite");

  const handleSubmit = async () => {
    // Permission check
    if (!canInvite) {
      setError("You don't have permission to invite users.");
      return;
    }

    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      setError("First name, last name, and email are required.");
      return;
    }

    if (!role) {
      setError("Please select a role.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const payload = {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        subrole: role, // Send as 'subrole' to backend
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
    <div
      className="fixed z-[90]"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'auto'
      }}
    >
      <div
        className="fixed bg-black/70"
        onClick={onClose}
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 90
        }}
      />
      <div
        className="fixed left-1/2 top-1/2 w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white p-6 shadow-2xl"
        style={{ zIndex: 91 }}
      >
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
            {availableRoles.length === 0 ? (
              <div className="flex h-[48px] items-center justify-between rounded-[10px] border border-[#DFDBE3] bg-white px-4 text-left text-[14px] font-medium text-[#6F6C90]">
                Loading roles...
              </div>
            ) : (
              <Select
                label={role || "Select a role"}
                value={role}
                onChange={(v) => setRole(v as Role)}
                options={availableRoles}
                className="w-full"
                openUp={true}
              />
            )}
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
