"use client";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="px-[15px] text-[12px] font-semibold uppercase tracking-[0.6px] text-[#6F6C90]">
        {title}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Item({ label, href = "#", active = false }: { label: string; href?: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={[
        "mx-[14px] flex items-center gap-[11px] rounded-[8.75px] px-[11px] py-2 text-[14px] font-semibold",
        active ? "bg-[#401B60] text-white" : "text-[#6F6C90] hover:bg-[#F5F4F8]",
      ].join(" ")}
    >
      <span>{label}</span>
    </a>
  );
}

export default function Sidebar({ width = 234 }: { width?: number }) {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen border-r border-[#DFDBE3] bg-white" style={{ width }}>
      {/* Logo row */}
      <div className="flex h-[89px] items-center border-b border-[#DFDBE3] px-[15px]">
        {/* Replace with your logo image if available */}
        <img src="https://api.builder.io/api/v1/image/assets/TEMP/6fb75eb88f22c13e4a96e9aa89f994b1c316a459?width=474" alt="Blynk" className="h-[41px] w-[194px]" />
      </div>

      {/* Sections */}
      <div className="flex h-[calc(100%-153px)] flex-col gap-6 overflow-auto px-[1px] py-[18px]">
        <Section title="Overview">
          <Item label="Dashboard" href="/admin/dashboard" active />
        </Section>

        <Section title="Management">
          <Item label="User Management" href="/admin/user-management" />
          <Item label="Role Management" href="/admin/role-management" />
        </Section>

        <Section title="Content">
          <Item label="Service Plan" href="/admin/service-plans" />
          <Item label="Website Content" href="/admin/website-content" />
          <Item label="Testimonial" href="/admin/testimonials" />
        </Section>

        <Section title="Operations">
          <Item label="Technician Network" href="/admin/technician-network" />
          <Item label="SIM Orders" href="/admin/sim-orders" />
          <Item label="Support Tickets" href="/admin/support-tickets" />
          <Item label="Customer Verification" href="/admin/customer-verification" />
          <Item label="Customer Notes" href="/admin/customer-notes" />
          <Item label="Customer Plans" href="/admin/customer-plans" />
        </Section>

        <Section title="System">
          <Item label="System Settings" href="/admin/system-settings" />
        </Section>
      </div>

      {/* Sign out */}
      <div className="absolute bottom-0 w-full bg-[#FFF0F0] px-[14px] py-[15px]">
        <button className="flex w-[205px] items-center gap-[11.5px] rounded-[8.75px] px-[10.5px] py-[7px] text-[16px] font-semibold text-[#FF0000]">
          <svg width="18" height="19" viewBox="0 0 18 19" fill="none" aria-hidden>
            <path d="M12.164 13.146 15.81 9.5 12.164 5.854" stroke="#FF0000" strokeWidth="1.45833" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.812 9.5H7.063" stroke="#FF0000" strokeWidth="1.45833" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.063 16.063H4.146a1.46 1.46 0 0 1-1.459-1.459V4.396a1.46 1.46 0 0 1 1.459-1.459H7.063" stroke="#FF0000" strokeWidth="1.45833" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
