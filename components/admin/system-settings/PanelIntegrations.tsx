'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export default function PanelIntegrations() {
  const [ovApi, setOvApi] = useState('https://api.oneview.com.au/v1');
  const [ovKey, setOvKey] = useState('');
  const [ovEnabled, setOvEnabled] = useState(false);
  const [ovHasKey, setOvHasKey] = useState(false); // Track if there's a saved key

  const [zohoClient, setZohoClient] = useState('');
  const [zohoKey, setZohoKey] = useState('');
  const [zohoSync, setZohoSync] = useState(false);
  const [zohoHasKey, setZohoHasKey] = useState(false); // Track if there's a saved key

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get<{ success: boolean; data: any }>('/system-settings');
      
      if (data?.success && data.data) {
        const settings = data.data;
        
        // Oneview settings
        if (settings.integrations?.oneview) {
          setOvApi(settings.integrations.oneview.apiEndpoint || 'https://api.oneview.com.au/v1');
          setOvKey('');
          setOvHasKey(!!settings.integrations.oneview.apiKey);
          setOvEnabled(settings.integrations.oneview.enabled || false);
        }
        
        // Zoho settings
        if (settings.integrations?.zoho) {
          setZohoClient(settings.integrations.zoho.clientId || '');
          setZohoKey('');
          setZohoHasKey(!!settings.integrations.zoho.apiKey);
          setZohoSync(settings.integrations.zoho.syncEnabled || false);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch settings:', err);
      setMessage({ type: 'error', text: err?.message || 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      
      const payload: any = {
        oneview: {
          apiEndpoint: ovApi,
          enabled: ovEnabled
        },
        zoho: {
          clientId: zohoClient,
          syncEnabled: zohoSync
        }
      };
      
      // Only include API keys if they were changed (not empty)
      if (ovKey) {
        payload.oneview.apiKey = ovKey;
      }
      if (zohoKey) {
        payload.zoho.apiKey = zohoKey;
      }
      
      const { data } = await apiClient.put<{ success: boolean; message: string }>('/system-settings/integrations', payload);

      if (data?.success) {
        setMessage({ type: 'success', text: data.message || 'Settings saved successfully' });
        // Update hasKey flags if keys were changed
        if (ovKey) {
          setOvHasKey(true);
          setOvKey(''); // Clear the actual key after saving
        }
        if (zohoKey) {
          setZohoHasKey(true);
          setZohoKey(''); // Clear the actual key after saving
        }
      }
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      setMessage({ type: 'error', text: err?.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleTestOneview = async () => {
    try {
      setTesting(true);
      setMessage(null);
      
      // If no API key entered, the backend will use the saved one
      const payload: any = {
        apiEndpoint: ovApi
      };
      
      if (ovKey) {
        payload.apiKey = ovKey;
      }
      
      const { data } = await apiClient.post<{ success: boolean; message: string }>('/system-settings/integrations/oneview/test', payload);

      setMessage({
        type: data.success ? 'success' : 'error',
        text: data.message || (data.success ? 'Connection successful' : 'Connection failed')
      });
    } catch (err: any) {
      console.error('Failed to test connection:', err);
      setMessage({ type: 'error', text: err?.message || 'Failed to test connection' });
    } finally {
      setTesting(false);
    }
  };

  const handleOvKeyChange = (value: string) => {
    setOvKey(value);
    if (value) {
      setOvHasKey(false); // User is entering a new key
    }
  };

  const handleZohoKeyChange = (value: string) => {
    setZohoKey(value);
    if (value) {
      setZohoHasKey(false); // User is entering a new key
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[16px] text-[#6F6C90]">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-[10px] border px-4 py-3 text-[13px] ${
            message.type === 'success'
              ? 'border-[#C6F6D5] bg-[#F0FFF4] text-[#22543D]'
              : 'border-[#FCD1D2] bg-[#FFF5F5] text-[#C53030]'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Oneview */}
        <section className="rounded-[12.75px] border border-[#DFDBE3] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold text-[#0A0A0A]">Oneview API Configuration</h3>
            <button
              onClick={handleTestOneview}
              disabled={testing}
              className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test Connection'}
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
                type="password"
                value={ovKey || (ovHasKey ? '•••••••••••••' : '')}
                onChange={(e) => handleOvKeyChange(e.target.value)}
                placeholder={ovHasKey ? "Enter new API key to update" : "Enter API key"}
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
                type="password"
                value={zohoKey || (zohoHasKey ? '•••••••••••••' : '')}
                onChange={(e) => handleZohoKeyChange(e.target.value)}
                placeholder={zohoHasKey ? "Enter new API key to update" : "Enter API key"}
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

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Integration Settings'}
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
