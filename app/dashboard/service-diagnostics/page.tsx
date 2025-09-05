import Panel from "../Panel";
import { Pill } from "../Pill";

export default function Diagnostics() {
  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Service Diagnostics & Outages</h1>

      <div className="grid grid-cols-3 gap-6">
        <Panel className="col-span-2 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">Service Status</div>
            <button className="rounded-[8px] border border-[#CDBEE3] px-3 py-1 text-[12px] font-semibold text-[#3F205F]">Run Network Test</button>
          </div>

          <div className="space-y-3">
            {[
              ["NBN Service", "Active"],
              ["Mobile Service", "Active"],
            ].map(([name, state]) => (
              <div key={name} className="flex items-center justify-between rounded-[12px] bg-[#F7F7FA] px-4 py-3">
                <div className="text-[14px] font-semibold text-[#0A0A0A]">{name}</div>
                <Pill tone="green">{state}</Pill>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="text-[16px] font-semibold text-[#0A0A0A]">Recent Outages</div>
          <div className="mt-4 space-y-3">
            <OutageRow
              place="Sydney CBD"
              meta="NBN • Reported: 2025-02-03 14:30 • Resolved: 2025-02-03 16:45"
              action="Resolve"
              tone="grey"
            />
            <OutageRow
              place="Parramatta"
              meta="Mobile • Reported: 2025-02-04 09:15"
              action="Investigating"
              tone="purple"
            />
          </div>
        </Panel>
      </div>
    </>
  );
}

function OutageRow({
  place,
  meta,
  action,
  tone,
}: {
  place: string;
  meta: string;
  action: string;
  tone: "grey" | "purple";
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] bg-[#F7F7FA] px-4 py-3">
      <div>
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{place}</div>
        <div className="text-[12px] text-[#6F6C90]">{meta}</div>
      </div>
      <span className={`rounded-[8px] px-3 py-1 text-[12px] font-semibold ${tone === "grey" ? "bg-[#EFF1F5] text-[#667085]" : "bg-[#EFE9F7] text-[#3F205F]"}`}>
        {action}
      </span>
    </div>
  );
}
