"use client";

import { useState } from "react";
import apiClient from "@/lib/apiClient";

export function ManualVerification({ onSuccess }: { onSuccess?: () => void }) {
  const [idOrEmail, setIdOrEmail] = useState("");
  const [code, setCode] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleVerify = async () => {
    if (!idOrEmail.trim()) {
      setError("Customer ID or email is required");
      return;
    }

    if (!code.trim()) {
      setError("OTP code is required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const { data } = await apiClient.post<{
        success: boolean;
        message: string;
      }>("/customer-verification/verify-otp", {
        emailOrPhone: idOrEmail.trim(),
        otpCode: code.trim(),
        adminNotes: notes.trim() || undefined,
      });

      if (data?.success) {
        setSuccess("Customer verified successfully");
        setIdOrEmail("");
        setCode("");
        setNotes("");
        onSuccess?.();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to verify customer. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to verify customer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualVerify = async () => {
    if (!idOrEmail.trim()) {
      setError("Customer ID or email is required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      const { data } = await apiClient.post<{
        success: boolean;
        message: string;
      }>("/customer-verification/manual-verify", {
        customerIdOrEmail: idOrEmail.trim(),
        adminNotes: notes.trim() || undefined,
      });

      if (data?.success) {
        setSuccess("Customer marked as verified");
        setIdOrEmail("");
        setCode("");
        setNotes("");
        onSuccess?.();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to verify customer. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to verify customer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#EEEAF4] bg-white p-6 shadow-[0_1px_0_#EEEAF4,0_8px_24px_rgba(24,8,56,0.06)]">
      <h3 className="mb-4 text-[16px] font-semibold text-[#0A0A0A]">
        Manual Verification
      </h3>

      <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
        Customer ID or Email
      </label>
      <input
        value={idOrEmail}
        onChange={(e) => setIdOrEmail(e.target.value)}
        placeholder="Enter customer identifier"
        className="mb-4 w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-[14px] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
        disabled={submitting}
      />

      <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
        Ask the customer to read the OTP they received. Enter it here and select
        Verify. We&rsquo;ll mark the account as verified and add a note that it
        was confirmed over the phone.
      </label>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter 6-digit code"
        maxLength={6}
        className="mb-4 w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-[14px] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
        disabled={submitting}
      />

      <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
        Admin Notes
      </label>
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Reason for manual verification"
        className="mb-5 w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-[14px] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
        disabled={submitting}
      />

      {error && (
        <div className="mb-4 rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-[10px] border border-[#C6F6D5] bg-[#F0FDF4] px-4 py-3 text-[13px] text-[#16A34A]">
          {success}
        </div>
      )}

      <div className="flex gap-3">
        <button
          className="rounded-md bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleVerify}
          disabled={submitting || !code.trim()}
        >
          {submitting ? "Verifying..." : "Verify OTP"}
        </button>
        <button
          className="rounded-md border border-[#DFDBE3] bg-white px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8] disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleManualVerify}
          disabled={submitting}
        >
          {submitting ? "Processing..." : "Mark as Verified"}
        </button>
      </div>
    </div>
  );
}
