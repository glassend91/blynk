import Panel from "../Panel";
import { Pill } from "../Pill";

export default function Services() {
  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Service Management</h1>

      {/* NBN */}
      <Panel className="p-6">
        <div className="text-[15px] font-semibold text-[#0A0A0A]">NBN - Premium 100/40</div>

        <div className="mt-4 rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD]">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 8.5C6.5 4.5 17.5 4.5 22 8.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </span>
              <div>
                <div className="text-[14px] font-semibold text-[#0A0A0A]">NBN - Premium 100/40</div>
                <div className="text-[12px] text-[#6F6C90]">$89.95/month</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Pill tone="green">Active</Pill>
              <button className="rounded-[8px] border border-[#D9D4E5] px-2.5 py-1 text-[12px] text-[#3F205F]">Setting</button>
              <button className="rounded-[8px] border border-[#D9D4E5] px-2.5 py-1 text-[12px] text-[#C63D3D]">Delete</button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 border-t border-[#EEEAF4] p-4 text-[13px]">
            <Spec label="Download Speed" value="100 Mbps" />
            <Spec label="Upload Speed" value="40 Mbps" />
            <Spec label="Data Allowance" value="Unlimited" />
            <Spec label="Static IP" value="No" />
          </div>
        </div>

        <div className="mt-4 rounded-[12px] border border-[#EEEAF4] bg-[#F7F7FA] p-4">
          <div className="text-[14px] font-semibold text-[#0A0A0A]">Add-ons</div>
          <div className="mt-3 flex items-center justify-between rounded-[10px] bg-white px-4 py-3">
            <div>
              <div className="text-[14px] font-semibold text-[#0A0A0A]">Static IP Address</div>
              <div className="text-[12px] text-[#6F6C90]">Get a fixed IP address for your connection (+$10/month)</div>
            </div>
            <input type="checkbox" className="h-5 w-9 cursor-pointer rounded-full bg-[#D9D4E5] accent-[#3F205F]" />
          </div>
        </div>
      </Panel>

      {/* Mobile */}
      <Panel className="mt-6 p-6">
        <div className="text-[15px] font-semibold text-[#0A0A0A]">Mobile - 20GB Voice + Data</div>

        <div className="mt-4 rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD]">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none"><rect x="3" y="1.5" width="10" height="17" rx="3" stroke="white" strokeWidth="1.8"/><circle cx="8" cy="15" r="1.4" fill="white"/></svg>
              </span>
              <div>
                <div className="text-[14px] font-semibold text-[#0A0A0A]">Mobile - 20GB Voice + Data</div>
                <div className="text-[12px] text-[#6F6C90]">$45.00/month</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Pill tone="green">Active</Pill>
              <button className="rounded-[8px] border border-[#D9D4E5] px-2.5 py-1 text-[12px] text-[#3F205F]">Setting</button>
              <button className="rounded-[8px] border border-[#D9D4E5] px-2.5 py-1 text-[12px] text-[#C63D3D]">Delete</button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 border-t border-[#EEEAF4] p-4 text-[13px]">
            <Spec label="Download Speed" value="20GB" />
            <Spec label="Voice Minutes" value="Unlimited" />
            <Spec label="Sms Messages" value="Unlimited" />
            <Spec label="International Calls" value="Not included" />
          </div>

          <div className="mt-4 flex gap-3">
            <button className="rounded-[10px] bg-white px-4 py-2 text-[14px] font-semibold text-[#3F205F] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
              Port Number from Another Carrier
            </button>
            <button className="rounded-[10px] bg-white px-4 py-2 text-[14px] font-semibold text-[#3F205F] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
              Order New SIM Card
            </button>
          </div>
        </div>
      </Panel>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[#6F6C90]">{label}</div>
      <div className="font-semibold text-[#0A0A0A]">{value}</div>
    </div>
  );
}
