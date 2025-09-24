"use client";

import { useState } from "react";

export default function ContactUsForm({
  dark = false,
  onClose,
}: {
  dark?: boolean;
  onClose?: () => void;
}) {
  const [method, setMethod] = useState<"email" | "phone">("email");

  return (
    <section
      className={`w-full ${dark ? "bg-[#190A2F]" : "bg-transparent"} ${onClose ? "relative" : ""
        }`}
    >
      <form
        className="relative mx-auto w-[661px] rounded-[30px] bg-white px-[30px] py-[50px] shadow-[0_10px_40px_rgba(0,0,0,0.04)]"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#F44336] hover:bg-[#FFD6D6] transition"
            aria-label="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {/* Heading */}
        <h2
          className={`text-center text-[32px] font-bold ${dark ? "text-white" : "text-black"
            }`}
        >
          Get in Touch
        </h2>

        {/* Two-column fields */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Full Name">
            <input
              required
              type="text"
              placeholder="Enter your name"
              className="h-[48px] w-full rounded-[8px] border border-[#DFDBE3] bg-[#FDFAFF] px-[14px] text-[14px] text-[#6F6C90] outline-[#401B60]"
            />
          </Field>

          <Field label="Email Address">
            <input
              required
              type="email"
              placeholder="Enter your email"
              className="h-[48px] w-full rounded-[8px] border border-[#DFDBE3] bg-[#FDFAFF] px-[14px] text-[14px] text-[#6F6C90] outline-[#401B60]"
            />
          </Field>

          <Field label="Phone Number">
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="h-[48px] w-full rounded-[8px] border border-[#DFDBE3] bg-[#FDFAFF] px-[14px] text-[14px] text-[#6F6C90] outline-[#401B60]"
            />
          </Field>

          <Field label="Subject">
            <input
              required
              type="text"
              placeholder="How can we help you?"
              className="h-[48px] w-full rounded-[8px] border border-[#DFDBE3] bg-[#FDFAFF] px-[14px] text-[14px] text-[#6F6C90] outline-[#401B60]"
            />
          </Field>
        </div>

        {/* Message */}
        <div className="mt-6">
          <label className="text-[14px] font-semibold text-black">Message</label>
          <textarea
            required
            placeholder="Write your message..."
            className="mt-[9px] h-[114px] w-full rounded-[8px] border border-[#DFDBE3] bg-[#FDFAFF] p-[14px] text-[14px] text-[#6F6C90] outline-[#401B60]"
          />
        </div>

        {/* Preferred Contact Method */}
        <div className="mt-6">
          <div className="text-[14px] font-semibold text-black">
            Preferred Contact Method
          </div>
          <div className="mt-4 flex items-start gap-[22px]">
            <label className="inline-flex cursor-pointer items-center gap-[5px]">
              <span
                className="grid h-[13px] w-[13px] place-items-center rounded-full border-[0.5px] border-[#401B60]"
                aria-hidden
              >
                <span className="h-[7px] w-[7px] rounded-full bg-[#401B60]" />
              </span>
              <input
                type="radio"
                name="contactMethod"
                value="email"
                className="sr-only"
                checked={method === "email"}
                onChange={() => setMethod("email")}
              />
              <span className="text-[14px] text-black">Email</span>
            </label>

            <label className="inline-flex cursor-pointer items-center gap-[5px]">
              <span className="h-[13px] w-[13px] rounded-full border-[0.5px] border-[#6F6C90]" aria-hidden />
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                className="sr-only"
                checked={method === "phone"}
                onChange={() => setMethod("phone")}
              />
              <span className="text-[14px] text-[#6F6C90]">Phone</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#401B60] px-4 py-[14px] text-[18px] font-semibold text-white hover:bg-[#5E2E89] transition"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
          Send Message
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-[9px]">
      <label className="text-[14px] font-semibold text-black">{label}</label>
      {children}
    </div>
  );
}
