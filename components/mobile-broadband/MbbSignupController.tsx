"use client";

import { useCallback, useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import HelpBanner from "@/components/shared/HelpBanner";
import MbbStepper from "@/components/mobile-broadband/MbbStepper";

import MbbSignup1 from "./modals/MobileBroadbandSignup1";
import MbbSignup2 from "./modals/MobileBroadbandSignup2";
import MbbSignup3 from "./modals/MobileBroadbandSignup3";
import MbbSignup4 from "./modals/MobileBroadbandSignup4";
import MbbSignup5 from "./modals/MobileBroadbandSignup5";
import MbbSignup6 from "./modals/MobileBroadBandSignup6";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function MbbSignupController({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const order: Step[] = [1, 2, 3, 4, 5, 6];
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
      <ModalShell onClose={closeAll}>
        {/* Header inside the white modal */}
        <div className="px-8 pt-8">
          <HelpBanner />
          <div className="pt-6">
            <MbbStepper active={step} />
          </div>
        </div>

        {/* Content area */}
        <div className="px-8 pb-10">
          {step === 1 && (
            <MbbSignup1 onNext={goNext} onBack={closeAll} onClose={closeAll} />
          )}
          {step === 2 && (
            <MbbSignup2 onNext={goNext} onBack={goBack} onClose={closeAll} />
          )}
          {step === 3 && (
            <MbbSignup3 onNext={goNext} onBack={goBack} onClose={closeAll} />
          )}
          {step === 4 && (
            <MbbSignup4 onNext={goNext} onBack={goBack} onClose={closeAll} />
          )}
          {step === 5 && (
            <MbbSignup5 onNext={goNext} onBack={goBack} onClose={closeAll} />
          )}
          {step === 6 && (
            <MbbSignup6 onComplete={closeAll} onBack={goBack} onClose={closeAll} />
          )}
        </div>
      </ModalShell>
    </div>
  );
}
