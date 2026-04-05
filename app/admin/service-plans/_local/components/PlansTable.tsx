"use client";

import type { PlanRow } from "../types";

function StatusBadge({ value }: { value: PlanRow["status"] }) {
  const map = {
    Published: "text-[#19BF66]",
    Draft: "text-[#F59E0B]",
    "Staff-Only": "text-[#6366F1]",
    Hidden: "text-[#6F6C90]",
  } as const;
  return <span className={["text-[14px] font-semibold", map[value] || "text-[#6F6C90]"].join(" ")}>{value}</span>;
}

const IconEdit = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" stroke="#401B60" strokeWidth="1.6" />
    <path d="M14.06 6.19 16.56 3.69 20.31 7.44l-2.5 2.5" stroke="#401B60" strokeWidth="1.6" />
  </svg>
);

const IconTrash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M19 7l-1 14H6L5 7" stroke="#E0342F" strokeWidth="1.6" />
    <path d="M3 7h18" stroke="#E0342F" strokeWidth="1.6" />
    <path d="M9 7V5h6v2" stroke="#E0342F" strokeWidth="1.6" />
  </svg>
);

const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#6F6C90" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3" stroke="#6F6C90" strokeWidth="1.6" />
  </svg>
);

const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-7-11-7a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#6F6C90" strokeWidth="1.6" />
    <path d="M1 1l22 22" stroke="#6F6C90" strokeWidth="1.6" />
  </svg>
);

type Props = {
  rows: PlanRow[];
  onEdit?: (plan: PlanRow) => void;
  onToggleActive?: (plan: PlanRow) => void;
  onDelete?: (plan: PlanRow) => void;
};

export default function PlansTable({ rows, onEdit, onToggleActive, onDelete }: Props) {
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
                {(onEdit || onToggleActive || onDelete) && (
                  <th className="w-[120px] text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="text-[14px] text-[#0A0A0A]">
              {rows.map((r) => (
                <tr
                  key={r.serviceId ?? r.id}
                  className="border-t border-[#F0EEF3] hover:bg-[#FBFAFD] [&>td]:px-4 [&>td]:py-3"
                >
                  <td>{r.id}</td>
                  <td className="text-[#401B60] underline-offset-2 hover:underline">{r.name}</td>
                  <td className="text-[#6F6C90]">{r.details}</td>
                  <td className="font-semibold text-[#000]">
                    <span className={r.type === "NBN" ? "text-[#FF00A8]" : "text-[#000]"}>{r.type}</span>
                  </td>
                  <td className="text-[#6F6C90]">{r.speedOrData}</td>
                  <td className="text-[#0A0A0A]">{r.price}</td>
                  <td><StatusBadge value={r.status} /></td>
                  <td className="text-[#6F6C90]">
                    {typeof r.customers === "number" ? r.customers.toLocaleString() : "-"}
                  </td>
                  {(onEdit || onToggleActive || onDelete) && (
                    <td>
                      <div className="flex items-center justify-center gap-3">
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(r)}
                            className="grid h-[34px] w-[34px] place-items-center rounded-[8px] border border-[#E7E4EC] bg-white hover:bg-[#F8F8F8]"
                            title="Edit plan"
                          >
                            <IconEdit />
                          </button>
                        )}
                        {onToggleActive && (
                          <button
                            type="button"
                            onClick={() => onToggleActive(r)}
                            className="grid h-[34px] w-[34px] place-items-center rounded-[8px] border border-[#E7E4EC] bg-white hover:bg-[#F8F8F8]"
                            title={r.status === "Published" ? "Hide plan" : r.status === "Hidden" ? "Show plan" : "Toggle visibility"}
                          >
                            {r.status === "Published" ? <IconEyeOff /> : <IconEye />}
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(r)}
                            className="grid h-[34px] w-[34px] place-items-center rounded-[8px] border border-[#E7E4EC] bg-white hover:bg-[#F8F8F8]"
                            title="Delete plan"
                          >
                            <IconTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={(onEdit || onToggleActive || onDelete) ? 9 : 8} className="px-4 py-10 text-center text-[14px] text-[#6F6C90]">
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
