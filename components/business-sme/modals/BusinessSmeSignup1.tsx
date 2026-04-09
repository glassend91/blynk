"use client";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";

export default function BusinessSmeSignup1({
  onNext,
  onBack,
  address,
  onChangeAddress,
}: {
  onNext: () => void;
  onBack: () => void;
  address: string;
  onChangeAddress: (v: string) => void;
}) {
  return (
    <SectionPanel>
      <div className="text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 12 7 12s7-7 7-12a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          </svg>
        </div>
        <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
          Business Address Check
        </h2>
        <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
          Enter your business address to check NBN availability and speeds
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-[680px] rounded-[16px] border border-[#E7E4EC] bg-white p-6 shadow-[0_24px_60px_rgba(64,27,118,0.08)]">
        <label className="block text-sm text-[#6B6478]">Business Address</label>
        <input
          value={address}
          onChange={(e) => onChangeAddress(e.target.value)}
          className="mt-2 h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76] focus:outline-none"
          placeholder="Enter your business address"
        />

        <div className="mt-5 rounded-[12px] bg-[#FBF8FF] p-4">
          <div className="text-[14px] font-semibold text-[#2B1940]">
            Business Service Benefits
          </div>
          <ul className="mt-3 space-y-2 text-[13px] leading-6 text-[#6F6C90]">
            <li>• Dedicated business support team</li>
            <li>• Service Level Agreement (SLA) protection</li>
            <li>• Priority fault resolution</li>
            <li>• Enhanced network reliability</li>
          </ul>
        </div>
      </div>

      <BarActions onBack={onBack} onNext={onNext} nextDisabled={!address} />
    </SectionPanel>
  );
}
