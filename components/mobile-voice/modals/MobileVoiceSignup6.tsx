"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";

export default function MobileVoiceSignup6({ onNext, onBack, onClose }:{
  onNext: () => void; onBack: () => void; onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6"><MVStepper active={6} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="3" y="6" width="18" height="12" rx="2" stroke="white" strokeWidth="1.5"/>
              <path d="M3 10h18" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Payment Details</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Secure payment information</p>
        </div>

        <div className="mx-auto mt-8 max-w-[760px] rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_40px_60px_rgba(0,0,0,0.06)]">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Card Number</label>
              <input className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Enter your card number" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Expiry Date</label>
              <input className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="MM/YY" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Name on Card</label>
              <input className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Name on card" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">CVV</label>
              <input className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="CVV" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[12px] font-semibold text-[#3B3551]">Billing Address</label>
              <input className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Add billing address" />
            </div>
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
