"use client";
import { useEffect, useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";
import { checkEmail } from "@/lib/services/auth";

export default function MobileBroadbandSignup3({
  onNext,
  onBack,
  onClose,
  firstName,
  lastName,
  email,
  phone,
  dateOfBirth,
  password,
  billingAddress,
  serviceAddress,
  simType,
  identity,
  onChangeFirstName,
  onChangeLastName,
  onChangeEmail,
  onChangePhone,
  onChangeDateOfBirth,
  onChangePassword,
  onChangeBillingAddress,
  onChangeServiceAddress,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  password: string;
  billingAddress: string;
  serviceAddress: string;
  simType: "eSim" | "physical";
  identity: any;
  onChangeFirstName: (v: string) => void;
  onChangeLastName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangeDateOfBirth: (v: string) => void;
  onChangePassword: (v: string) => void;
  onChangeBillingAddress: (v: string) => void;
  onChangeServiceAddress: (v: string) => void;
}) {
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [billingAddressError, setBillingAddressError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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

  // User account will be created after payment success, not here
  // Removed automatic signup call - signup happens only after payment

  // Validate only on Next click (no live validation)
  const validate = (): boolean => {
    const fnErr = !firstName ? "First name is required" : !isValidName(firstName) ? "Enter a valid first name" : null;
    const lnErr = !lastName ? "Last name is required" : !isValidName(lastName) ? "Enter a valid last name" : null;
    const phErr = phone && !isValidPhone(phone) ? "Enter a valid phone number" : null; // Phone is now optional
    const dbErr = !dateOfBirth ? "Date of birth is required" : !isAdult(dateOfBirth) ? "You must be at least 18 years old" : null;
    const pwErr = !password ? "Password is required" : password.length < 6 ? "Password must be at least 6 characters" : null;
    const baErr = !billingAddress ? "Billing address is required" : null;
    const emErr = !email ? "Email is required" : !isValidEmail(email) ? "Please enter a valid email address" : emailExists ? (emailError || "Email already registered") : null;

    setFirstNameError(fnErr);
    setLastNameError(lnErr);
    setPhoneError(phErr);
    setDobError(dbErr);
    setPasswordError(pwErr);
    setBillingAddressError(baErr);
    setEmailError(emErr);

    return !fnErr && !lnErr && !phErr && !dbErr && !pwErr && !baErr && !emErr;
  };
  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6"><MbbStepper active={3} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M4 18c0-3 3.6-5 8-5s8 2 8 5" />
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Customer Detaials</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Please provide your contact information</p>
        </div>

        <div className="mx-auto mt-8 max-w-[880px] rounded-[16px] border border-[#E7E4EC] bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-[#6B6478]">First Name</label>
              <input
                value={firstName}
                onChange={(e) => onChangeFirstName(e.target.value)}
                className={`h-11 w-full rounded-[10px] border px-3 focus:border-[#4F1C76] focus:outline-none ${firstNameError ? "border-red-300 bg-red-50" : "border-[#E7E4EC] bg-[#FBF9FF]"}`}
                placeholder="Enter your first name"
              />
              {firstNameError && <p className="mt-1 text-xs text-red-600">{firstNameError}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#6B6478]">Last Name</label>
              <input
                value={lastName}
                onChange={(e) => onChangeLastName(e.target.value)}
                className={`h-11 w-full rounded-[10px] border px-3 focus:border-[#4F1C76] focus:outline-none ${lastNameError ? "border-red-300 bg-red-50" : "border-[#E7E4EC] bg-[#FBF9FF]"}`}
                placeholder="Enter your last name"
              />
              {lastNameError && <p className="mt-1 text-xs text-red-600">{lastNameError}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm text-[#6B6478]">Email Address</label>
              <input
                value={email}
                onChange={(e) => onChangeEmail(e.target.value)}
                type="email"
                className={`h-11 w-full rounded-[10px] border px-3 focus:border-[#4F1C76] ${emailExists || (email && !isValidEmail(email))
                  ? 'border-red-300 bg-red-50'
                  : email && isValidEmail(email) && !emailChecking
                    ? 'border-green-300 bg-green-50'
                    : 'border-[#E7E4EC] bg-[#FBF9FF]'
                  }`}
                placeholder="Enter your email"
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
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#6B6478]">Contact Phone Number <span className="text-[#6F6C90] font-normal">(Optional)</span></label>
              <input
                value={phone}
                onChange={(e) => onChangePhone(e.target.value)}
                className={`h-11 w-full rounded-[10px] border px-3 focus:border-[#4F1C76] focus:outline-none ${phoneError ? "border-red-300 bg-red-50" : "border-[#E7E4EC] bg-[#FBF9FF]"}`}
                placeholder="Enter your phone number (optional)"
              />
              {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#6B6478]">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => onChangeDateOfBirth(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={`h-11 w-full rounded-[10px] border px-3 focus:border-[#4F1C76] focus:outline-none ${dobError ? "border-red-300 bg-red-50" : "border-[#E7E4EC] bg-[#FBF9FF]"}`}
              />
              {dobError && <p className="mt-1 text-xs text-red-600">{dobError}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#6B6478]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => onChangePassword(e.target.value)}
                className={`h-11 w-full rounded-[10px] border px-3 focus:border-[#4F1C76] focus:outline-none ${passwordError ? "border-red-300 bg-red-50" : "border-[#E7E4EC] bg-[#FBF9FF]"}`}
                placeholder="Create a password (min 6 chars)"
              />
              {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm text-[#6B6478]">Billing Address</label>
            <input
              value={billingAddress}
              onChange={(e) => onChangeBillingAddress(e.target.value)}
              className={`h-11 w-full rounded-[10px] border px-3 focus:border-[#4F1C76] focus:outline-none ${billingAddressError ? "border-red-300 bg-red-50" : "border-[#E7E4EC] bg-[#FBF9FF]"}`}
              placeholder="Enter your full billing address"
            />
            {billingAddressError && <p className="mt-1 text-xs text-red-600">{billingAddressError}</p>}
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
