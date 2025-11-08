"use client";

import { useEffect, useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import Stepper from "@/components/shared/Stepper";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import FormField from "@/components/shared/FormField";
import { checkEmail } from "@/lib/services/auth";

export default function SignupModal4({
  onNext,
  onBack,
  onClose,
  firstName,
  lastName,
  email,
  phone,
  serviceAddress,
  password,
  onChangeFirstName,
  onChangeLastName,
  onChangeEmail,
  onChangePhone,
  onChangeServiceAddress,
  onChangePassword,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceAddress: string;
  password: string;
  onChangeFirstName: (v: string) => void;
  onChangeLastName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangeServiceAddress: (v: string) => void;
  onChangePassword: (v: string) => void;
}) {
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [billingSameAsService, setBillingSameAsService] = useState(true);
  const [billingAddress, setBillingAddress] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (!email || !isValidEmail(email)) {
      setEmailExists(false);
      setEmailError(null);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        setEmailChecking(true);
        setEmailError(null);
        const res = await checkEmail(email);
        setEmailExists(res.exists);
        if (res.exists) setEmailError(res.message);
      } catch (err: any) {
        setEmailError(err?.message || "Could not verify email");
      } finally {
        setEmailChecking(false);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [email]);

  const canProceed = Boolean(
    firstName && 
    lastName && 
    email && 
    isValidEmail(email) && 
    !emailExists && 
    phone && 
    serviceAddress && 
    password && 
    password.length >= 6 &&
    dateOfBirth &&
    (billingSameAsService || billingAddress)
  );

  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={4} />

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.5" /><path d="M20 20c0-4-3.6-6-8-6s-8 2-8 6" stroke="white" strokeWidth="1.5" /></svg>
          </div>
          <h2 className="modal-h1 mt-4">Customer Details</h2>
          <p className="modal-sub mt-1">Please provide your contact information</p>
        </div>

        <div className="card mx-auto mt-8 max-w-[860px] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="First Name"><input id="firstName" name="firstName" className="input w-full" value={firstName} onChange={(e) => onChangeFirstName(e.target.value)} /></FormField>
            <FormField label="Last Name"><input id="lastName" name="lastName" className="input w-full" value={lastName} onChange={(e) => onChangeLastName(e.target.value)} /></FormField>
          </div>
          <div className="mt-4">
            <FormField label="Email Address">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`input w-full ${emailExists || (email && !isValidEmail(email))
                    ? 'border-red-300 bg-red-50'
                    : email && isValidEmail(email) && !emailChecking
                      ? 'border-green-300 bg-green-50'
                      : ''
                  }`}
                value={email}
                onChange={(e) => onChangeEmail(e.target.value)}
              />
              {emailChecking && <p className="mt-1 text-xs text-gray-500">Checking availability...</p>}
              {email && !isValidEmail(email) && !emailChecking && (
                <p className="mt-1 text-xs text-red-600">Please enter a valid email address</p>
              )}
              {emailExists && (
                <p className="mt-1 text-xs text-red-600">{emailError || "Email already registered"}</p>
              )}
              {email && isValidEmail(email) && !emailExists && !emailChecking && (
                <p className="mt-1 text-xs text-green-600">Email is available</p>
              )}
            </FormField>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormField label="Contact Phone Number">
              <input id="phone" name="phone" type="tel" className="input w-full" value={phone} onChange={(e) => onChangePhone(e.target.value)} />
            </FormField>
            <FormField label="Date of Birth">
              <input 
                id="dateOfBirth" 
                name="dateOfBirth" 
                type="date" 
                className="input w-full" 
                value={dateOfBirth} 
                onChange={(e) => setDateOfBirth(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Service Address">
              <input id="serviceAddress" name="serviceAddress" autoComplete="street-address" className="input w-full" value={serviceAddress} onChange={(e) => onChangeServiceAddress(e.target.value)} />
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Password">
              <input id="password" name="password" type="password" className="input w-full" value={password} onChange={(e) => onChangePassword(e.target.value)} />
            </FormField>
          </div>

          {/* Billing Address Section */}
          <div className="mt-6 border-t border-[#E9E3F2] pt-6">
            <label className="flex items-center gap-3 text-[15px] font-semibold text-[#2E2745]">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--cl-brand)]"
                checked={billingSameAsService}
                onChange={(e) => setBillingSameAsService(e.target.checked)}
              />
              Billing address is the same as my service address.
            </label>

            {!billingSameAsService && (
              <div className="mt-4">
                <FormField label="Billing Address">
                  <input
                    id="billingAddress"
                    name="billingAddress"
                    autoComplete="street-address"
                    className="input w-full"
                    placeholder="Enter your billing address"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                  />
                </FormField>
              </div>
            )}
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} nextDisabled={!canProceed} />
    </ModalShell>
  );
}
