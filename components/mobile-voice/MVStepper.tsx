"use client";

const STEPS = [
  "Plan Selection",
  "Customer Details",
  "Number Selection",
  "SIM Type",
  "ID Check",
  "Payment",
  "Agreement",
];

export default function MVStepper({ active }: { active: number }) {
  const a = Math.max(1, Math.min(STEPS.length, active));
  const pct = ((a - 1) / (STEPS.length - 1)) * 100;

  return (
    <div>
      {/* markers + labels */}
      <div className="hidden md:flex items-start justify-between gap-3">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const on = n === a;
          return (
            <div key={label} className="flex flex-col items-center gap-3 flex-1">
              <div
                className={[
                  "grid h-10 w-10 place-items-center rounded-full text-[16px] font-semibold",
                  on ? "bg-[#2F2151] text-white" : "bg-[#F1EFF5] text-[#8A84A3]",
                ].join(" ")}
              >
                {n}
              </div>
              <div className={on ? "text-[#1C1232]" : "text-[#8A84A3]"}>
                <span className="text-[14px] font-medium">{label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* mobile summary */}
      <div className="md:hidden mb-2 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#2F2151]">Step {a} of {STEPS.length}</span>
        <span className="text-[12px] text-[#8A84A3]">{STEPS[a - 1]}</span>
      </div>

      {/* progress (8px) */}
      <div className="mt-3 h-2 w-full rounded-full bg-[#E6E4EC]">
        <div className="h-full rounded-full bg-[#2F2151]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
