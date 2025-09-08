'use client';

type Props = {
  open: boolean;
  onClose: () => void;
  order: { orderNumber: string };
};

export default function EnterIccidDialog({ open, onClose, order }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[22px] font-bold text-[#0A0A0A]">
            Enter ICCID
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
          Add the SIM card ICCID to proceed with order{' '}
          <span className="font-semibold text-[#401B60]">
            {order.orderNumber}
          </span>
          .
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-[14px] font-semibold text-[#0A0A0A]">
              ICCID
            </label>
            <input
              type="text"
              placeholder="e.g., 8961 2345 6789 0123 45"
              className="w-full rounded-xl border border-[#DFDBE3] bg-white px-4 py-3 outline-none placeholder:text-[#B1AFBE] focus:ring-2 focus:ring-[#401B60]"
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
