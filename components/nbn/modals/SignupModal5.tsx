"use client";

import { useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import Stepper from "@/components/shared/Stepper";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import DVSVerification, { DVSSubmitPayload } from "@/components/signup/DVSVerification";

export default function SignupModal5({
  onNext,
  onBack,
  onClose,
  onStepClick,
  maxReached,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  onStepClick?: (step: number) => void;
  maxReached?: number;
}) {
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const handleVerify = async (payload: DVSSubmitPayload) => {
    try {
      // Verification is handled by DVSVerification component
      // This callback is called when verification succeeds
      setVerificationComplete(true);
      setVerificationError(null);
      // Auto-advance to next step after successful verification
      setTimeout(() => {
        onNext();
      }, 1000);
    } catch (error: any) {
      setVerificationError(error?.message || "Verification failed");
      setVerificationComplete(false);
    }
  };

  const handleSkip = () => {
    // Allow skipping verification (if needed)
    onNext();
  };

  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={5} onStepClick={onStepClick} maxReached={maxReached} />

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3l8 4v6c0 5-3.5 7.5-8 8-4.5-.5-8-3-8-8V7l8-4Z" stroke="white" strokeWidth="1.5" /></svg>
          </div>
          <h2 className="modal-h1 mt-4">Identity Verification</h2>
          <p className="modal-sub mt-1">We need to verify your identity for security purposes</p>
        </div>

        <div className="mx-auto mt-8 max-w-[720px]">
          <DVSVerification
            onVerify={handleVerify}
            onSkip={handleSkip}
            apiError={verificationError}
          />
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={verificationComplete ? onNext : undefined} nextDisabled={!verificationComplete} />
    </ModalShell>
  );
}
