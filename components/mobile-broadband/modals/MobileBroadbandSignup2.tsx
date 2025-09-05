"use client";
import { useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";

export default function MobileBroadbandSignup2({
  onNext, onBack, onClose,
}: { onNext: () => void; onBack: () => void; onClose: () => void; }) {
  const [type, setType] = useState<"esim" | "physical">("esim");

  const rows = [
    { id: "esim" as const, title: "eSIM (Digital)", tag: "FREE", sub: "Instant activation, environmentally friendly" },
    { id: "physical" as const, title: "Physical SIM Card", tag: "$10 one-time fee", sub: "Traditional SIM card delivered to your address" },
  ];

  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6"><MbbStepper active={2} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Choose Your SIM Type</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Select how you’d like to receive your SIM</p>
        </div>

        <div className="mx-auto mt-8 max-w-[760px] space-y-4">
          {rows.map(r => {
            const active = type === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setType(r.id)}
                className={[
                  "w-full rounded-[14px] border bg-white p-4 text-left shadow-[0_24px_60px_rgba(64,27,118,0.10)]",
                  active ? "border-[#4F1C76]" : "border-[#E7E4EC] hover:border-[#CFC6DC]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="text-[16px] font-semibold text-[#3B3551]">{r.title}</div>
                      <span className={`rounded-full px-2 py-[2px] text-[11px] font-semibold ${r.id==="esim"?"bg-black/5 text-[#111827]":"bg-[#EEE8F6] text-[#4F1C76]"}`}>{r.tag}</span>
                    </div>
                    <div className="mt-2 text-[13px] text-[#6B6478]">{r.sub}</div>
                  </div>
                  <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${active?"border-2 border-[#4F1C76]":"border border-[#CFC6DC]"}`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${active?"bg-[#4F1C76]":"bg-transparent"}`} />
                  </span>
                </div>
              </button>
            );
          })}
          <p className="pt-2 text-[12px] text-[#6B6478]">Before choosing an eSIM plan, please ensure your device supports eSIM.</p>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
