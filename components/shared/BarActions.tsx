"use client";

export default function BarActions({
  onBack,
  onNext,
  nextLabel = "Next",
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-[10px] border border-[#DFDBE3] bg-white px-5 py-3 text-[15px] font-semibold text-[#6E6690]"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <path d="M9.57 5.93 3.5 12l6.07 6.07M20.5 12H4" stroke="#6E6690" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      <button
        type="button"
        onClick={onNext}
        className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-[#401B60] px-6 py-3 text-[15px] font-semibold text-white"
      >
        {nextLabel}
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <path d="M14.43 5.93 20.5 12l-6.07 6.07M3.5 12H20.33" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
