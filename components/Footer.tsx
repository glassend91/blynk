"use client";

import { useState } from "react";
import Image from "next/image";
import ContactUsModal from "@/components/ContactUsModal";
import FindLocalSupportModal from "@/components/site/find-support/FindLocalSupportModal";

export default function Footer() {
  const [openContact, setOpenContact] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);

  return (
    <>
      <footer className="bg-[#401B60]/10">
        <div className="mx-auto max-w-[1171px] px-6 py-[100px]">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <Image
                src="https://api.builder.io/api/v1/image/assets/TEMP/7a98b2145cf9ac98b3f983bc3b3512d9b6047d42?width=474"
                alt="Blynk"
                width={237}
                height={50}
                className="h-10 w-auto"
                priority
              />
              <p className="text-[18px] leading-[30px] text-[#6F6C90]">
                Local experts making internet and mobile simple for Australian homes and businesses.
              </p>

              <div className="flex items-center gap-3">
                {/* social icons */}
                <svg width="50" height="51" viewBox="0 0 50 51" fill="none" aria-hidden>
                  <path d="M31.3396 15.6309H34.7864L27.2562 24.2374L36.1149 35.949H29.1786L23.7458 28.846L17.5295 35.949H14.0806L22.1349 26.7433L13.6367 15.6309H20.7491L25.6599 22.1233L31.3396 15.6309ZM30.1299 33.886H32.0398L19.7113 17.5856H17.6618L30.1299 33.886Z" fill="#401B60"/>
                </svg>
                <svg width="2" height="26" viewBox="0 0 2 26" fill="none" className="opacity-30" aria-hidden>
                  <path d="M1 1L1 25" stroke="#401B60" />
                </svg>
                <svg width="50" height="51" viewBox="0 0 50 51" fill="none" aria-hidden>
                  <path d="M30.8333 15.6309H19.1667C16.1113 15.6309 13.75 17.9922 13.75 21.0476V31.7143C13.75 34.7697 16.1113 37.131 19.1667 37.131H30.8333C33.8887 37.131 36.25 34.7697 36.25 31.7143V21.0476C36.25 17.9922 33.8887 15.6309 30.8333 15.6309ZM32.9167 20.756H31.25C30.9665 20.756 30.7292 20.9933 30.7292 21.2768V22.9435C30.7292 23.227 30.9665 23.4643 31.25 23.4643H32.9167V25.1309H31.25C30.9665 25.1309 30.7292 25.3682 30.7292 25.6518V27.3185C30.7292 27.602 30.9665 27.8393 31.25 27.8393H32.9167V29.5059H31.25C30.9665 29.5059 30.7292 29.7432 30.7292 30.0268V31.6935C30.7292 31.977 30.9665 32.2143 31.25 32.2143H32.9167V33.8809H30.8333C28.692 33.8809 26.9167 32.1056 26.9167 29.9643V22.7976C26.9167 20.6563 28.692 18.8809 30.8333 18.8809H32.9167V20.756Z" fill="#401B60"/>
                </svg>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[#170F49] text-[20px] font-bold">Contact us</h4>
              <ul className="mt-6 space-y-4 text-[18px] text-[#6F6C90]">
                <li className="flex items-center gap-2">
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" aria-hidden>
                    <path d="M18.3087 15.4501C18.3087 15.7501 18.242 16.0585 18.1003 16.3585C17.9587 16.6585 17.7753 16.9418 17.5337 17.2085C17.1253 17.6585 16.6753 17.9835 16.167 18.1918C15.667 18.4001 15.1253 18.5085 14.542 18.5085C13.692 18.5085 12.7837 18.3085 11.8253 17.9001C10.867 17.4918 9.90866 16.9418 8.95866 16.2501C8.00033 15.5501 7.09199 14.7751 6.22533 13.9168C5.36699 13.0501 4.59199 12.1418 3.90033 11.1918C3.21699 10.2418 2.66699 9.2918 2.26699 8.35013C1.86699 7.40013 1.66699 6.4918 1.66699 6.4918" stroke="#6F6C90" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  +00 000 000 000
                </li>
                <li className="flex items-center gap-2">
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none" aria-hidden>
                    <path d="M7.0837 16.0086H6.66699C3.33366 16.0086 1.66699 15.1753 1.66699 11.0086V6.84192C1.66699 3.50859 3.33366 1.84192 6.66699 1.84192H13.3337C16.667 1.84192 18.3337 3.50859 18.3337 6.84192V11.0086C18.3337 14.3419 16.667 16.0086 13.3337 16.0086H12.917C12.6587 16.0086 12.4087 16.1336 12.2503 16.3419L11.0003 18.0086C10.4503 18.7419 9.55033 18.7419 9.00033 18.0086L7.75033 16.3419C7.61699 16.1586 7.30866 16.0086 7.0837 16.0086Z" stroke="#6F6C90" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  support@blynkinternet.com
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-[#170F49] text-[20px] font-bold">Support</h4>
              <ul className="mt-6 space-y-3 text-[18px] text-[#6F6C90]">
                <li>Help Center</li>
                <li>
                  <button
                    type="button"
                    onClick={() => setOpenContact(true)}
                    className="transition-colors hover:text-[#401B60]"
                    aria-haspopup="dialog"
                    aria-controls="contact-modal"
                  >
                    Contact us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setOpenSupport(true)}
                    className="transition-colors hover:text-[#401B60]"
                    aria-haspopup="dialog"
                    aria-controls="find-local-support-modal"
                  >
                    Find Local Technician
                  </button>
                </li>
                <li>My Account</li>
                <li>Financial Hardship</li>
                <li>Policies</li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[#170F49] text-[20px] font-bold">Company</h4>
              <ul className="mt-6 space-y-3 text-[18px] text-[#6F6C90]">
                <li>About us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Legal</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals (render outside the footer) */}
      <ContactUsModal open={openContact} onClose={() => setOpenContact(false)} />
      <FindLocalSupportModal open={openSupport} onClose={() => setOpenSupport(false)} />
    </>
  );
}
