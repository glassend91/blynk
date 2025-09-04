"use client";

import ModalShell from "@/components/shared/ModalShell";
import { useState } from "react";

type Props = {
  onClose: () => void;
  onNext: () => void;
  onBack?: () => void;
};

export default function MbbSignup1({onClose, onNext, onBack }: Props) {
  const [plan, setPlan] = useState<"light" | "standard" | "unlimited">("standard");

  return (
    <ModalShell
      onClose={onClose}
      showClose={true}
    >
      {/* Top help bar */}
      <div className="rounded-t-[24px] px-8 pt-8">
        <div className="flex items-center justify-between rounded-xl bg-[#F4EEF9] px-6 py-4">
          <div className="flex items-center gap-3 text-[14px] leading-6 text-[#4A4458]">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#3E1B60] text-white">
              {/* headset */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 12a8 8 0 1 1 16 0" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
                <path d="M5 13v3a3 3 0 0 0 3 3h2v-8H8a3 3 0 0 0-3 3Zm14 0v3a3 3 0 0 1-3 3h-2v-8h2a3 3 0 0 1 3 3Z" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </span>
            <span>
              Having trouble or have a question? Our team is here to help.{" "}
              <strong>Call us on (02) 8123 4567</strong> or request a callback.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg bg-[#3E1B60] px-4 py-2 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
              Contact Us
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-[#3E1B60] px-4 py-2 text-[#3E1B60] font-medium">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 8h4l2 3h6v7H6V8Z" stroke="#3E1B60" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Call Now
            </button>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="px-8 pt-6">
        <ol className="mx-auto grid max-w-[980px] grid-cols-6 items-center gap-6 text-center">
          {["Plan Selection","SIM Type","Customer Details","ID Check","Payment","Agreement"].map((label, i) => (
            <li key={label} className="space-y-2">
              <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${i===0 ? "bg-[#3E1B60] text-white" : "bg-[#ECE7F2] text-[#6B6478]"}`}>
                {i+1}
              </div>
              <div className={`text-[14px] ${i===0 ? "text-[#3E1B60] font-semibold" : "text-[#6B6478]"}`}>{label}</div>
            </li>
          ))}
        </ol>
        <div className="mx-auto mt-4 h-2 w-full max-w-[980px] rounded-full bg-[#E7E4EC]">
          <div className="h-2 w-[16%] rounded-full bg-[#3E1B60]" />
        </div>
      </div>

      {/* Content well */}
      <div className="px-8 pb-8 pt-6">
        <div className="rounded-[20px] bg-[#FBF7FF] p-10 shadow-[0_30px_60px_-40px_rgba(62,27,96,0.25)]">
          <div className="mx-auto max-w-[980px]">
            <div className="mb-10 flex flex-col items-center text-center">
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#3E1B60]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16v12H4z" stroke="white" strokeWidth="1.6"/><path d="M8 10h8M8 14h6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </span>
              <h2 className="text-[32px] font-semibold leading-[40px] text-[#1B1332]">Choose Your Data Plan</h2>
              <p className="mt-2 text-[14px] text-[#6B6478]">Select the data plan that suits your usage</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {id:"light", title:"Data Light", price:"$20", perks:["10GB Data","4G/5G Network","30 days validity"]},
                {id:"standard", title:"Data Standard", price:"$35", tag:"Most Popular", perks:["50GB Data","4G/5G Network","30 days validity"]},
                {id:"unlimited", title:"Data Unlimited", price:"$65", perks:["Unlimited Data","4G/5G Network"]},
              ].map((card) => {
                const active = plan === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setPlan(card.id as typeof plan)}
                    className={`text-left rounded-[16px] border px-6 py-6 transition ${
                      active ? "border-[#3E1B60] shadow-[0_30px_60px_-40px_rgba(62,27,96,0.35)]" : "border-[#E7E4EC] hover:border-[#CFC6DC]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-[18px] font-semibold text-[#1B1332]">{card.title}</h3>
                      <span className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${active ? "border-2 border-[#3E1B60]" : "border border-[#CFC6DC]"}`}>
                        <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-[#3E1B60]" : "bg-transparent"}`} />
                      </span>
                    </div>
                    {card.tag && (
                      <span className="mt-2 inline-block rounded-full bg-[#F4EEF9] px-2 py-0.5 text-[12px] font-semibold text-[#3E1B60]">{card.tag}</span>
                    )}
                    <div className="mt-3 text-[28px] font-bold text-[#1B1332]">
                      {card.price}<span className="text-[16px] font-semibold text-[#3E1B60]">/month</span>
                    </div>
                    <ul className="mt-4 space-y-2 text-[14px] text-[#50485F]">
                      {card.perks.map(p => (
                        <li key={p} className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="#12B85A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mx-auto mt-8 flex max-w-[980px] items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-[#CFC6DC] bg-white px-5 py-3 text-[#6B6478]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6 9 12l6 6" stroke="#6B6478" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back
          </button>
          <button
            onClick={() => onNext()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#3E1B60] px-6 py-3 text-white"
          >
            Next
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
