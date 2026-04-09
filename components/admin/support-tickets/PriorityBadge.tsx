import type { Priority } from "./types";

export default function PriorityBadge({ level }: { level: Priority }) {
  const palette: Record<Priority, { text: string; dot: string; bg: string }> = {
    Critical: { text: "#B42318", dot: "#DC2626", bg: "#FEECEC" },
    High: { text: "#F04438", dot: "#F04438", bg: "#FEECEC" },
    Medium: { text: "#EE7D18", dot: "#EE7D18", bg: "#FFF3E8" },
    Low: { text: "#059669", dot: "#059669", bg: "#E8F8F3" },
  };

  const p = palette[level] ?? palette.Medium;

  return (
    <span
      className="inline-flex items-center gap-2 rounded-[8px] px-3 py-1 text-[14px] font-semibold"
      style={{ color: p.text, backgroundColor: p.bg }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: p.dot }}
      />
      {level}
    </span>
  );
}
