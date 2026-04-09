"use client";

import OrdersTable from "@/components/admin/sim-orders/OrdersTable";

export default function SimOrdersPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#0A0A0A]">
            Physical SIM Orders
          </h1>
          <p className="text-[16px] text-[#6F6C90]">
            Process pending SIM orders and provisioning
          </p>
        </div>
        {/* (Design shows a right aligned button on many pages;
            here we skip since table actions handle flow) */}
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-[#DFDBE3] bg-white p-[30px]">
        <OrdersTable />
      </div>
    </div>
  );
}
