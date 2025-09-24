"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";
import DVSVerification, { DVSSubmitPayload } from "@/components/signup/DVSVerification";

export default function MobileVoiceSignup5({ onNext, onBack, onClose, onIdentityVerified, canProceed }: {
  onNext: () => void; onBack: () => void; onClose: () => void; onIdentityVerified: (payload: any) => void; canProceed?: boolean;
}) {
  function handleVerify(payload: DVSSubmitPayload) {
    onIdentityVerified(payload);
    onNext();
  }

  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6"><MVStepper active={5} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#401B60] text-white">
            {/* id badge */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="6" width="18" height="12" rx="2" stroke="white" strokeWidth="1.6" />
              <circle cx="8.5" cy="12" r="2" stroke="white" strokeWidth="1.6" />
              <path d="M13 12h5M13 15h4" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
            Identity Verification
          </h2>
          <p className="mt-2 text-[14px] text-[#6F6C90]">
            Enter your document details exactly as they appear. Your information is encrypted.
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-[880px]">
          <DVSVerification onVerify={handleVerify} />
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} nextDisabled={!canProceed} />
    </ModalShell>
  );
}
