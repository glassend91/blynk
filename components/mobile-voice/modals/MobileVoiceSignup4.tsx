"use client";
import { useEffect, useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MVHeaderBanner from "../MVHeaderBanner";
import MVStepper from "../MVStepper";
import { checkEmail, sendOtp, resendOtp, verifyOtp, signup } from "@/lib/services/auth";

export default function MobileVoiceSignup4({ onNext, onBack, onClose, firstName, lastName, email, dateOfBirth, phone, password, keepExisting, currentNumber, currentProvider, mblSelectedNumber, simType, identity, onChangeFirstName, onChangeLastName, onChangeEmail, onChangeDob, onChangePhone, onChangePassword, onChangeKeepExisting, onChangeCurrentNumber, onChangeCurrentProvider }: {
  onNext: () => void; onBack: () => void; onClose: () => void;
  firstName: string; lastName: string; email: string; dateOfBirth: string; phone: string; password: string; keepExisting: boolean; currentNumber: string; currentProvider: string; mblSelectedNumber: string; simType: "ESIM" | "PHYSICAL"; identity: any;
  onChangeFirstName: (v: string) => void; onChangeLastName: (v: string) => void; onChangeEmail: (v: string) => void; onChangeDob: (v: string) => void; onChangePhone: (v: string) => void; onChangePassword: (v: string) => void; onChangeKeepExisting: (v: boolean) => void; onChangeCurrentNumber: (v: string) => void; onChangeCurrentProvider: (v: string) => void;
}) {
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

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
    // Validate all required fields
    if (!firstName || !lastName) {
      setOtpError("Please enter your first and last name");
      return;
    }
    if (!email || !isValidEmail(email)) {
      setOtpError("Please enter a valid email");
      return;
    }
    if (!password || password.length < 6) {
      setOtpError("Please enter a password (min 6 characters)");
      return;
    }
    if (emailExists) {
      setOtpError("This email is already registered");
      return;
    }

    try {
      setOtpSending(true);
      setOtpError(null);
      setOtpMessage(null);

      if (!otpSent) {
        // First time: Create user + Send OTP
        await signup({
          type: "MBL",
          firstName,
          lastName,
          email,
          password,
          phone,
          dateOfBirth,
          mblSelectedNumber,
          mblKeepExistingNumber: keepExisting,
          mblCurrentMobileNumber: currentNumber,
          mblCurrentProvider: currentProvider,
          identity,
          simType: simType === "ESIM" ? "eSim" : "physical",
        });

        // Then send OTP
        const response = await sendOtp(email);
        setOtpSent(true);
        setOtpMessage(response.message);

        // Start 2-minute cooldown
        setResendCooldown(120); // 2 minutes = 120 seconds
      } else {
        // Resend OTP only
        const response = await resendOtp(email);
        setOtpMessage(response.message);

        // Start 2-minute cooldown
        setResendCooldown(120); // 2 minutes = 120 seconds
      }
    } catch (err: any) {
      setOtpError(err?.message || "Failed to send OTP. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP code");
      return;
    }
    try {
      setOtpVerifying(true);
      setOtpError(null);
      const response = await verifyOtp(email, otpCode);
      if (response.verified) {
        setOtpVerified(true);
        setOtpMessage("Email verified successfully!");
      }
    } catch (err: any) {
      setOtpError(err?.message || "Invalid OTP code. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const canProceed = Boolean(
    firstName &&
    lastName &&
    email && isValidEmail(email) && !emailExists &&
    dateOfBirth &&
    phone &&
    password && password.length >= 6 &&
    (!keepExisting || (currentNumber && currentProvider)) &&
    otpVerified
  );
  return (
    <ModalShell onClose={onClose} size="wide">
      <MVHeaderBanner />
      <div className="mt-6"><MVStepper active={2} /></div>

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
              <input value={firstName} onChange={(e) => onChangeFirstName(e.target.value)} className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Enter your First name" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Last Name</label>
              <input value={lastName} onChange={(e) => onChangeLastName(e.target.value)} className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Enter your last name" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[12px] font-semibold text-[#3B3551]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => onChangeEmail(e.target.value)}
                className={`mt-2 w-full rounded-[10px] border px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20 ${emailExists || (email && !isValidEmail(email))
                  ? 'border-red-300 bg-red-50'
                  : email && isValidEmail(email) && !emailChecking
                    ? 'border-green-300 bg-green-50'
                    : 'border-[#DFDBE3]'
                  }`}
                placeholder="Enter your email address"
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
              <label className="text-[12px] font-semibold text-[#3B3551]">Date of Birth</label>
              <input value={dateOfBirth} onChange={(e) => onChangeDob(e.target.value)} className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="YYYY-MM-DD" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Phone Number</label>
              <input value={phone} onChange={(e) => onChangePhone(e.target.value)} className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Enter your phone number" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Password</label>
              <input type="password" value={password} onChange={(e) => onChangePassword(e.target.value)} className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Create a password (min 6 chars)" />
            </div>
          </div>

          <label className="mt-4 flex items-center gap-3 text-[14px] text-[#2E2745]">
            <input type="checkbox" checked={keepExisting} onChange={(e) => onChangeKeepExisting(e.target.checked)} className="h-4 w-4 accent-[#401B60]" />
            I want to keep my existing mobile number
          </label>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Current Mobile Number</label>
              <input value={currentNumber} onChange={(e) => onChangeCurrentNumber(e.target.value)} className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Enter your phone number" />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#3B3551]">Current Provider</label>
              <input value={currentProvider} onChange={(e) => onChangeCurrentProvider(e.target.value)} className="mt-2 w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 outline-none focus:ring-2 focus:ring-[#401B60]/20" placeholder="Current provider" />
            </div>
          </div>

          <div className="mt-4 rounded-[12px] border border-[#DFDBE3] bg-[#F9F8FB] p-4">
            <div className="text-[14px] font-semibold text-[#0A0A0A]">Verify Email Ownership</div>
            <p className="mt-1 text-[12px] text-[#8A84A3]">
              {otpSent
                ? "We've sent a one-time passcode (OTP) to your email. Enter it below to confirm ownership."
                : "Click 'Send OTP' to receive a verification code on your email."}
            </p>

            {otpMessage && (
              <p className={`mt-2 text-[12px] ${otpVerified ? 'text-green-600' : 'text-blue-600'}`}>
                {otpMessage}
              </p>
            )}
            {otpError && (
              <p className="mt-2 text-[12px] text-red-600">{otpError}</p>
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

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={
                  otpSending ||
                  !firstName ||
                  !lastName ||
                  !email ||
                  !isValidEmail(email) ||
                  emailExists ||
                  !password ||
                  password.length < 6 ||
                  otpVerified ||
                  resendCooldown > 0
                }
                className="h-[48px] rounded-[10px] border border-[#DFDBE3] bg-white px-4 text-[15px] font-semibold text-[#401B60] hover:bg-[#F4F3F7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {otpSending ? 'Sending...' :
                  resendCooldown > 0 ? `Resend OTP (${Math.floor(resendCooldown / 60)}:${(resendCooldown % 60).toString().padStart(2, '0')})` :
                    otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>

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
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} nextDisabled={!canProceed} />
    </ModalShell>
  );
}
