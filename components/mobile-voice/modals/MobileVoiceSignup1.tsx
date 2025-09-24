"use client";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";

export default function MobileVoiceSignup1({ onNext, onBack, onClose }: {
  onNext: () => void; onBack: () => void; onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6"><MVStepper active={1} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
            {/* phone icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <rect x="6" y="2" width="12" height="20" rx="3" stroke="white" strokeWidth="1.5" />
              <circle cx="12" cy="18" r="1.5" fill="white" />
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
            Choose Your Mobile Plan
          </h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
            Select the plan that best fits your needs
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { name: "Mobile Basic", price: "$25", perks: ["5GB Data", "Unlimited National", "Unlimited SMS"], selected: false },
            { name: "Mobile Standard", price: "$35", perks: ["20GB Data", "Unlimited National", "Unlimited SMS"], selected: true, badge: "Most Popular" },
            { name: "Mobile Premium", price: "$55", perks: ["100GB Data", "Unlimited National & International", "Unlimited SMS"], selected: false },
          ].map(({ name, price, perks, selected, badge }) => (
            <button
              key={name}
              type="button"
              className={[
                "text-left rounded-[16px] border bg-white p-6 shadow-[0_40px_60px_rgba(0,0,0,0.06)]",
                selected ? "border-[#5C3B86]" : "border-[#DFDBE3]",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="text-[18px] font-semibold text-[#7C7396]">{name}</div>
                {badge && (
                  <span className="rounded-[8px] bg-[#1C1232] px-2 py-1 text-[12px] font-semibold text-white">
                    {badge}
                  </span>
                )}
              </div>

              <div className="mt-3 text-[32px] font-extrabold text-[#2F2151]">
                {price}
                <span className="ml-1 text-[16px] font-semibold">/month</span>
              </div>

              <ul className="mt-4 space-y-2 text-[14px] text-[#5D5875]">
                {perks.map(p => (
                  <li key={p} className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M20 6 9 17l-5-5" stroke="#3EB164" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
