"use client";

const LABELS = [
  "Address Check",
  "Plan Selection",
  "Add-on Selection",
  "Business Details",
  "ID Check",
  "Payment & Agreement",
];

export default function BsmStepper({
  active,
  onStepClick,
  maxReached,
}: {
  active: number;
  onStepClick?: (step: number) => void;
  maxReached?: number;
}) {
  const a = Math.max(1, Math.min(LABELS.length, active));
  const pct = ((a - 1) / (LABELS.length - 1)) * 100;

  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        {LABELS.map((label, i) => {
          const n = i + 1;
          const isActive = n === a;
          const isPrevious = n < active;
          const isClickable =
            (!!maxReached ? n <= maxReached && n !== a : isPrevious) &&
            !!onStepClick;

          return (
            <div
              key={label}
              className={[
                "flex flex-col items-center gap-2 flex-1 group",
                isClickable ? "cursor-pointer" : "cursor-default",
              ].join(" ")}
              onClick={() => isClickable && onStepClick(n)}
            >
              <div
                className={[
                  "grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition-all",
                  isActive
                    ? "bg-[#2F2151] text-white"
                    : "bg-[#F1EFF5] text-[#8A84A3]",
                  isClickable
                    ? "group-hover:bg-[#2F2151]/10 group-hover:text-[#2F2151]"
                    : "",
                ].join(" ")}
              >
                {n}
              </div>
              <div
                className={[
                  "text-center text-[11px] leading-tight font-medium transition-all",
                  isActive ? "text-[#170F49]" : "text-[#8A84A3]",
                  isClickable ? "group-hover:text-[#170F49]" : "",
                ].join(" ")}
              >
                <span className="leading-tight">{label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* thicker single track as in PNGs */}
      <div className="mt-4 h-[7px] w-full rounded-full bg-[#E7E4EC]">
        <div
          className="h-[7px] rounded-full"
          style={{ width: `${pct}%`, background: "#4F1C76" }}
        />
      </div>
    </div>
  );
}
