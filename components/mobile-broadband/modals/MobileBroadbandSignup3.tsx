"use client";

import ModalShell from "@/components/shared/ModalShell";

type Props = {
  onClose: () => void;
  onNext: () => void;
  onBack: () => void;
};

export default function MbbSignup3({ onClose, onNext, onBack }: Props) {
  return (
    <ModalShell onClose={onClose}>
      <SharedHeader stepActive={3} />
      <SharedStepper active={3} progress="w-[48%]" />

      <div className="px-8 pb-8 pt-6">
        <div className="rounded-[20px] bg-[#FBF7FF] p-10 shadow-[0_30px_60px_-40px_rgba(62,27,96,0.25)]">
          <div className="mx-auto max-w-[980px]">
            <SectionHead icon="user" title="Customer Details & Porting" subtitle="Please provide your details and porting information" />

            <div className="mx-auto w-full rounded-[16px] bg-white p-6 shadow-[0_30px_50px_-40px_rgba(62,27,96,0.25)] md:w-[720px]">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="First Name" placeholder="Enter your First name" icon="👤" />
                <Field label="Last Name" placeholder="Enter your last name" icon="👤" />
                <Field label="Email Address" placeholder="Enter your email" icon="✉️" className="md:col-span-1" />
                <Field label="Phone Number" placeholder="Enter your phone number" icon="📞" className="md:col-span-1" />
                <Field label="Delivery Address" placeholder="Enter your delivery address" icon="📍" className="md:col-span-2" />
              </div>
            </div>
          </div>
        </div>

        <FooterNav onBack={onBack} onNext={onNext} />
      </div>
    </ModalShell>
  );
}

/* shared bits from previous file (paste or import) */
function SharedHeader({ stepActive }: { stepActive: number }) { /* …same as in MbbSignup2… */ return null as any; }
function SharedStepper({ active, progress }: { active: number; progress: string }) { return null as any; }
function SectionHead({ icon, title, subtitle }:{icon:string; title:string; subtitle:string}) { return null as any; }
function FooterNav({ onBack, onNext }:{onBack?:()=>void; onNext:()=>void}) { return null as any; }

function Field({ label, placeholder, className="" }: { label:string; placeholder:string; icon?:string; className?:string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[14px] font-medium text-[#4A4458]">{label}</span>
      <input
        placeholder={placeholder}
        className="h-[44px] w-full rounded-[10px] border border-[#E1DAEE] bg-[#F8F6FC] px-3 text-[14px] text-[#1B1332] outline-none focus:border-[#3E1B60] focus:bg-white"
      />
    </label>
  );
}
