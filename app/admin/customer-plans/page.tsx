'use client';

import { useMemo, useState } from 'react';
import SearchCustomer from '@/components/admin/customer-plans/SearchCustomer';
import PlanCard, { CustomerPlan } from '@/components/admin/customer-plans/PlanCard';

export default function CustomerPlansPage() {
  const [query, setQuery] = useState('');

  // demo data (swap with API later)
  const plans: CustomerPlan[] = [
    {
      id: '1',
      name: 'NBN Premium 100',
      activeSince: 'Jan 15, 2024',
      price: '$89.95/month',
    },
    {
      id: '2',
      name: 'Mobile 20GB',
      activeSince: 'Feb 1, 2024',
      price: '$29.95/month',
    },
  ];

  const filtered = useMemo(() => {
    if (!query.trim()) return plans;
    const q = query.toLowerCase();
    return plans.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-8">
      {/* Header + CTA */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#0A0A0A]">Customer Plan Management</h1>
          <p className="mt-2 text-[16px] leading-[21px] text-[#6F6C90]">
            Manage customer service plans and subscriptions
          </p>
        </div>
        <button
          className="rounded-[6px] bg-[#401B60] px-[21px] py-3 text-[16px] font-semibold text-white"
          onClick={() => alert('Add New Service')}
        >
          Add New Service
        </button>
      </div>

      {/* Search card */}
      <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <h3 className="mb-4 text-[18px] font-semibold text-black">Find Customer</h3>
        <SearchCustomer
          value={query}
          onChange={setQuery}
          onSearch={() => void 0}
        />
      </div>

      {/* Plans list */}
      <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <h3 className="mb-4 text-[18px] font-semibold text-black">Customer Services</h3>

        <div className="space-y-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]"
            >
              <PlanCard plan={p} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
