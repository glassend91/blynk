const LABELS = [
  "Address Check",
  "Plan Selection",
  "Add-on Selection",
  "Customer Details",
  "ID Check",
  "Payment & Agreement",
];

export default function Stepper({
  active,
  onStepClick,
  maxReached,
}: {
  active: number;
  onStepClick?: (step: number) => void;
  maxReached?: number;
}) {
  const pct = Math.max(
    0,
    Math.min(100, ((active - 1) / (LABELS.length - 1)) * 100),
  );
  return (
    <div className="mb-5 sm:mb-6 md:mb-7">
      <div className="hidden items-start justify-between sm:flex">
        {LABELS.map((label, i) => {
          const n = i + 1;
          const on = n <= active;
          const isActive = n === active;
          const isPrevious = n < active;
          const isClickable =
            (!!maxReached ? n <= maxReached && n !== active : isPrevious) &&
            !!onStepClick;

          return (
            <div
              key={label}
              className={[
                "flex flex-col items-center gap-3 flex-1 group",
                isClickable ? "cursor-pointer" : "cursor-default",
              ].join(" ")}
              onClick={() => isClickable && onStepClick(n)}
            >
              <div
                className={[
                  "grid place-items-center rounded-full text-[14px] font-bold transition-all",
                  "h-8 w-8 md:h-9 md:w-9 lg:h-10 lg:w-10",
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
                  "text-center transition-all px-1",
                  isActive ? "text-[#3F2E5A] font-semibold" : "text-[#8A84A3]",
                  isClickable ? "group-hover:text-[#3F2E5A]" : "",
                ].join(" ")}
              >
                <span className="text-[12px] md:text-[13px] lg:text-[14px] leading-tight flex justify-center items-center">
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-2 flex items-center justify-between sm:hidden">
        <span className="text-[13px] font-semibold text-[#3F2E5A]">
          Step {active} of {LABELS.length}
        </span>
        <span className="text-[12px] text-[var(--cl-muted)]">
          {LABELS[active - 1]}
        </span>
      </div>

      <div className="mt-3 h-[6px] w-full rounded-full bg-[#E3E0EA] sm:h-[8px]">
        <div
          className="h-full rounded-full bg-[var(--cl-brand)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
