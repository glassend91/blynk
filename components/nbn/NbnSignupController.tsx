"use client";

import { useCallback, useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import { signup } from "@/lib/services/auth";
import SignupModal1 from "./modals/SignupModal1";
import SignupModal2 from "./modals/SignupModal2";
import SignupModal3 from "./modals/SignupModal3";
import SignupModal4 from "./modals/SignupModal4";
import SignupModal5 from "./modals/SignupModal5";
import SignupModal6 from "./modals/SignupModal6";
import SignupModal7 from "./modals/SignupModal7";
import StaticIPInfoModal from "./modals/StaticIPInfoModal";
import LetsGetYourConnectionModal from "./modals/LetsGetYourConnectionModal";

// export type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function NbnSignupController({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<any>(1);
  const [showStaticIpInfo, setShowStaticIpInfo] = useState(false);
  const [showLetsGetConn, setShowLetsGetConn] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Signup data collected across steps
  const [serviceAddress, setServiceAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const closeAll = useCallback(() => {
    setShowStaticIpInfo(false);
    setShowLetsGetConn(false);
    setStep(1);
    setApiLoading(false);
    setApiError(null);
    setShowSuccess(false);
    setServiceAddress("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    onClose();
  }, [onClose]);

  const goNext = useCallback(() => {
    if (step === 6) {
      setShowLetsGetConn(true);
      return;
    }
    setStep((s: any) => Math.min(7, (s + 1)));
  }, [step]);
  const handleComplete = useCallback(async () => {
    try {
      setApiLoading(true);
      setApiError(null);
      await signup({ type: "NBN", firstName, lastName, email, password, phone, serviceAddress });
      setShowSuccess(true);
    } catch (err: any) {
      setApiError(err?.message || "Signup failed");
    } finally {
      setApiLoading(false);
    }
  }, [firstName, lastName, email, password, phone, serviceAddress, closeAll]);

  const goBack = useCallback(() => {
    if (showLetsGetConn) {
      setShowLetsGetConn(false);
      return;
    }
    setStep((s: any) => Math.max(1, (s - 1)));
  }, [showLetsGetConn]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/55 p-4">
      {step === 1 && (
        <SignupModal1
          onNext={goNext}
          onBack={closeAll}
          onClose={closeAll}
          address={serviceAddress}
          onChangeAddress={setServiceAddress}
        />
      )}
      {step === 2 && <SignupModal2 onNext={goNext} onBack={goBack} onClose={closeAll} />}
      {step === 3 && (
        <SignupModal3
          onNext={goNext}
          onBack={goBack}
          onClose={closeAll}
          onOpenStaticIp={() => setShowStaticIpInfo(true)}
        />
      )}
      {step === 4 && (
        <SignupModal4
          onNext={goNext}
          onBack={goBack}
          onClose={closeAll}
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          serviceAddress={serviceAddress}
          password={password}
          onChangeFirstName={setFirstName}
          onChangeLastName={setLastName}
          onChangeEmail={setEmail}
          onChangePhone={setPhone}
          onChangeServiceAddress={setServiceAddress}
          onChangePassword={setPassword}
        />
      )}
      {step === 5 && <SignupModal5 onNext={goNext} onBack={goBack} onClose={closeAll} />}
      {step === 6 && <SignupModal6 onNext={goNext} onBack={goBack} onClose={closeAll} />}
      {step === 7 && (
        <SignupModal7 onComplete={handleComplete} onBack={goBack} onClose={closeAll} loading={apiLoading} error={apiError || undefined} />
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

      {showSuccess && (
        <ModalShell onClose={closeAll} size="default">
          <SectionPanel>
            <div className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink,#2F2151)] text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M20 7 10 17 4 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="modal-h1 mt-4">Signup complete</h2>
              <p className="modal-sub mt-1">Thanks! We’ve received your details.</p>
              <button type="button" onClick={closeAll} className="btn-primary mt-6">Close</button>
            </div>
          </SectionPanel>
        </ModalShell>
      )}
    </div>
  );
}
