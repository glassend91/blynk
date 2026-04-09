import type { ReactNode } from "react";
import TicketTable from "@/components/admin/support-tickets/TicketTable";

export default function Page(): ReactNode {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#0A0A0A]">
            Support Tickets
          </h1>
          <p className="mt-1 text-[16px] leading-[21px] text-[#6F6C90]">
            Manage customer support requests and issues
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-[#DFDBE3] bg-white p-[30px]">
        <TicketTable />
      </div>
    </div>
  );
}
