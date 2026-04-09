"use client";

import { useRouter } from "next/navigation";

type IconKey = "user" | "box" | "profile" | "sim";

const I: any = {
  user: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
        stroke="#401B60"
        strokeWidth="1.8"
      />
      <circle cx="9" cy="7" r="4" stroke="#401B60" strokeWidth="1.8" />
    </svg>
  ),
  box: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="14"
        rx="2"
        stroke="#401B60"
        strokeWidth="1.8"
      />
      <path
        d="M7 8h10M7 12h6"
        stroke="#401B60"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),
  profile: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.2" stroke="#401B60" strokeWidth="1.8" />
      <path
        d="M4 20c1.6-3.6 5-5.6 8-5.6s6.4 2 8 5.6"
        stroke="#401B60"
        strokeWidth="1.8"
      />
    </svg>
  ),
  sim: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x="7"
        y="3"
        width="10"
        height="18"
        rx="2"
        stroke="#401B60"
        strokeWidth="1.8"
      />
      <rect
        x="9"
        y="9"
        width="6"
        height="7"
        rx="1.2"
        stroke="#401B60"
        strokeWidth="1.6"
      />
    </svg>
  ),
};

export default function DashboardQuickActions({ actions }: any) {
  const router = useRouter();
  return (
    <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-5">
      {/* correct label: Recent Activity row below is a band of actions */}
      <h3 className="mb-3 text-[16px] font-semibold text-[#0A0A0A]">
        Recent Activity
      </h3>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((a: any) => (
          <button
            key={a.label}
            onClick={() => router.push(a.path)}
            className="flex items-center justify-between rounded-[10px] bg-[#F8F8F8] px-5 py-5 text-left hover:bg-[#F7F6FB]"
          >
            <span className="text-[14px] font-semibold text-[#0A0A0A]">
              {a.label}
            </span>
            <span className="grid h-[44px] w-[44px] place-items-center rounded-[10px] border border-[#E7E4EC] bg-white text-[#401B60]">
              {I[a.icon]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
