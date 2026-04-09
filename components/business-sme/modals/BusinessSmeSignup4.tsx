"use client";
import { useEffect, useState } from "react";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import { checkEmail } from "@/lib/services/auth";

export default function BusinessSmeSignup4({
  onNext,
  onBack,
  businessName,
  businessType,
  abn,
  acn,
  primaryFirstName,
  primaryLastName,
  primaryEmail,
  primaryPhone,
  password,
  onChangeBusinessName,
  onChangeBusinessType,
  onChangeAbn,
  onChangeAcn,
  onChangePrimaryFirstName,
  onChangePrimaryLastName,
  onChangePrimaryEmail,
  onChangePrimaryPhone,
  onChangePassword,
}: {
  onNext: () => void;
  onBack: () => void;
  businessName: string;
  businessType: string;
  abn: string;
  acn: string;
  primaryFirstName: string;
  primaryLastName: string;
  primaryEmail: string;
  primaryPhone: string;
  password: string;
  onChangeBusinessName: (v: string) => void;
  onChangeBusinessType: (v: string) => void;
  onChangeAbn: (v: string) => void;
  onChangeAcn: (v: string) => void;
  onChangePrimaryFirstName: (v: string) => void;
  onChangePrimaryLastName: (v: string) => void;
  onChangePrimaryEmail: (v: string) => void;
  onChangePrimaryPhone: (v: string) => void;
  onChangePassword: (v: string) => void;
}) {
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (!primaryEmail || !isValidEmail(primaryEmail)) {
      setEmailExists(false);
      setEmailError(null);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        setEmailChecking(true);
        setEmailError(null);
        const res = await checkEmail(primaryEmail);
        setEmailExists(res.exists);
        if (res.exists) setEmailError(res.message);
      } catch (err: any) {
        setEmailError(err?.message || "Could not verify email");
      } finally {
        setEmailChecking(false);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [primaryEmail]);

  const isValidABN = (value: string) => {
    const digits = value.replace(/\s/g, "");
    return digits.length === 11; // ABN is 11 digits
  };

  const isValidACN = (value: string) => {
    const digits = value.replace(/\s/g, "");
    return digits.length === 9; // ACN is 9 digits
  };

  // Require at least one of ABN or ACN
  const hasValidABNOrACN = (abn && isValidABN(abn)) || (acn && isValidACN(acn));

  const canProceed = Boolean(
    businessName &&
    hasValidABNOrACN &&
    primaryFirstName &&
    primaryLastName &&
    primaryEmail &&
    isValidEmail(primaryEmail) &&
    !emailExists &&
    password &&
    password.length >= 6,
  );
  return (
    <SectionPanel>
      <div className="text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
            <path d="M4 19.8c0-3.3 4-5.8 8-5.8s8 2.5 8 5.8" />
          </svg>
        </div>
        <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">
          Business Details
        </h2>
        <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">
          Please provide your business information
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-[880px] rounded-[16px] border border-[#E7E4EC] bg-white p-6 shadow-[0_24px_60px_rgba(64,27,118,0.08)]">
        <label className="mb-1 block text-sm text-[#6B6478]">
          Business Name
        </label>
        <input
          value={businessName}
          onChange={(e) => onChangeBusinessName(e.target.value)}
          className="mb-4 h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3"
          placeholder="Enter your business name"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-[#6B6478]">
              Business Type
            </label>
            <input
              value={businessType}
              onChange={(e) => onChangeBusinessType(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3"
              placeholder="e.g., Pty Ltd, Sole Trader"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-[#6B6478]">
              ABN (11 digits)
            </label>
            <input
              value={abn}
              onChange={(e) => onChangeAbn(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3"
              placeholder="Enter ABN"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#6B6478]">
              ACN (9 digits)
            </label>
            <input
              value={acn}
              onChange={(e) => onChangeAcn(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3"
              placeholder="Enter ACN"
            />
          </div>
        </div>
        <div className="mt-1 text-[11px] text-[#9A93B3]">
          Enter your ABN or ACN (at least one required)
        </div>

        <div className="mt-6 text-[14px] font-semibold text-[#2B1940]">
          Primary Contact
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-[#6B6478]">
              First Name
            </label>
            <input
              value={primaryFirstName}
              onChange={(e) => onChangePrimaryFirstName(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#6B6478]">
              Last Name
            </label>
            <input
              value={primaryLastName}
              onChange={(e) => onChangePrimaryLastName(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3"
              placeholder="Enter your last name"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm text-[#6B6478]">
            Business Email
          </label>
          <input
            value={primaryEmail}
            onChange={(e) => onChangePrimaryEmail(e.target.value)}
            type="email"
            className={`h-11 w-full rounded-[10px] border px-3 focus:border-[#4F1C76] ${
              emailExists || (primaryEmail && !isValidEmail(primaryEmail))
                ? "border-red-300 bg-red-50"
                : primaryEmail && isValidEmail(primaryEmail) && !emailChecking
                  ? "border-green-300 bg-green-50"
                  : "border-[#E7E4EC] bg-[#FBF9FF]"
            }`}
            placeholder="Enter business email address"
          />
          {emailChecking && (
            <p className="mt-1 text-xs text-gray-500">
              Checking availability...
            </p>
          )}
          {primaryEmail && !isValidEmail(primaryEmail) && !emailChecking && (
            <p className="mt-1 text-xs text-red-600">
              Please enter a valid email address
            </p>
          )}
          {emailExists && (
            <p className="mt-1 text-xs text-red-600">
              {emailError || "Email already registered"}
            </p>
          )}
          {primaryEmail &&
            isValidEmail(primaryEmail) &&
            !emailExists &&
            !emailChecking && (
              <p className="mt-1 text-xs text-green-600">Email is available</p>
            )}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-[#6B6478]">
              Business Phone
            </label>
            <input
              value={primaryPhone}
              onChange={(e) => onChangePrimaryPhone(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3"
              placeholder="Enter business phone number"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#6B6478]">
              Account Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => onChangePassword(e.target.value)}
              className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3"
              placeholder="Create a password (min 6 chars)"
            />
          </div>
        </div>
      </div>

      <BarActions onBack={onBack} onNext={onNext} nextDisabled={!canProceed} />
    </SectionPanel>
  );
}
