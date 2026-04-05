"use client";

export default function HelpBanner() {
  return (
    <div className="panel p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--cl-brand)] text-white">
            {/* headset icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M5.46 18.99V16.07c0-.97.76-1.84 1.84-1.84.97 0 1.84.8 1.84 1.84v2.8c0 .97-.76 1.84-1.84 1.84" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M18.54 18.99V16.07c0-.97-.76-1.84-1.84-1.84-.97 0-1.84.8-1.84 1.84v2.8c0 .97.76 1.84 1.84 1.84" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M20.99 13.13V10.5A9 9 0 0 0 3.01 10.5v2.63" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="text-[17px] text-black">
              Having trouble or have a question? Our team is here to help.
            </div>
            <div className="text-[14px] font-extrabold text-[var(--cl-brand)]">
              Call us on (02) 8123 4567 or request a callback.
            </div>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <button className="btn-secondary flex-1 sm:flex-initial inline-flex items-center justify-center gap-2">
            {/* paper-plane */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M7.4 6.32 15.89 3.49c3.81-1.27 5.88.81 4.61 4.61l-2.83 8.49c-1.84 5.53-4.86 5.53-6.7 0L9.24 15l6.06-6.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Contact Us
          </button>
          <button className="btn-primary flex-1 sm:flex-initial inline-flex items-center justify-center gap-2">
            {/* phone */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M15.83 12.96c2.02-2.02 2.69-3.65 2.02-4.32l-2.02-2.02c-.67-.67-2.3 0-4.32 2.02-2.02 2.02-2.69 3.65-2.02 4.32l2.02 2.02c.67.67 2.3 0 4.32-2.02Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Call Now
          </button>
        </div>
      </div>
    </div>
  );
}
