"use client";
import { useState } from "react";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import InfoStaticIpModal from "./InfoStaticIpModal";

export default function BusinessSmeSignup3({
  onNext, onBack,
}: { onNext: () => void; onBack: () => void }) {
  const [on, setOn] = useState(true);
  const [info, setInfo] = useState(false);

  return (
    <>
      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="12" height="16" rx="2"/></svg>
          </div>
        </div>
        <h2 className="mt-4 text-center text-[28px] font-extrabold leading-[34px] text-[#170F49]">
          Business Add-ons
        </h2>
        <p className="mt-1 text-center text-[14px] leading-[22px] text-[#6F6C90]">
          Enhance your business connection with professional features
        </p>

        <div className="mx-auto mt-8 max-w-[760px] rounded-[16px] border border-[#E7E4EC] bg-white p-5 shadow-[0_24px_60px_rgba(64,27,118,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-[15px] font-semibold text-[#2B1940]">Static IP Address</div>
                <button
                  type="button"
                  aria-label="Static IP information"
                  onClick={() => setInfo(true)}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#E7E4EC] text-[#4F1C76]"
                >
                  i
                </button>
              </div>
              <div className="mt-1 text-[13px] text-[#6F6C90]">
                Essential for servers, remote access, and professional applications
              </div>
              <div className="mt-2 text-[12px] font-semibold text-[#4F1C76]">+$15/month</div>
            </div>

            {/* toggle */}
            <button
              type="button"
              onClick={() => setOn(v => !v)}
              className={[
                "relative mt-1 h-7 w-12 rounded-full transition-colors",
                on ? "bg-[#22C55E]" : "bg-[#D1D5DB]",
              ].join(" ")}
              aria-pressed={on}
            >
              <span
                className={[
                  "absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform",
                  on ? "translate-x-6" : "translate-x-0.5",
                ].join(" ")}
              />
            </button>
          </div>
        </div>

        <BarActions onBack={onBack} onNext={onNext} />
      </SectionPanel>

      <InfoStaticIpModal open={info} onClose={() => setInfo(false)} />
    </>
  );
}
