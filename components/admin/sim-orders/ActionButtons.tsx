'use client';

import { useState } from 'react';
import EnterIccidDialog from './EnterIccidDialog';
import ProvisionDialog from './ProvisionDialog';

type Row = {
  id: number;
  orderNumber: string;
  customer: string;
  email: string;
  plan: string;
  status: 'Pending ICCID' | 'Awaiting Provisioning' | 'Provisioned';
  orderDate: string;
};

export default function ActionButtons({ row }: { row: Row }) {
  const [openIccid, setOpenIccid] = useState(false);
  const [openProvision, setOpenProvision] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => setOpenIccid(true)}
        className="rounded-md border border-[#DFDBE3] bg-white px-3 py-1.5 text-[14px] font-medium text-[#6F6C90] hover:bg-[#F7F4FB]"
      >
        Enter ICCID
      </button>

      <button
        type="button"
        onClick={() => setOpenProvision(true)}
        className="rounded-md bg-[#401B60] px-3 py-1.5 text-[14px] font-semibold text-white hover:opacity-95"
      >
        Provision
      </button>

      <EnterIccidDialog
        open={openIccid}
        onClose={() => setOpenIccid(false)}
        order={row}
      />
      <ProvisionDialog
        open={openProvision}
        onClose={() => setOpenProvision(false)}
        order={row}
      />
    </div>
  );
}
