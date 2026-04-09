"use client";

import { useCallback, useState, useEffect } from "react";
import { signup } from "@/lib/services/auth";
import SectionPanel from "@/components/shared/SectionPanel";
import ModalShell from "@/components/shared/ModalShell";
import ExitConfirmationDialog from "@/components/shared/ExitConfirmationDialog";
import BsmHeaderBanner from "./BsmHeaderBanner";
import BsmStepper from "./BsmStepper";

import BusinessSmeSignup1 from "./modals/BusinessSmeSignup1";
import BusinessSmeSignup2 from "./modals/BusinessSmeSignup2";
import BusinessSmeSignup3 from "./modals/BusinessSmeSignup3";
import BusinessSmeSignup4 from "./modals/BusinessSmeSignup4";
import BusinessSmeSignup5 from "./modals/BusinessSmeSignup5";
import BusinessSmeSignup6 from "./modals/BusinessSmeSignup6";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export default function BusinessSmeSignupController({ open, onClose }: any) {
  const order: Step[] = [1, 2, 3, 4, 5, 6];
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  // State across steps
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [abn, setAbn] = useState("");
  const [acn, setAcn] = useState("");
  const [primaryFirstName, setPrimaryFirstName] = useState("");
  const [primaryLastName, setPrimaryLastName] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [password, setPassword] = useState("");

  const [maxReached, setMaxReached] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("bsm_max_reached");
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });

  // Persist maxReached
  useEffect(() => {
    if (step > maxReached) {
      setMaxReached(step);
      sessionStorage.setItem("bsm_max_reached", step.toString());
    }
  }, [step, maxReached]);

  const closeAll = useCallback(() => {
    setStep(1);
    setMaxReached(1);
    sessionStorage.removeItem("bsm_max_reached");
    setLoading(false);
    setError(null);
    setShowSuccess(false);
    setShowExitConfirmation(false);
    setAddress("");
    setBusinessName("");
    setBusinessType("");
    setAbn("");
    setAcn("");
    setPrimaryFirstName("");
    setPrimaryLastName("");
    setPrimaryEmail("");
    setPrimaryPhone("");
    onClose();
  }, [onClose]);

  const handleCloseClick = useCallback(() => {
    setShowExitConfirmation(true);
  }, []);

  const goNext = useCallback(() => {
    const idx = order.indexOf(step);
    setStep(order[Math.min(idx + 1, order.length - 1)]);
  }, [step]);

  const goBack = useCallback(() => {
    const idx = order.indexOf(step);
    setStep(order[Math.max(idx - 1, 0)]);
  }, [step]);

  const handleStepClick = useCallback(
    (s: number) => {
      if (s <= maxReached && s !== step) {
        setStep(s as Step);
      }
    },
    [maxReached, step],
  );

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/70 p-6">
        <ModalShell onClose={handleCloseClick} size="wide">
          <div className="px-8 pt-8">
            <BsmHeaderBanner />
            <div className="pt-6">
              <BsmStepper
                active={step}
                onStepClick={handleStepClick}
                maxReached={maxReached}
              />
            </div>
          </div>

          <div className="px-8 pb-10">
            {step === 1 && (
              <BusinessSmeSignup1
                onNext={goNext}
                onBack={closeAll}
                address={address}
                onChangeAddress={setAddress}
              />
            )}
            {step === 2 && (
              <BusinessSmeSignup2 onNext={goNext} onBack={goBack} />
            )}
            {step === 3 && (
              <BusinessSmeSignup3 onNext={goNext} onBack={goBack} />
            )}
            {step === 4 && (
              <BusinessSmeSignup4
                onNext={goNext}
                onBack={goBack}
                businessName={businessName}
                businessType={businessType}
                abn={abn}
                acn={acn}
                primaryFirstName={primaryFirstName}
                primaryLastName={primaryLastName}
                primaryEmail={primaryEmail}
                primaryPhone={primaryPhone}
                password={password}
                onChangeBusinessName={setBusinessName}
                onChangeBusinessType={setBusinessType}
                onChangeAbn={setAbn}
                onChangeAcn={setAcn}
                onChangePrimaryFirstName={setPrimaryFirstName}
                onChangePrimaryLastName={setPrimaryLastName}
                onChangePrimaryEmail={setPrimaryEmail}
                onChangePrimaryPhone={setPrimaryPhone}
                onChangePassword={setPassword}
              />
            )}
            {step === 5 && (
              <BusinessSmeSignup5 onNext={goNext} onBack={goBack} />
            )}
            {step === 6 && (
              <BusinessSmeSignup6
                onNext={async () => {
                  // After Payment & Agreement, go directly to confirmation
                  try {
                    setLoading(true);
                    setError(null);
                    await signup({
                      type: "SME",
                      firstName: primaryFirstName,
                      lastName: primaryLastName,
                      email: primaryEmail,
                      password,
                      phone: primaryPhone,
                      serviceAddress: address,
                      businessDetails: {
                        businessName,
                        businessAddress: address,
                        businessType,
                        ABN: abn,
                        ACN: acn,
                        primaryContact: {
                          firstName: primaryFirstName,
                          lastName: primaryLastName,
                          phone: primaryPhone,
                          email: primaryEmail,
                        },
                      },
                    });
                    setShowSuccess(true);
                  } catch (e: any) {
                    setError(e?.message || "Signup failed");
                  } finally {
                    setLoading(false);
                  }
                }}
                onBack={goBack}
              />
            )}
          </div>
        </ModalShell>
        {showSuccess && (
          <div className="fixed inset-0 z-[1001] grid place-items-center bg-black/55 p-4">
            <ModalShell onClose={closeAll} size="default">
              <SectionPanel>
                <div className="text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M20 7 10 17 4 11"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
                    Signup complete
                  </h2>
                  <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
                    Thanks! We’ve received your business details.
                  </p>
                  <button
                    type="button"
                    onClick={closeAll}
                    className="btn-primary mt-6"
                  >
                    Close
                  </button>
                </div>
              </SectionPanel>
            </ModalShell>
          </div>
        )}
      </div>
      <ExitConfirmationDialog
        open={showExitConfirmation}
        onStay={() => setShowExitConfirmation(false)}
        onExit={closeAll}
      />
    </>
  );
}
