'use client';

import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';

type Row = {
  id: number;
  orderNumber: string;
  customer: string;
  email: string;
  plan: string;
  status: 'Pending ICCID' | 'Awaiting Provisioning' | 'Provisioned';
  orderDate: string; // yyyy-mm-dd
};

const rows: Row[] = [
  {
    id: 1,
    orderNumber: 'SO-2024-0089',
    customer: 'John Smith',
    email: 'john.smith@email.com',
    plan: 'Mobile 20GB',
    status: 'Pending ICCID',
    orderDate: '2024-02-15',
  },
  {
    id: 2,
    orderNumber: 'SO-2024-0090',
    customer: 'Lisa Park',
    email: 'lisa.park@email.com',
    plan: 'Mobile Unlimited',
    status: 'Awaiting Provisioning',
    orderDate: '2024-02-16',
  },
];

export default function OrdersTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="text-[14px] text-[#0A0A0A]">
          <tr>
            {[
              '#',
              'Order Number',
              'Customer',
              'Email',
              'Plan',
              'Status',
              'Order Date',
              'Actions',
            ].map((h) => (
              <th
                key={h}
                className="border border-[#DFDBE3] bg-white px-4 py-4 font-medium"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="text-[14px] text-[#6F6C90]">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-[#FBFAFD]">
              <td className="border border-[#DFDBE3] px-4 py-4">{r.id}</td>
              <td className="border border-[#DFDBE3] px-4 py-4">
                <span className="text-[#401B60]">{r.orderNumber}</span>
              </td>
              <td className="border border-[#DFDBE3] px-4 py-4">{r.customer}</td>
              <td className="border border-[#DFDBE3] px-4 py-4">{r.email}</td>
              <td className="border border-[#DFDBE3] px-4 py-4">{r.plan}</td>
              <td className="border border-[#DFDBE3] px-4 py-4">
                <StatusBadge status={r.status} />
              </td>
              <td className="border border-[#DFDBE3] px-4 py-4">
                {new Date(r.orderDate).toISOString().slice(0, 10)}
              </td>
              <td className="border border-[#DFDBE3] px-4 py-4">
                <ActionButtons row={r} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
