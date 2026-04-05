"use client";

export default function Tabs({
  value,
  onChange,
  items,
}: {
  value: string;
  onChange: (k: string) => void;
  items: { key: string; label: string }[];
}) {
  const list = items ?? []; // safety

  return (
    <div className="inline-flex flex-wrap gap-2 rounded-[10px] bg-[#F8F8F8] p-2">
      {list.map((it) => {
        const active = value === it.key;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={[
              "rounded-[10px] px-4 py-2 text-[14px] font-semibold",
              active
                ? "bg-white text-[#0A0A0A] shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                : "text-[#6F6C90] hover:bg-white/70",
            ].join(" ")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
