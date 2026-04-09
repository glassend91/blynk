"use client";
export default function DashboardRecentActivity({
  items,
}: {
  items: { title: string; by: string; time: string }[];
}) {
  return (
    <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-5 shadow-[0_10px_24px_rgba(17,24,39,0.06)]">
      <h3 className="mb-3 text-[16px] font-semibold text-[#0A0A0A]">
        Recent Activity
      </h3>
      <ul className="space-y-3">
        {items?.slice(0, 4)?.map((r, i) => (
          <li
            key={i}
            className="flex items-center justify-between rounded-[10px] bg-[#F8F8F8] px-4 py-3"
          >
            <div>
              <div className="text-[14px] text-[#0A0A0A]">{r.title}</div>
              <div className="text-[12px] text-[#6F6C90]">{r.by}</div>
            </div>
            <span className="text-[12px] text-[#6F6C90]">
              {r.time.split("T")[0]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
