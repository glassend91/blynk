"use client";
import { useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";

export default function MobileBroadbandSignup1({
  onNext, onBack, onClose,
}: { onNext: () => void; onBack: () => void; onClose: () => void; }) {
  const [plan, setPlan] = useState<"light" | "standard" | "unlimited">("standard");

  const cards = [
    { id: "light" as const, title: "Data Light", price: "$20/month", bullets: ["10GB Data", "4G/5G Network", "30 days validity"] },
    { id: "standard" as const, title: "Data Standard", price: "$35/month", badge: "Most Popular", bullets: ["50GB Data", "4G/5G Network", "30 days validity"] },
    { id: "unlimited" as const, title: "Data Unlimited", price: "$65/month", bullets: ["Unlimited Data", "4G/5G Network", "30 days validity"] },
  ];

  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6"><MbbStepper active={1} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden><circle cx="12" cy="12" r="10" /></svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Choose Your Data Plan</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Select the data plan that suits your usage</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {cards.map(c => {
            const active = plan === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setPlan(c.id)}
                className={[
                  "text-left rounded-[16px] border bg-white p-6 shadow-[0_24px_60px_rgba(64,27,118,0.10)]",
                  active ? "border-[#4F1C76]" : "border-[#E7E4EC] hover:border-[#CFC6DC]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[18px] font-semibold text-[#3B3551]">{c.title}</div>
                    <div className="mt-2 text-[32px] font-extrabold text-[#4F1C76]">{c.price}</div>
                  </div>
                  <span className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full ${active ? "border-2 border-[#4F1C76]" : "border border-[#CFC6DC]"}`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-[#4F1C76]" : "bg-transparent"}`} />
                  </span>
                </div>

                {c.badge && (
                  <span className="mt-2 inline-block rounded-[8px] bg-[#EEE8F6] px-2 py-[2px] text-[11px] font-semibold text-[#3B3551]">{c.badge}</span>
                )}

                <ul className="mt-4 space-y-2 text-[14px] text-[#5B5668]">
                  {c.bullets.map(b => (
                    <li key={b} className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path d="M20 6 9 17l-5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
