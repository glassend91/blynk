"use client";

import { useState } from "react";

export default function ManualOTPVerify({
  onVerify,
  loading = false,
  error,
  success = false,
}: {
  onVerify: (otp: string) => Promise<void> | void;
  loading?: boolean;
  error?: string | null;
  success?: boolean;
}) {
  const [otp, setOtp] = useState("");

  return (
    <div className="rounded-2xl border border-[#EEEAF4] bg-white p-5">
      <h3 className="text-[18px] font-bold text-[#0A0A0A]">Manual Verification</h3>
      <p className="mt-1 text-[14px] text-[#6F6C90]">
        Ask the customer to read the OTP they received. Enter it below and click <b>Verify</b>.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div className="grow">
          <label className="mb-1 block text-[13px] font-semibold text-[#6F6C90]">Enter OTP received by customer</label>
          <input
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\s+/g, ""))}
            placeholder="6-digit code"
            className="w-full rounded-[10px] border border-[#EEEAF4] px-3 py-2.5 text-[16px] tracking-[4px] focus:border-[#3F205F] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={() => onVerify(otp)}
          disabled={!otp || loading}
          className="h-[45px] rounded-[10px] bg-[#3F205F] px-5 text-[15px] font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Verify"}
        </button>
      </div>

      {error ? <p className="mt-2 text-[14px] font-medium text-[#C63D3D]">{error}</p> : null}

      {success ? (
        <div className="mt-3 rounded-[10px] bg-[#ECFDF3] px-3 py-2 text-[14px] font-semibold text-[#05603A]">
          ✅ Customer verified via call. A note has been added to their history.
        </div>
      ) : null}
    </div>
  );
}
