"use client";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";

export default function BusinessSmeSignup6({
  onNext, onBack,
}: { onNext: () => void; onBack: () => void }) {
  return (
    <SectionPanel>
      <div className="text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="6" width="14" height="12" rx="2"/><path d="M5 10h14"/></svg>
        </div>
        <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Business Payment Details</h2>
        <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Enter your business payment information</p>
      </div>

      <div className="mx-auto mt-8 max-w-[760px] rounded-[16px] border border-[#E7E4EC] bg-white p-6 shadow-[0_24px_60px_rgba(64,27,118,0.08)]">
        <div className="grid gap-4 md:grid-cols-2">
          <div><label className="mb-1 block text-sm text-[#6B6478]">Card Number</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3" placeholder="Enter card number" /></div>
          <div><label className="mb-1 block text-sm text-[#6B6478]">Expiry Date</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3" placeholder="MM/YY" /></div>
          <div><label className="mb-1 block text-sm text-[#6B6478]">Name on Card</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3" placeholder="Name on card" /></div>
          <div><label className="mb-1 block text-sm text-[#6B6478]">CVV</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3" placeholder="CVV" /></div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm text-[#6B6478]">Billing Address</label>
          <input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3" placeholder="Add billing address" />
        </div>

        <label className="mt-5 flex items-start gap-3">
          <input type="checkbox" className="mt-1 h-4 w-4" />
          <span className="text-[14px] text-[#3B3551]">Request monthly invoices for business records</span>
        </label>
        <div className="mt-1 text-[12px] text-[#9A93B3]">
          Invoices will be sent to your registered business email
        </div>
      </div>

      <BarActions onBack={onBack} onNext={onNext} />
    </SectionPanel>
  );
}
