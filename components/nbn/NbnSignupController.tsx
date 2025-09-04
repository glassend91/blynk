"use client";

import { useCallback, useState } from "react";
import SignupModal1 from "./modals/SignupModal1";
import SignupModal2 from "./modals/SignupModal2";
import SignupModal3 from "./modals/SignupModal3";
import SignupModal4 from "./modals/SignupModal4";
import SignupModal5 from "./modals/SignupModal5";
import SignupModal6 from "./modals/SignupModal6";
import SignupModal7 from "./modals/SignupModal7";
import StaticIPInfoModal from "./modals/StaticIPInfoModal";
import LetsGetYourConnectionModal from "./modals/LetsGetYourConnectionModal";

export type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function NbnSignupController({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>(1);
  const [showStaticIpInfo, setShowStaticIpInfo] = useState(false);
  const [showLetsGetConn, setShowLetsGetConn] = useState(false);

  const closeAll = useCallback(() => {
    setShowStaticIpInfo(false);
    setShowLetsGetConn(false);
    setStep(1);
    onClose();
  }, [onClose]);

  const goNext = useCallback(() => {
    if (step === 6) {
      setShowLetsGetConn(true);
      return;
    }
    setStep((s) => Math.min(7, (s + 1) as Step));
  }, [step]);

  const goBack = useCallback(() => {
    if (showLetsGetConn) {
      setShowLetsGetConn(false);
      return;
    }
    setStep((s) => Math.max(1, (s - 1) as Step));
  }, [showLetsGetConn]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/55 p-4">
      {step === 1 && <SignupModal1 onNext={goNext} onBack={closeAll} onClose={closeAll} />}
      {step === 2 && <SignupModal2 onNext={goNext} onBack={goBack} onClose={closeAll} />}
      {step === 3 && (
        <SignupModal3
          onNext={goNext}
          onBack={goBack}
          onClose={closeAll}
          onOpenStaticIp={() => setShowStaticIpInfo(true)}
        />
      )}
      {step === 4 && <SignupModal4 onNext={goNext} onBack={goBack} onClose={closeAll} />}
      {step === 5 && <SignupModal5 onNext={goNext} onBack={goBack} onClose={closeAll} />}
      {step === 6 && <SignupModal6 onNext={goNext} onBack={goBack} onClose={closeAll} />}
      {step === 7 && (
        <SignupModal7 onComplete={closeAll} onBack={goBack} onClose={closeAll} />
      )}

      {showStaticIpInfo && <StaticIPInfoModal onClose={() => setShowStaticIpInfo(false)} />}

      {showLetsGetConn && (
        <LetsGetYourConnectionModal
          onNext={() => {
            setShowLetsGetConn(false);
            setStep(7);
          }}
          onBack={() => setShowLetsGetConn(false)}
          onClose={closeAll}
        />
      )}
    </div>
  );
}
