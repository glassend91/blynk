"use client";
import { useEffect, useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";
import { checkEmail, signup } from "@/lib/services/auth";
import apiClient from "@/lib/apiClient";

export default function MobileVoiceSignup4({
  onNext,
  onBack,
  onClose,
  firstName,
  lastName,
  email,
  dateOfBirth,
  phone,
  password,
  billingAddress,
  keepExisting,
  currentNumber,
  currentProvider,
  mblSelectedNumber,
  simType,
  identity,
  onChangeFirstName,
  onChangeLastName,
  onChangeEmail,
  onChangeDob,
  onChangePhone,
  onChangePassword,
  onChangeBillingAddress,
  onChangeKeepExisting,
  onChangeCurrentNumber,
  onChangeCurrentProvider,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  password: string;
  billingAddress: string;
  keepExisting: boolean;
  currentNumber: string;
  currentProvider: string;
  mblSelectedNumber: string;
  simType: "ESIM" | "PHYSICAL";
  identity: any;
  onChangeFirstName: (v: string) => void;
  onChangeLastName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangeDob: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangePassword: (v: string) => void;
  onChangeBillingAddress: (v: string) => void;
  onChangeKeepExisting: (v: boolean) => void;
  onChangeCurrentNumber: (v: string) => void;
  onChangeCurrentProvider: (v: string) => void;
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
  const [billingAddressError, setBillingAddressError] = useState<string | null>(null);
  const [currentNumberError, setCurrentNumberError] = useState<string | null>(null);
  const [currentProviderError, setCurrentProviderError] = useState<string | null>(null);

  // OTP states
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpMessage, setOtpMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

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
    const baErr = !billingAddress ? "Billing address is required" : null;
    const emErr = !email ? "Email is required" : !isValidEmail(email) ? "Please enter a valid email address" : emailExists ? (emailError || "Email already registered") : null;

    // Porting validation (only if keeping existing number)
    const cnErr = keepExisting && !currentNumber ? "Current mobile number is required for porting" : null;
    const cpErr = keepExisting && !currentProvider ? "Current provider is required for porting" : null;
    const otpErr = keepExisting && !otpVerified ? "Please verify number ownership with OTP" : null;

    setFirstNameError(fnErr);
    setLastNameError(lnErr);
    setPhoneError(phErr);
    setDobError(dbErr);
    setPasswordError(pwErr);
    setBillingAddressError(baErr);
    setEmailError(emErr);
    setCurrentNumberError(cnErr);
    setCurrentProviderError(cpErr);

    return !fnErr && !lnErr && !phErr && !dbErr && !pwErr && !baErr && !emErr && !cnErr && !cpErr && !otpErr;
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

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    // Validate required fields for porting
    if (!currentNumber) {
      setOtpError("Please enter your current mobile number");
      return;
    }
    if (!currentProvider) {
      setOtpError("Please enter your current provider");
      return;
    }

    try {
      setOtpSending(true);
      setOtpError(null);
      setOtpMessage(null);

      // Validate email is available
      if (!email || !isValidEmail(email)) {
        setOtpError("Please enter a valid email address");
        return;
      }

      // Use mobile API for porting OTP: POST /api/v1/mobile/send-otp
      // OTP will be sent to email (not SMS)
      const response = await apiClient.post("/v1/mobile/send-otp", {
        phoneNumber: currentNumber,
        provider: currentProvider,
        email: email, // Include email to send OTP via email
      });

      setOtpSent(true);
      setOtpMessage(response.data?.message || `OTP sent successfully to ${email}`);

      // Start 2-minute cooldown
      setResendCooldown(120); // 2 minutes = 120 seconds
    } catch (err: any) {
      setOtpError(err?.response?.data?.message || err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    await handleSendOtp();
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP code");
      return;
    }
    if (!currentNumber) {
      setOtpError("Current mobile number is required");
      return;
    }

    try {
      setOtpVerifying(true);
      setOtpError(null);

      // Use mobile API for porting OTP verification: POST /api/v1/mobile/verify-otp
      const response = await apiClient.post("/v1/mobile/verify-otp", {
        phoneNumber: currentNumber,
        otp: otpCode,
      });

      if (response.data?.verified || response.data?.success) {
        setOtpVerified(true);
        setOtpMessage("Number ownership verified successfully!");

        // Create user account after OTP verification
        try {
          await signup({
            type: "MBL",
            firstName,
            lastName,
            email,
            password,
            phone,
            dateOfBirth,
            mblSelectedNumber: keepExisting ? currentNumber : mblSelectedNumber,
            mblKeepExistingNumber: keepExisting,
            mblCurrentMobileNumber: currentNumber,
            mblCurrentProvider: currentProvider,
            identity,
            simType: simType === "ESIM" ? "eSim" : "physical",
            billingAddress,
          });
        } catch (signupErr: any) {
          console.error("Signup error:", signupErr);
          // Don't fail if user already exists, just continue
        }
      } else {
        setOtpError("Invalid OTP code. Please try again.");
      }
    } catch (err: any) {
      setOtpError(err?.response?.data?.message || err?.message || "Invalid OTP code. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  // Handle account creation for users who don't keep existing number
  useEffect(() => {
    const createAccountIfNeeded = async () => {
      // Only create account if not keeping existing number and all required fields are filled
      if (
        !keepExisting &&
        firstName &&
        lastName &&
        email &&
        isValidEmail(email) &&
        !emailExists &&
        dateOfBirth &&
        phone &&
        password &&
        password.length >= 6 &&
        billingAddress &&
        mblSelectedNumber
      ) {
        try {
          await signup({
            type: "MBL",
            firstName,
            lastName,
            email,
            password,
            phone,
            dateOfBirth,
            mblSelectedNumber,
            mblKeepExistingNumber: false,
            identity,
            simType: simType === "ESIM" ? "eSim" : "physical",
            billingAddress,
          });
        } catch (signupErr: any) {
          console.error("Signup error:", signupErr);
          // Don't fail if user already exists, just continue
        }
      }
    };

    createAccountIfNeeded();
  }, [
    keepExisting,
    firstName,
    lastName,
    email,
    emailExists,
    dateOfBirth,
    phone,
    password,
    billingAddress,
    mblSelectedNumber,
    identity,
    simType,
  ]);

  const canProceed = Boolean(
    firstName &&
    lastName &&
    email && isValidEmail(email) && !emailExists &&
    dateOfBirth &&
    phone &&
    password && password.length >= 6 &&
    billingAddress &&
    (!keepExisting || (currentNumber && currentProvider && otpVerified)) &&
    (keepExisting || mblSelectedNumber)
  );

  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6"><MVStepper active={5} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
            {/* user */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.5" />
              <path d="M20 20c0-4-3.6-6-8-6s-8 2-8 6" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
            Customer Details & Porting
          </h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Please provide your details and porting information</p>
        </div>

        <div className="mx-auto mt-8 max-w-[760px] rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_40px_60px_rgba(0,0,0,0.06)]">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">First Name</label>
              <input
                value={firstName}
                onChange={(e) => {
                  onChangeFirstName(e.target.value);
                  if (submitted) setFirstNameError(null);
                }}
                className={`mt-2 w-full rounded-[10px] border px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20 ${firstNameError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
                placeholder="Enter your First name"
              />
              {firstNameError && <p className="mt-1 text-xs text-red-600">{firstNameError}</p>}
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Last Name</label>
              <input
                value={lastName}
                onChange={(e) => {
                  onChangeLastName(e.target.value);
                  if (submitted) setLastNameError(null);
                }}
                className={`mt-2 w-full rounded-[10px] border px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20 ${lastNameError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
                placeholder="Enter your last name"
              />
              {lastNameError && <p className="mt-1 text-xs text-red-600">{lastNameError}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="text-[12px] font-semibold text-[#3B3551]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  onChangeEmail(e.target.value);
                  if (submitted) setEmailError(null);
                }}
                className={`mt-2 w-full rounded-[10px] border px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20 ${emailError || emailExists || (email && !isValidEmail(email))
                  ? 'border-red-300 bg-red-50'
                  : email && isValidEmail(email) && !emailChecking
                    ? 'border-green-300 bg-green-50'
                    : 'border-[#DFDBE3]'
                  }`}
                placeholder="Enter your email address"
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
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => {
                  onChangeDob(e.target.value);
                  if (submitted) setDobError(null);
                }}
                max={new Date().toISOString().split('T')[0]}
                className={`mt-2 w-full rounded-[10px] border px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20 ${dobError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
              />
              {dobError && <p className="mt-1 text-xs text-red-600">{dobError}</p>}
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Phone Number</label>
              <input
                value={phone}
                onChange={(e) => {
                  onChangePhone(e.target.value);
                  if (submitted) setPhoneError(null);
                }}
                className={`mt-2 w-full rounded-[10px] border px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20 ${phoneError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
                placeholder="Enter your phone number"
              />
              {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  onChangePassword(e.target.value);
                  if (submitted) setPasswordError(null);
                }}
                className={`mt-2 w-full rounded-[10px] border px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20 ${passwordError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
                placeholder="Create a password (min 6 chars)"
              />
              {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="text-[12px] font-semibold text-[#3B3551]">Billing Address</label>
              <input
                value={billingAddress}
                onChange={(e) => {
                  onChangeBillingAddress(e.target.value);
                  if (submitted) setBillingAddressError(null);
                }}
                className={`mt-2 w-full rounded-[10px] border px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20 ${billingAddressError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
                placeholder="Enter your full billing address"
              />
              {billingAddressError && <p className="mt-1 text-xs text-red-600">{billingAddressError}</p>}
            </div>
          </div>

          {/* Conditional Porting Section - Only show if keeping existing number */}
          {keepExisting && (
            <>
              <div className="mt-6 border-t border-[#E9E3F2] pt-6">
                <h3 className="text-[16px] font-semibold text-[#2E2745] mb-4">Porting Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] font-semibold text-[#3B3551]">Current Mobile Number</label>
                    <input
                      value={currentNumber}
                      onChange={(e) => {
                        onChangeCurrentNumber(e.target.value);
                        if (submitted) setCurrentNumberError(null);
                      }}
                      className={`mt-2 w-full rounded-[10px] border px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20 ${currentNumberError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
                      placeholder="Enter your current mobile number"
                    />
                    {currentNumberError && <p className="mt-1 text-xs text-red-600">{currentNumberError}</p>}
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-[#3B3551]">Current Provider</label>
                    <input
                      value={currentProvider}
                      onChange={(e) => {
                        onChangeCurrentProvider(e.target.value);
                        if (submitted) setCurrentProviderError(null);
                      }}
                      className={`mt-2 w-full rounded-[10px] border px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20 ${currentProviderError ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"}`}
                      placeholder="Enter your current provider name"
                    />
                    {currentProviderError && <p className="mt-1 text-xs text-red-600">{currentProviderError}</p>}
                  </div>
                </div>
              </div>

              {/* OTP Verification Block - Only for porting */}
              <div className="mt-6 rounded-[12px] border border-[#DFDBE3] bg-[#F9F8FB] p-4">
                <div className="text-[14px] font-semibold text-[#0A0A0A]">Verify Number Ownership</div>
                <p className="mt-1 text-[12px] text-[#8A84A3]">
                  {otpSent
                    ? `We've sent a one-time passcode (OTP) to your email address (${email}). Enter it below to verify ownership.`
                    : "Click 'Send OTP' to receive a verification code via email for porting."}
                </p>

                {otpMessage && (
                  <p className={`mt-2 text-[12px] ${otpVerified ? 'text-green-600' : 'text-blue-600'}`}>
                    {otpMessage}
                  </p>
                )}
                {otpError && (
                  <p className="mt-2 text-[12px] text-red-600">{otpError}</p>
                )}
                {submitted && keepExisting && !otpVerified && (
                  <p className="mt-2 text-[12px] text-red-600">Please verify number ownership with OTP</p>
                )}

                <div className="mt-3 flex flex-wrap items-end gap-3">
                  <div className="grow">
                    <label className="mb-2 block text-[12px] font-semibold text-[#3B3551]">OTP Code</label>
                    <input
                      inputMode="numeric"
                      placeholder="6-digit code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      disabled={!otpSent || otpVerified}
                      className={`w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[16px] tracking-[4px] outline-none focus:ring-2 focus:ring-[#401B60]/20 ${(!otpSent || otpVerified) ? 'bg-gray-100 cursor-not-allowed' : ''
                        } ${otpVerified ? 'border-green-500' : ''}`}
                    />
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpSending || !currentNumber || !currentProvider}
                      className="h-[48px] rounded-[10px] border border-[#DFDBE3] bg-white px-4 text-[15px] font-semibold text-[#401B60] hover:bg-[#F4F3F7] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {otpSending ? "Sending..." : "Send OTP"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={otpSending || resendCooldown > 0}
                      className="h-[48px] rounded-[10px] border border-[#DFDBE3] bg-white px-4 text-[15px] font-semibold text-[#401B60] hover:bg-[#F4F3F7] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {otpSending
                        ? "Sending..."
                        : resendCooldown > 0
                          ? `Resend OTP (${Math.floor(resendCooldown / 60)}:${(resendCooldown % 60).toString().padStart(2, "0")})`
                          : "Resend OTP"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={!otpSent || otpVerifying || otpCode.length !== 6 || otpVerified}
                    className="h-[48px] rounded-[10px] bg-[#401B60] px-5 text-[15px] font-semibold text-white hover:bg-[#401B60]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {otpVerifying ? 'Verifying...' : otpVerified ? 'Verified ✓' : 'Verify'}
                  </button>
                </div>
              </div>
            </>
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
