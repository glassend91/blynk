'use client';

import { useState } from 'react';

export function OTPForm() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [purpose, setPurpose] = useState('');

  return (
    <div className="rounded-xl border border-[#EEEAF4] bg-white p-6 shadow-[0_1px_0_#EEEAF4,0_8px_24px_rgba(24,8,56,0.06)]">
      <h3 className="mb-4 text-[16px] font-semibold text-[#0A0A0A]">Send Verification OTP</h3>

      <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
        Customer Email or Phone
      </label>
      <input
        value={emailOrPhone}
        onChange={(e) => setEmailOrPhone(e.target.value)}
        placeholder="customer@email.com or +61400123456"
        className="mb-4 w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-[14px] outline-none placeholder:text-[#A39FB8]"
      />

      <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
        Purpose (Optional)
      </label>
      <input
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="e.g., Account verification, Service activation"
        className="mb-5 w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-[14px] outline-none placeholder:text-[#A39FB8]"
      />

      <div className="flex gap-3">
        <button
          className="rounded-md bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95"
          onClick={() => alert('Send SMS')}
        >
          Send SMS
        </button>
        <button
          className="rounded-md bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95"
          onClick={() => alert('Send Email')}
        >
          Send Email
        </button>
      </div>
    </div>
  );
}
