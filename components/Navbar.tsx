"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import MbbSignupController from "@/components/mobile-broadband/MbbSignupController";
import NbnSignupController from "@/components/nbn/NbnSignupController";
import MobileVoiceSignupController from "@/components/mobile-voice/MobileVoiceSignupController";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [openMbbFlow, setOpenMbbFlow] = useState(false);
  const [openNbnFlow, setOpenNbnFlow] = useState(false);
  const [openMobileFlow, setOpenMobileFlow] = useState(false);
  const [internetDropdownOpen, setInternetDropdownOpen] = useState(false);
  const internetDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (internetDropdownRef.current && !internetDropdownRef.current.contains(event.target as Node)) {
        setInternetDropdownOpen(false);
      }
    }

    if (internetDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [internetDropdownOpen]);

  return (
    <>
      <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-black/5">
        <div className="mx-auto max-w-[1400px] px-6 py-4 flex items-center justify-between">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-10">
            <Link href="/" aria-label="Blynk home">
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
              {/* Internet Dropdown */}
              <div className="relative" ref={internetDropdownRef}>
                <button
                  onClick={() => setInternetDropdownOpen(!internetDropdownOpen)}
                  className="inline-flex items-center gap-2 text-[18px] font-bold text-black hover:text-[#401B60] transition-colors"
                  aria-label="Internet options"
                  aria-expanded={internetDropdownOpen}
                >
                  Internet
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                    className={`transition-transform ${internetDropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {internetDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-black/10 py-2 z-50">
                    <button
                      onClick={() => {
                        setInternetDropdownOpen(false);
                        setOpenMbbFlow(true);
                      }}
                      className="w-full text-left px-4 py-2 text-[16px] font-semibold text-black hover:bg-[#401B60] hover:text-white transition-colors"
                    >
                      MBB internet
                    </button>
                    <Link
                      href="/business"
                      onClick={() => setInternetDropdownOpen(false)}
                      className="block w-full text-left px-4 py-2 text-[16px] font-semibold text-black hover:bg-[#401B60] hover:text-white transition-colors"
                    >
                      SME internet
                    </Link>
                    <button
                      onClick={() => {
                        setInternetDropdownOpen(false);
                        setOpenNbnFlow(true);
                      }}
                      className="w-full text-left px-4 py-2 text-[16px] font-semibold text-black hover:bg-[#401B60] hover:text-white transition-colors"
                    >
                      NBN plan
                    </button>
                    <button
                      onClick={() => {
                        setInternetDropdownOpen(false);
                        setOpenMobileFlow(true);
                      }}
                      className="w-full text-left px-4 py-2 text-[16px] font-semibold text-black hover:bg-[#401B60] hover:text-white transition-colors"
                    >
                      Mobile plan
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setOpenMobileFlow(true)}
                className="text-[18px] font-bold text-black hover:text-[#401B60] transition-colors"
              >
                Mobile
              </button>
              {/* <button className="inline-flex items-center gap-2 text-[18px] font-bold text-black">
                Support
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 9L12 15L18 9" stroke="black" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button> */}
              <Link href="/about" className="text-[18px] font-bold text-black">About</Link>

              {/* Test buttons - Commented out */}
              {/* <button
                type="button"
                onClick={() => setOpenMbbFlow(true)}
                className="inline-flex items-center gap-2 text-[18px] font-bold text-[#401B60] hover:underline"
                aria-label="Open Mobile Broadband signup flow"
              >
                Test MBB
              </button>
              <button
                type="button"
                onClick={() => setOpenSmeFlow(true)}
                className="inline-flex items-center gap-2 text-[18px] font-bold text-[#401B60] hover:underline"
                aria-label="Open Business SME signup flow"
              >
                Test SME
              </button> */}
            </nav>
          </div>

          {/* Right: CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-[#401B60] bg-white px-4 py-2 text-[#401B60] font-bold">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M10.0004 11.1922C11.4363 11.1922 12.6004 10.0281 12.6004 8.59219C12.6004 7.15625 11.4363 5.99219 10.0004 5.99219C8.56445 5.99219 7.40039 7.15625 7.40039 8.59219C7.40039 10.0281 8.56445 11.1922 10.0004 11.1922Z" stroke="#401B60" strokeWidth="1.5" />
                <path d="M3.01675 7.0763C4.65842 -0.140363 15.3501 -0.132029 16.9834 7.08464C17.9417 11.318 15.3084 14.9013 13.0001 17.118C11.3251 18.7346 8.67508 18.7346 6.99175 17.118C4.69175 14.9013 2.05842 11.3096 3.01675 7.0763Z" stroke="#401B60" strokeWidth="1.5" />
              </svg>
              Find Local Support
            </button>

            {/* Login routes to /login */}
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-[#401B60] px-4 py-2 text-white font-semibold"
              aria-label="Go to login"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M18.1404 21.6207C17.2604 21.8807 16.2204 22.0007 15.0004 22.0007H9.00035C7.78035 22.0007 6.74035 21.8807 5.86035 21.6207C6.08035 19.0207 8.75035 16.9707 12.0004 16.9707C15.2504 16.9707 17.9204 19.0207 18.1404 21.6207Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 2H9C4 2 2 4 2 9V15C2 18.78 3.14 20.85 5.86 21.62C6.08 19.02 8.75 16.97 12 16.97C15.25 16.97 17.92 19.02 18.14 21.62C20.86 20.85 22 18.78 22 15V9C22 4 20 2 15 2ZM12 14.17C10.02 14.17 8.42 12.56 8.42 10.58C8.42 8.60002 10.02 7 12 7C13.98 7 15.58 8.60002 15.58 10.58C15.58 12.56 13.98 14.17 12 14.17Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Login
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-md border border-black/10 p-2"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 6H20M4 12H20M4 18H20" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-black/5 bg-white">
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-2">
                <div className="text-base font-semibold text-black mb-2">Internet</div>
                <button
                  onClick={() => { setOpen(false); setOpenMbbFlow(true); }}
                  className="block w-full text-left px-4 py-2 text-sm font-semibold text-[#401B60] hover:bg-[#401B60]/10 rounded-lg"
                >
                  MBB internet
                </button>
                <Link
                  href="/business"
                  onClick={() => setOpen(false)}
                  className="block w-full text-left px-4 py-2 text-sm font-semibold text-[#401B60] hover:bg-[#401B60]/10 rounded-lg"
                >
                  SME internet
                </Link>
                <button
                  onClick={() => { setOpen(false); setOpenNbnFlow(true); }}
                  className="block w-full text-left px-4 py-2 text-sm font-semibold text-[#401B60] hover:bg-[#401B60]/10 rounded-lg"
                >
                  NBN plan
                </button>
                <button
                  onClick={() => { setOpen(false); setOpenMobileFlow(true); }}
                  className="block w-full text-left px-4 py-2 text-sm font-semibold text-[#401B60] hover:bg-[#401B60]/10 rounded-lg"
                >
                  Mobile plan
                </button>
              </div>
              <button
                type="button"
                onClick={() => { setOpen(false); setOpenMobileFlow(true); }}
                className="block w-full text-left text-base font-semibold text-black hover:text-[#401B60] transition-colors"
              >
                Mobile
              </button>
              {/* <Link href="#" className="block text-base font-semibold text-black">Support</Link> */}
              <Link href="/about" className="block text-base font-semibold text-black">About</Link>

              {/* Test buttons for mobile - Commented out */}
              {/* <div className="flex gap-3">
                <button
                  onClick={() => { setOpen(false); setOpenMbbFlow(true); }}
                  className="flex-1 rounded-lg border border-[#401B60] px-4 py-2 text-[#401B60] font-bold"
                >
                  Test MBB
                </button>
                <button
                  onClick={() => { setOpen(false); setOpenSmeFlow(true); }}
                  className="flex-1 rounded-lg bg-[#401B60] px-4 py-2 text-white font-semibold"
                >
                  Test SME
                </button>
              </div> */}

              {/* Mobile Login link */}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-[#401B60] px-4 py-2 text-center text-white font-semibold"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Controllers */}
      <MbbSignupController open={openMbbFlow} onClose={() => setOpenMbbFlow(false)} />
      <NbnSignupController open={openNbnFlow} onClose={() => setOpenNbnFlow(false)} />
      <MobileVoiceSignupController open={openMobileFlow} onClose={() => setOpenMobileFlow(false)} />
    </>
  );
}
