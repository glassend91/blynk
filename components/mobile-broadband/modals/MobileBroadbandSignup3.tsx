"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";

export default function MobileBroadbandSignup3({
  onNext, onBack, onClose,
}: { onNext: () => void; onBack: () => void; onClose: () => void; }) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6"><MbbStepper active={3} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="3.2"/><path d="M4 18c0-3 3.6-5 8-5s8 2 8 5" /></svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Customer Details &amp; Porting</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Please provide your details and porting information</p>
        </div>

        <div className="mx-auto mt-8 max-w-[880px] rounded-[16px] border border-[#E7E4EC] bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-1 block text-sm text-[#6B6478]">First Name</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76] focus:outline-none" placeholder="Enter your First name" /></div>
            <div><label className="mb-1 block text-sm text-[#6B6478]">Last Name</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76] focus:outline-none" placeholder="Enter your last name" /></div>
            <div><label className="mb-1 block text-sm text-[#6B6478]">Email Address</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76]" placeholder="Enter your email" /></div>
            <div><label className="mb-1 block text-sm text-[#6B6478]">Phone Number</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76]" placeholder="Enter your phone number" /></div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm text-[#6B6478]">Delivery Address</label>
            <input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76]" placeholder="Enter your delivery address" />
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
