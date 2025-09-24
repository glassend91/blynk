"use client";

import { useCallback, useState } from "react";
import { signup } from "@/lib/services/auth";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // State across steps
  const [simType, setSimType] = useState<"eSim" | "physical">("eSim");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [serviceAddress, setServiceAddress] = useState("");
  const [identity, setIdentity] = useState<any>(null);

  const closeAll = useCallback(() => {
    setStep(1);
    setLoading(false);
    setError(null);
    setShowSuccess(false);
    setSimType("eSim");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setServiceAddress("");
    setIdentity(null);
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
            <MbbSignup2 onNext={goNext} onBack={goBack} onClose={closeAll} type={simType} onChangeType={setSimType} />
          )}
          {step === 3 && (
            <MbbSignup3 onNext={goNext} onBack={goBack} onClose={closeAll}
              firstName={firstName}
              lastName={lastName}
              email={email}
              phone={phone}
              password={password}
              serviceAddress={serviceAddress}
              onChangeFirstName={setFirstName}
              onChangeLastName={setLastName}
              onChangeEmail={setEmail}
              onChangePhone={setPhone}
              onChangePassword={setPassword}
              onChangeServiceAddress={setServiceAddress}
            />
          )}
          {step === 4 && (
            <MbbSignup4 onNext={goNext} onBack={goBack} onClose={closeAll} onIdentityVerified={setIdentity} canProceed={!!identity} />
          )}
          {step === 5 && (
            <MbbSignup5 onNext={goNext} onBack={goBack} onClose={closeAll} />
          )}
          {step === 6 && (
            <MbbSignup6 onComplete={async () => {
              try {
                setLoading(true);
                setError(null);
                await signup({
                  type: "MBB",
                  firstName,
                  lastName,
                  email,
                  password,
                  phone,
                  serviceAddress,
                  identity,
                  simType,
                });
                setStep(6); // ensure visible
                setShowSuccess(true);
              } catch (e: any) {
                setError(e?.message || "Signup failed");
              } finally {
                setLoading(false);
              }
            }} onBack={goBack} onClose={closeAll} loading={loading} error={error || undefined} />
          )}
        </div>
      </ModalShell>
      {showSuccess && (
        <div className="fixed inset-0 z-[1001] grid place-items-center bg-black/55 p-4">
          <ModalShell onClose={closeAll} size="default">
            <SectionPanel>
              <div className="text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M20 7 10 17 4 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Signup complete</h2>
                <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Thanks! We’ve received your details.</p>
                <button type="button" onClick={closeAll} className="btn-primary mt-6">Close</button>
              </div>
            </SectionPanel>
          </ModalShell>
        </div>
      )}
    </div>
  );
}
