"use client";

import type { PlanRow } from "../types";

function StatusBadge({ value }: { value: PlanRow["status"] }) {
  const map = {
    Published: "text-[#19BF66]",
    Draft: "text-[#F59E0B]",
  } as const;
  return <span className={["text-[14px] font-semibold", map[value]].join(" ")}>{value}</span>;
}

export default function PlansTable({ rows }: { rows: PlanRow[] }) {
  return (
    <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-4">
      <div className="rounded-[12px] border border-[#E7E4EC]">
        <div className="overflow-x-auto rounded-[12px]">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#F8F8F8] text-[13px] text-[#6F6C90]">
              <tr className="[&>th]:px-4 [&>th]:py-3">
                <th className="w-[56px]">#</th>
                <th>Plan</th>
                <th>Details</th>
                <th>Type</th>
                <th>Speed/Data</th>
                <th>Price</th>
                <th>Status</th>
                <th>Customers</th>
              </tr>
            </thead>
            <tbody className="text-[14px] text-[#0A0A0A]">
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-[#F0EEF3] hover:bg-[#FBFAFD] [&>td]:px-4 [&>td]:py-3">
                  <td>{r.id}</td>
                  <td className="text-[#401B60] underline-offset-2 hover:underline">{r.name}</td>
                  <td className="text-[#6F6C90]">{r.details}</td>
                  <td className="font-semibold text-[#000]">
                    <span className={r.type === "NBN" ? "text-[#FF00A8]" : "text-[#000]"}>{r.type}</span>
                  </td>
                  <td className="text-[#6F6C90]">{r.speedOrData}</td>
                  <td className="text-[#0A0A0A]">{r.price}</td>
                  <td><StatusBadge value={r.status} /></td>
                  <td className="text-[#6F6C90]">{r.customers.toLocaleString()}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-[14px] text-[#6F6C90]">
                    No plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
