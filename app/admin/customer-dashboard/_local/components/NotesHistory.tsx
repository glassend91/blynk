"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

type Note = {
  id: string;
  customerId: string;
  noteType: string;
  priority: string;
  content: string;
  tags: string[];
  isCritical?: boolean;
  createdBy: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  createdAt: string;
};

type Props = {
  customerId?: string;
  onNoteAdded?: () => void;
};

export default function NotesHistory({ customerId, onNoteAdded }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);

  useEffect(() => {
    if (customerId) {
      fetchNotes();
    } else {
      setNotes([]);
    }
  }, [customerId]);

  const fetchNotes = async () => {
    if (!customerId) return;

    try {
      setLoading(true);
      setError(null);

      const { data } = await apiClient.get<{ success: boolean; data: Note[] }>(
        `/customer-verification/notes?customerId=${customerId}&limit=100`,
      );

      if (data?.success && data.data) {
        // Sort notes: critical first (always pinned to top), then by date (newest first)
        const sorted = [...data.data].sort((a, b) => {
          // Critical notes always come first
          if (a.isCritical && !b.isCritical) return -1;
          if (!a.isCritical && b.isCritical) return 1;
          // Within same critical status, sort by date (newest first)
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setNotes(sorted);
      } else {
        setNotes([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch notes:", err);
      setError(err?.message || "Failed to load notes");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteAdded = () => {
    fetchNotes();
    setAddNoteModalOpen(false);
    onNoteAdded?.();
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    if (diffHours < 24)
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    if (diffDays < 7)
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;

    return date.toLocaleDateString();
  };

  if (!customerId) {
    return (
      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-4">
          Notes History
        </h2>
        <div className="text-center py-8">
          <p className="text-[14px] text-[#6F6C90]">
            Select a customer to view their notes history
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-semibold text-[#0A0A0A]">
            Notes History
          </h2>
          <button
            onClick={() => setAddNoteModalOpen(true)}
            className="rounded-[8px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95"
          >
            Add New Note
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#401B60] border-r-transparent"></div>
            <p className="mt-4 text-[14px] text-[#6F6C90]">Loading notes...</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {notes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[14px] text-[#6F6C90]">
                  No notes found for this customer.
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className={`rounded-[10px] border-2 p-4 ${
                    note.isCritical
                      ? "border-red-500 bg-red-100 shadow-sm ring-2 ring-red-200 ring-opacity-50"
                      : "border-[#DFDBE3] bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-[#401B60]">
                        {note.noteType}
                      </span>
                      {note.isCritical && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-red-600 text-white text-[11px] font-bold uppercase shadow-sm">
                          <span>⚠</span>
                          <span>Critical</span>
                        </span>
                      )}
                      <span className="text-[12px] text-[#6F6C90]">
                        {note.priority} Priority
                      </span>
                    </div>
                    <span className="text-[12px] text-[#6F6C90]">
                      {formatTimeAgo(note.createdAt)}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#0A0A0A] mb-2">
                    {note.content}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-0.5 rounded-[4px] bg-[#F8F8F8] text-[11px] text-[#6F6C90]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 text-[12px] text-[#6F6C90]">
                    by{" "}
                    {note.createdBy.firstName && note.createdBy.lastName
                      ? `${note.createdBy.firstName} ${note.createdBy.lastName}`
                      : note.createdBy.email || "Admin"}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Note Modal */}
      {addNoteModalOpen && (
        <AddNoteModal
          customerId={customerId}
          onClose={() => setAddNoteModalOpen(false)}
          onSuccess={handleNoteAdded}
        />
      )}
    </>
  );
}

// Add Note Modal Component
function AddNoteModal({
  customerId,
  onClose,
  onSuccess,
}: {
  customerId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [content, setContent] = useState("");
  const [noteType, setNoteType] = useState("General");
  const [priority, setPriority] = useState("Normal");
  const [isCritical, setIsCritical] = useState(false);
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
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
  }, []);

  const handleSave = async () => {
    if (!content.trim()) {
      setError("Note content is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const { data } = await apiClient.post<{ success: boolean; data: Note }>(
        "/customer-verification/notes",
        {
          customerId,
          noteType,
          priority,
          content: content.trim(),
          tags: tagsArray,
          isCritical,
        },
      );

      if (data?.success) {
        onSuccess();
      } else {
        setError("Failed to save note");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to save note",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed z-[90] flex items-center justify-center overflow-y-auto"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        className="fixed bg-black/75"
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
      <div
        className="fixed w-full max-w-md rounded-[16px] bg-white shadow-2xl flex flex-col max-h-[75vh] sm:max-h-[80vh]"
        style={{
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 91,
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-[#DFDBE3] flex-shrink-0 bg-white rounded-t-[16px] relative z-10">
          <h2 className="text-[20px] sm:text-[22px] md:text-[24px] font-extrabold text-[#0A0A0A]">
            Add New Note
          </h2>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F] hover:bg-[#FFE0E0] transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 md:p-6">
          {error && (
            <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
                Note Type
              </label>
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors"
              >
                <option value="General">General</option>
                <option value="Verification">Verification</option>
                <option value="Support">Support</option>
                <option value="Billing">Billing</option>
                <option value="Technical">Technical</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors"
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
                Note Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors resize-y min-h-[100px]"
                rows={5}
                placeholder="Enter note content..."
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors"
                placeholder="e.g., verification, billing, support"
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="criticalNote"
                checked={isCritical}
                onChange={(e) => setIsCritical(e.target.checked)}
                className="h-4 w-4 accent-[#401B60] mt-0.5 flex-shrink-0"
              />
              <label
                htmlFor="criticalNote"
                className="text-[13px] sm:text-[14px] text-[#0A0A0A] cursor-pointer leading-relaxed"
              >
                Critical Note (pinned to top, highlighted in red)
              </label>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex items-center justify-end gap-3 p-4 sm:p-5 md:p-6 border-t border-[#DFDBE3] flex-shrink-0 bg-white rounded-b-[16px]">
          <button
            onClick={onClose}
            className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !content.trim()}
            className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  );
}
