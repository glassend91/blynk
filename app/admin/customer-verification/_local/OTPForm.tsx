"use client";

import { useState } from "react";
import apiClient from "@/lib/apiClient";

export function OTPForm({ onSuccess }: { onSuccess?: () => void }) {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [channel, setChannel] = useState<"email" | "sms" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSend = async (sendChannel: "email" | "sms") => {
    if (!emailOrPhone.trim()) {
      setError("Email or phone number is required");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      setChannel(sendChannel);

      const { data } = await apiClient.post<{
        success: boolean;
        message: string;
        data?: any;
      }>("/customer-verification/send-otp", {
        emailOrPhone: emailOrPhone.trim(),
        channel: sendChannel,
        purpose: purpose.trim() || undefined,
      });

      if (data?.success) {
        setSuccess(data.message || `OTP sent successfully via ${sendChannel}`);
        setEmailOrPhone("");
        setPurpose("");
        onSuccess?.();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#EEEAF4] bg-white p-6 shadow-[0_1px_0_#EEEAF4,0_8px_24px_rgba(24,8,56,0.06)]">
      <h3 className="mb-4 text-[16px] font-semibold text-[#0A0A0A]">
        Send Verification OTP
      </h3>

      <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
        Customer Email or Phone
      </label>
      <input
        value={emailOrPhone}
        onChange={(e) => setEmailOrPhone(e.target.value)}
        placeholder="customer@email.com or +61400123456"
        className="mb-4 w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-[14px] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
        disabled={submitting}
      />

      <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
        Purpose (Optional)
      </label>
      <input
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="e.g., Account verification, Service activation"
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
          onClick={() => handleSend("sms")}
          disabled={submitting}
        >
          {submitting && channel === "sms" ? "Sending..." : "Send SMS"}
        </button>
        <button
          className="rounded-md bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleSend("email")}
          disabled={submitting}
        >
          {submitting && channel === "email" ? "Sending..." : "Send Email"}
        </button>
        <button
          className="rounded-md border border-dashed border-red-300 bg-red-50 px-4 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-100"
          onClick={() => onSuccess?.()}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
