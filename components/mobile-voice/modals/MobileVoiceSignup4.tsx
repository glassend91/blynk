"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";

export default function MobileVoiceSignup4({ onNext, onBack, onClose }:{
  onNext: () => void; onBack: () => void; onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6"><MVStepper active={4} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
            {/* user */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.5"/>
              <path d="M20 20c0-4-3.6-6-8-6s-8 2-8 6" stroke="white" strokeWidth="1.5"/>
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
            Customer Details & Porting
          </h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Please provide your details and porting information</p>
        </div>

        <div className="mx-auto mt-8 max-w-[760px] rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_40px_60px_rgba(0,0,0,0.06)]">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">First Name</label>
              <input className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Enter your First name" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Last Name</label>
              <input className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Enter your last name" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Date of Birth</label>
              <input className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Jan 12, 1996" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Phone Number</label>
              <input className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Enter your phone number" />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-3 text-[14px] text-[#2E2745]">
            <input type="checkbox" className="h-4 w-4 accent-[#401B60]" />
            I want to keep my existing mobile number
          </label>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Current Mobile Number</label>
              <input className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Enter your phone number" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Current Provider</label>
              <input className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Current provider" />
            </div>
          </div>

          <div className="mt-4 rounded-[12px] border border-[#DFDBE3] bg-[#F9F8FB] p-4">
  <div className="text-[14px] font-semibold text-[#0A0A0A]">Verify Ownership</div>
  <p className="mt-1 text-[12px] text-[#8A84A3]">
    We&apos;ve sent a one-time passcode (OTP) to the number you want to port. Enter it below to confirm ownership.
  </p>

  <div className="mt-3 flex flex-wrap items-end gap-3">
    <div className="grow">
      <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">OTP Code</label>
      <input
        inputMode="numeric"
        placeholder="6-digit code"
        className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[16px] tracking-[4px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
      />
    </div>

    <button
      type="button"
      className="h-[48px] rounded-[10px] border border-[#DFDBE3] bg-white px-4 text-[15px] font-semibold text-[#401B60] hover:bg-[#F4F3F7]"
      // onClick={() => /* resend */ null}
    >
      Resend OTP
    </button>

    <button
      type="button"
      className="h-[48px] rounded-[10px] bg-[#401B60] px-5 text-[15px] font-semibold text-white"
      // onClick={() => /* verify */ null}
    >
      Verify
    </button>
  </div>
</div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
