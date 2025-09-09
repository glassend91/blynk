'use client';

import { useState } from 'react';

export function ManualVerification() {
  const [idOrEmail, setIdOrEmail] = useState('');
  const [code, setCode] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <div className="rounded-xl border border-[#EEEAF4] bg-white p-6 shadow-[0_1px_0_#EEEAF4,0_8px_24px_rgba(24,8,56,0.06)]">
      <h3 className="mb-4 text-[16px] font-semibold text-[#0A0A0A]">Manual Verification</h3>

      <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
        Customer ID or Email
      </label>
      <input
        value={idOrEmail}
        onChange={(e) => setIdOrEmail(e.target.value)}
        placeholder="Enter customer identifier"
        className="mb-4 w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-[14px] outline-none placeholder:text-[#A39FB8]"
      />

      <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
        Verification Code
      </label>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter 6-digit code"
        className="mb-4 w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-[14px] outline-none placeholder:text-[#A39FB8]"
      />

      <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">Admin Notes</label>
      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Reason for manual verification"
        className="mb-5 w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-[14px] outline-none placeholder:text-[#A39FB8]"
      />

      <button
        className="rounded-md bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95"
        onClick={() => alert('Marked as verified')}
      >
        Make as Verified
      </button>
    </div>
  );
}
