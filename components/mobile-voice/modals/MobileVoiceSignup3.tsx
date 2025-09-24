"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";

export default function MobileVoiceSignup3({ onNext, onBack, onClose, simType, onChangeSimType }: {
  onNext: () => void; onBack: () => void; onClose: () => void; simType: "ESIM" | "PHYSICAL"; onChangeSimType: (v: "ESIM" | "PHYSICAL") => void;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6"><MVStepper active={3} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 3h7l4 4v14H7V3Z" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
            Choose Your SIM Type
          </h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
            Select how you’d like to receive your SIM
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[760px]">
          <label className="flex cursor-pointer items-start justify-between rounded-[12px] border border-[#5C3B86] bg-white px-5 py-4 shadow-[0_40px_60px_rgba(0,0,0,0.06)]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-[#2E2745]">eSIM (Digital)</span>
                <span className="rounded-[8px] bg-[#1C1232] px-2 py-[2px] text-[11px] font-semibold text-white">FREE</span>
              </div>
              <div className="text-[13px] text-[#6F6C90]">Instant activation, environmentally friendly</div>
            </div>
            <input type="radio" name="mv-sim" checked={simType === "ESIM"} onChange={() => onChangeSimType("ESIM")} className="sr-only" />
            <span className="grid h-5 w-5 place-items-center rounded-full border border-[#5C3B86]">
              <span className={["h-2.5 w-2.5 rounded-full", simType === "ESIM" ? "bg-[#5C3B86]" : "bg-transparent"].join(" ")} />
            </span>
          </label>

          <p className="mt-5 max-w-[720px] text-[12px] leading-[18px] text-[#8A84A3]">
            * Before choosing an eSIM plan, please ensure your phone is compatible with eSIM technology. If you’re unsure or need assistance,
            our customer support team is happy to help.
          </p>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
