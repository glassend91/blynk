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
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {LABELS.map((label, i) => {
          const n = i + 1,
            on = n <= active;
          return (
            <div key={label} className="flex w-full items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-full border text-sm font-semibold
                  ${on ? "text-white" : "text-[#6F6C90]"}`}
                  style={{
                    background: on ? "var(--b-brand)" : "#fff",
                    borderColor: on ? "var(--b-brand)" : "#E5E7EB",
                  }}
                >
                  {n}
                </div>
                <div className="mt-2 text-xs text-[#6F6C90]">{label}</div>
              </div>
              {i < LABELS.length - 1 && (
                <div className="mx-3 h-[6px] w-full rounded-full bg-[#E5E7EB]">
                  <div
                    className="h-[6px] rounded-full"
                    style={{
                      width: n < active ? "100%" : n === active ? "50%" : "0%",
                      background: "var(--b-brand)",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
