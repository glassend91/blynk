'use client';

import { useState } from 'react';

export default function PanelNotifications() {
  // email notifications
  const [newTickets, setNewTickets] = useState(true);
  const [newUsers, setNewUsers] = useState(true);
  const [alerts, setAlerts] = useState(true);

  // sms notifications
  const [smsCritical, setSmsCritical] = useState(true);
  const [smsOutages, setSmsOutages] = useState(true);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="rounded-[12.75px] border border-[#DFDBE3] p-6">
        <div className="mb-4">
          <h3 className="text-[16px] font-semibold text-[#0A0A0A]">Notification Settings</h3>
        </div>

        <Row label="New support tickets" checked={newTickets} onChange={setNewTickets} />
        <Row label="New user registrations" checked={newUsers} onChange={setNewUsers} />
        <Row label="System alerts" checked={alerts} onChange={setAlerts} />
      </section>

      <section className="rounded-[12.75px] border border-[#DFDBE3] p-6">
        <div className="mb-4">
          <h3 className="text-[16px] font-semibold text-[#0A0A0A]">SMS Notifications</h3>
        </div>
        <Row label="Critical system alerts" checked={smsCritical} onChange={setSmsCritical} />
        <Row label="Service outages" checked={smsOutages} onChange={setSmsOutages} />
      </section>

      <div className="md:col-span-2 flex justify-end">
        <button className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white">
          Save Notification Settings
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
    <div className="mb-3 flex items-center justify-between rounded-[10px] bg-[#F8F8F8] px-4 py-3">
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
