"use client";

import ModalShell from "@/components/shared/ModalShell";
import Stepper from "@/components/shared/Stepper";
import SectionPanel from "@/components/shared/SectionPanel";

export default function SignupModal7({
  onComplete,
  onBack,
  onClose,
  loading,
  error,
}: {
  onComplete: () => void;
  onBack: () => void;
  onClose: () => void;
  loading?: boolean;
  error?: string;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={7} />

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2Z" stroke="white" strokeWidth="1.5" /><path d="M14 3v5h5" stroke="white" strokeWidth="1.5" /></svg>
          </div>
          <h2 className="modal-h1 mt-4">Final Agreement</h2>
          <p className="modal-sub mt-1">Review and accept the terms and conditions</p>
        </div>

        <div className="card mx-auto mt-8 max-w-[640px] p-6">
          <div className="text-[15px] font-semibold text-[#2E2745]">Order Summary</div>
          <div className="mt-4 flex items-center justify-between border-b border-[#E9E3F2] pb-3 text-[15px]">
            <div className="text-[#6A6486]">NBN Plan</div>
            <div className="font-semibold text-[#2E2745]">$69.99/mo</div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[15px]">
            <div className="font-semibold text-[#2E2745]">Total</div>
            <div className="font-semibold text-[#2E2745]">$69.99/mo</div>
          </div>

          <label className="mt-5 flex items-center gap-3 text-[15px] text-[#2E2745]">
            <input type="checkbox" className="h-4 w-4 accent-[var(--cl-brand)]" />
            I agree to the <a className="text-[var(--cl-brand)] underline" href="#">Terms and Conditions</a>
          </label>

          {error ? (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M9.57 5.93 3.5 12l6.07 6.07M20.5 12H4" stroke="#6E6690" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
            <button type="button" onClick={onComplete} disabled={loading} className="btn-primary inline-flex items-center justify-center gap-3 disabled:opacity-60">
              {loading ? "Submitting..." : "Complete Order"}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M14.43 5.93 20.5 12l-6.07 6.07M3.5 12H20.33" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </SectionPanel>
    </ModalShell>
  );
}
