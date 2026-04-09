"use client";

import { useCallback, useState, useEffect } from "react";
import MVSignup1 from "./modals/MobileVoiceSignup1";
import MVSignup2 from "./modals/MobileVoiceSignup2";
import MVSignup3 from "./modals/MobileVoiceSignup3";
import MVSignup3NumberChoice from "./modals/MobileVoiceSignup3NumberChoice";
import MVSignup4 from "./modals/MobileVoiceSignup4";
import MVSignup5 from "./modals/MobileVoiceSignup5";
import MVSignup6 from "./modals/MobileVoiceSignup6";
import MVSignup7 from "./modals/MobileVoiceSignup7";
import { signup } from "@/lib/services/auth";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import ExitConfirmationDialog from "@/components/shared/ExitConfirmationDialog";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export default function MobileVoiceSignupController({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const order: Step[] = [1, 2, 3, 4, 5, 6, 7, 8];
  const [step, setStep] = useState<Step>(1);
  const [maxReached, setMaxReached] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("mbl_max_reached");
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });

  // Update maxReached whenever step increases
  useEffect(() => {
    if (step > maxReached) {
      setMaxReached(step);
      sessionStorage.setItem("mbl_max_reached", step.toString());
    }
  }, [step, maxReached]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  // Collected data across steps
  const [selectedPlan, setSelectedPlan] = useState<{ id?: string | number; name: string; price: number } | null>(null);
  const [mblSelectedNumber, setMblSelectedNumber] = useState<string>("");
  const [simType, setSimType] = useState<"ESIM" | "PHYSICAL">("ESIM");
  const [numberChoice, setNumberChoice] = useState<"keep" | "new" | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [mblKeepExistingNumber, setMblKeepExistingNumber] = useState(false);
  const [mblCurrentMobileNumber, setMblCurrentMobileNumber] = useState("");
  const [mblCurrentProvider, setMblCurrentProvider] = useState("");
  const [identity, setIdentity] = useState<any>(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [simNumber, setSimNumber] = useState<string>(""); // ICCID for physical SIM
  const [esimNotificationEmail, setEsimNotificationEmail] = useState<string>(""); // Email for eSIM notifications
  const canProceedIdentity = !!identity;

  const closeAll = useCallback(() => {
    setStep(1);
    setMaxReached(1);
    sessionStorage.removeItem("mbl_max_reached");
    setLoading(false);
    setError(null);
    setShowSuccess(false);
    setShowExitConfirmation(false);
    setSelectedPlan(null);
    setMblSelectedNumber("");
    setSimType("ESIM");
    setNumberChoice(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setDateOfBirth("");
    setPhone("");
    setPassword("");
    setBillingAddress("");
    setMblKeepExistingNumber(false);
    setMblCurrentMobileNumber("");
    setMblCurrentProvider("");
    setIdentity(null);
    setOtpVerified(false);
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
      const response = await signup({
        type: "MBL",
        firstName,
        lastName,
        email,
        password,
        phone,
        dateOfBirth,
        mblSelectedNumber: mblKeepExistingNumber ? mblCurrentMobileNumber : mblSelectedNumber,
        mblKeepExistingNumber,
        mblCurrentMobileNumber,
        mblCurrentProvider,
        identity,
        simType: simType === "ESIM" ? "eSim" : "physical",
        simNumber: simType === "PHYSICAL" ? simNumber : undefined, // Only include if physical SIM
        esimNotificationEmail: simType === "ESIM" ? (esimNotificationEmail || email) : undefined, // Default to account email if not provided
        billingAddress,
        selectedPlan: selectedPlan || undefined,
      });

      return response;
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Signup failed";
      setError(msg);
      throw e; // Re-throw to allow caller (MVSignup6) to handle failure
    } finally {
      setLoading(false);
    }
  }, [firstName, lastName, email, password, phone, dateOfBirth, mblSelectedNumber, mblKeepExistingNumber, mblCurrentMobileNumber, mblCurrentProvider, identity, simType, simNumber, esimNotificationEmail, billingAddress, selectedPlan]);

  const goNext = useCallback(() => {
    const idx = order.indexOf(step);
    let nextStep = order[Math.min(idx + 1, order.length - 1)];
    // Skip step 4 (Select New Number) if keeping existing number
    if (step === 3 && numberChoice === "keep" && nextStep === 4) {
      nextStep = 5;
    }
    setStep(nextStep);
  }, [step, numberChoice, order]);

  const goBack = useCallback(() => {
    const idx = order.indexOf(step);
    let prevStep = order[Math.max(idx - 1, 0)];
    // Skip step 4 (Select New Number) going back if keeping existing number
    if (step === 5 && numberChoice === "keep" && prevStep === 4) {
      prevStep = 3;
    }
    setStep(prevStep);
  }, [step, numberChoice, order]);

  const handleStepClick = useCallback((s: number) => {
    // Allow clicking on any step already reached
    if (s <= maxReached && s !== step) {
      let targetStep = s as Step;
      // Skip step 4 if keeping existing number
      if (targetStep === 4 && numberChoice === "keep") {
        targetStep = 3;
      }
      setStep(targetStep);
    }
  }, [maxReached, step, numberChoice]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90] grid place-items-center bg-black/55 p-4">
        {/* Step 1: Plan Selection */}
        {step === 1 && (
          <MVSignup1
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
          <MVSignup3
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            simType={simType}
            onChangeSimType={setSimType}
            onStepClick={handleStepClick}
            maxReached={maxReached}
          />
        )}

        {/* Step 3: Choose Your Number */}
        {step === 3 && (
          <MVSignup3NumberChoice
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            numberChoice={numberChoice}
            onChangeNumberChoice={(choice) => {
              setNumberChoice(choice);
              setMblKeepExistingNumber(choice === "keep");
            }}
            onStepClick={handleStepClick}
            maxReached={maxReached}
          />
        )}

        {/* Step 4: Select a New Number (only if "Get a new number" selected) */}
        {step === 4 && numberChoice === "new" && (
          <MVSignup2
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            selectedNumber={mblSelectedNumber}
            onChangeSelectedNumber={setMblSelectedNumber}
            onStepClick={handleStepClick}
            maxReached={maxReached}
          />
        )}

        {/* Step 5: Customer & Porting Details */}
        {step === 5 && (
          <MVSignup4
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            firstName={firstName}
            lastName={lastName}
            email={email}
            dateOfBirth={dateOfBirth}
            phone={phone}
            password={password}
            billingAddress={billingAddress}
            keepExisting={mblKeepExistingNumber}
            currentNumber={mblCurrentMobileNumber}
            currentProvider={mblCurrentProvider}
            mblSelectedNumber={mblSelectedNumber}
            simType={simType}
            identity={identity}
            otpVerified={otpVerified}
            simNumber={simNumber}
            esimNotificationEmail={esimNotificationEmail}
            onChangeFirstName={setFirstName}
            onChangeLastName={setLastName}
            onChangeEmail={setEmail}
            onChangeDob={setDateOfBirth}
            onChangePhone={setPhone}
            onChangePassword={setPassword}
            onChangeBillingAddress={setBillingAddress}
            onChangeKeepExisting={setMblKeepExistingNumber}
            onChangeCurrentNumber={setMblCurrentMobileNumber}
            onChangeCurrentProvider={setMblCurrentProvider}
            onOtpVerified={setOtpVerified}
            onChangeSimNumber={setSimNumber}
            onChangeEsimNotificationEmail={setEsimNotificationEmail}
            onStepClick={handleStepClick}
            maxReached={maxReached}
          />
        )}

        {/* Step 6: ID Verification */}
        {step === 6 && (
          <MVSignup5
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            onIdentityVerified={setIdentity}
            canProceed={canProceedIdentity}
            onStepClick={handleStepClick}
            maxReached={maxReached}
          />
        )}

        {/* Step 7: Payment & Agreement */}
        {step === 7 && (
          <MVSignup6
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            selectedPlan={selectedPlan}
            onPaymentSuccess={handleComplete}
            loading={loading}
            onStepClick={handleStepClick}
            maxReached={maxReached}
          />
        )}

        {/* Step 8: Confirmation */}
        {step === 8 && (
          <MVSignup7
            onComplete={() => { }} // Not used anymore, signup already completed
            onBack={goBack}
            onClose={closeAll}
            loading={false}
            error={error || undefined}
            selectedPlan={selectedPlan}
            onStepClick={handleStepClick}
            maxReached={maxReached}
          />
        )}

        {showSuccess && (
          <div className="fixed inset-0 z-[100] grid place-items-center bg-black/55 p-4">
            <ModalShell onClose={closeAll} size="default">
              <SectionPanel>
                <div className="text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
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
      </div>
      <ExitConfirmationDialog
        open={showExitConfirmation}
        onStay={() => setShowExitConfirmation(false)}
        onExit={closeAll}
      />
    </>
  );
}
