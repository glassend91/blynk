import Panel from "../Panel";
import { Pill } from "../Pill";

export default function PaymentMethods() {
  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Payment Method</h1>

      <div className="mb-5 flex justify-end">
        <button className="rounded-[10px] bg-[#3F205F] px-4 py-2 text-[14px] font-semibold text-white">
          Add Payment Method
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Panel className="p-6">
          <div className="text-[16px] font-semibold text-[#0A0A0A]">Saved Payment Methods</div>

          <div className="mt-4 space-y-3">
            <PaymentRow
              title="Credit Card ending in 4532"
              subtitle="Expires 12/26"
              right={
                <>
                  <Pill tone="grey">Default</Pill>
                  <RowActions />
                </>
              }
            />
            <PaymentRow
              title="Bank Account ending in 7890"
              subtitle="Commonwealth Bank"
              right={
                <>
                  <button className="rounded-[8px] border border-[#CDBEE3] px-3 py-1 text-[12px] font-semibold text-[#3F205F]">
                    Save as Default
                  </button>
                  <RowActions />
                </>
              }
            />
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="text-[16px] font-semibold text-[#0A0A0A]">Auto-Pay Settings</div>

          <div className="mt-4 space-y-3">
            <SettingRow title="Auto-Pay Enabled" desc="Automatically pay bills when due using your default payment method" />
            <SettingRow title="Email Notifications" desc="Receive email confirmations for successful payments" />
          </div>
        </Panel>
      </div>
    </>
  );
}

function PaymentRow({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#EEEAF4] bg-[#F7F7FA] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="1.7"/><path d="M2 9h20" stroke="white" strokeWidth="1.7"/></svg>
        </span>
        <div>
          <div className="text-[14px] font-semibold text-[#0A0A0A]">{title}</div>
          <div className="text-[12px] text-[#6F6C90]">{subtitle}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

function RowActions() {
  return (
    <>
      <button className="rounded-[8px] border border-[#D9D4E5] px-2.5 py-1 text-[12px] text-[#3F205F]">Edit</button>
      <button className="rounded-[8px] border border-[#D9D4E5] px-2.5 py-1 text-[12px] text-[#C63D3D]">Delete</button>
    </>
  );
}

function SettingRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#EEEAF4] bg-[#F7F7FA] px-4 py-3">
      <div>
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{title}</div>
        <div className="text-[12px] text-[#6F6C90]">{desc}</div>
      </div>
      <button className="rounded-[8px] border border-[#CDBEE3] px-3 py-1 text-[12px] font-semibold text-[#3F205F]">
        Manage
      </button>
    </div>
  );
}
