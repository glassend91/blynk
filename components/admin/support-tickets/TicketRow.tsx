"use client";

import { useState } from "react";
import type { Ticket } from "./types";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./StatusBadge";
import ViewTicketModal from "./ViewTicketModal";

export default function TicketRow({ row, index }: { row: Ticket; index: number }) {
  const [open, setOpen] = useState(false);

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
        <td><PriorityBadge level={row.priority} /></td>
        <td><StatusBadge status={row.status} /></td>
        <td className="text-[14px] text-[#6F6C90]">{row.assignee}</td>
        <td className="text-[14px] text-[#6F6C90]">{row.createdAgo}</td>
        <td className="text-right">
          <button
            onClick={() => setOpen(true)}
            className="rounded-md border border-[#DFDBE3] bg-white px-3 py-1.5 text-[14px] font-semibold text-[#401B60] hover:bg-[#F8F8F8]"
          >
            View
          </button>
        </td>
      </tr>

      <ViewTicketModal open={open} onClose={() => setOpen(false)} ticket={row} />
    </>
  );
}
