'use client';

import { useState, useEffect } from 'react';
import Panel from "../Panel";
import { Pill } from "../Pill";
import { getUserSubscriptions, type ServiceSubscription } from "../../../lib/services/services";

export default function Diagnostics() {
  const [subscriptions, setSubscriptions] = useState<ServiceSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserSubscriptions();
      console.log(data);
      setSubscriptions(data.subscriptions.filter(sub =>
        sub.subscriptionStatus === 'active'
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load service status');
    } finally {
      setLoading(false);
    }
  };

  const getServiceStatus = (subscription: ServiceSubscription) => {
    switch (subscription.subscriptionStatus) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'suspended':
        return 'Suspended';
      case 'cancelled':
        return 'Cancelled';
      case 'pending':
        return 'Pending';
      case 'expired':
        return 'Expired';
      default:
        return 'Unknown';
    }
  };

  const getStatusTone = (subscription: ServiceSubscription) => {
    switch (subscription.subscriptionStatus) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'yellow';
      case 'suspended':
        return 'red';
      case 'cancelled':
        return 'grey';
      case 'pending':
        return 'yellow';
      case 'expired':
        return 'grey';
      default:
        return 'grey';
    }
  };

  const getServiceDisplayName = (subscription: ServiceSubscription) => {
    const service = subscription.serviceId;
    return `${service.serviceType} - ${service.serviceName}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading service status...</div>
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
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Service Diagnostics & Outages</h1>

      <div className="grid grid-cols-3 gap-6">
        <Panel className="col-span-2 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">Service Status</div>
            <button className="rounded-[8px] border border-[#CDBEE3] px-3 py-1 text-[12px] font-semibold text-[#3F205F]">Run Network Test</button>
          </div>

          <div className="space-y-3">
            {subscriptions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No active services found.
              </div>
            ) : (
              subscriptions.map((subscription) => (
                <div key={subscription._id} className="flex items-center justify-between rounded-[12px] bg-[#F7F7FA] px-4 py-3">
                  <div>
                    <div className="text-[14px] font-semibold text-[#0A0A0A]">
                      {getServiceDisplayName(subscription)}
                    </div>
                    <div className="text-[12px] text-[#6F6C90]">
                      ${subscription.subscriptionPrice.toFixed(2)}/month
                    </div>
                  </div>
                  <Pill tone={getStatusTone(subscription) as any}>
                    {getServiceStatus(subscription)}
                  </Pill>
                </div>
              ))
            )}
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="text-[16px] font-semibold text-[#0A0A0A]">Recent Outages</div>
          <div className="mt-4 space-y-3">
            <OutageRow
              place="Sydney CBD"
              meta="NBN • Reported: 2025-02-03 14:30 • Resolved: 2025-02-03 16:45"
              action="Resolve"
              tone="grey"
            />
            <OutageRow
              place="Parramatta"
              meta="Mobile • Reported: 2025-02-04 09:15"
              action="Investigating"
              tone="purple"
            />
          </div>
        </Panel>
      </div>
    </>
  );
}

function OutageRow({
  place,
  meta,
  action,
  tone,
}: {
  place: string;
  meta: string;
  action: string;
  tone: "grey" | "purple";
}) {
  return (
    <div className="flex items-center justify-between rounded-[12px] bg-[#F7F7FA] px-4 py-3">
      <div>
        <div className="text-[14px] font-semibold text-[#0A0A0A]">{place}</div>
        <div className="text-[12px] text-[#6F6C90]">{meta}</div>
      </div>
      <span className={`rounded-[8px] px-3 py-1 text-[12px] font-semibold ${tone === "grey" ? "bg-[#EFF1F5] text-[#667085]" : "bg-[#EFE9F7] text-[#3F205F]"}`}>
        {action}
      </span>
    </div>
  );
}
