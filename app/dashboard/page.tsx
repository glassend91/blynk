import Panel from "../dashboard/Panel";
import Progress from "../dashboard/Progress";
import { Pill } from "../dashboard/Pill";
import { parseAndFormatDate, convertMonthNameToAU } from "@/lib/dateUtils";

export default function DashboardHome() {
  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Overview of your services and account Active Services</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Active Services */}
        <Panel className="col-span-1 p-6">
          <div className="text-[18px] font-semibold text-[#0A0A0A]">Active Services</div>
          <div className="mt-4 space-y-4">
            {[
              { name: "NBN 100/20", price: "$79.99/month", icon: "wifi" },
              { name: "60GB Mobile", price: "$45.00/month", icon: "sim" },
            ].map((s) => (
              <div key={s.name} className="rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD] px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#3F205F] text-white">
                      {s.icon === "wifi" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 8.5C6.5 4.5 17.5 4.5 22 8.5M5 12c4-3 10-3 14 0M8.5 15.5c2-1.5 5-1.5 7 0" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
                      ) : (
                        <svg width="16" height="20" viewBox="0 0 16 20" fill="none"><rect x="3" y="1.5" width="10" height="17" rx="3" stroke="white" strokeWidth="1.8" /><circle cx="8" cy="15" r="1.4" fill="white" /></svg>
                      )}
                    </span>
                    <div>
                      <div className="text-[15px] font-semibold text-[#0A0A0A]">{s.name}</div>
                      <div className="text-[12px] text-[#6F6C90]">{s.price}</div>
                    </div>
                  </div>
                  <Pill tone="green">Active</Pill>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Mobile Data Usage */}
        <Panel className="col-span-1 p-6">
          <div className="text-[18px] font-semibold text-[#0A0A0A]">Mobile Data Usage</div>
          <div className="mt-6">
            <div className="mb-2 text-[14px] text-[#0A0A0A]">42.5GB used</div>
            <Progress value={42.5} max={60} />
            <div className="mt-3 text-right text-[12px] text-[#6F6C90]">60GB total</div>
            <div className="mt-3 text-[13px] text-[#6F6C90]">Resets on {parseAndFormatDate("2025-02-10")}</div>
          </div>
        </Panel>

        {/* Upcoming Bills */}
        <Panel className="col-span-1 p-6">
          <div className="flex items-center justify-between">
            <div className="text-[18px] font-semibold text-[#0A0A0A]">Upcoming Bills</div>
            <button className="rounded-[10px] bg-[#3F205F] px-3 py-1.5 text-[12px] font-semibold text-white">View All Bills</button>
          </div>
          <div className="mt-4 divide-y divide-[#EEEAF4]">
            {[
              { label: "Mobile Plan", due: "2025-02-10", amount: "$45.00" },
              { label: "NBN Plan", due: "2025-02-15", amount: "$79.99" },
            ].map((b) => (
              <div key={b.label} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#3F205F] text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 2h10a2 2 0 0 1 2 2v18l-7-3-7 3V4a2 2 0 0 1 2-2Z" stroke="white" strokeWidth="1.6" /></svg>
                  </span>
                  <div>
                    <div className="text-[14px] font-semibold text-[#0A0A0A]">{b.label}</div>
                    <div className="text-[12px] text-[#6F6C90]">Due: {parseAndFormatDate(b.due)}</div>
                  </div>
                </div>
                <div className="text-[14px] font-semibold text-[#0A0A0A]">{b.amount}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Recent Support Tickets */}
        <Panel className="col-span-1 p-6">
          <div className="flex items-center justify-between">
            <div className="text-[18px] font-semibold text-[#0A0A0A]">Recent Support Tickets</div>
            <button className="rounded-[10px] border border-[#D9D4E5] px-3 py-1.5 text-[12px] font-semibold text-[#3F205F]">View All Tickets</button>
          </div>
          <div className="mt-4 space-y-3">
            <TicketRow title="Internet connection issues" id={`#T-2401 • ${parseAndFormatDate("2025-01-28")}`} state="Resolved" />
            <TicketRow title="Billing inquiry" id={`#T-2398 • ${parseAndFormatDate("2025-01-25")}`} state="Open" />
          </div>
        </Panel>

        {/* Recent Invoices */}
        <Panel className="col-span-1 p-6">
          <div className="flex items-center justify-between">
            <div className="text-[18px] font-semibold text-[#0A0A0A]">Recent Invoices</div>
            <button className="rounded-[10px] border border-[#D9D4E5] px-3 py-1.5 text-[12px] font-semibold text-[#3F205F]">View All</button>
          </div>
          <div className="mt-4 space-y-3">
            <InvoiceRow date={convertMonthNameToAU("Jan 15, 2025")} label="Monthly Services" amount="$134.95" />
            <InvoiceRow date={convertMonthNameToAU("Dec 15, 2024")} label="Monthly Services" amount="$134.95" />
          </div>
        </Panel>

        {/* Quick Actions */}
        <Panel className="col-span-1 p-6">
          <div className="text-[18px] font-semibold text-[#0A0A0A]">Quick Actions</div>
          <div className="mt-4 space-y-3">
            {["Pay Bill", "Report Issue", "Add Service"].map((a) => (
              <button key={a} className="flex w-full items-center gap-3 rounded-[12px] bg-[#F7F7FA] px-4 py-3 text-left text-[14px] font-semibold text-[#0A0A0A] hover:bg-[#EFEAF7]">
                {a}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function TicketRow({ title, id, state }: { title: string; id: string; state: "Open" | "Resolved" }) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD] px-4 py-3">
      <div>
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{title}</div>
        <div className="text-[12px] text-[#6F6C90]">{id}</div>
      </div>
      <Pill tone={state === "Resolved" ? "green" : "purple"}>{state}</Pill>
    </div>
  );
}

function InvoiceRow({ date, label, amount }: { date: string; label: string; amount: string }) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD] px-4 py-3">
      <div>
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{date}</div>
        <div className="text-[12px] text-[#6F6C90]">{label}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{amount}</div>
        <Pill tone="green">Paid</Pill>
      </div>
    </div>
  );
}
