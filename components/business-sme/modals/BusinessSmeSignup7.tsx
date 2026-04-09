"use client";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";

export default function BusinessSmeSignup7({
  onBack,
  onComplete,
  loading,
  error,
}: {
  onBack: () => void;
  onComplete: () => void;
  loading?: boolean;
  error?: string;
}) {
  return (
    <SectionPanel>
      <div className="text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 3H7a2 2 0 0 0-2 2v14l7-3 7 3V5a2 2 0 0 0-2-2z" />
          </svg>
        </div>
        <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
          Complete Business Order
        </h2>
        <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
          Review your business plan details and finalize your order
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-[720px] rounded-[16px] border border-[#E7E4EC] bg-white p-6 shadow-[0_24px_60px_rgba(64,27,118,0.08)]">
        <div className="text-[14px] font-semibold text-[#2B1940]">
          Business Plan Summary
        </div>
        <div className="mt-4 grid gap-3 text-[14px] text-[#5B5668]">
          <div className="flex items-center justify-between">
            <span>Selected Plan:</span>
            <span>Business Standard NBN</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Monthly Cost:</span>
            <span>$189/month</span>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <span>Total Monthly:</span>
            <span className="font-semibold">$189/month</span>
          </div>
        </div>

        {/* Agreement already accepted on step 6 (Payment page) */}
        {/* <div className="mt-5 space-y-3">
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 h-4 w-4" />
            <span className="text-[14px] text-[#3B3551]">I agree to the Business Terms and Conditions</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 h-4 w-4" />
            <span className="text-[14px] text-[#3B3551]">I acknowledge the Service Level Agreement (SLA) terms</span>
          </label>
          <label className="flex items-start gap-3">
            <input type="checkbox" className="mt-1 h-4 w-4" />
            <span className="text-[14px] text-[#3B3551]">I agree to the Business Privacy Policy</span>
          </label>
        </div> */}
      </div>

      {error ? (
        <div className="mx-auto mt-2 max-w-[720px] rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <BarActions
        onBack={onBack}
        complete={onComplete}
        disabled={!!loading}
        label={loading ? "Submitting..." : "Complete Order"}
      />
    </SectionPanel>
  );
}
