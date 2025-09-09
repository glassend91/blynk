'use client';

import * as React from 'react';

export function AddNoteDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-[80] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div
        className={`absolute inset-0 flex items-center justify-center px-4 transition-transform duration-200 ${
          open ? 'scale-100' : 'scale-95'
        }`}
      >
        <div className="w-full max-w-[780px] rounded-2xl bg-white p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[22px] font-bold text-[#0A0A0A]">Add Customer Note</h3>
            <button
              onClick={() => onOpenChange(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F4FB]"
              aria-label="Close"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="m6 6 12 12M6 18 18 6" stroke="#DD3B3B" strokeWidth="1.7" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">Customer</label>
              <Select placeholder="Select customer" />
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">Note Type</label>
              <Select placeholder="Select type" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">Priority</label>
              <Select placeholder="Select priority" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">Note Content</label>
              <textarea
                rows={5}
                placeholder="Enter detailed note about the customer interaction..."
                className="w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] p-3 text-[14px] outline-none placeholder:text-[#A39FB8]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
                Tags (comma separated)
              </label>
              <input
                placeholder="e.g., Billing, Technical, Resolved"
                className="w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-[14px] outline-none placeholder:text-[#A39FB8]"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              className="rounded-md bg-[#F1EEF6] px-5 py-3 text-[14px] font-semibold text-[#401B60]"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-[#401B60] px-5 py-3 text-[14px] font-semibold text-white"
              onClick={() => alert('Saved')}
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Select({ placeholder }: { placeholder: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-left text-[14px] text-[#0A0A0A]"
      >
        <span className="text-[#A39FB8]">{placeholder}</span>
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path d="m6 9 6 6 6-6" stroke="#6F6C90" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-[#EEEAF4] bg-white shadow-lg">
          {['Option 1', 'Option 2', 'Option 3'].map((o) => (
            <button
              key={o}
              className="block w-full px-4 py-2 text-left text-[14px] hover:bg-[#F7F4FB]"
              onClick={() => setOpen(false)}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
