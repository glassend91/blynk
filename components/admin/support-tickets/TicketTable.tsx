"use client";

import TicketRow from "./TicketRow";
import type { Ticket } from "./types";

const rows: Ticket[] = [
  {
    id: "ST-2024-0156",
    customer: "Alice Brown",
    subject: "Internet connection issues",
    priority: "High",
    status: "Open",
    assignee: "Sarah Wilson",
    createdAgo: "2 Hours Ago",
  },
  {
    id: "ST-2024-0157",
    customer: "Lisa Park",
    subject: "Billing inquiry",
    priority: "Medium",
    status: "In Progress",
    assignee: "Mike Chen",
    createdAgo: "1 Day Ago",
  },
];

export default function TicketTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#DFDBE3]">
      <table className="w-full border-collapse text-left">
        <thead className="bg-white text-[14px] font-medium text-[#0A0A0A]">
          <tr className="[&>th]:px-4 [&>th]:py-4">
            <th className="w-[64px]">#</th>
            <th>Ticket ID</th>
            <th>Customer</th>
            <th>Subject</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assignee</th>
            <th>Created</th>
            <th className="w-[96px] text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-[14px] text-[#0A0A0A]">
          {rows.map((r, i) => (
            <TicketRow key={r.id} row={r} index={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
