'use client';

import { useState, useEffect } from 'react';
import Panel from "../Panel";
import { Pill } from "../Pill";
import {
  getUserSubscriptions,
  updateSubscriptionStatus,
  removeAddOn,
  addAddOn,
  type ServiceSubscription
} from "../../../lib/services/services";
import BuyServiceModal from "../../../components/BuyServiceModal";

export default function Services() {
  const [subscriptions, setSubscriptions] = useState<ServiceSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserSubscriptions();
      setSubscriptions(data.subscriptions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (subscriptionId: string, newStatus: 'active' | 'inactive' | 'suspended' | 'cancelled') => {
    try {
      setActionLoading(subscriptionId);
      await updateSubscriptionStatus(subscriptionId, { status: newStatus });
      await loadSubscriptions(); // Refresh the data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) {
      return;
    }

    try {
      setActionLoading(subscriptionId);
      await updateSubscriptionStatus(subscriptionId, {
        status: 'cancelled',
        reason: 'User requested deletion'
      });
      await loadSubscriptions(); // Refresh the data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddOnToggle = async (subscriptionId: string, addOnId: string, isActive: boolean) => {
    try {
      setActionLoading(`${subscriptionId}-${addOnId}`);
      if (isActive) {
        await removeAddOn(subscriptionId, addOnId);
      } else {
        await addAddOn(subscriptionId, addOnId);
      }
      await loadSubscriptions(); // Refresh the data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update add-on');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBuyService = () => {
    setShowBuyModal(true);
  };

  const handleServicePurchased = () => {
    setShowBuyModal(false);
    loadSubscriptions(); // Refresh the subscriptions
  };

  const formatPrice = (subscription: ServiceSubscription) => {
    return `$${subscription.subscriptionPrice.toFixed(2)}/month`;
  };

  const formatSpecValue = (subscription: ServiceSubscription, spec: string) => {
    const service = subscription.serviceId;
    switch (spec) {
      case 'downloadSpeed':
        return service.specifications.downloadSpeed ? `${service.specifications.downloadSpeed} Mbps` : 'N/A';
      case 'uploadSpeed':
        return service.specifications.uploadSpeed ? `${service.specifications.uploadSpeed} Mbps` : 'N/A';
      case 'dataAllowance':
        return service.specifications.dataAllowance || 'Unlimited';
      case 'staticIP':
        return service.specifications.staticIP ? 'Yes' : 'No';
      case 'voiceMinutes':
        return service.specifications.voiceMinutes || 'Unlimited';
      case 'smsMessages':
        return service.specifications.smsMessages || 'Unlimited';
      case 'internationalCalls':
        return service.specifications.internationalCalls ? 'Included' : 'Not included';
      default:
        return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }
  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Service Management</h1>

      <div className="mb-5 flex justify-end">
        <button
          onClick={handleBuyService}
          className="rounded-[10px] bg-[#3F205F] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#2D1A4A] focus:outline-none focus:ring-2 focus:ring-[#3F205F]"
        >
          Buy Service
        </button>
      </div>

      {subscriptions.length === 0 ? (
        <Panel className="p-6">
          <div className="text-center py-8 text-gray-500">
            No active subscriptions found.
          </div>
        </Panel>
      ) : (
        subscriptions.map((subscription, index) => (
          <Panel key={subscription._id} className={`${index > 0 ? 'mt-6' : ''} p-6`}>
            <div className="text-[15px] font-semibold text-[#0A0A0A]">
              {subscription.serviceId.serviceName}
            </div>

            <div className="mt-4 rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD]">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3F205F] text-white">
                    {subscription.serviceId.serviceType === 'NBN' ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 8.5C6.5 4.5 17.5 4.5 22 8.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    ) : (
                      <svg width="16" height="20" viewBox="0 0 16 20" fill="none"><rect x="3" y="1.5" width="10" height="17" rx="3" stroke="white" strokeWidth="1.8" /><circle cx="8" cy="15" r="1.4" fill="white" /></svg>
                    )}
                  </span>
                  <div>
                    <div className="text-[14px] font-semibold text-[#0A0A0A]">
                      {subscription.serviceId.serviceName}
                    </div>
                    <div className="text-[12px] text-[#6F6C90]">
                      {formatPrice(subscription)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Pill tone={subscription.subscriptionStatus === 'active' ? 'green' : 'grey'}>
                    {subscription.subscriptionStatus.charAt(0).toUpperCase() + subscription.subscriptionStatus.slice(1)}
                  </Pill>
                  <button
                    onClick={() => handleStatusUpdate(subscription._id, subscription.subscriptionStatus === 'active' ? 'inactive' : 'active')}
                    // disabled={actionLoading === subscription._id}
                    disabled={true}
                    className="rounded-[8px] border border-[#D9D4E5] px-2.5 py-1 text-[12px] text-[#3F205F] hover:bg-[#3F205F] hover:text-white disabled:opacity-50"
                  >
                    {actionLoading === subscription._id ? 'Updating...' : 'Setting'}
                  </button>
                  <button
                    onClick={() => handleDeleteSubscription(subscription._id)}
                    // disabled={actionLoading === subscription._id}
                    disabled={true}
                    className="rounded-[8px] border border-[#D9D4E5] px-2.5 py-1 text-[12px] text-[#C63D3D] hover:bg-[#C63D3D] hover:text-white disabled:opacity-50"
                  >
                    {actionLoading === subscription._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6 border-t border-[#EEEAF4] p-4 text-[13px]">
                {subscription.serviceId.serviceType === 'NBN' ? (
                  <>
                    <Spec label="Download Speed" value={formatSpecValue(subscription, 'downloadSpeed')} />
                    <Spec label="Upload Speed" value={formatSpecValue(subscription, 'uploadSpeed')} />
                    <Spec label="Data Allowance" value={formatSpecValue(subscription, 'dataAllowance')} />
                    <Spec label="Static IP" value={formatSpecValue(subscription, 'staticIP')} />
                  </>
                ) : (
                  <>
                    <Spec label="Data Allowance" value={formatSpecValue(subscription, 'dataAllowance')} />
                    <Spec label="Voice Minutes" value={formatSpecValue(subscription, 'voiceMinutes')} />
                    <Spec label="SMS Messages" value={formatSpecValue(subscription, 'smsMessages')} />
                    <Spec label="International Calls" value={formatSpecValue(subscription, 'internationalCalls')} />
                  </>
                )}
              </div>

              {subscription.serviceId.serviceType === 'Mobile' && (
                <div className="mt-4 flex gap-3">
                  <button className="rounded-[10px] bg-white px-4 py-2 text-[14px] font-semibold text-[#3F205F] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                    Port Number from Another Carrier
                  </button>
                  <button className="rounded-[10px] bg-white px-4 py-2 text-[14px] font-semibold text-[#3F205F] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                    Order New SIM Card
                  </button>
                </div>
              )}
            </div>

            {subscription.serviceId.addOns && subscription.serviceId.addOns.length > 0 && (
              <div className="mt-4 rounded-[12px] border border-[#EEEAF4] bg-[#F7F7FA] p-4">
                <div className="text-[14px] font-semibold text-[#0A0A0A]">Add-ons</div>
                {subscription.serviceId.addOns.map((addOn) => {
                  const isSelected = subscription.selectedAddOns.some(selected => selected.addOnId === addOn._id && selected.isActive);
                  return (
                    <div key={addOn._id} className="mt-3 flex items-center justify-between rounded-[10px] bg-white px-4 py-3">
                      <div>
                        <div className="text-[14px] font-semibold text-[#0A0A0A]">{addOn.name}</div>
                        <div className="text-[12px] text-[#6F6C90]">
                          {addOn.description} (+${addOn.price.toFixed(2)}/month)
                        </div>
                      </div>
                      {/* <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleAddOnToggle(subscription._id, addOn._id, isSelected)}
                        disabled={actionLoading === `${subscription._id}-${addOn._id}`}
                        className="h-5 w-9 cursor-pointer rounded-full bg-[#D9D4E5] accent-[#3F205F] disabled:opacity-50"
                      /> */}
                    </div>
                  );
                })}
              </div>
            )}
          </Panel>
        ))
      )}

      <BuyServiceModal
        isOpen={showBuyModal}
        onClose={() => setShowBuyModal(false)}
        onSuccess={handleServicePurchased}
      />
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[#6F6C90]">{label}</div>
      <div className="font-semibold text-[#0A0A0A]">{value}</div>
    </div>
  );
}
