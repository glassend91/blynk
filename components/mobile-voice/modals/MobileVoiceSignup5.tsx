"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";

export default function MobileVoiceSignup5({ onNext, onBack, onClose }:{
  onNext: () => void; onBack: () => void; onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6"><MVStepper active={5} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#401B60] text-white">
            {/* id badge */}
            <svg width="28" height="28" viewBox="0 0 30 30" fill="none" aria-hidden>
              <path d="M27.08 13.05l-1.23 5.23c-1.05 4.51-3.12 6.34-7.02 5.97-.63-.05-1.3-.16-2.02-.34l-2.1-.5c-5.21-1.24-6.82-3.82-5.6-9.05l1.22-5.24c.25-1.07.56-1.99.93-2.76 1.46-3.03 3.95-3.85 8.13-2.86l2.09.49c5.24 1.22 6.84 3.8 5.6 9.05Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15.8 10.66l6.06 1.54M14.57 15.5l3.63.93" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Identity Verification</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
            We need to verify your identity for security purposes
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[548px] rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_40px_60px_rgba(0,0,0,0.06)]">
          <p className="text-[14px] text-[#6F6C90]">
            To keep your account secure and protect you from fraud, I confirm I am authorised to provide these details and I consent to them
            being checked against official records by a secure verification service.
          </p>
          <label className="mt-4 flex items-start gap-3 text-[14px] font-semibold text-[#401B60]">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#401B60]" />
            I consent to the identity verification process and understand that valid ID will be required
          </label>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
