import Panel from "../Panel";
import { Pill } from "../Pill";

export default function Billing() {
  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Billing & Invoices</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Current Balance */}
        <Panel className="p-6">
          <div className="text-[14px] font-semibold text-[#0A0A0A]">Current Balance</div>
          <div className="mt-3 text-[28px] font-extrabold text-[#0A0A0A]">$0.00</div>
          <div className="text-[13px] text-[#6F6C90]">No outstanding balance</div>
        </Panel>

        {/* Next Bill Date */}
        <Panel className="p-6">
          <div className="text-[14px] font-semibold text-[#0A0A0A]">Next Bill Date</div>
          <div className="mt-3 text-[22px] font-bold text-[#0A0A0A]">Feb 15, 2025</div>
          <div className="text-[13px] text-[#6F6C90]">2025</div>
        </Panel>

        {/* Monthly Amount */}
        <Panel className="p-6">
          <div className="text-[14px] font-semibold text-[#0A0A0A]">Monthly Amount</div>
          <div className="mt-3 text-[22px] font-bold text-[#0A0A0A]">$89.99</div>
          <div className="text-[13px] text-[#6F6C90]">Due monthly</div>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <Panel className="col-span-2 p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">Recent Invoices</div>
            <button className="rounded-[10px] border border-[#D9D4E5] px-3 py-1.5 text-[12px] font-semibold text-[#3F205F]">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { id: "INV-2025-001", meta: "2025-01-15 • NBN + Mobile", amount: "$124.95" },
              { id: "INV-2024-012", meta: "2024-12-15 • NBN + Mobile", amount: "$134.95" },
              { id: "INV-2024-011", meta: "2024-11-15 • NBN Only", amount: "$79.99" },
              { id: "INV-2024-012", meta: "2024-12-15 • NBN + Mobile", amount: "$134.95" },
            ].map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD] px-4 py-3">
                <div>
                  <div className="text-[14px] font-semibold text-[#0A0A0A]">{i.id}</div>
                  <div className="text-[12px] text-[#6F6C90]">{i.meta}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-[14px] font-semibold text-[#0A0A0A]">{i.amount}</div>
                  <Pill tone="green">Paid</Pill>
                  <button className="rounded-[8px] border border-[#D9D4E5] px-2.5 py-1 text-[12px] text-[#3F205F]">Download</button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Current Month Charges */}
        <Panel className="p-6">
          <div className="text-[16px] font-semibold text-[#0A0A0A]">Current Month Charges</div>
          <div className="mt-3 divide-y divide-[#EEEAF4] text-[14px]">
            {[
              ["NBN100 Unlimited Plan", "$69.99"],
              ["Mobile Plan - Primary Line (50GB)", "$45.00"],
              ["Mobile Plan - Secondary Line (20GB)", "$35.00"],
              ["Static IP Add-on", "$5.00"],
              ["Subtotal", "$154.99"],
              ["Bundle Discount", "-$20.00"],
              ["GST (10%)", "$13.50"],
            ].map(([a, b]) => (
              <div key={a as string} className="flex items-center justify-between py-2">
                <div className="text-[#0A0A0A]">{a}</div>
                <div className="text-[#0A0A0A]">{b}</div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 font-semibold">
              <div>Total</div>
              <div>$89.99</div>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}
