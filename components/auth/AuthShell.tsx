"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function AuthShell({
  children,
  onCloseHref = "/",
  widthClass = "w-[720px]",
}: {
  children: ReactNode;
  onCloseHref?: string;
  widthClass?: string; // allow narrow/wide variants if needed
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-[#F7F7FA] flex items-center justify-center">
      <div
        className={[
          "relative rounded-[24px] bg-white",
          "shadow-[0_64px_160px_rgba(0,0,0,0.12)]",
          "px-12 py-10",
          widthClass,
        ].join(" ")}
      >
        {/* close (red) */}
        <button
          type="button"
          onClick={() => router.push(onCloseHref)}
          aria-label="Close"
          className="absolute right-5 top-5 grid h-[28px] w-[28px] place-items-center rounded-full bg-[#FF4D4F]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2L2 10" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );
}
