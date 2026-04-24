"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import TicketRow from "./TicketRow";
import type { Ticket, Priority, Status } from "./types";
import apiClient from "@/lib/apiClient";

type ApiTicket = {
  id?: string;
  _id?: string;
  ticketId?: string;
  subject?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
  customer?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  assignedTo?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

export default function TicketTable() {
  const [rows, setRows] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const { data } = await apiClient.get<{
        success: boolean;
        data?: { tickets?: ApiTicket[] };
      }>("/support-tickets?limit=50");

      const payload = data?.data?.tickets ?? [];
      const mapped = payload.map((ticket) => mapTicket(ticket));
      setRows(mapped);
    } catch (err: any) {
      setError(err?.message || "Failed to load support tickets.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="rounded-2xl border border-[#DFDBE3] bg-[#FBFBFD] p-6 text-[14px] text-[#6F6C90]">
          Loading support tickets...
        </div>
      );
    }

    if (error) {
      return (
        <div className="rounded-2xl border border-[#FCD1D2] bg-[#FFF5F5] p-6 text-[14px] text-[#C53030]">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchTickets}
              className="rounded-md border border-[#F6B0B3] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#C53030]"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (rows.length === 0) {
      return (
        <div className="rounded-2xl border border-[#DFDBE3] bg-[#FBFBFD] p-6 text-[14px] text-[#6F6C90]">
          No support tickets found.
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded-2xl border border-[#DFDBE3]">
        <table className="w-full border-collapse text-left">
          <thead className="bg-white text-[14px] font-medium text-[#0A0A0A]">
            <tr className="[&>th]:px-4 [&>th]:py-4">
              <th className="w-[64px]">#</th>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Subject</th>
              {/* <th>Priority</th> */}
              <th>Status</th>
              {/* <th>Assignee</th> */}
              <th>Created</th>
              <th className="w-[200px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-[14px] text-[#0A0A0A]">
            {rows.map((r, i) => (
              <TicketRow key={r.id} row={r} index={i} onUpdated={fetchTickets} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }, [error, fetchTickets, loading, rows]);

  return content;
}

function mapTicket(ticket: ApiTicket): Ticket {
  const id = ticket.ticketId || ticket.id || ticket._id || "TICKET";
  const customer =
    ticket.customer?.name ||
    [ticket.customer?.firstName, ticket.customer?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    ticket.customer?.email ||
    "Customer";
  const assignee =
    ticket.assignedTo?.name ||
    [ticket.assignedTo?.firstName, ticket.assignedTo?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    ticket.assignedTo?.email ||
    "Unassigned";

  return {
    id,
    customer,
    subject: ticket.subject || "—",
    priority: mapPriority(ticket.priority),
    status: mapStatus(ticket.status),
    assignee,
    createdAgo: formatRelativeTime(ticket.createdAt),
  };
}

function mapPriority(value?: string): Priority {
  const normalized = (value || "Medium").toLowerCase();
  switch (normalized) {
    case "critical":
      return "Critical";
    case "high":
      return "High";
    case "low":
      return "Low";
    case "medium":
    default:
      return "Medium";
  }
}

function mapStatus(value?: string): Status {
  const normalized = (value || "Open").toLowerCase();
  switch (normalized) {
    case "in progress":
      return "In Progress";
    case "pending customer":
      return "Pending Customer";
    case "resolved":
      return "Resolved";
    case "closed":
      return "Closed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Open";
  }
}

function formatRelativeTime(dateInput?: string) {
  if (!dateInput) return "-";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "-";

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) return "Just now";
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60)
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}
