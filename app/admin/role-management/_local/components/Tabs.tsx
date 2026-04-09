"use client";

export default function Tabs({
  value,
  onChange,
  items,
}: {
  value: string;
  onChange: (k: any) => void;
  items: { key: string; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-1">
      {items.map((it) => {
        const active = value === it.key;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={[
              "min-w-[150px] rounded-[8px] px-4 py-2 text-[14px] font-semibold",
              active
                ? "bg-white text-[#0A0A0A] shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                : "text-[#6F6C90] hover:bg-white/60",
            ].join(" ")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
