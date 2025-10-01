"use client";
export default function BarActions(
  { onBack, onNext, complete, label = "Next", disabled = false, nextDisabled = false }:
    { onBack: () => void; onNext?: () => void; complete?: () => void; label?: string; disabled?: boolean; nextDisabled?: boolean; }
) {
  return (
    <div className="mt-10 flex items-center justify-between">
      <button type="button" onClick={onBack} className="btn-secondary">
        ← Back
      </button>
      {complete ?
        <button type="button" onClick={complete} disabled={disabled} className="btn-primary disabled:opacity-60">
          Complete Order →
        </button> :
        onNext ? (
          <button type="button" onClick={onNext} disabled={nextDisabled || disabled} className="btn-primary disabled:opacity-60">
            {label} →
          </button>
        ) : (
          <div className="text-gray-500 text-sm">
            {disabled ? "Complete payment to continue" : "Payment required"}
          </div>
        )}
    </div>
  );
}
