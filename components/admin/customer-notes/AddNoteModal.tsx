'use client';

import * as React from 'react';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function AddNoteModal({ open, onOpenChange }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-[940px] max-w-[94vw] rounded-[16px] bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-[26px] font-bold text-[#0A0A0A]">Add Customer Note</h3>
            <p className="mt-1 text-[14px] text-[#6F6C90]">
              Record a new interaction or note for a customer.
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#FEECEC] text-[#E54343]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onOpenChange(false);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Customer">
              <Select placeholder="Select customer" />
            </Field>
            <Field label="Note Type">
              <Select placeholder="Select type" />
            </Field>
            <Field label="Priority">
              <Select placeholder="Select priority" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Note Content">
                <textarea
                  rows={5}
                  placeholder="Enter detailed note about the customer interaction..."
                  className="w-full resize-none rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-3 outline-none"
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Tags (comma separated)">
                <input
                  placeholder="e.g., Billing, Technical, Resolved"
                  className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-[11px] outline-none"
                />
              </Field>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-[10px] border border-[#DFDBE3] bg-white px-6 py-3 text-[#0A0A0A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[10px] bg-[#401B60] px-6 py-3 font-semibold text-white"
            >
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: React.PropsWithChildren<{ label: string }>) {
  return (
    <label className="block">
      <div className="mb-2 text-[14px] font-medium text-[#0A0A0A]">{label}</div>
      {children}
    </label>
  );
}

function Select({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex items-center justify-between rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-[11px]">
      <span className="text-[#6F6C90]">{placeholder}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6l4 4 4-4" stroke="#6F6C90" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
