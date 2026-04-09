"use client";

import { useCallback, useState, useEffect } from "react";
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
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number; id?: string } | null>(null);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [locId, setLocId] = useState<string>("");
  const [ntdId, setNtdId] = useState<string>("");
  const [port, setPort] = useState<string>("");
  const [serviceRef, setServiceRef] = useState<string>("");
  const [wantsStaticIp, setWantsStaticIp] = useState<boolean>(true); // Default checked as per original design
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [billingSameAsService, setBillingSameAsService] = useState<boolean>(true);
  const [billingAddress, setBillingAddress] = useState<string>("");

  const [maxReached, setMaxReached] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("nbn_max_reached");
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });

  // Persist maxReached
  useEffect(() => {
    if (step > maxReached) {
      setMaxReached(step);
      sessionStorage.setItem("nbn_max_reached", step.toString());
    }
  }, [step, maxReached]);

  const closeAll = useCallback(() => {
    setShowStaticIpInfo(false);
    setStep(1);
    setMaxReached(1);
    sessionStorage.removeItem("nbn_max_reached");
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
    setAvailablePlans([]);
    setLocId("");
    setNtdId("");
    setPort("");
    setServiceRef("");
    setWantsStaticIp(true);
    setDateOfBirth("");
    setBillingSameAsService(true);
    setBillingAddress("");
    onClose();
  }, [onClose]);

  const handleCloseClick = useCallback(() => {
    setShowExitConfirmation(true);
  }, []);

  const handleComplete = useCallback(async () => {
    try {
      setApiLoading(true);
      setApiError(null);
      const res = await signup({
        type: "NBN",
        firstName,
        lastName,
        email,
        password,
        phone,
        serviceAddress,
        selectedPlan: selectedPlan || undefined,
        locId,
        ntdId,
        port,
        serviceRef,
        wantsStaticIp,
        dateOfBirth,
        billingAddress: billingSameAsService ? serviceAddress : billingAddress,
      });
      return { success: true, data: res };
    } catch (err: any) {
      setApiError(err?.message || "Signup failed");
      return { success: false, message: err?.message || "Signup failed" };
    } finally {
      setApiLoading(false);
    }
  }, [firstName, lastName, email, password, phone, serviceAddress, selectedPlan, locId, ntdId, port, serviceRef, wantsStaticIp, dateOfBirth, billingSameAsService, billingAddress]);

  const goNext = useCallback(() => {
    setStep((s: any) => Math.min(6, (s + 1)));
  }, []);

  const goBack = useCallback(() => {
    setStep((s: any) => Math.max(1, (s - 1)));
  }, []);

  const handleStepClick = useCallback((s: number) => {
    if (s <= maxReached && s !== step) {
      setStep(s);
    }
  }, [maxReached, step]);

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
            onAvailablePlans={setAvailablePlans}
            onLocId={setLocId}
            onNtdId={setNtdId}
            onPort={setPort}
            onServiceRef={setServiceRef}
            onStepClick={handleStepClick}
            maxReached={maxReached}
          />
        )}
        {step === 2 && (
          <SignupModal2
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            selectedPlan={selectedPlan}
            onPlanSelect={setSelectedPlan}
            availablePlans={availablePlans}
            onStepClick={handleStepClick}
            maxReached={maxReached}
          />
        )}
        {step === 3 && (
          <SignupModal3
            onNext={goNext}
            onBack={goBack}
            onClose={handleCloseClick}
            onOpenStaticIp={() => setShowStaticIpInfo(true)}
            wantsStaticIp={wantsStaticIp}
            onChangeWantsStaticIp={setWantsStaticIp}
            onStepClick={handleStepClick}
            maxReached={maxReached}
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
            dateOfBirth={dateOfBirth}
            billingSameAsService={billingSameAsService}
            billingAddress={billingAddress}
            onChangeFirstName={setFirstName}
            onChangeLastName={setLastName}
            onChangeEmail={setEmail}
            onChangePhone={setPhone}
            onChangeServiceAddress={setServiceAddress}
            onChangePassword={setPassword}
            onChangeDateOfBirth={setDateOfBirth}
            onChangeBillingSameAsService={setBillingSameAsService}
            onChangeBillingAddress={setBillingAddress}
            onStepClick={handleStepClick}
            maxReached={maxReached}
          />
        )}
        {step === 5 && <SignupModal5 onNext={goNext} onBack={goBack} onClose={handleCloseClick} onStepClick={handleStepClick} maxReached={maxReached} />}
        {step === 6 && (
          <SignupModal6
            onNext={() => setShowSuccess(true)}
            onBack={goBack}
            onClose={handleCloseClick}
            selectedPlan={selectedPlan}
            wantsStaticIp={wantsStaticIp}
            onStepClick={handleStepClick}
            maxReached={maxReached}
            onComplete={handleComplete}
            apiError={apiError}
            apiLoading={apiLoading}
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
