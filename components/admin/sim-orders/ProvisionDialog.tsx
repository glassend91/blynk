'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

type Props = {
  open: boolean;
  onClose: () => void;
  order: { id: string; orderNumber: string; customer?: string };
  onSuccess?: (order: any) => void;
};

export default function ProvisionDialog({ open, onClose, order, onSuccess }: Props) {
  const [provisioningNotes, setProvisioningNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setProvisioningNotes('');
    setError(null);
    setSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const { data } = await apiClient.post<{ success: boolean; data: any }>(
        `/sim-orders/${order.id}/provision`,
        { provisioningNotes: provisioningNotes.trim() || undefined }
      );

      if (data?.success && data.data) {
        onSuccess?.(data.data);
        handleClose();
      } else {
        setError('Failed to provision order. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to provision order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed z-50 grid place-items-center"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh'
      }}
    >
      <div
        className="fixed bg-black/70"
        onClick={onClose}
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 50
        }}
      />
      <div
        className="fixed w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-xl"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 51
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[22px] font-bold text-[#0A0A0A]">
            Provision SIM
          </h3>
          <button
            onClick={handleClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#F8F8F8] hover:bg-[#F0F0F0]"
            aria-label="close"
            disabled={submitting}
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
              value={provisioningNotes}
              onChange={(e) => setProvisioningNotes(e.target.value)}
              className="h-28 w-full resize-none rounded-xl border border-[#DFDBE3] bg-white px-4 py-3 outline-none placeholder:text-[#B1AFBE] focus:ring-2 focus:ring-[#401B60] disabled:opacity-50"
              placeholder="Any details to record with this provisioning…"
              disabled={submitting}
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="rounded-md border border-[#DFDBE3] bg-white px-4 py-2 text-[14px] font-medium text-[#6F6C90] hover:bg-[#F8F8F8] disabled:opacity-50"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="rounded-md bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Provisioning...' : 'Provision'}
          </button>
        </div>
      </div>
    </div>
  );
}
