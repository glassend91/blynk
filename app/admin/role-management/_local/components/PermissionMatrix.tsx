"use client";

import type { PermissionGroup, Role } from "../types";

function Tick({ on, faint = false }: { on: boolean; faint?: boolean }) {
  return (
    <div
      className={[
        "mx-auto h-[22px] w-[22px] rounded-[6px] border",
        on
          ? "border-[#19BF66] bg-[#E9FBF2]"
          : faint
          ? "border-[#E7E4EC] bg-[#F8F8F8]"
          : "border-[#E7E4EC] bg-white",
      ].join(" ")}
    >
      {on && (
        <svg viewBox="0 0 24 24" width="18" height="18" className="m-[1px] text-[#19BF66]">
          <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      )}
    </div>
  );
}

export default function PermissionMatrix({
  groups,
  roles,
}: {
  groups: PermissionGroup[];
  roles: Role[];
}) {
  return (
    <div className="space-y-6">
      {groups.map((g, gi) => (
        <div key={g.key} className="rounded-[12.75px] border border-[#DFDBE3] bg-white">
          <div className="flex items-center justify-between border-b border-[#E7E4EC] px-4 py-3">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">
              {gi + 1}. {g.title}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[#F8F8F8] text-[13px] text-[#6F6C90]">
                <tr className="[&>th]:px-4 [&>th]:py-3">
                  <th className="w-[56px]">#</th>
                  <th>Permission</th>
                  {roles.map((r) => (
                    <th key={r.id} className="text-center">{r.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[14px] text-[#0A0A0A]">
                {g.items.map((it, idx) => (
                  <tr key={it.key} className="border-t border-[#F0EEF3] [&>td]:px-4 [&>td]:py-3">
                    <td className="text-[#6F6C90]">{idx + 1}</td>
                    <td>
                      <div className="flex flex-col">
                        <span>{it.title}</span>
                        {it.hint && <span className="text-[12px] text-[#6F6C90]">{it.hint}</span>}
                      </div>
                    </td>
                    {roles.map((r) => (
                      <td key={r.id} className="text-center">
                        <Tick on={!!r.permissions[it.key]} faint />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
