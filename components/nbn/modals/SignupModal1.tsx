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

          {/* FTTP Upgrade Message - Displayed after address check */}
          <div className="mt-6 rounded-lg border border-[#E9E3F2] bg-[#FBF8FF] p-4 text-left">
            <div className="flex items-start gap-3">
              <div className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-full bg-[#401B60] text-white mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
                </svg>
              </div>
              <div className="text-[14px] text-[#3B3551]">
                <p className="font-semibold text-[#401B60] mb-1">Did you know?</p>
                <p className="text-[#6A6486]">
                  Some properties are eligible for a free Fibre to the Premises (FTTP) upgrade. Contact our team on{" "}
                  <span className="font-semibold text-[#401B60]">(Number will be provided soon)</span> to find out if your address qualifies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionPanel>

      <BarActions onBack={onBack} onNext={onNext} nextDisabled={!address} />
    </ModalShell>
  );
}
