"use client";

import { useState } from "react";
import type { Ticket } from "./types";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import ViewTicketModal from "./ViewTicketModal";
import apiClient from "@/lib/apiClient";

export default function TicketRow({
  row,
  index,
  onUpdated,
}: {
  row: Ticket;
  index: number;
  onUpdated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (!newStatus) return;
    setIsUpdating(true);
    try {
      await apiClient.put(`/support-tickets/${row.id}`, { status: newStatus });
      if (onUpdated) onUpdated();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <tr className="border-t border-[#DFDBE3] hover:bg-[#FBFAFD] [&>td]:px-4 [&>td]:py-4">
        <td className="w-[64px] text-[14px] text-[#6F6C90]">{index + 1}</td>
        <td>
          <button
            className="text-[14px] font-semibold text-[#401B60] underline-offset-2 hover:underline"
            onClick={() => setOpen(true)}
          >
            {row.id}
          </button>
        </td>
        <td className="text-[14px] text-[#6F6C90]">{row.customer}</td>
        <td className="text-[14px] text-[#6F6C90]">{row.subject}</td>
        {/* <td>
          <PriorityBadge level={row.priority} />
        </td> */}
        <td>
          <StatusBadge status={row.status} />
        </td>
        {/* <td className="text-[14px] text-[#6F6C90]">{row.assignee}</td> */}
        <td className="text-[14px] text-[#6F6C90]">{row.createdAgo}</td>
        <td className="text-right">
          <div className="flex items-center justify-end gap-2">
            <select
              value=""
              onChange={handleStatusChange}
              disabled={isUpdating}
              className="rounded-md border border-[#DFDBE3] bg-white px-2 py-1.5 text-[13px] text-[#6F6C90] outline-none disabled:opacity-50"
            >
              <option value="" disabled>Status...</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => setOpen(true)}
              className="rounded-md border border-[#DFDBE3] bg-white px-3 py-1.5 text-[14px] font-semibold text-[#401B60] hover:bg-[#F8F8F8]"
            >
              View
            </button>
          </div>
        </td>
      </tr>

      <ViewTicketModal
        open={open}
        onClose={() => setOpen(false)}
        ticket={row}
      />
    </>
  );
}
