"use client";

import { UserRow } from "../data";

function StatusPill({ value }: { value: UserRow["status"] }) {
  const map = {
    Active: "text-[#19BF66]",
    Inactive: "text-[#E0342F]",
    Pending: "text-[#F59E0B]",
  } as const;
  return <span className={["text-[14px] font-semibold", map[value]].join(" ")}>{value}</span>;
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
const IconView = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" stroke="#6F6C90" strokeWidth="1.6" />
    <circle cx="12" cy="12" r="3" stroke="#6F6C90" strokeWidth="1.6" />
  </svg>
);

type Props = {
  rows: UserRow[];
  onView?: (user: UserRow) => void;
  onEdit?: (user: UserRow) => void;
  onDelete?: (user: UserRow) => void;
};

export default function UsersTable({ rows, onView, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-4">
      <div className="rounded-[12px] border border-[#E7E4EC]">
        <div className="overflow-x-auto rounded-[12px]">
          <table className="w-full border-collapse text-left">
            <thead className="bg-[#F8F8F8] text-[13px] text-[#6F6C90]">
              <tr className="[&>th]:px-4 [&>th]:py-3">
                <th className="w-[56px]">#</th>
                <th>User</th>
                <th>Email</th>
                <th>Type</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Created</th>
                <th className="w-[120px] text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="text-[14px] text-[#0A0A0A]">
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-[#F0EEF3] hover:bg-[#FBFAFD] [&>td]:px-4 [&>td]:py-3">
                  <td>{r.id}</td>
                  <td>
                    <a href="#" className="text-[#401B60] underline-offset-2 hover:underline">
                      {r.name}
                    </a>
                  </td>
                  <td className="text-[#6F6C90]">{r.email}</td>
                  <td className="text-[#6F6C90]">{r.type || "-"}</td>
                  <td className="text-[#6F6C90]">{r.role}</td>
                  <td>
                    <StatusPill value={r.status} />
                  </td>
                  <td className="text-[#6F6C90]">{r.lastLogin}</td>
                  <td className="text-[#6F6C90]">{r.created}</td>
                  <td>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => onView?.(r)}
                        className="grid h-[34px] w-[34px] place-items-center rounded-[8px] border border-[#E7E4EC] bg-white"
                      >
                        <IconView />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit?.(r)}
                        className="grid h-[34px] w-[34px] place-items-center rounded-[8px] border border-[#E7E4EC] bg-white"
                      >
                        <IconEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(r)}
                        className="grid h-[34px] w-[34px] place-items-center rounded-[8px] border border-[#E7E4EC] bg-white"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-[14px] text-[#6F6C90]">
                    No users found.
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
