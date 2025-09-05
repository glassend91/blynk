"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";

export default function MobileBroadbandSignup5({
  onNext, onBack, onClose,
}: { onNext: () => void; onBack: () => void; onClose: () => void; }) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6"><MbbStepper active={5} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Payment Details</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Secure payment information</p>
        </div>

        <div className="mx-auto mt-8 max-w-[760px] rounded-[16px] border border-[#E7E4EC] bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-1 block text-sm text-[#6B6478]">Card Number</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76]" placeholder="Enter card number" /></div>
            <div><label className="mb-1 block text-sm text-[#6B6478]">Expiry Date</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76]" placeholder="MM/YY" /></div>
            <div><label className="mb-1 block text-sm text-[#6B6478]">Name on Card</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76]" placeholder="Name on card" /></div>
            <div><label className="mb-1 block text-sm text-[#6B6478]">CVV</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76]" placeholder="CVV" /></div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm text-[#6B6478]">Billing Address</label>
            <input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76]" placeholder="Add billing address" />
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
