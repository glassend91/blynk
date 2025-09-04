"use client";

import ModalShell from "@/components/shared/ModalShell";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
};

export default function MbbSignup2({ onClose, onNext, onBack }: Props) {
  const [type, setType] = useState<"esim" | "physical">("esim");

  return (
    <ModalShell onClose={onClose}>
      {/* Help bar + stepper identical; progress ~ 2/6 */}
      <SharedHeader stepActive={2} />
      <SharedStepper active={2} progress="w-[32%]" />

      <div className="px-8 pb-8 pt-6">
        <div className="rounded-[20px] bg-[#FBF7FF] p-10 shadow-[0_30px_60px_-40px_rgba(62,27,96,0.25)]">
          <div className="mx-auto max-w-[980px]">
            <SectionHead icon="sim" title="Choose Your SIM Type" subtitle="Select how you’d like to receive your SIM" />

            <div className="mx-auto mt-6 space-y-4 md:w-[720px]">
              {[
                {id:"esim", title:"eSIM (Digital)", badge:"FREE", desc:"Instant activation, environmentally friendly"},
                {id:"physical", title:"Physical SIM Card", badge:"$10 one-time fee", desc:"Traditional SIM card delivered to your address"},
              ].map(opt => {
                const active = type === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setType(opt.id as typeof type)}
                    className={`flex w-full items-center justify-between rounded-[12px] border px-5 py-4 text-left ${
                      active ? "border-[#3E1B60]" : "border-[#E7E4EC] hover:border-[#CFC6DC]"
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[16px] font-semibold text-[#1B1332]">{opt.title}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[12px] ${opt.id==="esim" ? "bg-[#EDE6F7] text-[#3E1B60]" : "bg-[#F6F1FB] text-[#3E1B60]"}`}>
                          {opt.badge}
                        </span>
                      </div>
                      <p className="mt-1 text-[14px] text-[#6B6478]">{opt.desc}</p>
                    </div>
                    <span className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${active ? "border-2 border-[#3E1B60]" : "border border-[#CFC6DC]"}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-[#3E1B60]" : "bg-transparent"}`} />
                    </span>
                  </button>
                );
              })}
              <p className="pt-2 text-[12px] leading-5 text-[#6B6478]">
                Before choosing an eSIM plan, please ensure your phone is compatible with eSIM technology. If you’re unsure or need assistance, our customer support team is happy to help.
              </p>
            </div>
          </div>
        </div>

        <FooterNav onBack={onBack} onNext={onNext} />
      </div>
    </ModalShell>
  );
}

/* ——— shared tiny bits used below ——— */

function SharedHeader({ stepActive }: { stepActive: number }) {
  return (
    <div className="rounded-t-[24px] px-8 pt-8">
      <div className="flex items-center justify-between rounded-xl bg-[#F4EEF9] px-6 py-4">
        <div className="flex items-center gap-3 text-[14px] leading-6 text-[#4A4458]">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#3E1B60] text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 12a8 8 0 1 1 16 0" stroke="white" strokeWidth="1.6" strokeLinecap="round"/><path d="M5 13v3a3 3 0 0 0 3 3h2v-8H8a3 3 0 0 0-3 3Zm14 0v3a3 3 0 0 1-3 3h-2v-8h2a3 3 0 0 1 3 3Z" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </span>
          <span>Having trouble or have a question? Our team is here to help. <strong>Call us on (02) 8123 4567</strong> or request a callback.</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#3E1B60] px-4 py-2 text-white">Contact Us</button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-[#3E1B60] px-4 py-2 text-[#3E1B60]">Call Now</button>
        </div>
      </div>
    </div>
  );
}

function SharedStepper({ active, progress }: { active: number; progress: string }) {
  const labels = ["Plan Selection","SIM Type","Customer Details","ID Check","Payment","Agreement"];
  return (
    <div className="px-8 pt-6">
      <ol className="mx-auto grid max-w-[980px] grid-cols-6 items-center gap-6 text-center">
        {labels.map((label, i) => (
          <li key={label} className="space-y-2">
            <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${i===active-1 ? "bg-[#3E1B60] text-white" : "bg-[#ECE7F2] text-[#6B6478]"}`}>{i+1}</div>
            <div className={`text-[14px] ${i===active-1 ? "text-[#3E1B60] font-semibold" : "text-[#6B6478]"}`}>{label}</div>
          </li>
        ))}
      </ol>
      <div className="mx-auto mt-4 h-2 w-full max-w-[980px] rounded-full bg-[#E7E4EC]">
        <div className={`h-2 rounded-full bg-[#3E1B60] ${progress}`} />
      </div>
    </div>
  );
}

function SectionHead({ icon, title, subtitle }:{icon:"sim"|"user"|"lock"|"card"|"doc", title:string, subtitle:string}) {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#3E1B60]">
        {/* generic circle icon; keep consistent */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.6"/></svg>
      </span>
      <h2 className="text-[32px] font-semibold leading-[40px] text-[#1B1332]">{title}</h2>
      <p className="mt-2 text-[14px] text-[#6B6478]">{subtitle}</p>
    </div>
  );
}

function FooterNav({ onBack, onNext }:{onBack?:()=>void; onNext:()=>void}) {
  return (
    <div className="mx-auto mt-8 flex max-w-[980px] items-center justify-between">
      <button onClick={onBack} className="inline-flex items-center gap-2 rounded-lg border border-[#CFC6DC] bg-white px-5 py-3 text-[#6B6478]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6 9 12l6 6" stroke="#6B6478" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Back
      </button>
      <button onClick={onNext} className="inline-flex items-center gap-2 rounded-lg bg-[#3E1B60] px-6 py-3 text-white">
        Next
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}
