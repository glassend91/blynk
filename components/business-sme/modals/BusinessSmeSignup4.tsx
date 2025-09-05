"use client";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";

export default function BusinessSmeSignup4({
  onNext, onBack,
}: { onNext: () => void; onBack: () => void }) {
  return (
    <SectionPanel>
      <div className="text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"/><path d="M4 19.8c0-3.3 4-5.8 8-5.8s8 2.5 8 5.8"/></svg>
        </div>
        <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Business Details</h2>
        <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Please provide your business information</p>
      </div>

      <div className="mx-auto mt-8 max-w-[880px] rounded-[16px] border border-[#E7E4EC] bg-white p-6 shadow-[0_24px_60px_rgba(64,27,118,0.08)]">
        <label className="mb-1 block text-sm text-[#6B6478]">Business Name</label>
        <input className="mb-4 h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3" placeholder="Enter your business name" />

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-[#6B6478]">Business Type</label>
            <input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3" placeholder="e.g., Pty Ltd, Sole Trader" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-[#6B6478]">ABN/ACN *</label>
            <input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3" placeholder="Enter ABN or ACN" />
            <div className="mt-1 text-[11px] text-[#9A93B3]">Required for business verification</div>
          </div>
        </div>

        <div className="mt-6 text-[14px] font-semibold text-[#2B1940]">Primary Contact</div>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div><label className="mb-1 block text-sm text-[#6B6478]">First Name</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3" placeholder="Enter your first name" /></div>
          <div><label className="mb-1 block text-sm text-[#6B6478]">Last Name</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3" placeholder="Enter your last name" /></div>
          <div><label className="mb-1 block text-sm text-[#6B6478]">Business Email</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3" placeholder="Enter business email address" /></div>
          <div><label className="mb-1 block text-sm text-[#6B6478]">Business Phone</label><input className="h-11 w-full rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] px-3" placeholder="Enter business phone number" /></div>
        </div>
      </div>

      <BarActions onBack={onBack} onNext={onNext} />
    </SectionPanel>
  );
}
