"use client";

import Panel from "../Panel";
import { Pill } from "../Pill";
import { useEffect, useState } from "react";
import { getAllTickets, createTicket, type Ticket, type CreateTicketPayload } from "@/lib/services/tickets";

type ValidationError = {
  path: string;
  msg: string;
  value?: any;
};

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await getAllTickets();
      setTickets(response.data.tickets);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (payload: CreateTicketPayload) => {
    try {
      setIsCreating(true);
      setValidationErrors([]);
      await createTicket(payload);
      setShowCreateModal(false);
      fetchTickets(); // Refresh the list
    } catch (err: any) {
      // Check if it's a validation error response
      const errorData = err.response?.data;

      // Check for validation errors in the response data
      if (errorData?.success === false && errorData?.errors && Array.isArray(errorData.errors)) {
        setValidationErrors(errorData.errors);
      } else if (errorData?.errors && Array.isArray(errorData.errors)) {
        setValidationErrors(errorData.errors);
      } else {
        // For non-validation errors, show as a general error in the modal
        setValidationErrors([{
          path: "general",
          msg: err.message || "Failed to create ticket"
        }]);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const openTickets = tickets.filter((t) => t.status === "Open");
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed");

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[26px] font-bold text-[#0A0A0A]">Support Tickets</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-[10px] bg-[#3F205F] px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-[#4F2870] transition-colors"
        >
          + Create Ticket
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <StatTile title="Open Tickets" value={openTickets.length.toString()} hint="Currently being resolved" />
        <StatTile title="Resolved Tickets" value={resolvedTickets.length.toString()} hint="Completed this month" />
        <StatTile title="Avg. Response Time" value="2h" hint="Average first response" />
      </div>

      {loading ? (
        <Panel className="mt-6 p-6">
          <div className="text-center text-[#6F6C90]">Loading tickets...</div>
        </Panel>
      ) : error ? (
        <Panel className="mt-6 p-6">
          <div className="text-center text-red-600">{error}</div>
        </Panel>
      ) : tickets.length === 0 ? (
        <Panel className="mt-6 p-6">
          <div className="text-center text-[#6F6C90]">No tickets found</div>
        </Panel>
      ) : (
        tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))
      )}

      {showCreateModal && (
        <CreateTicketModal
          onClose={() => {
            setShowCreateModal(false);
            setValidationErrors([]);
          }}
          onCreate={handleCreateTicket}
          isCreating={isCreating}
          validationErrors={validationErrors}
        />
      )}
    </>
  );
}

function StatTile({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <Panel className="p-6">
      <div className="text-[14px] font-semibold text-[#0A0A0A]">{title}</div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-[28px] font-extrabold text-[#0A0A0A]">{value}</div>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F4F3F7] text-[#3F205F]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </span>
      </div>
      <div className="text-[12px] text-[#6F6C90] mt-1">{hint}</div>
    </Panel>
  );
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  const getStatusTone = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
      case "in progress":
        return "purple";
      case "resolved":
      case "closed":
        return "green";
      default:
        return "grey";
    }
  };

  const getPriorityTone = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "red";
      case "medium":
        return "grey";
      case "low":
        return "grey";
      default:
        return "grey";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <Panel className="mt-4 p-6">
      <div className="text-[15px] font-semibold text-[#0A0A0A]">{ticket.subject}</div>

      <div className="mt-4 rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD]">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M2 8.5C6.5 4.5 17.5 4.5 22 8.5M5 12c4-3 10-3 14 0" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <div className="text-[14px] font-semibold text-[#0A0A0A]">{ticket.description}</div>
              <div className="text-[12px] text-[#6F6C90]">Ticket #{ticket.id.slice(-12).toUpperCase()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Pill tone={getStatusTone(ticket.status)}>{ticket.status}</Pill>
            {/* <Pill tone={getPriorityTone(ticket.priority)}>{ticket.priority}</Pill> */}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 border-t border-[#EEEAF4] p-4 text-[13px]">
          <div>
            <div className="text-[#6F6C90]">Category</div>
            <div className="font-semibold text-[#0A0A0A]">{ticket.category}</div>
          </div>
          <div>
            <div className="text-[#6F6C90]">Created</div>
            <div className="font-semibold text-[#0A0A0A]">{formatDate(ticket.createdAt)}</div>
          </div>
          <div>
            <div className="text-[#6F6C90]">Last Update</div>
            <div className="font-semibold text-[#0A0A0A]">{getTimeAgo(ticket.lastActivity)}</div>
          </div>
          <div>
            <div className="text-[#6F6C90]">Messages</div>
            <div className="font-semibold text-[#0A0A0A]">{ticket.messages.length}</div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function CreateTicketModal({
  onClose,
  onCreate,
  isCreating,
  validationErrors,
}: {
  onClose: () => void;
  onCreate: (payload: CreateTicketPayload) => void;
  isCreating: boolean;
  validationErrors: ValidationError[];
}) {
  const [formData, setFormData] = useState<CreateTicketPayload>({
    subject: "",
    description: "",
    category: "Technical",
  });

  // Lock body scroll when modal is open
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  const getFieldError = (fieldName: string) => {
    const error = validationErrors.find((err) => err.path === fieldName);
    return error?.msg;
  };

  const hasFieldError = (fieldName: string) => {
    return validationErrors.some((err) => err.path === fieldName);
  };

  return (
    <div
      className="fixed z-50 flex items-center justify-center"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      <div
        className="fixed bg-black/70"
        onClick={onClose}
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 50
        }}
      />
      <div
        className="fixed w-full max-w-lg rounded-[16px] bg-white p-6 shadow-xl"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 51
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[20px] font-bold text-[#0A0A0A]">Create Support Ticket</h2>
          <button
            onClick={onClose}
            className="text-[#6F6C90] hover:text-[#0A0A0A]"
            disabled={isCreating}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div>
            <label className="mb-1 block text-[14px] font-semibold text-[#0A0A0A]">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={`w-full rounded-[8px] border px-3 py-2 text-[14px] focus:outline-none ${hasFieldError("subject")
                ? "border-red-500 focus:border-red-600"
                : "border-[#EEEAF4] focus:border-[#3F205F]"
                }`}
              placeholder="Brief description of the issue"
              required
              disabled={isCreating}
            />
            {getFieldError("subject") && (
              <p className="mt-1 text-[12px] text-red-600">{getFieldError("subject")}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-[14px] font-semibold text-[#0A0A0A]">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full rounded-[8px] border px-3 py-2 text-[14px] focus:outline-none ${hasFieldError("description")
                ? "border-red-500 focus:border-red-600"
                : "border-[#EEEAF4] focus:border-[#3F205F]"
                }`}
              placeholder="Provide more details about your issue"
              rows={4}
              required
              disabled={isCreating}
            />
            {getFieldError("description") && (
              <p className="mt-1 text-[12px] text-red-600">{getFieldError("description")}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-[14px] font-semibold text-[#0A0A0A]">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full rounded-[8px] border px-3 py-2 text-[14px] focus:outline-none ${hasFieldError("category")
                ? "border-red-500 focus:border-red-600"
                : "border-[#EEEAF4] focus:border-[#3F205F]"
                }`}
              disabled={isCreating}
            >
              <option value="Technical">Technical</option>
              <option value="Billing">Billing</option>
              <option value="Service">Service</option>
              <option value="General">General</option>
            </select>
            {getFieldError("category") && (
              <p className="mt-1 text-[12px] text-red-600">{getFieldError("category")}</p>
            )}
          </div>

          {/* {validationErrors.length > 0 && (
            <div className="rounded-[8px] bg-red-50 p-3 text-[13px] text-red-800">
              <div className="font-semibold">Please fix the following errors:</div>
              <ul className="mt-1 space-y-1">
                {validationErrors.map((err, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>{err.msg}</span>
                  </li>
                ))}
              </ul>
            </div>
          )} */}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[10px] border border-[#EEEAF4] px-4 py-2.5 text-[14px] font-semibold text-[#0A0A0A] hover:bg-[#F4F3F7] transition-colors"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-[10px] bg-[#3F205F] px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-[#4F2870] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

