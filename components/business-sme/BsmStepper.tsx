"use client";

const LABELS = [
  "Address Check",
  "Plan Selection",
  "Add-on Selection",
  "Business Details",
  "ID Check",
  "Payment & Agreement",
];

export default function BsmStepper({ active }: { active: number }) {
  const a = Math.max(1, Math.min(LABELS.length, active));
  const pct = ((a - 1) / (LABELS.length - 1)) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {LABELS.map((label, i) => {
          const n = i + 1;
          const on = n <= a;
          return (
            <div key={label} className="flex flex-col items-center">
              <div
                className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold ${
                  on ? "text-white" : "text-[#9A93B3]"
                }`}
                style={{
                  background: on ? "#4F1C76" : "#FFFFFF",
                  borderColor: on ? "#4F1C76" : "#E7E4EC",
                }}
              >
                {n}
              </div>
              <div className="mt-2 text-xs leading-4 text-[#9A93B3]">{label}</div>
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
