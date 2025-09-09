'use client';

import { useState } from 'react';

export default function PanelSystem() {
  const [company, setCompany] = useState('Your Telecommunications Provider');
  const [email, setEmail] = useState('support@yourtelco.com.au');
  const [oneview, setOneview] = useState(true);

  return (
    <div className="space-y-6">
      <section className="rounded-[12.75px] border border-[#DFDBE3] p-6">
        <div className="mb-4">
          <h3 className="text-[16px] font-semibold text-[#0A0A0A]">System Configuration</h3>
          <p className="mt-1 text-[14px] text-[#6F6C90]">General Settings</p>
        </div>

        <Field label="Company Name">
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-[11px] outline-none"
          />
        </Field>

        <div className="mt-4">
          <Field label="Support Email">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-[11px] outline-none"
            />
          </Field>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-[14px] text-[#0A0A0A]">Enable Oneview Integration</span>
          <Switch checked={oneview} onChange={setOneview} />
        </div>

        <div className="mt-6">
          <h4 className="mb-3 text-[14px] font-medium text-[#0A0A0A]">System Maintenance</h4>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-[6px] border border-[#DFDBE3] bg-white px-4 py-[9px] text-[14px]">
              View System Logs
            </button>
            <button className="rounded-[6px] border border-[#DFDBE3] bg-white px-4 py-[9px] text-[14px]">
              Export Data
            </button>
            <button className="rounded-[6px] border border-[#DFDBE3] bg-white px-4 py-[9px] text-[14px]">
              Clear Cache
            </button>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white">
          Save System Settings
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: React.PropsWithChildren<{ label: string }>) {
  return (
    <label className="block">
      <div className="mb-2 text-[14px] font-medium text-[#0A0A0A]">{label}</div>
      {children}
    </label>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        'h-6 w-11 rounded-full px-1 transition-colors',
        checked ? 'bg-[#2BBF5A]' : 'bg-[#DFDBE3]',
      ].join(' ')}
      aria-pressed={checked}
    >
      <span
        className={[
          'block h-4 w-4 rounded-full bg-white transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  );
}
