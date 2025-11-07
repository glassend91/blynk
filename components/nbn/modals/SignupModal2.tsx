"use client";

import { useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import Stepper from "@/components/shared/Stepper";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";

type Plan = {
  name: string;
  price: number;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "NBN Basic",
    price: 59.99,
    features: ["Unlimited Data", "24/7 Support", "Free Modem"],
  },
  {
    name: "NBN Standard",
    price: 79.99,
    features: ["Unlimited Data", "24/7 Support", "Free Modem", "Priority Support"],
  },
  {
    name: "NBN Premium",
    price: 99.99,
    features: ["Unlimited Data", "24/7 Support", "Free Modem", "Priority Support", "Static IP Included"],
  },
];

export default function SignupModal2({
  onNext,
  onBack,
  onClose,
  selectedPlan: initialSelectedPlan,
  onPlanSelect,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  selectedPlan?: { name: string; price: number } | null;
  onPlanSelect?: (plan: { name: string; price: number }) => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(
    initialSelectedPlan ? plans.find(p => p.name === initialSelectedPlan.name) || null : null
  );

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    if (onPlanSelect) {
      onPlanSelect({ name: plan.name, price: plan.price });
    }
  };

  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={2} />

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 8c6-5 12-5 18 0M6 12c4-3 8-3 12 0M9 16c2-1.5 4-1.5 6 0" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
          <h2 className="modal-h1 mt-4">Choose Your NBN Plan</h2>
          <p className="modal-sub mt-1">Select the plan that suits you</p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {plans.map((plan) => {
              const isSelected = selectedPlan?.name === plan.name;
              return (
                <button
                  key={plan.name}
                  type="button"
                  onClick={() => handlePlanSelect(plan)}
                  className={[
                    "card p-6 text-left transition-all",
                    isSelected
                      ? "border-2 border-[#5C3B86] bg-[#FBF8FF] shadow-lg"
                      : "border border-[var(--cl-border)] hover:border-[#5C3B86]/50 hover:shadow-md",
                  ].join(" ")}
                >
                  {isSelected && (
                    <div className="mb-3 flex items-center justify-end">
                      <div className="grid h-6 w-6 place-items-center rounded-full bg-[#5C3B86] text-white">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className={["text-[20px] font-semibold", isSelected ? "text-[#5C3B86]" : "text-[#7C7396]"].join(" ")}>
                    {plan.name}
                  </div>
                  <div className="mt-3 text-[34px] font-extrabold text-[var(--cl-brand-ink)]">
                    ${plan.price.toFixed(2)}<span className="text-[18px] font-semibold">/month</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-[#5D5875]">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>✔ {feature}</li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} nextDisabled={!selectedPlan} />
    </ModalShell>
  );
}
