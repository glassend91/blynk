"use client";

import ModalShell from "@/components/shared/ModalShell";
import Stepper from "@/components/shared/Stepper";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";

export default function SignupModal5({
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
      <Stepper active={5} />

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 5-3.5 7.5-8 8-4.5-.5-8-3-8-8V7l8-4Z" stroke="white" strokeWidth="1.5"/></svg>
          </div>
          <h2 className="modal-h1 mt-4">Identity Verification</h2>
          <p className="modal-sub mt-1">We need to verify your identity for security purposes</p>
        </div>

        <div className="card mx-auto mt-8 max-w-[720px] p-6">
          <p className="text-[14px] text-[var(--cl-sub)]">
            To keep your account secure and protect you from fraud, I confirm I am authorised to provide these details and I consent to them
            being checked against official records by a secure verification service.
          </p>
          <label className="mt-4 flex items-center gap-3 text-[15px] text-[#2E2745]">
            <input type="checkbox" className="h-4 w-4 accent-[var(--cl-brand)]" />
            I consent to the identity verification process and understand that valid ID will be required
          </label>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
