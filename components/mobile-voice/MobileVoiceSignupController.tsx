"use client";

import { useCallback, useState } from "react";
import MVSignup1 from "./modals/MobileVoiceSignup1";
import MVSignup2 from "./modals/MobileVoiceSignup2";
import MVSignup3 from "./modals/MobileVoiceSignup3";
import MVSignup4 from "./modals/MobileVoiceSignup4";
import MVSignup5 from "./modals/MobileVoiceSignup5"; // ← NEW
import MVSignup6 from "./modals/MobileVoiceSignup6";
import MVSignup7 from "./modals/MobileVoiceSignup7";
import { signup } from "@/lib/services/auth";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Collected data across steps
  const [mblSelectedNumber, setMblSelectedNumber] = useState<string>("0412 345 678");
  const [simType, setSimType] = useState<"ESIM" | "PHYSICAL">("ESIM");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [mblKeepExistingNumber, setMblKeepExistingNumber] = useState(false);
  const [mblCurrentMobileNumber, setMblCurrentMobileNumber] = useState("");
  const [mblCurrentProvider, setMblCurrentProvider] = useState("");
  const [identity, setIdentity] = useState<any>(null);
  const canProceedIdentity = !!identity;

  const closeAll = useCallback(() => {
    setStep(1);
    setLoading(false);
    setError(null);
    setShowSuccess(false);
    setMblSelectedNumber("0412 345 678");
    setSimType("ESIM");
    setFirstName("");
    setLastName("");
    setEmail("");
    setDateOfBirth("");
    setPhone("");
    setPassword("");
    setMblKeepExistingNumber(false);
    setMblCurrentMobileNumber("");
    setMblCurrentProvider("");
    setIdentity(null);
    onClose();
  }, [onClose]);

  const goNext = useCallback(() => {
    const idx = order.indexOf(step);
    let nextStep = order[Math.min(idx + 1, order.length - 1)];
    // Skip number selection (step 2) if keeping existing number
    if (step === 1 && mblKeepExistingNumber && nextStep === 2) {
      nextStep = 3;
    }
    setStep(nextStep);
  }, [step, mblKeepExistingNumber]);

  const goBack = useCallback(() => {
    const idx = order.indexOf(step);
    let prevStep = order[Math.max(idx - 1, 0)];
    // Skip number selection (step 2) going back if keeping existing number
    if (step === 3 && mblKeepExistingNumber && prevStep === 2) {
      prevStep = 1;
    }
    setStep(prevStep);
  }, [step, mblKeepExistingNumber]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/55 p-4">
      {/* Step 1: Plan Selection */}
      {step === 1 && <MVSignup1 onNext={goNext} onBack={closeAll} onClose={closeAll} />}

      {/* Step 2: Number Selection (only if NOT keeping existing) */}
      {step === 2 && (
        <MVSignup2
          onNext={goNext}
          onBack={goBack}
          onClose={closeAll}
          selectedNumber={mblSelectedNumber}
          onChangeSelectedNumber={setMblSelectedNumber}
        />
      )}

      {/* Step 3: SIM Type */}
      {step === 3 && (
        <MVSignup3
          onNext={goNext}
          onBack={goBack}
          onClose={closeAll}
          simType={simType}
          onChangeSimType={setSimType}
        />
      )}

      {/* Step 4: Identity Verification */}
      {step === 4 && (
        <MVSignup5
          onNext={goNext}
          onBack={goBack}
          onClose={closeAll}
          onIdentityVerified={setIdentity}
          canProceed={canProceedIdentity}
        />
      )}

      {/* Step 5: Customer Details & Porting + OTP (creates user, asks about keeping number) */}
      {step === 5 && (
        <MVSignup4
          onNext={goNext}
          onBack={goBack}
          onClose={closeAll}
          firstName={firstName}
          lastName={lastName}
          email={email}
          dateOfBirth={dateOfBirth}
          phone={phone}
          password={password}
          keepExisting={mblKeepExistingNumber}
          currentNumber={mblCurrentMobileNumber}
          currentProvider={mblCurrentProvider}
          mblSelectedNumber={mblSelectedNumber}
          simType={simType}
          identity={identity}
          onChangeFirstName={setFirstName}
          onChangeLastName={setLastName}
          onChangeEmail={setEmail}
          onChangeDob={setDateOfBirth}
          onChangePhone={setPhone}
          onChangePassword={setPassword}
          onChangeKeepExisting={setMblKeepExistingNumber}
          onChangeCurrentNumber={setMblCurrentMobileNumber}
          onChangeCurrentProvider={setMblCurrentProvider}
        />
      )}

      {/* Step 6: Payment */}
      {step === 6 && <MVSignup6 onNext={goNext} onBack={goBack} onClose={closeAll} />}

      {/* Step 7: Agreement & Submit */}
      {step === 7 && (
        <MVSignup7
          onComplete={async () => {
            try {
              setLoading(true);
              setError(null);
              // User already created in step 5, just show success
              setShowSuccess(true);
            } catch (e: any) {
              setError(e?.message || "Signup failed");
            } finally {
              setLoading(false);
            }
          }}
          onBack={goBack}
          onClose={closeAll}
          loading={loading}
          error={error || undefined}
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
                <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Signup complete</h2>
                <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Thanks! We've received your details.</p>
                <button type="button" onClick={closeAll} className="btn-primary mt-6">Close</button>
              </div>
            </SectionPanel>
          </ModalShell>
        </div>
      )}
    </div>
  );
}
