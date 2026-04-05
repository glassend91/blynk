"use client";
export default function DashboardPendingTasks({ items }: { items: string[] }) {
  return (
    <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-5 shadow-[0_10px_24px_rgba(17,24,39,0.06)]">
      <h3 className="mb-3 text-[16px] font-semibold text-[#0A0A0A]">Pending Tasks</h3>
      <ul className="space-y-3">
        {items.map((t, i) => (
          <li key={i} className="flex items-center justify-between rounded-[10px] bg-[#F8F8F8] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-[6px] w-[6px] rounded-full bg-[#0A0A0A]" />
              <span className="text-[14px] text-[#0A0A0A]">{t}</span>
            </div>
            <button className="rounded-[10px] border border-[#DFDBE3] px-4 py-1.5 text-[12px] font-semibold text-[#0A0A0A] hover:bg-[#F5F4F8]">
              View
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
