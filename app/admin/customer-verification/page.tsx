'use client';

import { useState } from 'react';
import { OTPForm } from './_local/OTPForm';
import { ManualVerification } from './_local/ManualVerification';
import { StatCard } from './_local/StatCard';
import { AddNoteDialog } from './_local/AddNoteDialog';

export default function CustomerVerificationPage() {
  const [openNote, setOpenNote] = useState(false);
  console.log('openNote', openNote);

  // mock stats (wire to API later)
  const stats = [
    { label: 'Pending Verification', value: 2, icon: 'clock' as const },
    { label: 'Verified Today', value: 1, icon: 'check' as const },
    { label: 'Failed Verifications', value: 1, icon: 'warning' as const },
    { label: 'OTPs Sent Today', value: 3, icon: 'send' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-[26px] font-bold text-[#0A0A0A]">Customer Verification</h1>
        <p className="mt-1 text-[14px] text-[#6F6C90]">
          Send verification OTPs to customers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ManualVerification />
        <OTPForm />
      </div>

      {/* Floating action: Add Note (match to your pattern of top-right CTA) */}
      <div className="flex justify-end">
        <button
          onClick={() => setOpenNote(true)}
          className="rounded-md bg-[#401B60] px-5 py-3 text-[15px] font-semibold text-white shadow-sm hover:opacity-95"
        >
          Add New Service
        </button>
      </div>

{
  openNote && (
    <AddNoteDialog open={openNote} onOpenChange={setOpenNote} />
  )
}
      {/* <AddNoteDialog open={openNote} onOpenChange={setOpenNote} /> */}
    </div>
  );
}
