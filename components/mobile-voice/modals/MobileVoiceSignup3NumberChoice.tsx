"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";

export default function MobileVoiceSignup3NumberChoice({
  onNext,
  onBack,
  onClose,
  numberChoice,
  onChangeNumberChoice,
  onStepClick,
  maxReached,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  numberChoice: "keep" | "new" | null;
  onChangeNumberChoice: (choice: "keep" | "new") => void;
  onStepClick?: (step: number) => void;
  maxReached?: number;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6">
        <MVStepper
          active={3}
          onStepClick={onStepClick}
          maxReached={maxReached}
        />
      </div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M22 16.9v2a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 7 7l.6-.6a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9Z"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
            Choose Your Number
          </h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
            Would you like to keep your existing number or get a new one?
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[720px] space-y-4">
          <button
            type="button"
            onClick={() => onChangeNumberChoice("keep")}
            className={[
              "w-full flex items-center justify-between rounded-[12px] border px-5 py-4 text-left transition-all",
              numberChoice === "keep"
                ? "border-2 border-[#5C3B86] bg-[#FBF8FF] shadow-lg"
                : "border border-[#DFDBE3] bg-white hover:border-[#5C3B86]/50 hover:shadow-md",
            ].join(" ")}
          >
            <div>
              <div className="text-[16px] font-semibold text-[#2E2745]">
                Keep my existing number
              </div>
              <div className="mt-1 text-[13px] text-[#6F6C90]">
                Port your current mobile number to Blynk
              </div>
            </div>
            <div
              className={[
                "grid h-5 w-5 place-items-center rounded-full border-2",
                numberChoice === "keep"
                  ? "border-[#5C3B86] bg-[#5C3B86]"
                  : "border-[#CFC8DA]",
              ].join(" ")}
            >
              {numberChoice === "keep" && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChangeNumberChoice("new")}
            className={[
              "w-full flex items-center justify-between rounded-[12px] border px-5 py-4 text-left transition-all",
              numberChoice === "new"
                ? "border-2 border-[#5C3B86] bg-[#FBF8FF] shadow-lg"
                : "border border-[#DFDBE3] bg-white hover:border-[#5C3B86]/50 hover:shadow-md",
            ].join(" ")}
          >
            <div>
              <div className="text-[16px] font-semibold text-[#2E2745]">
                Get a new number
              </div>
              <div className="mt-1 text-[13px] text-[#6F6C90]">
                Choose from our available mobile numbers
              </div>
            </div>
            <div
              className={[
                "grid h-5 w-5 place-items-center rounded-full border-2",
                numberChoice === "new"
                  ? "border-[#5C3B86] bg-[#5C3B86]"
                  : "border-[#CFC8DA]",
              ].join(" ")}
            >
              {numberChoice === "new" && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </button>
        </div>
      </SectionPanel>

      <BarActions
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!numberChoice}
      />
    </ModalShell>
  );
}
