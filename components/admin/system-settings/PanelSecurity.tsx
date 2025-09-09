'use client';

import { useState } from 'react';

export default function PanelSecurity() {
  const [require2fa, setRequire2fa] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState(true);
  const [timeout, setTimeout] = useState(60);

  return (
    <div className="space-y-6">
      <section className="rounded-[12.75px] border border-[#DFDBE3] p-6">
        <h3 className="mb-4 text-[16px] font-semibold text-[#0A0A0A]">Security Settings</h3>

        <div className="rounded-[10px] bg-[#F8F8F8] p-4">
          <h4 className="mb-3 text-[14px] font-medium text-[#0A0A0A]">Authentication</h4>
          <Row
            label="Require two-factor authentication"
            checked={require2fa}
            onChange={setRequire2fa}
          />
          <Row label="Password expiry (90 days)" checked={passwordExpiry} onChange={setPasswordExpiry} />
        </div>

        <div className="mt-5 rounded-[10px] bg-[#F8F8F8] p-4">
          <h4 className="mb-3 text-[14px] font-medium text-[#0A0A0A]">Session Management</h4>
          <div className="flex items-center gap-3">
            <span className="text-[14px] text-[#0A0A0A]">Session timeout (minutes)</span>
            <input
              type="number"
              min={1}
              value={timeout}
              onChange={(e) => setTimeout(parseInt(e.target.value || '0', 10))}
              className="w-[72px] rounded-[8px] border border-[#DFDBE3] bg-white px-3 py-[9px] text-center outline-none"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white">
          Save Security Settings
        </button>
      </div>
    </div>
  );
}

function Row({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="mb-3 flex items-center justify-between rounded-[10px] px-4 py-3">
      <span className="text-[14px] text-[#0A0A0A]">{label}</span>
      <Switch checked={checked} onChange={onChange} />
    </div>
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
