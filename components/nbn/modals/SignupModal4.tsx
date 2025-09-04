"use client";

import ModalShell from "@/components/shared/ModalShell";
import Stepper from "@/components/shared/Stepper";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import FormField from "@/components/shared/FormField";

export default function SignupModal4({
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
      <Stepper active={4} />

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.5"/><path d="M20 20c0-4-3.6-6-8-6s-8 2-8 6" stroke="white" strokeWidth="1.5"/></svg>
          </div>
          <h2 className="modal-h1 mt-4">Customer Details</h2>
          <p className="modal-sub mt-1">Please provide your contact information</p>
        </div>

        <div className="card mx-auto mt-8 max-w-[860px] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="First Name"><input className="input w-full" /></FormField>
            <FormField label="Last Name"><input className="input w-full" /></FormField>
            <FormField label="Email Address"><input className="input w-full" /></FormField>
            <FormField label="Phone Number"><input className="input w-full" /></FormField>
          </div>
          <div className="mt-4">
            <FormField label="Service Address"><input className="input w-full" /></FormField>
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} />
    </ModalShell>
  );
}
