"use client";

import type { Role } from "../types";

export default function RoleCard({
  role,
  onEdit,
  onRemove,
}: {
  role: Role;
  onEdit: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-5 shadow-[0_10px_24px_rgba(17,24,39,0.06)]">
      <div className="mb-3 flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-[16px] font-semibold text-[#0A0A0A]">{role.name}</div>
          <div className="text-[14px] text-[#6F6C90]">{role.description}</div>
        </div>
        {role.badge && (
          <span className="rounded-[8px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-1 text-[12px] text-[#6F6C90]">
            {role.badge}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between rounded-[10px] bg-[#F8F8F8] p-4">
        <div className="text-[20px] font-extrabold text-[#0A0A0A]">
          {Object.values(role.permissions).filter(Boolean).length} permissions
        </div>
        <div className="text-[12px] text-[#6F6C90]">{role.usersCount} users</div>
        <div className="flex gap-3">
          <button
            onClick={() => onRemove(role.id)}
            className="grid h-[36px] w-[36px] place-items-center rounded-[8px] border border-[#E7E4EC] bg-white"
            title="Delete"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 7l-1 14H6L5 7M3 7h18M9 7V5h6v2" stroke="#E0342F" strokeWidth="1.6" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(role.id)}
            className="grid h-[36px] w-[36px] place-items-center rounded-[8px] border border-[#E7E4EC] bg-white"
            title="Edit"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" stroke="#401B60" strokeWidth="1.6" />
              <path d="M14.06 6.19 16.56 3.69 20.31 7.44l-2.5 2.5" stroke="#401B60" strokeWidth="1.6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
