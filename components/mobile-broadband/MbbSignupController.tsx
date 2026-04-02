"use client";

import { useCallback, useState, useEffect } from "react";
import { signup } from "@/lib/services/auth";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import MbbStepper from "@/components/mobile-broadband/MbbStepper";
import ExitConfirmationDialog from "@/components/shared/ExitConfirmationDialog";

import MbbSignup1 from "./modals/MobileBroadbandSignup1";
import MbbSignup2 from "./modals/MobileBroadbandSignup2";
import MbbSignup3 from "./modals/MobileBroadbandSignup3";
import MbbSignup4 from "./modals/MobileBroadbandSignup4";
import MbbSignup5 from "./modals/MobileBroadbandSignup5";

type Step = 1 | 2 | 3 | 4 | 5;

export default function MbbSignupController({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const order: Step[] = [1, 2, 3, 4, 5];
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  // State across steps
  const [selectedPlan, setSelectedPlan] = useState<{ id?: string | number; name: string; price: number } | null>(null);
  const [simType, setSimType] = useState<"eSim" | "physical">("eSim");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [serviceAddress, setServiceAddress] = useState("");
  const [identity, setIdentity] = useState<any>(null);
  const [simNumber, setSimNumber] = useState<string>(""); // ICCID for physical SIM
  const [esimNotificationEmail, setEsimNotificationEmail] = useState<string>(""); // Email for eSIM notifications

  const [maxReached, setMaxReached] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("mbb_max_reached");
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });

  // Percist maxReached
  useEffect(() => {
    if (step > maxReached) {
      setMaxReached(step);
      sessionStorage.setItem("mbb_max_reached", step.toString());
    }
  }, [step, maxReached]);

  const closeAll = useCallback(() => {
    setStep(1);
    setMaxReached(1);
    sessionStorage.removeItem("mbb_max_reached");
    setLoading(false);
    setError(null);
    setShowSuccess(false);
    setShowExitConfirmation(false);
    setSelectedPlan(null);
    setSimType("eSim");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setDateOfBirth("");
    setPassword("");
    setBillingAddress("");
    setServiceAddress("");
    setIdentity(null);
    setSimNumber("");
    setEsimNotificationEmail("");
    onClose();
  }, [onClose]);

  const handleCloseClick = useCallback(() => {
    setShowExitConfirmation(true);
  }, []);

  const handleComplete = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Create user account
      const res = await signup({
        type: "MBB",
        firstName,
        lastName,
        email,
        password,
        phone,
        dateOfBirth,
        billingAddress,
        serviceAddress,
        identity,
        simType,
        simNumber: simType === "physical" ? simNumber : undefined,
        esimNotificationEmail: simType === "eSim" ? (esimNotificationEmail || email) : undefined,
        selectedPlan: selectedPlan || undefined,
      });

      return { success: true, data: res };
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Signup failed";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, email, password, phone, dateOfBirth, billingAddress, serviceAddress, identity, simType, simNumber, esimNotificationEmail, selectedPlan]);

  const goNext = useCallback(() => {
    if (step === 5) {
      setShowSuccess(true);
      return;
    }
    const idx = order.indexOf(step);
    setStep(order[Math.min(idx + 1, order.length - 1)]);
  }, [step, order]);

  const goBack = useCallback(() => {
    const idx = order.indexOf(step);
    setStep(order[Math.max(idx - 1, 0)]);
  }, [step]);

  const handleStepClick = useCallback((s: number) => {
    if (s <= maxReached && s !== step) {
      setStep(s as Step);
    }
  }, [maxReached, step]);

  if (!open) return null;

  return (
    <>
      {/* Step 1: Plan Selection */}
      {step === 1 && (
        <MbbSignup1
          onNext={goNext}
          onBack={closeAll}
          onClose={handleCloseClick}
          selectedPlan={selectedPlan}
          onPlanSelect={setSelectedPlan}
          onStepClick={handleStepClick}
          maxReached={maxReached}
        />
      )}
      {/* Step 2: SIM Selection (eSIM only) */}
      {step === 2 && (
        <MbbSignup2
          onNext={goNext}
          onBack={goBack}
          onClose={handleCloseClick}
          type={simType}
          onChangeType={setSimType}
          onStepClick={handleStepClick}
          maxReached={maxReached}
        />
      )}
      {/* Step 3: Customer Details */}
      {step === 3 && (
        <MbbSignup3
          onNext={goNext}
          onBack={goBack}
          onClose={handleCloseClick}
          firstName={firstName}
          lastName={lastName}
          email={email}
          phone={phone}
          dateOfBirth={dateOfBirth}
          password={password}
          billingAddress={billingAddress}
          serviceAddress={serviceAddress}
          simType={simType}
          identity={identity}
          simNumber={simNumber}
          esimNotificationEmail={esimNotificationEmail}
          onChangeFirstName={setFirstName}
          onChangeLastName={setLastName}
          onChangeEmail={setEmail}
          onChangePhone={setPhone}
          onChangeDateOfBirth={setDateOfBirth}
          onChangePassword={setPassword}
          onChangeBillingAddress={setBillingAddress}
          onChangeServiceAddress={setServiceAddress}
          onChangeSimNumber={setSimNumber}
          onChangeEsimNotificationEmail={setEsimNotificationEmail}
          onStepClick={handleStepClick}
          maxReached={maxReached}
        />
      )}
      {/* Step 4: ID Verification */}
      {step === 4 && (
        <MbbSignup4
          onNext={goNext}
          onBack={goBack}
          onClose={handleCloseClick}
          onIdentityVerified={setIdentity}
          canProceed={!!identity}
          onStepClick={handleStepClick}
          maxReached={maxReached}
        />
      )}
      {/* Step 5: Payment & Agreement */}
      {step === 5 && (
        <MbbSignup5
          onNext={goNext}
          onBack={goBack}
          onClose={handleCloseClick}
          selectedPlan={selectedPlan}
          onStepClick={handleStepClick}
          maxReached={maxReached}
          onComplete={handleComplete}
        />
      )}

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
                <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Thank You!</h2>
                <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Your order is complete.</p>
                <p className="mt-4 text-[15px] text-[#6A6486] max-w-md mx-auto">
                  You will receive an email shortly with your new plan details and receipt.
                </p>
                <button type="button" onClick={closeAll} className="btn-primary mt-6">Close</button>
              </div>
            </SectionPanel>
          </ModalShell>
        </div>
      )}

      <ExitConfirmationDialog
        open={showExitConfirmation}
        onStay={() => setShowExitConfirmation(false)}
        onExit={closeAll}
      />
    </>
  );
}
