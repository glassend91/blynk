"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import apiClient from "@/lib/apiClient";

type ManualChargeModalProps = {
  customerId: string;
  customerName: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ManualChargeModal({
  customerId,
  customerName,
  onClose,
  onSuccess,
}: ManualChargeModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !amount || !description) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Process manual charge
      const { data } = await apiClient.post(
        `/billing/admin/customers/${customerId}/manual-charge`,
        {
          amount: amountNum,
          description: description,
        },
      );

      if (data?.success) {
        // Log to customer notes for audit
        try {
          await apiClient.post("/customer-verification/notes", {
            customerId,
            noteType: "Billing",
            priority: "Normal",
            content: `One-Off Charge of $${amountNum.toFixed(2)} processed. Description: ${description}`,
            tags: ["manual-charge", "billing", "one-off"],
          });
        } catch (noteErr) {
          console.error("Failed to log manual charge to notes:", noteErr);
        }

        onSuccess();
        onClose();
      } else {
        setError(data?.message || "Failed to process charge.");
      }
    } catch (err: any) {
      console.error("Manual charge failed", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "An error occurred while processing the charge.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 sm:p-6 font-sans text-[14px] overflow-y-auto"
      onClick={() => !isLoading && onClose()}
    >
      <div
        className="relative w-full max-w-md rounded-[16px] bg-white p-6 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">
              One-Off Charge
            </h2>
            <p className="text-[14px] text-[#6F6C90]">
              Customer: <span className="font-semibold text-[#0A0A0A]">{customerName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => !isLoading && onClose()}
            className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F] hover:bg-[#FFE0E0] transition-colors"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
              Charge Amount (AUD) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-[#6F6C90]">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0.10"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-[10px] border border-[#DFDBE3] pl-8 pr-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors"
                autoFocus
              />
            </div>
            <p className="mt-1 text-[12px] text-[#6F6C90]">
              Minimum amount is $0.10
            </p>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
              Description / Reason *
            </label>
            <textarea
              placeholder="e.g. Late payment fee, custom hardware setup..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors min-h-[100px] resize-none"
            />
          </div>

          <div className="bg-[#FBFAFD] rounded-[10px] p-4 text-[13px] text-[#6F6C90] border border-[#F0EEF3]">
            <p className="flex gap-2">
              <span className="text-[#401B60] font-bold">ℹ️</span>
              <span>
                This will immediately charge the customer's <strong>default payment method</strong> on file. A paid invoice will be generated automatically.
              </span>
            </p>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="rounded-[10px] border border-[#DFDBE3] px-6 py-2.5 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !amount || !description}
              className="rounded-[10px] bg-[#19BF66] px-8 py-2.5 text-[14px] font-bold text-white shadow-md hover:bg-[#15A357] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  Processing...
                </div>
              ) : (
                `Charge $${parseFloat(amount || "0").toFixed(2)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
