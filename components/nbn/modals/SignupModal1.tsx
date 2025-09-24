"use client";

import ModalShell from "@/components/shared/ModalShell";
import Stepper from "@/components/shared/Stepper";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";

export default function SignupModal1({
  onNext,
  onBack,
  onClose,
  address,
  onChangeAddress,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  address: string;
  onChangeAddress: (value: string) => void;
}) {
  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={1} />

      <SectionPanel>
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11Z" stroke="white" strokeWidth="1.5" /></svg>
          </div>
          <h2 className="modal-h1 mt-4">Check NBN Availability</h2>
          <p className="modal-sub mt-1">Enter your address to see available plans</p>

          <div className="mt-6 text-left">
            <label htmlFor="serviceAddress" className="text-sm font-semibold text-[#3B3551]">Your Address</label>
            <input
              id="serviceAddress"
              name="serviceAddress"
              autoComplete="street-address"
              className="input mt-2 w-full"
              placeholder="Enter your full address"
              value={address}
              onChange={(e) => onChangeAddress(e.target.value)}
            />
            <button type="button" onClick={onNext} disabled={!address} className="btn-primary mt-5 w-full disabled:opacity-60">
              Check
            </button>
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} nextDisabled={!address} />
    </ModalShell>
  );
}
