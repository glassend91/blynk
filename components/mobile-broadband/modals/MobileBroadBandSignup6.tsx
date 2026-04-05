"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";

export default function MobileBroadBandSignup6({
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
  const planName = selectedPlan?.name || "Mobile Broadband Plan";
  const planPrice = selectedPlan?.price || 35.00;

  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6"><MbbStepper active={6} /></div>

      <SectionPanel>
        <div className="text-center">
          {error ? (
            <>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-100 text-red-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-red-700">Order Issue</h2>
              <p className="mt-1 text-[14px] leading-[22px] text-red-600 font-medium">We encountered a problem with your order submission.</p>
              <p className="mt-4 text-[15px] text-[#6A6486] max-w-md mx-auto">
                Your payment was processed, but the order could not be completed at this time. Our team has been notified.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7 10 17 4 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Thank You!</h2>
              <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Your order is complete.</p>
              <p className="mt-4 text-[15px] text-[#6A6486] max-w-md mx-auto">
                You will receive an email shortly with your new plan details and receipt.
              </p>
            </>
          )}
        </div>

        <div className="mx-auto mt-8 max-w-[720px] rounded-[16px] border border-[#E7E4EC] bg-[#FBF8FF] p-6">
          <div className="text-[15px] font-semibold text-[#2F2A3A] mb-4">Order Summary</div>
          <div className="mt-4 grid gap-2 text-[14px] text-[#5B5668]">
            <div className="flex items-center justify-between">
              <span>Selected Plan:</span>
              <span className="font-semibold">{planName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Monthly Cost:</span>
              <span className="font-semibold">${planPrice.toFixed(2)}/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SIM Type:</span>
              <span className="font-semibold">eSIM (Free)</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-auto mt-4 max-w-[720px] rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mx-auto mt-6 max-w-[720px]">
          <button
            type="button"
            onClick={onComplete}
            disabled={loading}
            className="w-full rounded-[10px] bg-[#4F1C76] px-5 py-3 text-[15px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3F205F] transition-colors"
          >
            {loading ? "Processing..." : "Close"}
          </button>
        </div>
      </SectionPanel>
    </ModalShell>
  );
}
