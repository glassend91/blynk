import Panel from "../Panel";
import Progress from "../Progress";

export default function DataUsage() {
  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Data Usage</h1>

      <div className="mb-5 flex justify-end">
        <button className="rounded-[10px] bg-[#3F205F] px-4 py-2 text-[14px] font-semibold text-white">
          Add Payment Method
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column */}
        <div className="col-span-2 space-y-6">
          <Panel className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-[16px] font-semibold text-[#0A0A0A]">Combined Data Usage</div>
              <span className="rounded-[8px] bg-[#EFE9F7] px-2.5 py-1 text-[12px] font-semibold text-[#3F205F]">Normal Usage</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="text-[13px] text-[#0A0A0A]">87.5GB used</div>
              <Progress value={87.5} max={160} />
              <div className="flex items-center justify-between text-[12px] text-[#6F6C90]">
                <span>72.5GB remaining</span>
                <span>160GB total</span>
              </div>
              <div className="text-right text-[12px] text-[#6F6C90]">54.7% used</div>
            </div>
          </Panel>

          {[{ title: "60GB Mobile Plan", msisdn: "0412 345 678", used: 42.5, total: 60, reset: "2025-02-10" },
            { title: "100GB Data Only", msisdn: "0423 456 789", used: 45, total: 100, reset: "2025-02-12" }].map((x) => (
            <Panel key={x.title} className="p-6">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white">
                  <svg width="16" height="20" viewBox="0 0 16 20" fill="none"><rect x="3" y="1.5" width="10" height="17" rx="3" stroke="white" strokeWidth="1.8"/><circle cx="8" cy="15" r="1.4" fill="white"/></svg>
                </span>
                <div>
                  <div className="text-[14px] font-semibold text-[#0A0A0A]">{x.title}</div>
                  <div className="text-[12px] text-[#6F6C90]">{x.msisdn}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 text-[13px] text-[#0A0A0A]">{x.used}GB used</div>
                <Progress value={x.used} max={x.total} />
                <div className="mt-2 flex items-center justify-between text-[12px] text-[#6F6C90]">
                  <span>{x.total}GB total</span>
                  <span>{((x.used / x.total) * 100).toFixed(1)}% used</span>
                </div>
                <div className="mt-2 text-[12px] text-[#6F6C90]">Resets on {x.reset}</div>
              </div>
            </Panel>
          ))}
        </div>

        {/* Right column */}
        <div className="col-span-1 space-y-6">
          <Panel className="p-6">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">Daily Usage (Last 7 Days)</div>
            <div className="mt-4 space-y-3 text-[13px]">
              {["29 Jan","30 Jan","31 Jan","1 Feb","2 Feb","3 Feb","4 Feb"].map((d, i) => (
                <div key={d} className="flex items-center gap-3">
                  <div className="w-16 text-[#6F6C90]">{d}</div>
                  <div className="flex-1">
                    <div className="h-2.5 w-full rounded-full bg-[#E9E6F0]">
                      <div className="h-2.5 rounded-full bg-[#3F205F]" style={{ width: `${60 + i * 5}%` }} />
                    </div>
                  </div>
                  <div className="w-10 text-right text-[#6F6C90]">2.1GB</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">Usage Tips</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
              {[
                ["WiFi Connection", "Connect to WiFi when available to save mobile data"],
                ["Data Saver Mode", "Enable data saver in your device settings"],
                ["App Management", "Monitor which apps use the most data"],
                ["Data Alerts", "Set up usage alerts to avoid overages"],
              ].map(([t, d]) => (
                <div key={t} className="rounded-[12px] bg-[#F7F7FA] p-3">
                  <div className="text-[14px] font-semibold text-[#0A0A0A]">{t}</div>
                  <div className="text-[#6F6C90]">{d}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
