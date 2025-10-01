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
  firstName,
  lastName,
  email,
  phone,
  serviceAddress,
  password,
  onChangeFirstName,
  onChangeLastName,
  onChangeEmail,
  onChangePhone,
  onChangeServiceAddress,
  onChangePassword,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceAddress: string;
  password: string;
  onChangeFirstName: (v: string) => void;
  onChangeLastName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangePhone: (v: string) => void;
  onChangeServiceAddress: (v: string) => void;
  onChangePassword: (v: string) => void;
}) {
  const canProceed = Boolean(firstName && lastName && email && phone && serviceAddress && password && password.length >= 6);
  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={4} />

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.5" /><path d="M20 20c0-4-3.6-6-8-6s-8 2-8 6" stroke="white" strokeWidth="1.5" /></svg>
          </div>
          <h2 className="modal-h1 mt-4">Customer Details</h2>
          <p className="modal-sub mt-1">Please provide your contact information</p>
        </div>

        <div className="card mx-auto mt-8 max-w-[860px] p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="First Name"><input id="firstName" name="firstName" className="input w-full" value={firstName} onChange={(e) => onChangeFirstName(e.target.value)} /></FormField>
            <FormField label="Last Name"><input id="lastName" name="lastName" className="input w-full" value={lastName} onChange={(e) => onChangeLastName(e.target.value)} /></FormField>
            <FormField label="Email Address"><input id="email" name="email" type="email" autoComplete="email" className="input w-full" value={email} onChange={(e) => onChangeEmail(e.target.value)} /></FormField>
            <FormField label="Phone Number"><input id="phone" name="phone" className="input w-full" value={phone} onChange={(e) => onChangePhone(e.target.value)} /></FormField>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <FormField label="Service Address"><input id="serviceAddress" name="serviceAddress" autoComplete="street-address" className="input w-full" value={serviceAddress} onChange={(e) => onChangeServiceAddress(e.target.value)} /></FormField>
            <FormField label="Password"><input id="password" name="password" type="password" className="input w-full" value={password} onChange={(e) => onChangePassword(e.target.value)} /></FormField>
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} nextDisabled={!canProceed} />
    </ModalShell>
  );
}
