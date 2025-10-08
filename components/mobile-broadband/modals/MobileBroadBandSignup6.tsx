"use client";
import { useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";

export default function MobileBroadBandSignup6({
  onComplete, onBack, onClose, loading, error,
}: { onComplete: () => void; onBack: () => void; onClose: () => void; loading?: boolean; error?: string; }) {

  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6"><MbbStepper active={6} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Final Agreement</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Review and accept the terms and conditions</p>
        </div>

        <div className="mx-auto mt-8 max-w-[720px] rounded-[16px] border border-[#E7E4EC] bg-[#FBF8FF] p-6">
          <div className="text-[15px] font-semibold text-[#2F2A3A]">Order Summary</div>
          <div className="mt-4 grid gap-2 text-[14px] text-[#5B5668]">
            <div className="flex items-center justify-between"><span>Selected Plan:</span><span>Mobile Standard</span></div>
            <div className="flex items-center justify-between"><span>Monthly Cost:</span><span>$65/month</span></div>
            <div className="flex items-center justify-between"><span>SIM Type:</span><span>eSIM (Free)</span></div>
          </div>
          {/* Agreement already accepted on step 5 (Payment page) */}
          {/* <label className="mt-6 flex items-start gap-3">
            <input type="checkbox" className="mt-1 h-4 w-4" checked={agree} onChange={e => setAgree(e.target.checked)} />
            <span className="text-[14px] text-[#3B3551]">I agree to the Terms and Conditions and Privacy Policy</span>
          </label> */}
        </div>
      </SectionPanel>

      {error ? (
        <div className="mx-auto mt-2 max-w-[720px] rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}
      <BarActions onBack={onBack} complete={onComplete} disabled={!!loading} label={loading ? "Submitting..." : "Complete Order"} />
    </ModalShell>
  );
}
