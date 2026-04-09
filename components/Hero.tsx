"use client";

import { useState } from "react";
import Image from "next/image";
import HomeHero from "@/app/assets/images/HomeHero.svg";
import NbnSignupController from "@/components/nbn/NbnSignupController";
import MobileVoiceSignupController from "@/components/mobile-voice/MobileVoiceSignupController";

export default function HeroSection() {
  const [openNbnFlow, setOpenNbnFlow] = useState(false);
  const [openMobileFlow, setOpenMobileFlow] = useState(false);

  return (
    <>
      <section className="bg-[#401B60]/10 bg-cover bg-center">
        <div className="mx-auto max-w-[1400px] px-6 py-4 md:py-4 lg:py-10">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            {/* Copy */}
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-black md:text-6xl">
                Internet That Just Works. And Real Techs For When It Doesn’t.
              </h1>

              <p className="max-w-xl text-[22px] leading-[33px] text-[#6F6C90]">
                Get fast, simple internet and mobile plans, backed by real
                computer technicians from your local community. No scripts, just
                solutions.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* View NBN Plan → opens modal flow */}
                <button
                  type="button"
                  onClick={() => setOpenNbnFlow(true)}
                  aria-haspopup="dialog"
                  aria-controls="nbn-signup-flow"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#401B60] px-6 py-3 font-bold text-white"
                >
                  {/* wifi */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M4.91 11.927C9.21 8.607 14.8 8.607 19.1 11.927"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 8.447C8.06 3.767 15.94 3.767 22 8.447"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.79 15.578C9.94 13.138 14.05 13.138 17.2 15.578"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.4 19.237C10.98 18.017 13.03 18.017 14.61 19.237"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  View NBN Plan
                  {/* arrow */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M14.43 6.018L20.5 12.088L14.43 18.158"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 12.088H20.33"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* View Mobile Plan → opens Mobile Voice modal */}
                <button
                  type="button"
                  onClick={() => setOpenMobileFlow(true)}
                  aria-haspopup="dialog"
                  aria-controls="mobile-signup-flow"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#401B60] bg-white px-6 py-3 font-bold text-[#401B60]"
                >
                  {/* mobile */}
                  <svg
                    width="18"
                    height="22"
                    viewBox="0 0 18 22"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M17 6.088V16.088C17 20.088 16 21.088 12 21.088H6C2 21.088 1 20.088 1 16.088V6.088C1 2.088 2 1.088 6 1.088H12C16 1.088 17 2.088 17 6.088Z"
                      stroke="#401B60"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11 4.588H7"
                      stroke="#401B60"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 18.188C9.856 18.188 10.55 17.494 10.55 16.638C10.55 15.782 9.856 15.088 9 15.088C8.144 15.088 7.45 15.782 7.45 16.638C7.45 17.494 8.144 18.188 9 18.188Z"
                      stroke="#401B60"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  View Mobile Plan
                  {/* arrow */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 25"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M14.43 6.018L20.5 12.088L14.43 18.158"
                      stroke="#401B60"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.5 12.088H20.33"
                      stroke="#401B60"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <ul className="mt-2 flex flex-wrap gap-5 text-[#6F6C90]">
                <li className="inline-flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#401B60]" />{" "}
                  Local technicians nationwide
                </li>
                <li className="inline-flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#401B60]" />{" "}
                  No contracts, no confusion
                </li>
                <li className="inline-flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#401B60]" />{" "}
                  Human-first service
                </li>
              </ul>
            </div>

            {/* Right visual */}
            <div className="relative">
              <Image
                src={HomeHero}
                alt="How it works"
                width={400}
                height={400}
                className="h-[600px] w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* NBN Signup flow controller */}
      <div id="nbn-signup-flow" aria-hidden={!openNbnFlow}>
        <NbnSignupController
          open={openNbnFlow}
          onClose={() => setOpenNbnFlow(false)}
        />
      </div>

      {/* Mobile Voice Signup flow controller */}
      <div id="mobile-signup-flow" aria-hidden={!openMobileFlow}>
        <MobileVoiceSignupController
          open={openMobileFlow}
          onClose={() => setOpenMobileFlow(false)}
        />
      </div>
    </>
  );
}
