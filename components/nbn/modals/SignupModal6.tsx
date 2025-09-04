"use client";

import ModalShell from "@/components/shared/ModalShell";
import Stepper from "@/components/shared/Stepper";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import FormField from "@/components/shared/FormField";

export default function SignupModal6({
  onNext,
  onBack,
  onClose,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={6} />

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
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
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
