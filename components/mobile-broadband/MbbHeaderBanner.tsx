"use client";

export default function MVHeaderBanner() {
  return (
    <div className="rounded-[12px] border border-[#E9E3F2] bg-[#F6F1FF] px-5 py-[18px]">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#2F2151] text-white">
            {/* headphones */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M5.5 18.4V15.6c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8v2.8c0 2-1.6 3.6-3.6 3.6S2 20.4 2 18.4v-6.3C1.9 6.6 6.3 2 12 2s10.1 4.6 10.1 10.1v6.3c0 2-1.6 3.6-3.6 3.6s-3.6-1.6-3.6-3.6v-3.1c0-1 .8-1.8 1.8-1.8s1.8.8 1.8 1.8v3.1"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="leading-[1.15]">
            <p className="text-[15px] font-medium text-[#1C1232]">
              Having trouble or have a question? Our team is here to help.
            </p>
            <p className="text-[13px] font-extrabold text-[#2F2151]">
              Call us on (02) 8123 4567 or request a callback.
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <button
            type="button"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#2F2151] px-5 py-[12px] text-[15px] font-semibold text-white sm:flex-initial"
          >
            {/* paper-plane */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M7.4 6.3 15.9 3.5c3.8-1.3 5.9.8 4.6 4.6l-2.8 8.5c-1.9 5.7-5 5.7-6.9 0l-.8-2.5-2.5-.8C1.7 11.3 1.7 8.2 7.4 6.3Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m10.1 13.6 3.6-3.6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Contact Us
          </button>
          <a
            href="tel:+61281234567"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#2F2151] px-5 py-[12px] text-[15px] font-semibold text-white sm:flex-initial"
          >
            {/* phone */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M22 16.9v2a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 7 7l.6-.6a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6A2 2 0 0 1 22 16.9Z"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
}
