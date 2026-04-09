"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";

export default function MobileBroadbandSignup2({
  onNext,
  onBack,
  onClose,
  type,
  onChangeType,
  onStepClick,
  maxReached,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  type: "eSim" | "physical";
  onChangeType: (v: "eSim" | "physical") => void;
  onStepClick?: (step: number) => void;
  maxReached?: number;
}) {
  // Ensure eSIM is always selected (non-changeable)
  if (type !== "eSim") {
    onChangeType("eSim");
  }

  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6">
        <MbbStepper
          active={2}
          onStepClick={onStepClick}
          maxReached={maxReached}
        />
      </div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="10" />
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
          <div className="rounded-[14px] border-2 border-[#4F1C76] bg-[#FBF8FF] p-4 shadow-[0_24px_60px_rgba(64,27,118,0.10)]">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-[16px] font-semibold text-[#3B3551]">
                    eSIM
                  </span>
                  <span className="rounded-full bg-black/5 px-2 py-[2px] text-[11px] font-semibold text-[#111827]">
                    SELECTED
                  </span>
                </div>
                <div className="mt-2 text-[13px] text-[#6B6478]">
                  Instant activation, environmentally friendly
                </div>
              </div>
              <div className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#4F1C76] bg-[#4F1C76]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Required text */}
          <div className="mt-6 rounded-[12px] border border-[#E9E3F2] bg-[#FBF8FF] p-5">
            <p className="text-[14px] leading-[22px] text-[#3B3551]">
              We're an eSIM-only provider for all online sign-ups! This means
              you get connected in minutes without waiting for a plastic SIM in
              the mail, and it's better for the planet. Before proceeding,
              please ensure your device is eSIM compatible. Simply confirm by
              clicking 'Next' to continue.
            </p>
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
