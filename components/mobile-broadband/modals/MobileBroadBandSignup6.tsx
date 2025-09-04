"use client";

import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import FormField from "@/components/shared/FormField";
import MbbStepper from "../MbbStepper";

export default function MobileBroadBandSignup6({
  onComplete,
  onBack,
  onClose,
}: {
  onComplete: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <div className="panel p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--cl-brand)] text-white">
              {/* headphone */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5.46 18.99V16.07c0-.97.76-1.84 1.84-1.84.97 0 1.84.76 1.84 1.84v2.81c0 1.95-1.62 3.57-3.57 3.57S2 20.82 2 18.88V12.72C1.89 7.1 6.33 2.55 11.95 2.55 17.57 2.55 22 7.1 22 12.61v6.16c0 1.95-1.62 3.57-3.57 3.57s-3.57-1.62-3.57-3.57v-3.03c0-.97.76-1.84 1.84-1.84.97 0 1.84.8 1.84 1.84v3.03" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

          <div className="flex w-full sm:w-auto items-center gap-3">
            <button className="btn-primary flex-1 sm:flex-initial inline-flex items-center justify-center gap-2">
              {/* send */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M7.4 6.32 15.89 3.49c3.81-1.27 5.88.81 4.62 4.62l-2.83 8.49c-1.9 5.71-5.02 5.71-6.92 0l-.84-2.52-2.52-.84C1.69 11.34 1.69 8.23 7.4 6.32Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="m10.11 13.65 3.58-3.59" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Contact Us
            </button>
            <a href="tel:+61281234567" className="btn-primary flex-1 sm:flex-initial inline-flex items-center justify-center gap-2">
              {/* call */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v2a2 2 0 01-2.18 2A19.79 19.79 0 013 5.18 2 2 0 015 3h2a2 2 0 012 1.72c.12.9.31 1.77.57 2.61a2 2 0 01-.45 2.11L8.09 10a16 16 0 007 7l.56-.63a2 2 0 012.11-.45c.84.26 1.71.45 2.61.57A2 2 0 0122 16.92z" stroke="white" strokeWidth="1.5"/>
              </svg>
              Call Now
            </a>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <MbbStepper active={6} />
      </div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            {/* card */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" stroke="white" strokeWidth="1.5"/><path d="M3 10h18" stroke="white" strokeWidth="1.5"/></svg>
          </div>
          <h2 className="modal-h1 mt-4">Payment Details</h2>
          <p className="modal-sub mt-1">Secure payment information</p>
        </div>

        <div className="card mx-auto mt-8 max-w-[760px] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Card Number"><input className="input w-full" /></FormField>
            <FormField label="Expiry Date"><input className="input w-full" /></FormField>
            <FormField label="Name on Card"><input className="input w-full" /></FormField>
            <FormField label="CVV"><input className="input w-full" /></FormField>
            <div className="md:col-span-2">
              <FormField label="Billing Address"><input className="input w-full" /></FormField>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={onBack}
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M9.57 5.93 3.5 12l6.07 6.07M20.5 12H4" stroke="#6E6690" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
            <button onClick={onComplete} className="btn-primary inline-flex items-center justify-center gap-3">
              Complete Order
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M14.43 5.93 20.5 12l-6.07 6.07M3.5 12H20.33" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </SectionPanel>
    </ModalShell>
  );
}
