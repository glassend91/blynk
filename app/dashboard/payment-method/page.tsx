'use client';

import { useState, useEffect } from 'react';
import Panel from "../Panel";
import { Pill } from "../Pill";
import AddPaymentMethodModal from "../../../components/AddPaymentMethodModal";
import {
  getPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod,
  getAutoPaySettings,
  updateAutoPaySettings,
  type PaymentMethod,
  type AutoPaySettings
} from "../../../lib/services/paymentMethods";

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [autoPaySettings, setAutoPaySettings] = useState<AutoPaySettings>({
    autoPayEnabled: false,
    emailNotifications: true,
    billingNotifications: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [paymentMethodsData, autoPayData] = await Promise.all([
        getPaymentMethods(),
        getAutoPaySettings()
      ]);

      console.log('Loaded payment methods:', paymentMethodsData.paymentMethods);
      setPaymentMethods(paymentMethodsData.paymentMethods);
      setAutoPaySettings(autoPayData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = () => {
    setShowAddModal(true);
  };

  const handlePaymentMethodAdded = () => {
    setShowAddModal(false);
    loadData(); // Refresh the data
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      console.log('Setting default payment method with ID:', paymentMethodId);
      setActionLoading(paymentMethodId);
      await setDefaultPaymentMethod(paymentMethodId);
      await loadData(); // Refresh the data
    } catch (err) {
      console.error('Error setting default payment method:', err);
      setError(err instanceof Error ? err.message : 'Failed to set default payment method');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      setActionLoading(paymentMethodId);
      await deletePaymentMethod(paymentMethodId);
      await loadData(); // Refresh the data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete payment method');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateAutoPaySetting = async (setting: keyof AutoPaySettings, value: boolean) => {
    try {
      setActionLoading(setting);
      await updateAutoPaySettings({ [setting]: value });
      setAutoPaySettings(prev => ({ ...prev, [setting]: value }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update setting');
    } finally {
      setActionLoading(null);
    }
  };

  const formatCardTitle = (paymentMethod: PaymentMethod) => {
    if (paymentMethod.type === 'card' && paymentMethod.card) {
      return `Card ending in ${paymentMethod.card.last4}`;
    } else if (paymentMethod.type === 'bank_account' && paymentMethod.bankAccount) {
      return `Bank Account ending in ${paymentMethod.bankAccount.last4}`;
    }
    return 'Payment Method';
  };

  const formatCardSubtitle = (paymentMethod: PaymentMethod) => {
    if (paymentMethod.type === 'card' && paymentMethod.card) {
      return `Expires ${paymentMethod.card.expMonth.toString().padStart(2, '0')}/${paymentMethod.card.expYear}`;
    } else if (paymentMethod.type === 'bank_account' && paymentMethod.bankAccount) {
      return paymentMethod.bankAccount.bankName;
    }
    return '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Payment Method</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="mb-5 flex justify-end">
        <button
          onClick={handleAddPaymentMethod}
          className="rounded-[10px] bg-[#3F205F] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#2D1A4A] focus:outline-none focus:ring-2 focus:ring-[#3F205F]"
        >
          Add Payment Method
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Panel className="p-6">
          <div className="text-[16px] font-semibold text-[#0A0A0A]">Saved Payment Methods</div>

          <div className="mt-4 space-y-3">
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No payment methods found. Add one to get started.
              </div>
            ) : (
              paymentMethods.map((paymentMethod) => {
                console.log('Rendering payment method:', paymentMethod);
                return (
                  <PaymentRow
                    key={paymentMethod._id || paymentMethod.id}
                    title={formatCardTitle(paymentMethod)}
                    subtitle={formatCardSubtitle(paymentMethod)}
                    right={
                      <>
                        {paymentMethod.isDefault ? (
                          <Pill tone="grey">Default</Pill>
                        ) : (
                          <button
                            onClick={() => handleSetDefault(paymentMethod._id || paymentMethod.id)}
                            disabled={actionLoading === (paymentMethod._id || paymentMethod.id)}
                            className="rounded-[8px] border border-[#CDBEE3] px-3 py-1 text-[12px] font-semibold text-[#3F205F] hover:bg-[#3F205F] hover:text-white disabled:opacity-50"
                          >
                            {actionLoading === (paymentMethod._id || paymentMethod.id) ? 'Setting...' : 'Save as Default'}
                          </button>
                        )}
                        <RowActions
                          onDelete={() => handleDeletePaymentMethod(paymentMethod._id || paymentMethod.id)}
                          loading={actionLoading === (paymentMethod._id || paymentMethod.id)}
                        />
                      </>
                    }
                  />
                );
              })
            )}
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="text-[16px] font-semibold text-[#0A0A0A]">Auto-Pay Settings</div>

          <div className="mt-4 space-y-3">
            <SettingRow
              title="Auto-Pay Enabled"
              desc="Automatically pay bills when due using your default payment method"
              enabled={autoPaySettings.autoPayEnabled}
              onToggle={() => handleUpdateAutoPaySetting('autoPayEnabled', !autoPaySettings.autoPayEnabled)}
              loading={actionLoading === 'autoPayEnabled'}
            />
            <SettingRow
              title="Email Notifications"
              desc="Receive email confirmations for successful payments"
              enabled={autoPaySettings.emailNotifications}
              onToggle={() => handleUpdateAutoPaySetting('emailNotifications', !autoPaySettings.emailNotifications)}
              loading={actionLoading === 'emailNotifications'}
            />
          </div>
        </Panel>
      </div>

      <AddPaymentMethodModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handlePaymentMethodAdded}
      />
    </>
  );
}

function PaymentRow({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#EEEAF4] bg-[#F7F7FA] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="1.7" /><path d="M2 9h20" stroke="white" strokeWidth="1.7" /></svg>
        </span>
        <div>
          <div className="text-[14px] font-semibold text-[#0A0A0A]">{title}</div>
          <div className="text-[12px] text-[#6F6C90]">{subtitle}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

function RowActions({ onDelete, loading }: { onDelete: () => void; loading?: boolean }) {
  return (
    <>
      <button
        onClick={onDelete}
        disabled={loading}
        className="rounded-[8px] border border-[#D9D4E5] px-2.5 py-1 text-[12px] text-[#C63D3D] hover:bg-[#C63D3D] hover:text-white disabled:opacity-50"
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>
    </>
  );
}

function SettingRow({
  title,
  desc,
  enabled,
  onToggle,
  loading
}: {
  title: string;
  desc: string;
  enabled: boolean;
  onToggle: () => void;
  loading?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-[#EEEAF4] bg-[#F7F7FA] px-4 py-3">
      <div>
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{title}</div>
        <div className="text-[12px] text-[#6F6C90]">{desc}</div>
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={enabled}
          onChange={onToggle}
          disabled={loading}
        />
        <div className={`peer h-5 w-9 rounded-full ${enabled ? "bg-[#3F205F]" : "bg-[#D9D4E5]"} transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}></div>
      </label>
    </div>
  );
}
