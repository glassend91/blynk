"use client";

import { useCallback, useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import BsmHeaderBanner from "./BsmHeaderBanner";
import BsmStepper from "./BsmStepper";

import BusinessSmeSignup1 from "./modals/BusinessSmeSignup1";
import BusinessSmeSignup2 from "./modals/BusinessSmeSignup2";
import BusinessSmeSignup3 from "./modals/BusinessSmeSignup3";
import BusinessSmeSignup4 from "./modals/BusinessSmeSignup4";
import BusinessSmeSignup5 from "./modals/BusinessSmeSignup5";
import BusinessSmeSignup6 from "./modals/BusinessSmeSignup6";
import BusinessSmeSignup7 from "./modals/BusinessSmeSignup7";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function BusinessSmeSignupController({
  open,
  onClose,
}: any) {
  const order: Step[] = [1, 2, 3, 4, 5, 6, 7];
  const [step, setStep] = useState<Step>(1);

  const closeAll = useCallback(() => {
    setStep(1);
    onClose();
  }, [onClose]);

  const goNext = useCallback(() => {
    const idx = order.indexOf(step);
    setStep(order[Math.min(idx + 1, order.length - 1)]);
  }, [step]);

  const goBack = useCallback(() => {
    const idx = order.indexOf(step);
    setStep(order[Math.max(idx - 1, 0)]);
  }, [step]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/70 p-6">
      <ModalShell onClose={closeAll} size="wide">
        <div className="px-8 pt-8">
          <BsmHeaderBanner />
          <div className="pt-6">
            <BsmStepper active={step} />
          </div>
        </div>

        <div className="px-8 pb-10">
          {step === 1 && <BusinessSmeSignup1 onNext={goNext} onBack={closeAll} />}
          {step === 2 && <BusinessSmeSignup2 onNext={goNext} onBack={goBack} />}
          {step === 3 && <BusinessSmeSignup3 onNext={goNext} onBack={goBack} />}
          {step === 4 && <BusinessSmeSignup4 onNext={goNext} onBack={goBack} />}
          {step === 5 && <BusinessSmeSignup5 onNext={goNext} onBack={goBack} />}
          {step === 6 && <BusinessSmeSignup6 onNext={goNext} onBack={goBack} />}
          {step === 7 && <BusinessSmeSignup7 onComplete={closeAll} onBack={goBack} />}
        </div>
      </ModalShell>
    </div>
  );
}
