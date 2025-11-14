"use client";

import { useCallback, useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import ExitConfirmationDialog from "@/components/shared/ExitConfirmationDialog";
import { signup } from "@/lib/services/auth";
import SignupModal1 from "./modals/SignupModal1";
import SignupModal2 from "./modals/SignupModal2";
import SignupModal3 from "./modals/SignupModal3";
import SignupModal4 from "./modals/SignupModal4";
import SignupModal5 from "./modals/SignupModal5";
import SignupModal6 from "./modals/SignupModal6";
import StaticIPInfoModal from "./modals/StaticIPInfoModal";

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
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  // Signup data collected across steps
  const [serviceAddress, setServiceAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number } | null>(null);

  const closeAll = useCallback(() => {
    setShowStaticIpInfo(false);
    setStep(1);
    setApiLoading(false);
    setApiError(null);
    setShowSuccess(false);
    setShowExitConfirmation(false);
    setServiceAddress("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setSelectedPlan(null);
    onClose();
  }, [onClose]);

  const handleCloseClick = useCallback(() => {
    setShowExitConfirmation(true);
  }, []);

  const handleComplete = useCallback(async () => {
    try {
      setApiLoading(true);
      setApiError(null);
      await signup({
        type: "NBN",
        firstName,
        lastName,
        email,
        password,
        phone,
        serviceAddress,
        selectedPlan: selectedPlan || undefined,
      });
      setShowSuccess(true);
    } catch (err: any) {
      setApiError(err?.message || "Signup failed");
    } finally {
      setApiLoading(false);
    }
  }, [firstName, lastName, email, password, phone, serviceAddress, selectedPlan]);

  const goNext = useCallback(() => {
    if (step === 6) {
      // After Payment & Agreement, go directly to completion (skip obsolete Agreements step)
      handleComplete();
      return;
    }
    setStep((s: any) => Math.min(6, (s + 1)));
  }, [step, handleComplete]);

  const goBack = useCallback(() => {
    setStep((s: any) => Math.max(1, (s - 1)));
  }, []);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90] grid place-items-center bg-black/55 p-4">
        {step === 1 && (
          <SignupModal1
            onNext={goNext}
            onBack={closeAll}
            onClose={handleCloseClick}
            address={serviceAddress}
            onChangeAddress={setServiceAddress}
          />
        )}
        {step === 2 && (
          <SignupModal2
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            selectedPlan={selectedPlan}
            onPlanSelect={setSelectedPlan}
          />
        )}
        {step === 3 && (
          <SignupModal3
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            onOpenStaticIp={() => setShowStaticIpInfo(true)}
          />
        )}
        {step === 4 && (
          <SignupModal4
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
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
        {step === 5 && <SignupModal5 onNext={goNext} onBack={goBack} onClose={handleCloseClick} />}
        {step === 6 && (
          <SignupModal6
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            selectedPlan={selectedPlan}
          />
        )}

        {showStaticIpInfo && <StaticIPInfoModal onClose={() => setShowStaticIpInfo(false)} />}

        {showSuccess && (
          <ModalShell onClose={closeAll} size="default">
            <SectionPanel>
              <div className="text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink,#2F2151)] text-white">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M20 7 10 17 4 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="modal-h1 mt-4">Thank You!</h2>
                <p className="modal-sub mt-1">Your order is complete.</p>
                <p className="mt-4 text-[15px] text-[#6A6486] max-w-md mx-auto">
                  You will receive an email shortly with your new plan details and receipt.
                </p>
                <button type="button" onClick={closeAll} className="btn-primary mt-6">Close</button>
              </div>
            </SectionPanel>
          </ModalShell>
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
