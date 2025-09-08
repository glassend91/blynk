'use client';

type Props = {
  open: boolean;
  onClose: () => void;
  order: { orderNumber: string; customer?: string };
};

export default function ProvisionDialog({ open, onClose, order }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[22px] font-bold text-[#0A0A0A]">
            Provision SIM
          </h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#F8F8F8]"
            aria-label="close"
          >
            ✕
          </button>
        </div>

        <p className="mb-5 text-[14px] text-[#6F6C90]">
          Confirm provisioning for order{' '}
          <span className="font-semibold text-[#401B60]">
            {order.orderNumber}
          </span>
          .
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-[14px] font-semibold text-[#0A0A0A]">
              Provisioning Notes (optional)
            </label>
            <textarea
              className="h-28 w-full resize-none rounded-xl border border-[#DFDBE3] bg-white px-4 py-3 outline-none placeholder:text-[#B1AFBE] focus:ring-2 focus:ring-[#401B60]"
              placeholder="Any details to record with this provisioning…"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-[#DFDBE3] bg-white px-4 py-2 text-[14px] font-medium text-[#6F6C90]"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="rounded-md bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white"
          >
            Provision
          </button>
        </div>
      </div>
    </div>
  );
}
