"use client";

const STEPS = [
  "Plan Selection",
  "SIM Selection",
  "Choose Your Number",
  "Select a New Number",
  "Customer & Porting Details",
  "ID Verification",
  "Payment & Agreement",
  "Confirmation",
];

export default function MVStepper({ active, onStepClick, maxReached }: { active: number; onStepClick?: (step: number) => void; maxReached?: number }) {
  const a = Math.max(1, Math.min(STEPS.length, active));
  const pct = ((a - 1) / (STEPS.length - 1)) * 100;

  return (
    <div>
      {/* markers + labels */}
      <div className="hidden md:flex items-start justify-between gap-3">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const on = n === a;
          const isPrevious = n < a;
          const isClickable = (!!maxReached ? (n <= maxReached && n !== a) : isPrevious) && !!onStepClick;

          return (
            <div
              key={label}
              className={[
                "flex flex-col items-center gap-3 flex-1",
                isClickable ? "cursor-pointer group" : "cursor-default"
              ].join(" ")}
              onClick={() => isClickable && onStepClick(n)}
            >
              <div
                className={[
                  "grid h-10 w-10 place-items-center rounded-full text-[16px] font-semibold transition-all",
                  on ? "bg-[#2F2151] text-white" : "bg-[#F1EFF5] text-[#8A84A3]",
                  isClickable ? "group-hover:bg-[#2F2151]/10 group-hover:text-[#2F2151]" : "",
                ].join(" ")}
              >
                {n}
              </div>
              <div className={`${on ? "text-[#1C1232]" : "text-[#8A84A3]"} text-center transition-all ${isClickable ? "group-hover:text-[#1C1232]" : ""}`}>
                <span className="text-[14px] font-medium leading-tight">{label}</span>
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
