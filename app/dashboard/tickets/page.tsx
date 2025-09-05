import Panel from "../Panel";
import { Pill } from "../Pill";

export default function Tickets() {
  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Support Tickets</h1>

      <div className="grid grid-cols-3 gap-6">
        <StatTile title="Open Tickets" value="1" hint="Currently being resolved" />
        <StatTile title="Resolved Tickets" value="1" hint="Completed this month" />
        <StatTile title="Avg. Response Time" value="2h" hint="Average first response" />
      </div>

      <Panel className="mt-6 p-6">
        <div className="text-[15px] font-semibold text-[#0A0A0A]">Billing inquiry</div>

        <div className="mt-4 rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD]">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 8.5C6.5 4.5 17.5 4.5 22 8.5M5 12c4-3 10-3 14 0" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </span>
              <div>
                <div className="text-[14px] font-semibold text-[#0A0A0A]">Slow internet speeds</div>
                <div className="text-[12px] text-[#6F6C90]">Ticket #TK-2025-001</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Pill tone="purple">In Progress</Pill>
              <Pill tone="grey">Medium</Pill>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 border-t border-[#EEEAF4] p-4 text-[13px]">
            <div><div className="text-[#6F6C90]">Category</div><div className="font-semibold text-[#0A0A0A]">Technical</div></div>
            <div><div className="text-[#6F6C90]">Created</div><div className="font-semibold text-[#0A0A0A]">Jan 20, 2025</div></div>
            <div><div className="text-[#6F6C90]">Last Update</div><div className="font-semibold text-[#0A0A0A]">2 hours ago</div></div>
            <div><div className="text-[#6F6C90]">Messages</div><div className="font-semibold text-[#0A0A0A]">3</div></div>
          </div>
        </div>
      </Panel>

      <Panel className="mt-4 p-6">
        <div className="text-[15px] font-semibold text-[#0A0A0A]">Slow internet speeds</div>

        <div className="mt-4 rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD]">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 8.5C6.5 4.5 17.5 4.5 22 8.5M5 12c4-3 10-3 14 0" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </span>
              <div>
                <div className="text-[14px] font-semibold text-[#0A0A0A]">Billing inquiry</div>
                <div className="text-[12px] text-[#6F6C90]">Ticket #TK-2025-002</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Pill tone="green">Resolved</Pill>
              <Pill tone="grey">Low</Pill>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6 border-t border-[#EEEAF4] p-4 text-[13px]">
            <div><div className="text-[#6F6C90]">Category</div><div className="font-semibold text-[#0A0A0A]">Billing</div></div>
            <div><div className="text-[#6F6C90]">Created</div><div className="font-semibold text-[#0A0A0A]">Jan 15, 2025</div></div>
            <div><div className="text-[#6F6C90]">Last Update</div><div className="font-semibold text-[#0A0A0A]">3 days ago</div></div>
            <div><div className="text-[#6F6C90]">Messages</div><div className="font-semibold text-[#0A0A0A]">5</div></div>
          </div>
        </div>
      </Panel>
    </>
  );
}

function StatTile({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <Panel className="p-6">
      <div className="text-[14px] font-semibold text-[#0A0A0A]">{title}</div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-[28px] font-extrabold text-[#0A0A0A]">{value}</div>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F4F3F7] text-[#3F205F]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
        </span>
      </div>
      <div className="text-[12px] text-[#6F6C90] mt-1">{hint}</div>
    </Panel>
  );
}
