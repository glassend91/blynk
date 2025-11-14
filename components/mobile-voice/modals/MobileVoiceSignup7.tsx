"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";

export default function MobileVoiceSignup7({
  onComplete,
  onBack,
  onClose,
  loading,
  error,
  selectedPlan,
}: {
  onComplete: () => void;
  onBack: () => void;
  onClose: () => void;
  loading?: boolean;
  error?: string;
  selectedPlan?: { name: string; price: number } | null;
}) {
  const planName = selectedPlan?.name || "Mobile Voice Plan";
  const planPrice = selectedPlan?.price || 35.00;

  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6"><MVStepper active={8} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M20 7 10 17 4 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Thank You!</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Your order is complete.</p>
          <p className="mt-4 text-[15px] text-[#6A6486] max-w-md mx-auto">
            You will receive an email shortly with your new plan details and receipt.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[560px] rounded-[12px] border border-[#EEE8F6] bg-white p-5 shadow-[0_40px_60px_rgba(0,0,0,0.06)]">
          <div className="text-[15px] font-semibold text-[#2E2745] mb-4">Order Summary</div>

          <div className="mt-4 space-y-2 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-[#8A84A3]">Selected Plan:</span>
              <span className="text-[#2E2745] font-medium">{planName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8A84A3]">Monthly Cost:</span>
              <span className="text-[#2E2745] font-medium">${planPrice.toFixed(2)}/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8A84A3]">SIM Type:</span>
              <span className="text-[#2E2745] font-medium">eSIM (Free)</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-auto mt-4 max-w-[560px] rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mx-auto mt-6 max-w-[560px]">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-[10px] bg-[#401B60] px-5 py-3 text-[15px] font-semibold text-white hover:bg-[#3F205F] transition-colors"
          >
            Close
          </button>
        </div>
      </SectionPanel>
    </ModalShell>
  );
}
