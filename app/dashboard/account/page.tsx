import Panel from "../Panel";

export default function AccountManagement() {
  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Account Management</h1>

      <div className="grid grid-cols-2 gap-6">
        <Panel className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">Personal Information</div>
            <button className="rounded-[8px] border border-[#D9D4E5] px-3 py-1 text-[12px] text-[#3F205F]">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["First Name", "Last Name", "Email Address", "Phone Number", "Delivery Address"].map((l, i) => (
              <div key={l} className={i === 4 ? "col-span-2" : ""}>
                <label className="mb-1 block text-[13px] text-[#0A0A0A]">{l}</label>
                <input className="h-[44px] w-full rounded-[12px] border border-[#E5E2EA] bg-[#F8F8FB] px-3 text-[14px] outline-none focus:border-[#3F205F]" placeholder={`Enter your ${l.toLowerCase()}`} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">Address Information</div>
            <button className="rounded-[8px] border border-[#D9D4E5] px-3 py-1 text-[12px] text-[#3F205F]">Edit</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {["Street Address", "Suburb", "City", "Country", "State", "Postcode"].map((l) => (
              <div key={l}>
                <label className="mb-1 block text-[13px] text-[#0A0A0A]">{l}</label>
                <input className="h-[44px] w-full rounded-[12px] border border-[#E5E2EA] bg-[#F8F8FB] px-3 text-[14px] outline-none focus:border-[#3F205F]" placeholder={`Enter your ${l.toLowerCase()}`} />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <Panel className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">Security Settings</div>
            <button className="rounded-[8px] border border-[#D9D4E5] px-3 py-1 text-[12px] text-[#3F205F]">Change Password</button>
          </div>

          <div className="space-y-3">
            {[
              ["Two-Factor Authentication", "Add an extra layer of security to your account"],
              ["Email Notifications", "Receive security alerts and account updates"],
              ["SMS Notifications", "Receive service alerts and payment reminders"],
            ].map(([t, d]) => (
              <ToggleRow key={t} title={t} desc={d} />
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="mb-4 text-[16px] font-semibold text-[#0A0A0A]">Communication Preferences</div>

          <div className="space-y-3">
            {[
              ["Marketing Communications", "Receive offers and product updates"],
              ["Service Updates", "Network maintenance and service improvements"],
              ["Billing Notifications", "Invoice and payment confirmations"],
            ].map(([t, d]) => (
              <ToggleRow key={t} title={t} desc={d} />
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function ToggleRow({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#EEEAF4] bg-[#F7F7FA] px-4 py-3">
      <div>
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{title}</div>
        <div className="text-[12px] text-[#6F6C90]">{desc}</div>
      </div>
      <input type="checkbox" className="h-5 w-9 cursor-pointer rounded-full bg-[#D9D4E5] accent-[#2F8E51]" defaultChecked />
    </div>
  );
}
