"use client";
import { useState } from "react";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";

export default function BusinessSmeSignup2({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const [sel, setSel] = useState<"basic" | "standard" | "premium">("standard");
  const plans = [
    {
      id: "basic",
      name: "Business Basic NBN",
      price: "$89",
      bullets: [
        "25/10 Mbps guaranteed speeds",
        "Unlimited data",
        "24/7 Business Support",
        "SLA Guarantee",
        "Priority Network Access",
      ],
    },
    {
      id: "standard",
      name: "Business Standard NBN",
      price: "$129",
      badge: "Most Popular",
      bullets: [
        "25/20 Mbps guaranteed speeds",
        "Unlimited data",
        "24/7 Business Support",
        "SLA Guarantee",
        "Priority Network Access",
        "Enhanced Security",
      ],
    },
    {
      id: "premium",
      name: "Business Premium NBN",
      price: "$189",
      bullets: [
        "Unlimited data",
        "24/7 Business Support",
        "SLA Guarantee",
        "Priority Network Access",
        "Enhanced Security",
        "Dedicated Account Manager",
      ],
    },
  ];

  return (
    <SectionPanel>
      <div className="text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
          Choose Your Business Plan
        </h2>
        <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
          Professional internet solutions designed for business reliability
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const active = sel === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSel(p.id as any)}
              className={[
                "text-left rounded-[16px] border bg-white p-6 shadow-[0_24px_60px_rgba(64,27,118,0.08)]",
                active
                  ? "border-[#4F1C76]"
                  : "border-[#E7E4EC] hover:border-[#CFC6DC]",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <div className="text-[18px] font-semibold text-[#2B1940]">
                  {p.name}
                </div>
                {p.badge && (
                  <span className="rounded-[8px] bg-[#0F0A1F] px-2 py-1 text-[11px] font-semibold text-white">
                    {p.badge}
                  </span>
                )}
              </div>

              <div className="mt-2 text-[32px] font-extrabold text-[#4F1C76]">
                {p.price}
                <span className="ml-1 text-[16px] font-semibold text-[#2B1940]">
                  /month
                </span>
              </div>

              <ul className="mt-4 space-y-2 text-[14px] text-[#5B5668]">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M20 6 9 17l-5-5"
                        stroke="#10B981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <BarActions onBack={onBack} onNext={onNext} />
    </SectionPanel>
  );
}
