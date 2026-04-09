"use client";

import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";

export default function TwoFactorPage() {
  const router = useRouter();
  return (
    <AuthShell>
      {/* badge */}
      <div className="mx-auto grid h-[88px] w-[88px] place-items-center rounded-full bg-[#3F205F]">
        {/* shield/check */}
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden>
          <path
            d="M19.5 5.5 10.1 8.9c-2.1.8-3.6 3.1-3.6 5.4v14.2c0 2.1 1.3 4.6 2.9 5.8l7.3 5.4c2.4 1.8 6.4 1.8 8.8 0l7.3-5.4c1.6-1.2 2.9-3.7 2.9-5.8V14.3c0-2.3-1.5-4.6-3.6-5.4L24.9 5.5c-1.4-.5-3.7-.5-5.4 0Z"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m16.8 22.8 3 3 7.4-7.4"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mt-6 text-center">
        <h1 className="text-[28px] font-extrabold leading-[34px] text-[#0A0A0A]">
          Two-Factor Authentication
        </h1>
        <p className="mt-2 text-[15px] text-[#6F6C90]">
          Choose how you'd like to receive your verification code
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {/* Email option */}
        <button
          type="button"
          className="flex w-full items-center gap-4 rounded-[12px] bg-[#F4F3F7] px-4 py-4 text-left"
        >
          <span className="grid h-[44px] w-[44px] place-items-center rounded-full bg-[#3F205F]">
            {/* message bubble */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M21 8.5c0-3-2-5-6-5H9C5 3.5 3 5.5 3 8.5v5c0 5 2 6 6 6h.5c.3 0 .6.2.8.5l1.5 2c.7.9 1.7.9 2.4 0l1.5-2c.19-.26.49-.5.8-.5H15c4 0 6-2 6-6v-1"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <div className="text-[15px] font-semibold text-[#0A0A0A]">
              Email Verification
            </div>
            <div className="text-[14px] text-[#6F6C90]">
              Send code to de***@example.com
            </div>
          </div>
        </button>

        {/* SMS option */}
        <button
          type="button"
          onClick={() => router.push("/login/otp")}
          className="flex w-full items-center gap-4 rounded-[12px] bg-[#F4F3F7] px-4 py-4 text-left"
        >
          <span className="grid h-[44px] w-[44px] place-items-center rounded-full bg-[#3F205F]">
            {/* phone */}
            <svg
              width="20"
              height="24"
              viewBox="0 0 20 24"
              fill="none"
              aria-hidden
            >
              <rect
                x="4"
                y="2"
                width="12"
                height="20"
                rx="3"
                stroke="white"
                strokeWidth="1.8"
              />
              <circle cx="10" cy="18" r="1.5" fill="white" />
            </svg>
          </span>
          <div>
            <div className="text-[15px] font-semibold text-[#0A0A0A]">
              SMS Verification
            </div>
            <div className="text-[14px] text-[#6F6C90]">
              Send code to +1 (***) ***-5678
            </div>
          </div>
        </button>
      </div>

      <button
        type="button"
        onClick={() => router.push("/login")}
        className="mt-6 h-[50px] w-full rounded-[12px] bg-[#3F205F] text-[15px] font-semibold text-white"
      >
        Back to Login
      </button>
    </AuthShell>
  );
}
