"use client";

const LABELS = [
  "Plan Selection",
  "SIM Type",
  "Customer Details",
  "ID Check",
  "Payment",
  "Agreement",
];

export default function MbbStepper({ active }: { active: number }) {
  // clamp 1..6
  const a = Math.max(1, Math.min(LABELS.length, active));
  const pct = ((a - 1) / (LABELS.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Dots and labels only (no inter-segment bars) */}
      <div className="flex items-center justify-between">
        {LABELS.map((label, i) => {
          const n = i + 1;
          const on = n <= a;
          return (
            <div key={label} className="flex flex-col items-center">
              <div
                className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold ${
                  on ? "text-white" : "text-[#6F6C90]"
                }`}
                style={{
                  background: on ? "var(--b-brand)" : "#fff",
                  borderColor: on ? "var(--b-brand)" : "#E5E7EB",
                }}
              >
                {n}
              </div>
              <div className="mt-2 text-xs text-[#6F6C90]">{label}</div>
            </div>
          );
        })}
      </div>

      {/* Single continuous progress bar */}
      <div className="mt-4 h-2 w-full rounded-full bg-[#E5E7EB]">
        <div
          className="h-2 rounded-full"
          style={{ width: `${pct}%`, background: "var(--b-brand)" }}
        />
      </div>
    </div>
  );
}
