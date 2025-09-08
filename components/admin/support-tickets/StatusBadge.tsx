import type { Status } from "./types";

export default function StatusBadge({ status }: { status: Status }) {
  const palette: Record<Status, { text: string; bg: string }> = {
    Open:        { text: "#401B60", bg: "#EFE9F6" },
    "In Progress": { text: "#0A0A0A", bg: "#F3F4F6" },
    Resolved:    { text: "#059669", bg: "#E8F8F3" },
    Closed:      { text: "#6F6C90", bg: "#F2F1F5" },
  };

  const s = palette[status];

  return (
    <span
      className="rounded-[8px] px-3 py-1 text-[14px] font-semibold"
      style={{ color: s.text, backgroundColor: s.bg }}
    >
      {status}
    </span>
  );
}
