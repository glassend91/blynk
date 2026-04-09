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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  if (!open || !ticket) return null;

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
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* backdrop */}
      <div
        className="fixed bg-black/70"
        onClick={onClose}
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 90,
        }}
      />
      {/* dialog */}
      <div
        className="fixed z-[91] w-[720px] max-w-[92vw] rounded-2xl bg-white p-6 shadow-xl"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-[#0A0A0A]">
            Ticket Details
          </h3>
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
          {/* <div className="pt-2 text-[#6F6C90]">
            (This modal is a stub—hook it to your real data/actions as needed.)
          </div> */}
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
