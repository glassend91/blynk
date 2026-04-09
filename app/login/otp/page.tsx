"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import AuthShell from "@/components/auth/AuthShell";

export default function OtpPage() {
  const router = useRouter();
  const refs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  function onInput(i: number) {
    return (e: React.FormEvent<HTMLInputElement>) => {
      const v = (e.target as HTMLInputElement).value;
      if (v && i < refs.length - 1) refs[i + 1].current?.focus();
    };
  }

  return (
    <AuthShell>
      {/* badge */}
      <div className="mx-auto grid h-[88px] w-[88px] place-items-center rounded-full bg-[#3F205F]">
        <svg width="40" height="48" viewBox="0 0 40 48" fill="none" aria-hidden>
          <rect
            x="9"
            y="4"
            width="22"
            height="33"
            rx="6"
            stroke="white"
            strokeWidth="3"
          />
          <circle cx="20" cy="32.5" r="3" fill="white" />
        </svg>
      </div>

      <div className="mt-6 text-center">
        <h1 className="text-[28px] font-extrabold leading-[34px] text-[#0A0A0A]">
          Enter Verification Code
        </h1>
        <p className="mt-2 text-[15px] text-[#6F6C90]">
          We sent a 6-digit code to +1 (***) ***-5678
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        {refs.map((r, i) => (
          <input
            key={i}
            ref={r}
            maxLength={1}
            onInput={onInput(i)}
            className="h-[60px] w-[60px] rounded-[12px] border border-[#E5E2EA] bg-[#F8F8FB] text-center text-[22px] font-bold outline-none focus:border-[#3F205F]"
          />
        ))}
      </div>

      <div className="mt-5 text-center">
        <div className="text-[14px] text-[#0A0A0A]">
          Didn't receive the code?
        </div>
        <button
          type="button"
          className="mt-1 text-[14px] font-medium text-[#3F205F] underline"
        >
          Resend Code
        </button>
      </div>

      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="mt-6 h-[50px] w-full rounded-[12px] bg-[#3F205F] text-[15px] font-semibold text-white"
      >
        Verify Code
      </button>
    </AuthShell>
  );
}
