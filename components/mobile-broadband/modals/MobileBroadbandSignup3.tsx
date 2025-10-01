"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";

export default function MobileBroadbandSignup3({
  onNext, onBack, onClose,
  firstName, lastName, email, phone, password, serviceAddress,
  onChangeFirstName, onChangeLastName, onChangeEmail, onChangePhone, onChangePassword, onChangeServiceAddress,
}: {
  onNext: () => void; onBack: () => void; onClose: () => void;
  firstName: string; lastName: string; email: string; phone: string; password: string; serviceAddress: string;
  onChangeFirstName: (v: string) => void; onChangeLastName: (v: string) => void; onChangeEmail: (v: string) => void; onChangePhone: (v: string) => void; onChangePassword: (v: string) => void; onChangeServiceAddress: (v: string) => void;
}) {
  const canProceed = Boolean(firstName && lastName && email && password && password.length >= 6);
  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6"><MbbStepper active={3} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="3.2" /><path d="M4 18c0-3 3.6-5 8-5s8 2 8 5" /></svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Customer Details &amp; Porting</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Please provide your details and porting information</p>
        </div>

        <div className="mx-auto mt-8 max-w-[880px] rounded-[16px] border border-[#E7E4EC] bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-1 block text-sm text-[#6B6478]">First Name</label><input value={firstName} onChange={(e) => onChangeFirstName(e.target.value)} className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76] focus:outline-none" placeholder="Enter your First name" /></div>
            <div><label className="mb-1 block text-sm text-[#6B6478]">Last Name</label><input value={lastName} onChange={(e) => onChangeLastName(e.target.value)} className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76] focus:outline-none" placeholder="Enter your last name" /></div>
            <div><label className="mb-1 block text-sm text-[#6B6478]">Email Address</label><input value={email} onChange={(e) => onChangeEmail(e.target.value)} type="email" className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76]" placeholder="Enter your email" /></div>
            <div><label className="mb-1 block text-sm text-[#6B6478]">Phone Number</label><input value={phone} onChange={(e) => onChangePhone(e.target.value)} className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76]" placeholder="Enter your phone number" /></div>
            <div><label className="mb-1 block text-sm text-[#6B6478]">Password</label><input type="password" value={password} onChange={(e) => onChangePassword(e.target.value)} className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76]" placeholder="Create a password (min 6 chars)" /></div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm text-[#6B6478]">Delivery Address</label>
            <input value={serviceAddress} onChange={(e) => onChangeServiceAddress(e.target.value)} className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76]" placeholder="Enter your delivery address" />
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
