"use client";

import ModalShell from "@/components/shared/ModalShell";
import Stepper from "@/components/shared/Stepper";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";

export default function SignupModal2({
  onNext,
  onBack,
  onClose,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={2} />

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 8c6-5 12-5 18 0M6 12c4-3 8-3 12 0M9 16c2-1.5 4-1.5 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <h2 className="modal-h1 mt-4">Choose Your NBN Plan</h2>
          <p className="modal-sub mt-1">Select the plan that suits you</p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {["NBN Basic", "NBN Standard", "NBN Premium"].map((name, i) => (
              <button
                key={name}
                className={[
                  "card p-6 text-left",
                  i === 1 ? "border-[#5C3B86]" : "border-[var(--cl-border)]",
                ].join(" ")}
              >
                <div className="text-[20px] font-semibold text-[#7C7396]">{name}</div>
                <div className="mt-3 text-[34px] font-extrabold text-[var(--cl-brand-ink)]">
                  $69.99<span className="text-[18px] font-semibold">/month</span>
                </div>
                <ul className="mt-4 space-y-2 text-[#5D5875]">
                  <li>✔ Unlimited Data</li>
                  <li>✔ 24/7 Support</li>
                  <li>✔ Free Modem</li>
                </ul>
              </button>
            ))}
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
