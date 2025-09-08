"use client";

import { useEffect } from "react";
import type { Ticket } from "./types";

interface Props {
  open: boolean;
  onClose: () => void;
  ticket?: Ticket | null;
}

export default function ViewTicketModal({ open, onClose, ticket }: Props) {
  // simple ESC close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      {/* dialog */}
      <div className="relative z-10 w-[720px] max-w-[92vw] rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-[#0A0A0A]">Ticket Details</h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#F8F8F8] text-[#E5484D]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-3 text-[14px] text-[#0A0A0A]">
          <div className="grid grid-cols-2 gap-4">
            <Item label="Ticket ID" value={ticket.id} />
            <Item label="Customer" value={ticket.customer} />
            <Item label="Subject" value={ticket.subject} />
            <Item label="Priority" value={ticket.priority} />
            <Item label="Status" value={ticket.status} />
            <Item label="Assignee" value={ticket.assignee} />
            <Item label="Created" value={ticket.createdAgo} />
          </div>
          <div className="pt-2 text-[#6F6C90]">
            (This modal is a stub—hook it to your real data/actions as needed.)
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-[#DFDBE3] bg-white px-4 py-2 text-[14px] font-semibold text-[#401B60]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[12px] font-semibold uppercase tracking-wide text-[#627084]">
        {label}
      </div>
      <div className="text-[14px]">{value}</div>
    </div>
  );
}
