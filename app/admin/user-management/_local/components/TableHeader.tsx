"use client";

import { allStatuses, Role, Status } from "../data";
import { useState, useEffect, useRef } from "react";

type Props = {
  query: string;
  onQuery: (v: string) => void;
  role: Role | "All Roles";
  onRole: (v: Role | "All Roles") => void;
  status: Status | "All Status";
  onStatus: (v: Status | "All Status") => void;
  onInvite?: () => void;
  availableRoles: Role[];
  isCustomerOnly: boolean;
};

export function Select({
  label,
  value,
  onChange,
  options,
  className = "",
  openUp = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
  openUp?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-[48px] items-center justify-between rounded-[10px] border border-[#DFDBE3] bg-white px-4 text-left text-[14px] font-medium text-[#0A0A0A] hover:bg-[#F7F6FB] ${className || "md:w-[260px]"}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{label}</span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className={`text-[#6F6C90] transition-transform ${open && openUp ? "rotate-180" : ""}`}
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
          className={`absolute z-20 w-full rounded-[10px] border border-[#DFDBE3] bg-white p-2 shadow-[0_10px_24px_rgba(17,24,39,0.06)] ${
            openUp ? "bottom-full mb-2" : "top-full mt-2"
          }`}
          role="listbox"
        >
          {options.map((opt) => (
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

export default function TableHeader({
  query,
  onQuery,
  role,
  onRole,
  status,
  onStatus,
  onInvite,
  availableRoles,
  isCustomerOnly,
}: Props) {
  // Combine "All Roles" with available roles for the dropdown
  const roleOptions: Array<Role | "All Roles"> = [
    "All Roles",
    ...availableRoles,
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-1 flex-wrap items-center gap-4">
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
            placeholder="Search users..."
            className="w-full bg-transparent text-[14px] text-[#0A0A0A] placeholder-[#6F6C90] outline-none"
          />
        </div>

        {!isCustomerOnly && (
          <Select
            label={role === "All Roles" ? "Filter by role" : role}
            value={role}
            onChange={(v) => onRole(v as Role | "All Roles")}
            options={roleOptions}
          />
        )}

        <Select
          label={status === "All Status" ? "Filter by status" : status}
          value={status}
          onChange={(v) => onStatus(v as Status | "All Status")}
          options={allStatuses}
        />
      </div>

      {onInvite && (
        <button
          onClick={onInvite}
          className="h-[44px] rounded-[8px] bg-[#401B60] px-5 text-[14px] font-semibold text-white hover:opacity-95"
        >
          Add User
        </button>
      )}
    </div>
  );
}
