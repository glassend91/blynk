"use client";

import { useEffect, useMemo, useState } from "react";
import type { PermissionGroup, Role } from "../types";

export default function CreateRoleModal({
  open,
  onClose,
  onCreate,
  groups,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (role: Omit<Role, "id">) => void;
  groups: PermissionGroup[];
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) {
      setName("");
      setDesc("");
      setChecked({});
    }
  }, [open]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  const allKeys = useMemo(
    () => groups.flatMap((g) => g.items.map((i) => i.key)),
    [groups]
  );

  if (!open) return null;

  const toggle = (key: string) => setChecked((s) => ({ ...s, [key]: !s[key] }));
  const selectGroup = (key: string, on: boolean) => {
    const group = groups.find((g) => g.key === key);
    if (!group) return;
    setChecked((prev) => {
      const next = { ...prev };
      for (const it of group.items) next[it.key] = on;
      return next;
    });
  };

  return (
    <div
      className="fixed z-[90]"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'auto'
      }}
    >
      <div
        className="fixed bg-black/70"
        onClick={onClose}
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 90
        }}
      />
      <div
        className="fixed left-1/2 top-1/2 w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white p-6 shadow-2xl h-[80vh] overflow-y-auto"
        style={{ zIndex: 91 }}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">Create New Role</h2>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="mb-5 text-[14px] text-[#6F6C90]">
          Define a new role with specific permissions for your team members.
        </p>

        {/* Basic fields */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">Role Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="user@telco.com"
              className="w-full rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none placeholder-[#6F6C90]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">Description</label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter full name"
              className="w-full rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none placeholder-[#6F6C90]"
            />
          </div>
        </div>

        {/* Permissions */}
        <div className="mt-5 space-y-4">
          <div className="text-[14px] font-semibold text-[#0A0A0A]">Permissions</div>

          {groups.map((g) => (
            <div key={g.key} className="rounded-[12.75px] border border-[#DFDBE3] bg-[#FBFBFD]">
              <div className="flex items-center justify-between border-b border-[#E7E4EC] px-4 py-3">
                <div className="text-[14px] font-semibold text-[#0A0A0A]">{g.title}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => selectGroup(g.key, true)}
                    className="rounded-[8px] border border-[#DFDBE3] bg-white px-3 py-1 text-[12px] text-[#6F6C90]"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => selectGroup(g.key, false)}
                    className="rounded-[8px] border border-[#DFDBE3] bg-white px-3 py-1 text-[12px] text-[#6F6C90]"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid gap-3 p-4 md:grid-cols-2">
                {g.items.map((it) => {
                  const on = !!checked[it.key];
                  return (
                    <label
                      key={it.key}
                      className="flex cursor-pointer items-start justify-between rounded-[10px] border border-[#E7E4EC] bg-white px-4 py-3"
                    >
                      <div className="mr-3">
                        <div className="text-[14px] text-[#0A0A0A]">{it.title}</div>
                        {it.hint && <div className="text-[12px] text-[#6F6C90]">{it.hint}</div>}
                      </div>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(it.key)}
                        className="mt-[2px] h-[18px] w-[18px] accent-[#401B60]"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="h-[44px] flex-1 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] text-[14px] font-semibold text-[#6F6C90]"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onCreate({
                name: name || "New Role",
                description: desc || "Custom role",
                usersCount: 0,
                permissions: Object.fromEntries(
                  allKeys.map((k) => [k, !!checked[k]])
                ),
              })
            }
            className="h-[44px] flex-1 rounded-[10px] bg-[#401B60] text-[14px] font-semibold text-white"
          >
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
}
