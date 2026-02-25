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
  simNumber,
  esimNotificationEmail,
  onChangeFirstName,
  onChangeLastName,
  onChangeEmail,
  onChangePhone,
  onChangeDateOfBirth,
  onChangePassword,
  onChangeBillingAddress,
  onChangeServiceAddress,
  onChangeSimNumber,
  onChangeEsimNotificationEmail,
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
  dateOfBirth: string;
  password: string;
  billingAddress: string;
  serviceAddress: string;
  simType: "eSim" | "physical";
  identity: any;
  simNumber?: string;
  esimNotificationEmail?: string;
  onChangeFirstName: (v: string) => void;
  onChangeLastName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangeDateOfBirth: (v: string) => void;
  onChangePassword: (v: string) => void;
  onChangeBillingAddress: (v: string) => void;
  onChangeServiceAddress: (v: string) => void;
  onChangeSimNumber?: (v: string) => void;
  onChangeEsimNotificationEmail?: (v: string) => void;
  onStepClick?: (step: number) => void;
  maxReached?: number;
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
  const [simNumberError, setSimNumberError] = useState<string | null>(null);
  const [esimNotificationEmailError, setEsimNotificationEmailError] = useState<string | null>(null);
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

  const validate = (): boolean => {
    const fnErr = !firstName ? "First name is required" : !isValidName(firstName) ? "Enter a valid first name" : null;
    const lnErr = !lastName ? "Last name is required" : !isValidName(lastName) ? "Enter a valid last name" : null;
    const phErr = phone && !isValidPhone(phone) ? "Enter a valid phone number" : null;
    const dbErr = !dateOfBirth ? "Date of birth is required" : !isAdult(dateOfBirth) ? "You must be at least 18 years old" : null;
    const pwErr = !password ? "Password is required" : password.length < 6 ? "Password must be at least 6 characters" : null;
    const baErr = !billingAddress ? "Billing address is required" : null;
    const emErr = !email ? "Email is required" : !isValidEmail(email) ? "Please enter a valid email address" : emailExists ? (emailError || "Email already registered") : null;

    const simNumErr = simType === "physical" && (!simNumber || !simNumber.trim()) ? "SIM Card Number (ICCID) is required for physical SIM" : null;
    const esimEmailErr = simType === "eSim" && (!esimNotificationEmail || !esimNotificationEmail.trim() || !isValidEmail(esimNotificationEmail))
      ? "eSIM Notification Email is required and must be a valid email address" : null;

    setFirstNameError(fnErr);
    setLastNameError(lnErr);
    setPhoneError(phErr);
    setDobError(dbErr);
    setPasswordError(pwErr);
    setBillingAddressError(baErr);
    setEmailError(emErr);
    setSimNumberError(simNumErr);
    setEsimNotificationEmailError(esimEmailErr);

    return !fnErr && !lnErr && !phErr && !dbErr && !pwErr && !baErr && !emErr && !simNumErr && !esimEmailErr;
  };

  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6"><MbbStepper active={3} onStepClick={onStepClick} maxReached={maxReached} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="3.2" />
              <path d="M4 18c0-3 3.6-5 8-5s8 2 8 5" />
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Customer Details</h2>
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

          {(simType === "physical" || simType === "eSim") && (
            <div className="mt-6 border-t border-[#E7E4EC] pt-6">
              <h3 className="text-[16px] font-semibold text-[#2E2745] mb-4">
                {simType === "physical" ? "Physical SIM Details" : "eSIM Details"}
              </h3>

              {simType === "physical" && (
                <div>
                  <label className="mb-1 block text-sm text-[#6B6478]">
                    SIM Card Number (ICCID) <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={simNumber || ""}
                    onChange={(e) => {
                      if (onChangeSimNumber) onChangeSimNumber(e.target.value);
                      if (submitted) setSimNumberError(null);
                    }}
                    className={`h-11 w-full rounded-[10px] border px-3 focus:border-[#4F1C76] focus:outline-none ${simNumberError ? "border-red-300 bg-red-50" : "border-[#E7E4EC] bg-[#FBF9FF]"}`}
                    placeholder="Enter SIM Card Number (ICCID)"
                  />
                  {simNumberError && <p className="mt-1 text-xs text-red-600">{simNumberError}</p>}
                  <p className="mt-1 text-xs text-[#6F6C90]">
                    The ICCID is printed on the physical SIM card. This is required for physical SIM provisioning.
                  </p>
                </div>
              )}

              {simType === "eSim" && (
                <div>
                  <label className="mb-1 block text-sm text-[#6B6478]">
                    eSIM Notification Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={esimNotificationEmail || email || ""}
                    onChange={(e) => {
                      if (onChangeEsimNotificationEmail) onChangeEsimNotificationEmail(e.target.value);
                      if (submitted) setEsimNotificationEmailError(null);
                    }}
                    className={`h-11 w-full rounded-[10px] border px-3 focus:border-[#4F1C76] focus:outline-none ${esimNotificationEmailError ? "border-red-300 bg-red-50" : "border-[#E7E4EC] bg-[#FBF9FF]"}`}
                    placeholder="Enter email for eSIM notifications"
                  />
                  {esimNotificationEmailError && <p className="mt-1 text-xs text-red-600">{esimNotificationEmailError}</p>}
                  <p className="mt-1 text-xs text-[#6F6C90]">
                    This email will receive the eSIM activation QR code and instructions. Defaults to your account email but can be changed.
                  </p>
                </div>
              )}
            </div>
          )}
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
