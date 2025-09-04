"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AboutNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/">
            <Image
              src="https://api.builder.io/api/v1/image/assets/TEMP/6fb75eb88f22c13e4a96e9aa89f994b1c316a459?width=474"
              alt="Blynk"
              width={237}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-9">
            <button className="inline-flex items-center gap-2 text-[18px] font-bold text-black">
              Internet
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <Link href="#" className="text-[18px] font-bold text-black">Mobile</Link>
            <button className="inline-flex items-center gap-2 text-[18px] font-bold text-black">
              Support
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <Link href="/about" className="text-[18px] font-bold text-black">About</Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#401B60] px-4 py-2 text-white font-semibold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18.1404 21.6207C17.2604 21.8807 16.2204 22.0007 15.0004 22.0007H9.00035C7.78035 22.0007 6.74035 21.8807 5.86035 21.6207C6.08035 19.0207 8.75035 16.9707 12.0004 16.9707C15.2504 16.9707 17.9204 19.0207 18.1404 21.6207Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 2H9C4 2 2 4 2 9V15C2 18.78 3.14 20.85 5.86 21.62C6.08 19.02 8.75 16.97 12 16.97C15.25 16.97 17.92 19.02 18.14 21.62C20.86 20.85 22 18.78 22 15V9C22 4 20 2 15 2ZM12 14.17C10.02 14.17 8.42 12.56 8.42 10.58C8.42 8.60002 10.02 7 12 7C13.98 7 15.58 8.60002 15.58 10.58C15.58 12.56 13.98 14.17 12 14.17Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Login
          </button>
        </div>

        <button
          onClick={() => setOpen(v => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-md border border-black/10 p-2"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/5 bg-white">
          <div className="px-6 py-4 space-y-4">
            <Link href="#" className="block text-base font-semibold text-black">Internet</Link>
            <Link href="#" className="block text-base font-semibold text-black">Mobile</Link>
            <Link href="#" className="block text-base font-semibold text-black">Support</Link>
          </div>
        </div>
      )}
    </header>
  );
}
