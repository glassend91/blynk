"use client";

import { useState } from "react";
import EnterIccidDialog from "./EnterIccidDialog";
import ProvisionDialog from "./ProvisionDialog";

type Row = {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  plan: string;
  status: "Pending ICCID" | "Awaiting Provisioning" | "Provisioned";
  orderDate: string;
};

export default function ActionButtons({
  row,
  onUpdate,
}: {
  row: Row;
  onUpdate: (order: Row) => void;
}) {
  const [openIccid, setOpenIccid] = useState(false);
  const [openProvision, setOpenProvision] = useState(false);

  const canEnterIccid = row.status === "Pending ICCID";
  const canProvision = row.status === "Awaiting Provisioning";

  return (
    <div className="flex items-center gap-3">
      {canEnterIccid && (
        <button
          type="button"
          onClick={() => setOpenIccid(true)}
          className="rounded-md border border-[#DFDBE3] bg-white px-3 py-1.5 text-[14px] font-medium text-[#6F6C90] hover:bg-[#F7F4FB]"
        >
          Enter ICCID
        </button>
      )}

      {canProvision && (
        <button
          type="button"
          onClick={() => setOpenProvision(true)}
          className="rounded-md bg-[#401B60] px-3 py-1.5 text-[14px] font-semibold text-white hover:opacity-95"
        >
          Provision
        </button>
      )}

      {row.status === "Provisioned" && (
        <span className="text-[14px] text-[#6F6C90]">Completed</span>
      )}

      <EnterIccidDialog
        open={openIccid}
        onClose={() => setOpenIccid(false)}
        order={row}
        onSuccess={onUpdate}
      />
      <ProvisionDialog
        open={openProvision}
        onClose={() => setOpenProvision(false)}
        order={row}
        onSuccess={onUpdate}
      />
    </div>
  );
}
