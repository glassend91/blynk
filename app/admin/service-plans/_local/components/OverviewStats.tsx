"use client";

export default function OverviewStats({
  total,
  published,
  nbn,
  mobile,
}: {
  total: number;
  published: number;
  nbn: number;
  mobile: number;
}) {
  return (
    <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-4">
      <div className="rounded-[12px] border border-[#E7E4EC] bg-[#FBFBFD] p-4">
        <div className="mb-3 text-[16px] font-semibold text-[#0A0A0A]">Overview</div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat label="Total Plans" value={total} />
          <Stat label="Published" value={published} />
          <Stat label="NBN Plans" value={nbn} />
          <Stat label="Mobile Plan" value={mobile} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#E7E4EC] bg-white px-6 py-5">
      <span className="text-[14px] font-semibold text-[#6F6C90]">{label}</span>
      <span className="text-[22px] font-extrabold text-[#401B60]">{value}</span>
    </div>
  );
}
