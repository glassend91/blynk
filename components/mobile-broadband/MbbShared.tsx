"use client";

import React from "react";

/** Top help banner with Contact/Call buttons */
export function MbbHeader() {
  return (
    <div className="rounded-t-[24px] px-8 pt-8">
      <div className="flex items-center justify-between rounded-xl bg-[#F4EEF9] px-6 py-4">
        <div className="flex items-center gap-3 text-[14px] leading-6 text-[#4A4458]">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#3E1B60] text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 12a8 8 0 1 1 16 0" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M5 13v3a3 3 0 0 0 3 3h2v-8H8a3 3 0 0 0-3 3Zm14 0v3a3 3 0 0 1-3 3h-2v-8h2a3 3 0 0 1 3 3Z" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </span>
          <span>
            Having trouble or have a question? Our team is here to help.{" "}
            <strong>Call us on (02) 8123 4567</strong> or request a callback.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#3E1B60] px-4 py-2 text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
            Contact Us
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-[#3E1B60] px-4 py-2 text-[#3E1B60]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 8h4l2 3h6v7H6V8Z" stroke="#3E1B60" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Call Now
          </button>
        </div>
      </div>
    </div>
  );
}

/** Six-step stepper; progress auto-calculated */
export function MbbStepper({ active }: { active: number }) {
  const labels = ["Plan Selection","SIM Type","Customer Details","ID Check","Payment","Agreement"];
  const pct = Math.max(0, Math.min(100, ((active - 1) / (labels.length - 1)) * 100));

  return (
    <div className="px-8 pt-6">
      <ol className="mx-auto grid max-w-[980px] grid-cols-6 items-center gap-6 text-center">
        {labels.map((label, i) => (
          <li key={label} className="space-y-2">
            <div className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${i===active-1 ? "bg-[#3E1B60] text-white" : "bg-[#ECE7F2] text-[#6B6478]"}`}>{i+1}</div>
            <div className={`text-[14px] ${i===active-1 ? "text-[#3E1B60] font-semibold" : "text-[#6B6478]"}`}>{label}</div>
          </li>
        ))}
      </ol>
      <div className="mx-auto mt-4 h-2 w-full max-w-[980px] rounded-full bg-[#E7E4EC]">
        <div className="h-2 rounded-full bg-[#3E1B60]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Icon circle + title + subtitle (centered) */
export function SectionHead({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#3E1B60]">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6" stroke="white" strokeWidth="1.6"/></svg>
      </span>
      <h2 className="text-[32px] font-semibold leading-[40px] text-[#1B1332]">{title}</h2>
      <p className="mt-2 text-[14px] text-[#6B6478]">{subtitle}</p>
    </div>
  );
}

/** Footer back/next buttons */
export function FooterNav({
  onBack,
  onNext,
  primaryLabel = "Next",
  secondaryLabel = "Back",
}: {
  onBack?: () => void;
  onNext: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="mx-auto mt-8 flex max-w-[980px] items-center justify-between">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-lg border border-[#CFC6DC] bg-white px-5 py-3 text-[#6B6478]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6 9 12l6 6" stroke="#6B6478" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        {secondaryLabel}
      </button>
      <button
        onClick={onNext}
        className="inline-flex items-center gap-2 rounded-lg bg-[#3E1B60] px-6 py-3 text-white"
      >
        {primaryLabel}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m9 6 6 6-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}

/** Uniform form field */
export function FormField({
  label,
  placeholder,
  className = "",
  type = "text",
}: {
  label: string;
  placeholder: string;
  className?: string;
  type?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[14px] font-medium text-[#4A4458]">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-[44px] w-full rounded-[10px] border border-[#E1DAEE] bg-[#F8F6FC] px-3 text-[14px] text-[#1B1332] outline-none focus:border-[#3E1B60] focus:bg-white"
      />
    </label>
  );
}
