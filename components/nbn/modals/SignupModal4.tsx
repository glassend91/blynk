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
  dateOfBirth,
  billingSameAsService,
  billingAddress,
  onChangeDateOfBirth,
  onChangeBillingSameAsService,
  onChangeBillingAddress,
  onStepClick,
  maxReached,
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
  dateOfBirth: string;
  billingSameAsService: boolean;
  billingAddress: string;
  onChangeFirstName: (v: string) => void;
  onChangeLastName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangeServiceAddress: (v: string) => void;
  onChangePassword: (v: string) => void;
  onChangeDateOfBirth: (v: string) => void;
  onChangeBillingSameAsService: (v: boolean) => void;
  onChangeBillingAddress: (v: string) => void;
  onStepClick?: (step: number) => void;
  maxReached?: number;
}) {
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Validation error states
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serviceAddressError, setServiceAddressError] = useState<string | null>(null);
  const [billingAddressError, setBillingAddressError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidName = (value: string) => /^[a-zA-Z\s'-]{2,}$/.test(value.trim());

  const isValidPhone = (value: string) => {
    const digits = value.replace(/[^\d+]/g, "");
    return digits.length >= 8;
  };

  const getAge = (isoDate: string) => {
    if (!isoDate) return 0;
    const dob = new Date(isoDate);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    return age;
  };

  const isAdult = (isoDate: string) => getAge(isoDate) >= 18;

  // Validate function - runs on Next click
  const validate = (): boolean => {
    const fnErr = !firstName ? "First name is required" : !isValidName(firstName) ? "Enter a valid first name" : null;
    const lnErr = !lastName ? "Last name is required" : !isValidName(lastName) ? "Enter a valid last name" : null;
    const phErr = !phone ? "Phone number is required" : !isValidPhone(phone) ? "Enter a valid phone number" : null;
    const dbErr = !dateOfBirth ? "Date of birth is required" : !isAdult(dateOfBirth) ? "You must be at least 18 years old" : null;
    const pwErr = !password ? "Password is required" : password.length < 6 ? "Password must be at least 6 characters" : null;
    const saErr = !serviceAddress ? "Service address is required" : null;
    const baErr = !billingSameAsService && !billingAddress ? "Billing address is required" : null;
    const emErr = !email ? "Email is required" : !isValidEmail(email) ? "Please enter a valid email address" : emailExists ? (emailError || "Email already registered") : null;

    setFirstNameError(fnErr);
    setLastNameError(lnErr);
    setPhoneError(phErr);
    setDobError(dbErr);
    setPasswordError(pwErr);
    setServiceAddressError(saErr);
    setBillingAddressError(baErr);
    setEmailError(emErr);

    return !fnErr && !lnErr && !phErr && !dbErr && !pwErr && !saErr && !baErr && !emErr;
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
      <Stepper active={4} onStepClick={onStepClick} maxReached={maxReached} />

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
            <FormField label="First Name">
              <input
                id="firstName"
                name="firstName"
                className={`input w-full ${firstNameError ? "border-red-300 bg-red-50" : ""}`}
                value={firstName}
                onChange={(e) => {
                  onChangeFirstName(e.target.value);
                  if (submitted) setFirstNameError(null);
                }}
              />
              {firstNameError && <p className="mt-1 text-xs text-red-600">{firstNameError}</p>}
            </FormField>
            <FormField label="Last Name">
              <input
                id="lastName"
                name="lastName"
                className={`input w-full ${lastNameError ? "border-red-300 bg-red-50" : ""}`}
                value={lastName}
                onChange={(e) => {
                  onChangeLastName(e.target.value);
                  if (submitted) setLastNameError(null);
                }}
              />
              {lastNameError && <p className="mt-1 text-xs text-red-600">{lastNameError}</p>}
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Email Address">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`input w-full ${emailError || emailExists || (email && !isValidEmail(email))
                  ? 'border-red-300 bg-red-50'
                  : email && isValidEmail(email) && !emailChecking
                    ? 'border-green-300 bg-green-50'
                    : ''
                  }`}
                value={email}
                onChange={(e) => {
                  onChangeEmail(e.target.value);
                  if (submitted) setEmailError(null);
                }}
              />
              {emailChecking && <p className="mt-1 text-xs text-gray-500">Checking availability...</p>}
              {emailError && !emailChecking && (
                <p className="mt-1 text-xs text-red-600">{emailError}</p>
              )}
              {!emailError && email && !isValidEmail(email) && !emailChecking && (
                <p className="mt-1 text-xs text-red-600">Please enter a valid email address</p>
              )}
              {!emailError && emailExists && !emailChecking && (
                <p className="mt-1 text-xs text-red-600">{emailError || "Email already registered"}</p>
              )}
              {!emailError && email && isValidEmail(email) && !emailExists && !emailChecking && (
                <p className="mt-1 text-xs text-green-600">Email is available</p>
              )}
            </FormField>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormField label="Contact Phone Number">
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`input w-full ${phoneError ? "border-red-300 bg-red-50" : ""}`}
                value={phone}
                onChange={(e) => {
                  onChangePhone(e.target.value);
                  if (submitted) setPhoneError(null);
                }}
              />
              {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
            </FormField>
            <FormField label="Date of Birth">
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                className={`input w-full ${dobError ? "border-red-300 bg-red-50" : ""}`}
                value={dateOfBirth}
                onChange={(e) => {
                  onChangeDateOfBirth(e.target.value);
                  if (submitted) setDobError(null);
                }}
                max={new Date().toISOString().split('T')[0]}
              />
              {dobError && <p className="mt-1 text-xs text-red-600">{dobError}</p>}
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Service Address">
              <input
                id="serviceAddress"
                name="serviceAddress"
                autoComplete="street-address"
                className={`input w-full ${serviceAddressError ? "border-red-300 bg-red-50" : ""}`}
                value={serviceAddress}
                onChange={(e) => {
                  onChangeServiceAddress(e.target.value);
                  if (submitted) setServiceAddressError(null);
                }}
              />
              {serviceAddressError && <p className="mt-1 text-xs text-red-600">{serviceAddressError}</p>}
            </FormField>
          </div>
          <div className="mt-4">
            <FormField label="Password">
              <input
                id="password"
                name="password"
                type="password"
                className={`input w-full ${passwordError ? "border-red-300 bg-red-50" : ""}`}
                value={password}
                onChange={(e) => {
                  onChangePassword(e.target.value);
                  if (submitted) setPasswordError(null);
                }}
              />
              {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
            </FormField>
          </div>

          {/* Billing Address Section */}
          <div className="mt-6 border-t border-[#E9E3F2] pt-6">
            <label className="flex items-center gap-3 text-[15px] font-semibold text-[#2E2745]">
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--cl-brand)]"
                checked={billingSameAsService}
                onChange={(e) => {
                  onChangeBillingSameAsService(e.target.checked);
                  if (submitted) setBillingAddressError(null);
                }}
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
                    className={`input w-full ${billingAddressError ? "border-red-300 bg-red-50" : ""}`}
                    placeholder="Enter your billing address"
                    value={billingAddress}
                    onChange={(e) => {
                      onChangeBillingAddress(e.target.value);
                      if (submitted) setBillingAddressError(null);
                    }}
                  />
                  {billingAddressError && <p className="mt-1 text-xs text-red-600">{billingAddressError}</p>}
                </FormField>
              </div>
            )}
          </div>
        </div>
      </SectionPanel>

      <BarActions
        onBack={onBack}
        onNext={() => {
          setSubmitted(true);
          if (validate()) onNext();
        }}
        nextDisabled={false}
      />
    </ModalShell>
  );
}
