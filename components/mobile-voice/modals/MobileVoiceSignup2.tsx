"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";

const numbers = ["0412 345 678", "0423 456 789", "0434 567 890", "0445 678 901"];

export default function MobileVoiceSignup2({ onNext, onBack, onClose, selectedNumber, onChangeSelectedNumber }: {
  onNext: () => void; onBack: () => void; onClose: () => void; selectedNumber: string; onChangeSelectedNumber: (v: string) => void;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6"><MVStepper active={3} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
            {/* handset */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M22 16.9v2a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 7 7l.6-.6a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9Z" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
            Choose Your Mobile Number
          </h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
            Select from our available mobile numbers
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[720px] space-y-4">
          {numbers.map((n, i) => (
            <label
              key={n}
              className={[
                "flex cursor-pointer items-center justify-between rounded-[12px] border px-5 py-4",
                i === 0 ? "border-[#5C3B86]" : "border-[#DFDBE3]",
                "bg-white shadow-[0_40px_60px_rgba(0,0,0,0.06)]",
              ].join(" ")}
            >
              <span className="text-[15px] text-[#2E2745]">{n}</span>
              <input type="radio" name="mv-number" checked={selectedNumber === n} onChange={() => onChangeSelectedNumber(n)} className="sr-only" />
              <span
                className={[
                  "grid h-5 w-5 place-items-center rounded-full border",
                  selectedNumber === n ? "border-[#5C3B86]" : "border-[#CFC8DA]",
                ].join(" ")}
              >
                <span className={["h-2.5 w-2.5 rounded-full", selectedNumber === n ? "bg-[#5C3B86]" : "bg-transparent"].join(" ")} />
              </span>
            </label>
          ))}
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
