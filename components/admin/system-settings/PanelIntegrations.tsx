'use client';

import { useState } from 'react';

export default function PanelIntegrations() {
  const [ovApi, setOvApi] = useState('https://api.oneview.com.au/v1');
  const [ovKey, setOvKey] = useState('•••••••••••••');
  const [ovEnabled, setOvEnabled] = useState(true);

  const [zohoClient, setZohoClient] = useState('1000.ABC123XYZ');
  const [zohoKey, setZohoKey] = useState('•••••••••••••');
  const [zohoSync, setZohoSync] = useState(true);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Oneview */}
      <section className="rounded-[12.75px] border border-[#DFDBE3] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#0A0A0A]">Oneview API Configuration</h3>
          <button className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white">
            Test Connection
          </button>
        </div>

        <Field label="API Endpoint">
          <input
            value={ovApi}
            onChange={(e) => setOvApi(e.target.value)}
            className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-[11px] outline-none"
          />
        </Field>

        <div className="mt-4">
          <Field label="API Key">
            <input
              value={ovKey}
              onChange={(e) => setOvKey(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-[11px] outline-none"
            />
          </Field>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-[14px] text-[#0A0A0A]">Enable Oneview Integration</span>
          <Switch checked={ovEnabled} onChange={setOvEnabled} />
        </div>
      </section>

      {/* Zoho */}
      <section className="rounded-[12.75px] border border-[#DFDBE3] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#0A0A0A]">Zoho CRM Integration</h3>
          <button className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white">
            Authorize Zoho
          </button>
        </div>

        <Field label="Client ID">
          <input
            value={zohoClient}
            onChange={(e) => setZohoClient(e.target.value)}
            className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-[11px] outline-none"
          />
        </Field>

        <div className="mt-4">
          <Field label="API Key">
            <input
              value={zohoKey}
              onChange={(e) => setZohoKey(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-[11px] outline-none"
            />
          </Field>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-[14px] text-[#0A0A0A]">Enable Support Ticket Sync</span>
          <Switch checked={zohoSync} onChange={setZohoSync} />
        </div>
      </section>
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
