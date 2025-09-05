"use client";
import { useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";

export default function MobileBroadbandSignup4({
  onNext, onBack, onClose,
}: { onNext: () => void; onBack: () => void; onClose: () => void; }) {
  const [ok, setOk] = useState(false);

  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6"><MbbStepper active={4} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Identity Verification</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">We need to verify your identity for security purposes</p>
        </div>

        <div className="mx-auto mt-8 max-w-[740px] rounded-[16px] border border-[#E7E4EC] bg-white p-6">
          <p className="text-[14px] leading-6 text-[#5B5668]">
            To keep your account secure and protect you from fraud, I confirm I am authorised to provide these details and I consent
            to them being checked against official records by a secure verification service.
          </p>
          <label className="mt-5 flex items-start gap-3">
            <input type="checkbox" className="mt-1 h-4 w-4" checked={ok} onChange={e => setOk(e.target.checked)} />
            <span className="text-[14px] text-[#3B3551]">
              I consent to the identity verification process and understand that valid ID will be required
            </span>
          </label>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
