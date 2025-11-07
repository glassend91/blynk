"use client";
import { useEffect, useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";
import { checkEmail, signup } from "@/lib/services/auth";

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

  // Handle account creation when all fields are filled
  useEffect(() => {
    const createAccountIfNeeded = async () => {
      if (
        firstName &&
        lastName &&
        email &&
        isValidEmail(email) &&
        !emailExists &&
        phone &&
        dateOfBirth &&
        password &&
        password.length >= 6 &&
        billingAddress
      ) {
        try {
          await signup({
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
          });
        } catch (signupErr: any) {
          console.error("Signup error:", signupErr);
          // Don't fail if user already exists, just continue
        }
      }
    };

    createAccountIfNeeded();
  }, [
    firstName,
    lastName,
    email,
    emailExists,
    phone,
    dateOfBirth,
    password,
    billingAddress,
    serviceAddress,
    identity,
    simType,
  ]);

  const canProceed = Boolean(
    firstName &&
    lastName &&
    email &&
    isValidEmail(email) &&
    !emailExists &&
    phone &&
    dateOfBirth &&
    password &&
    password.length >= 6 &&
    billingAddress
  );
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
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Customer Details</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Please provide your contact information</p>
        </div>

        <div className="mx-auto mt-8 max-w-[880px] rounded-[16px] border border-[#E7E4EC] bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-1 block text-sm text-[#6B6478]">First Name</label><input value={firstName} onChange={(e) => onChangeFirstName(e.target.value)} className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76] focus:outline-none" placeholder="Enter your First name" /></div>
            <div><label className="mb-1 block text-sm text-[#6B6478]">Last Name</label><input value={lastName} onChange={(e) => onChangeLastName(e.target.value)} className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76] focus:outline-none" placeholder="Enter your last name" /></div>
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
              <label className="mb-1 block text-sm text-[#6B6478]">Contact Phone Number</label>
              <input
                value={phone}
                onChange={(e) => onChangePhone(e.target.value)}
                className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76] focus:outline-none"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#6B6478]">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => onChangeDateOfBirth(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-[#6B6478]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => onChangePassword(e.target.value)}
                className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76] focus:outline-none"
                placeholder="Create a password (min 6 chars)"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm text-[#6B6478]">Billing Address</label>
            <input
              value={billingAddress}
              onChange={(e) => onChangeBillingAddress(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3 focus:border-[#4F1C76] focus:outline-none"
              placeholder="Enter your full billing address"
            />
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} nextDisabled={!canProceed} />
    </ModalShell>
  );
}
