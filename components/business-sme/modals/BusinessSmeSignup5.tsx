"use client";
import { useState } from "react";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";

export default function BusinessSmeSignup5({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [ok, setOk] = useState(false);

  return (
    <SectionPanel>
      <div className="text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2 14.2 8H21l-5.6 4.1L17.5 18 12 14.6 6.5 18l2.1-5.9L3 8h6.8L12 2Z" />
          </svg>
        </div>
        <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
          Business Verification
        </h2>
        <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
          We need to verify your business details for security and compliance
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-[720px] rounded-[16px] border border-[#E7E4EC] bg-white p-6 shadow-[0_24px_60px_rgba(64,27,118,0.08)]">
        <div className="text-[14px] font-semibold text-[#2B1940]">
          Business Verification Requirements
        </div>
        <ul className="mt-3 space-y-2 text-[13px] leading-6 text-[#6F6C90]">
          <li>• Verify ABN/ACN registration status</li>
          <li>• Confirm business identity and legitimacy</li>
          <li>• Comply with telecommunications regulations</li>
          <li>• Protect against business fraud</li>
        </ul>

        <label className="mt-5 flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4"
            checked={ok}
            onChange={(e) => setOk(e.target.checked)}
          />
          <span className="text-[14px] text-[#3B3551]">
            I consent to business verification and understand that business
            details will be securely processed and verified with relevant
            authorities
          </span>
        </label>
      </div>

      <BarActions onBack={onBack} onNext={onNext} />
    </SectionPanel>
  );
}
