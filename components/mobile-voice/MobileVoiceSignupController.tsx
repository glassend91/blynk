"use client";

import { useCallback, useState } from "react";
import MVSignup1 from "./modals/MobileVoiceSignup1";
import MVSignup2 from "./modals/MobileVoiceSignup2";
import MVSignup3 from "./modals/MobileVoiceSignup3";
import MVSignup4 from "./modals/MobileVoiceSignup4";
import MVSignup5 from "./modals/MobileVoiceSignup5"; // ← NEW
import MVSignup6 from "./modals/MobileVoiceSignup6";
import MVSignup7 from "./modals/MobileVoiceSignup7";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function MobileVoiceSignupController({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
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
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/55 p-4">
      {step === 1 && <MVSignup1 onNext={goNext} onBack={closeAll} onClose={closeAll} />}
      {step === 2 && <MVSignup2 onNext={goNext} onBack={goBack} onClose={closeAll} />}
      {step === 3 && <MVSignup3 onNext={goNext} onBack={goBack} onClose={closeAll} />}
      {step === 4 && <MVSignup4 onNext={goNext} onBack={goBack} onClose={closeAll} />}
      {step === 5 && <MVSignup5 onNext={goNext} onBack={goBack} onClose={closeAll} />} {/* ← NEW */}
      {step === 6 && <MVSignup6 onNext={goNext} onBack={goBack} onClose={closeAll} />}
      {step === 7 && <MVSignup7 onComplete={closeAll} onBack={goBack} onClose={closeAll} />}
    </div>
  );
}
