'use client';

import { useState } from 'react';
import SettingsTabs, { TabKey } from '@/components/admin/system-settings/SettingsTabs';
import PanelIntegrations from '@/components/admin/system-settings/PanelIntegrations';
import PanelNotifications from '@/components/admin/system-settings/PanelNotifications';
import PanelSecurity from '@/components/admin/system-settings/PanelSecurity';
import PanelSystem from '@/components/admin/system-settings/PanelSystem';

export default function SystemSettingsPage() {
  const [active, setActive] = useState<TabKey>('integrations');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[26px] font-bold text-[#0A0A0A]">System Settings</h1>
        <p className="mt-2 text-[16px] leading-[21px] text-[#6F6C90]">
          Configure system integrations and global settings
        </p>
      </div>

      <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <SettingsTabs active={active} onChange={setActive} />

        <div className="mt-6">
          {active === 'integrations' && <PanelIntegrations />}
          {active === 'notification' && <PanelNotifications />}
          {active === 'security' && <PanelSecurity />}
          {active === 'system' && <PanelSystem />}
        </div>
      </div>
    </div>
  );
}
