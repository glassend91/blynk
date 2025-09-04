"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";
import BarActions from "@/components/shared/BarActions";

export default function MobileVoiceSignup7({ onComplete, onBack, onClose }:{
  onComplete: () => void; onBack: () => void; onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6"><MVStepper active={7} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
            {/* clipboard */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M9 4h6a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="white" strokeWidth="1.5"/>
              <path d="M9 7h6" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Final Agreement</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Review and accept the terms and conditions</p>
        </div>

        <div className="mx-auto mt-8 max-w-[560px] rounded-[12px] border border-[#EEE8F6] bg-white p-5 shadow-[0_40px_60px_rgba(0,0,0,0.06)]">
          <div className="text-[15px] font-semibold text-[#2E2745]">Order Summary</div>

          <div className="mt-4 space-y-2 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-[#8A84A3]">Selected Plan:</span>
              <span className="text-[#2E2745] font-medium">Mobile Standard</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8A84A3]">Monthly Cost:</span>
              <span className="text-[#2E2745] font-medium">$35/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8A84A3]">SIM Type:</span>
              <span className="text-[#2E2745] font-medium">eSIM (Free)</span>
            </div>
          </div>

          <label className="mt-5 flex items-start gap-3 text-[14px] text-[#2E2745]">
            <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#401B60]" />
            I agree to the <a className="text-[#401B60] underline" href="#">Terms and Conditions</a> and <a className="text-[#401B60] underline" href="#">Privacy Policy</a>
          </label>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onComplete} nextLabel="Complete Order" />
    </ModalShell>
  );
}
