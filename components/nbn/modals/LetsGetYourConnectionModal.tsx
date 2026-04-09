"use client";

import ModalShell from "@/components/shared/ModalShell";
import BarActions from "@/components/shared/BarActions";

export default function LetsGetYourConnectionModal({
  onNext,
  onBack,
  onClose,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose} size="default">
      <h2 className="modal-h1 text-center">
        Let’s Get Your Connection Perfect.
      </h2>
      <p className="modal-sub mx-auto mt-3 max-w-[640px] text-center">
        Your address is eligible for a professional installation. A trained NBN
        technician will visit to ensure your service is set up for optimal speed
        and reliability.
      </p>

      <div className="mt-8 flex items-start gap-4 rounded-[16px] bg-[var(--cl-panel)] p-4">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 14v-2a8 8 0 1116 0v2M6 20h3v-6H6v6Zm9 0h3v-6h-3v6Z"
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div className="text-[16px]">
          <div className="font-semibold text-[#1A1531]">
            Questions? Our team can help.
          </div>
          <div className="text-[var(--cl-sub)]">
            Call us on (02) 8123 4567 or request a callback.
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <a
          href="tel:+61281234567"
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 16.92v2a2 2 0 01-2.18 2A19.79 19.79 0 013 5.18 2 2 0 015 3h2a2 2 0 012 1.72c.12.9.31 1.77.57 2.61a2 2 0 01-.45 2.11L8.09 10a16 16 0 007 7l.56-.63a2 2 0 012.11-.45c.84.26 1.71.45 2.61.57A2 2 0 0122 16.92z"
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>
          Call Now
        </a>
        <button onClick={onNext} className="btn-primary">
          Next
        </button>
      </div>

      <div className="sr-only">
        <BarActions onBack={onBack} onNext={onNext} />
      </div>
    </ModalShell>
  );
}
