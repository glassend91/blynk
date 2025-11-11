"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";

export default function MobileVoiceSignup3({
  onNext,
  onBack,
  onClose,
  simType,
  onChangeSimType,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  simType: "ESIM" | "PHYSICAL";
  onChangeSimType: (v: "ESIM" | "PHYSICAL") => void;
}) {
  // Ensure eSIM is always selected (non-changeable)
  if (simType !== "ESIM") {
    onChangeSimType("ESIM");
  }

  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6"><MVStepper active={2} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7 3h7l4 4v14H7V3Z" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
            SIM Selection
          </h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
            We're an eSIM-only provider for all online sign-ups
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[760px]">
          {/* Pre-selected, non-changeable eSIM option */}
          <div className="rounded-[12px] border-2 border-[#5C3B86] bg-[#FBF8FF] px-5 py-4 shadow-[0_40px_60px_rgba(0,0,0,0.06)]">
            <div className="flex items-start justify-between">
              <div className="flex-1">
              <div className="flex items-center gap-2">
                  <span className="text-[16px] font-semibold text-[#2E2745]">eSIM</span>
                  <span className="rounded-[8px] bg-[#1C1232] px-2 py-[2px] text-[11px] font-semibold text-white">SELECTED</span>
                </div>
                <div className="mt-2 text-[14px] text-[#6F6C90]">
                  Instant activation, environmentally friendly
                </div>
              </div>
              <div className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#5C3B86] bg-[#5C3B86]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Required text */}
          <div className="mt-6 rounded-[12px] border border-[#E9E3F2] bg-[#FBF8FF] p-5">
            <p className="text-[14px] leading-[22px] text-[#3B3551]">
              We're an eSIM-only provider for all online sign-ups! This means you get connected in minutes without waiting for a plastic SIM in the mail, and it's better for the planet. Before proceeding, please ensure your device is eSIM compatible. Simply confirm by clicking 'Next' to continue.
          </p>
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
