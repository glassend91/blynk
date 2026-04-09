"use client";

import { useState } from "react";
import type { PlanType } from "../types";

export default function TableHeader({
  query,
  onQuery,
  type,
  onType,
}: {
  query: string;
  onQuery: (v: string) => void;
  type: PlanType | "All Type";
  onType: (v: PlanType | "All Type") => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-4">
      {/* Search */}
      <div className="flex w-full max-w-[380px] items-center gap-3 rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3">
        <svg width="18" height="18" viewBox="0 0 20 21" fill="none">
          <path
            d="M9.6 18c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8Z"
            stroke="#292D32"
            strokeWidth="1.5"
          />
          <path
            d="m18.3 18.8-1.7-1.7"
            stroke="#292D32"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search plans..."
          className="w-full bg-transparent text-[14px] text-[#0A0A0A] placeholder-[#6F6C90] outline-none"
        />
      </div>

      {/* Type filter */}
      <TypeSelect value={type} onChange={onType} />
    </div>
  );
}

function TypeSelect({
  value,
  onChange,
}: {
  value: PlanType | "All Type";
  onChange: (v: PlanType | "All Type") => void;
}) {
  const [open, setOpen] = useState(false);
  const opts: Array<PlanType | "All Type"> = [
    "All Type",
    "NBN",
    "Business NBN",
    "Mobile",
    "Data Only",
    "Voice Only",
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-[48px] items-center justify-between rounded-[10px] border border-[#DFDBE3] bg-white px-4 text-left text-[14px] font-medium text-[#0A0A0A] hover:bg-[#F7F6FB] md:w-[220px]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{value}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[#6F6C90]"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-20 mt-2 w-full rounded-[10px] border border-[#DFDBE3] bg-white p-2 shadow-[0_10px_24px_rgba(17,24,39,0.06)]"
          role="listbox"
        >
          {opts.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={[
                "block w-full rounded-[8px] px-3 py-2 text-left text-[14px]",
                opt === value
                  ? "bg-[#19BF66] font-semibold text-white"
                  : "text-[#0A0A0A] hover:bg-[#F7F6FB]",
              ].join(" ")}
              role="option"
              aria-selected={opt === value}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
