'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export default function PanelNotifications() {
  // email notifications
  const [newTickets, setNewTickets] = useState(true);
  const [newUsers, setNewUsers] = useState(true);
  const [alerts, setAlerts] = useState(true);

  // sms notifications
  const [smsCritical, setSmsCritical] = useState(true);
  const [smsOutages, setSmsOutages] = useState(true);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
        
        // Email notifications
        if (settings.notifications?.email) {
          setNewTickets(settings.notifications.email.newTickets ?? true);
          setNewUsers(settings.notifications.email.newUsers ?? true);
          setAlerts(settings.notifications.email.systemAlerts ?? true);
        }
        
        // SMS notifications
        if (settings.notifications?.sms) {
          setSmsCritical(settings.notifications.sms.criticalAlerts ?? true);
          setSmsOutages(settings.notifications.sms.serviceOutages ?? true);
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
      
      const { data } = await apiClient.put<{ success: boolean; message: string }>('/system-settings/notifications', {
        email: {
          newTickets,
          newUsers,
          systemAlerts: alerts
        },
        sms: {
          criticalAlerts: smsCritical,
          serviceOutages: smsOutages
        }
      });

      if (data?.success) {
        setMessage({ type: 'success', text: data.message || 'Notification settings saved successfully' });
      }
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      setMessage({ type: 'error', text: err?.message || 'Failed to save settings' });
    } finally {
      setSaving(false);
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
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-[6px] bg-[#401B60] px-4 py-[9px] text-[14px] font-semibold text-white disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Notification Settings'}
          </button>
        </div>
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
