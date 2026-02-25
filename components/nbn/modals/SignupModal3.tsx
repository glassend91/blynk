"use client";

import ModalShell from "@/components/shared/ModalShell";
import Stepper from "@/components/shared/Stepper";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";

export default function SignupModal3({
  onNext,
  onBack,
  onClose,
  onOpenStaticIp,
  onStepClick,
  maxReached,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  onOpenStaticIp: () => void;
  onStepClick?: (step: number) => void;
  maxReached?: number;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={3} onStepClick={onStepClick} maxReached={maxReached} />

      <SectionPanel>
        <h2 className="modal-h1 text-center">Add-on Selection</h2>
        <p className="modal-sub mt-1 text-center">Enhance your connection with additional features</p>

        <div className="mx-auto mt-8 max-w-[680px]">
          <div className="flex items-center justify-between rounded-[14px] border border-[var(--cl-border)] bg-white p-5 shadow-[0_50px_60px_rgba(0,0,0,0.06)]">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-[17px] font-semibold text-[#3B3551]">Static IP Address</div>
                <button onClick={onOpenStaticIp} aria-label="Static IP info">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#7D7598" />
                    <path d="M12 8v5" stroke="#7D7598" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="12" cy="16" r="1" fill="#7D7598" />
                  </svg>
                </button>
              </div>
              <div className="mt-1 text-[14px] font-extrabold text-[var(--cl-brand-ink)]">
                +$10.00/month
              </div>
            </div>

            {/* green toggle */}
            <label className="relative inline-flex h-7 w-[50px] cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <span className="absolute inset-0 rounded-full bg-[#E7F6EA] transition peer-checked:bg-[#3EB164]" />
              <span className="absolute left-1 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-[22px]" />
            </label>
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
