"use client";

const LABELS = [
  "Plan Selection",
  "Device / SIM",
  "Add-ons",
  "Customer Details",
  "ID Check",
  "Payment",
];

export default function MbbStepper({ active }: { active: number }) {
  const pct = Math.max(0, Math.min(100, ((active - 1) / (LABELS.length - 1)) * 100));

  return (
    <div className="w-full">
      {/* desktop: dots + labels */}
      <div className="hidden sm:flex items-start justify-between gap-3">
        {LABELS.map((label, i) => {
          const n = i + 1;
          const on = n === active;
          return (
            <div key={label} className="flex flex-col items-center gap-3 flex-1">
              <div
                className={[
                  "grid place-items-center h-10 w-10 rounded-full text-[17px] font-medium",
                  on ? "bg-[var(--cl-brand)] text-white" : "bg-[#F0EEF4] text-[#6F6C90]",
                ].join(" ")}
              >
                {n}
              </div>
              <div className={on ? "text-black" : "text-[#6F6C90]"}>
                <span className="text-[16px] font-medium">{label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* mobile: compact */}
      <div className="sm:hidden mb-2 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#3F2E5A]">
          Step {active} of {LABELS.length}
        </span>
        <span className="text-[12px] text-[#6F6C90]">{LABELS[active - 1]}</span>
      </div>

      {/* progress bar */}
      <div className="mt-4 h-[10px] w-full rounded-[10px] bg-[rgba(111,108,144,0.20)]">
        <div className="h-full rounded-[10px] bg-[var(--cl-brand)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
