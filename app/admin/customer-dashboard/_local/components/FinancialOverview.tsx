"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

type FinancialData = {
  accountBalance: number;
  nextBillDueDate?: string;
  autoPayStatus: "Active" | "Inactive";
  paymentMethod?: string;
};

type Props = {
  customerId?: string;
  onCreditRefundApplied?: () => void;
};

export default function FinancialOverview({ customerId, onCreditRefundApplied }: Props) {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreditRefundModal, setShowCreditRefundModal] = useState(false);

  useEffect(() => {
    if (customerId) {
      fetchFinancialData();
    } else {
      setFinancialData(null);
    }
  }, [customerId]);

  const fetchFinancialData = async () => {
    if (!customerId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch financial data from API
      const { data } = await apiClient.get<{ success: boolean; data?: FinancialData; financial?: FinancialData }>(
        `/customer-verification/financial/${customerId}`
      ).catch(async () => {
        // Fallback: try alternative endpoint
        return await apiClient.get<{ success: boolean; data?: FinancialData; financial?: FinancialData }>(
          `/customer-plans/financial/${customerId}`
        );
      });

      if (data?.success) {
        let financial: FinancialData;

        if ('data' in data) {
          financial = data.data;
        } else if ('financial' in data) {
          financial = data.financial;
        } else {
          financial = {
            accountBalance: 0,
            autoPayStatus: "Inactive",
          };
        }
        setFinancialData(financial);
      } else {
        // Default values if API doesn't return data
        setFinancialData({
          accountBalance: 0,
          autoPayStatus: "Inactive",
        });
      }
    } catch (err: any) {
      console.error("Failed to fetch financial data:", err);
      // Set default values on error
      setFinancialData({
        accountBalance: 0,
        autoPayStatus: "Inactive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!customerId) {
    return (
      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-4">Financial Overview</h2>
        <div className="text-center py-8">
          <p className="text-[14px] text-[#6F6C90]">
            Select a customer to view their financial information
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-4">Financial Overview</h2>
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#401B60] border-r-transparent"></div>
          <p className="mt-4 text-[14px] text-[#6F6C90]">Loading financial data...</p>
        </div>
      </div>
    );
  }

  const balance = financialData?.accountBalance || 0;
  const isCredit = balance < 0;
  const balanceDisplay = isCredit
    ? `-$${Math.abs(balance).toFixed(2)} CR`
    : `$${balance.toFixed(2)} DR`;

  return (
    <>
      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-semibold text-[#0A0A0A]">Financial Overview</h2>
          <button
            onClick={() => setShowCreditRefundModal(true)}
            className="rounded-[8px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95"
          >
            Apply Credit / Refund
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">
              Current Account Balance
            </div>
            <div className={`text-[18px] font-semibold ${isCredit ? "text-green-600" : "text-[#0A0A0A]"}`}>
              {balanceDisplay}
            </div>
          </div>

          {financialData?.nextBillDueDate && (
            <div>
              <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">
                Next Bill Due Date
              </div>
              <div className="text-[14px] text-[#0A0A0A]">
                {new Date(financialData.nextBillDueDate).toLocaleDateString("en-AU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
            </div>
          )}

          <div>
            <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">
              Auto-pay Status
            </div>
            <div className="text-[14px] text-[#0A0A0A]">
              <span
                className={`inline-block px-3 py-1 rounded-[6px] font-medium ${
                  financialData?.autoPayStatus === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {financialData?.autoPayStatus || "Inactive"}
              </span>
            </div>
          </div>

          {financialData?.paymentMethod && (
            <div>
              <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">
                Payment Method
              </div>
              <div className="text-[14px] text-[#0A0A0A]">{financialData.paymentMethod}</div>
            </div>
          )}
        </div>
      </div>

      {/* Credit / Refund Modal */}
      {showCreditRefundModal && (
        <CreditRefundModal
          customerId={customerId}
          onClose={() => setShowCreditRefundModal(false)}
          onSuccess={() => {
            fetchFinancialData();
            onCreditRefundApplied?.();
          }}
        />
      )}
    </>
  );
}

// Credit / Refund Modal Component
function CreditRefundModal({
  customerId,
  onClose,
  onSuccess,
}: {
  customerId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [type, setType] = useState<"credit" | "refund" | "">("");
  const [amount, setAmount] = useState("");
  const [reasonCode, setReasonCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRefundInstructions, setShowRefundInstructions] = useState(false);

  const reasonCodes = [
    { value: "overcharge", label: "Overcharge" },
    { value: "goodwill", label: "Goodwill" },
    { value: "service_issue", label: "Service Issue" },
    { value: "cancellation", label: "Cancellation" },
    { value: "other", label: "Other" },
  ];

  const validateAmount = (value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };

  const handleSubmit = async () => {
    if (!type) {
      setError("Please select Credit or Refund");
      return;
    }

    if (!amount || !validateAmount(amount)) {
      setError("Please enter a valid positive amount");
      return;
    }

    if (!reasonCode) {
      setError("Please select a reason code");
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      if (type === "credit") {
        // Apply credit via OneView API
        const { data } = await apiClient.post<{ success: boolean; message?: string }>(
          "/api/v1/customer/credit",
          {
            customerId,
            amount: parseFloat(amount),
            reasonCode,
          }
        );

        if (data?.success) {
          // Log to notes
          try {
            await apiClient.post("/customer-verification/notes", {
              customerId,
              noteType: "Billing",
              priority: "Normal",
              content: `Credit of $${parseFloat(amount).toFixed(2)} applied. Reason: ${reasonCodes.find(r => r.value === reasonCode)?.label || reasonCode}`,
              tags: ["credit", "billing", reasonCode],
            });
          } catch (noteErr) {
            console.error("Failed to log credit to notes:", noteErr);
          }

          onSuccess();
          onClose();
        } else {
          setError(data?.message || "Failed to apply credit");
        }
      } else {
        // Refund - show instructions
        setShowRefundInstructions(true);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to process request");
    } finally {
      setProcessing(false);
    }
  };

  const handleRefundConfirmed = async () => {
    try {
      // Log refund attempt to notes
      await apiClient.post("/customer-verification/notes", {
        customerId,
        noteType: "Billing",
        priority: "High",
        content: `Refund of $${parseFloat(amount).toFixed(2)} requested. Reason: ${reasonCodes.find(r => r.value === reasonCode)?.label || reasonCode}. ACTION REQUIRED: Process manually in Stripe Dashboard. Must be completed within 5 working days for compliance.`,
        tags: ["refund", "billing", "stripe", reasonCode],
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to log refund request");
    }
  };

  if (showRefundInstructions) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
        <div className="w-full max-w-md rounded-[16px] bg-white p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">Manual Refund Required</h2>
            <button
              onClick={onClose}
              className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-[14px] font-semibold text-amber-800 mb-2">
                Process this refund manually in the Stripe Dashboard
              </p>
              <p className="text-[13px] text-amber-700">
                Amount: <span className="font-semibold">${parseFloat(amount).toFixed(2)}</span>
              </p>
              <p className="text-[13px] text-amber-700">
                Reason: <span className="font-semibold">{reasonCodes.find(r => r.value === reasonCode)?.label || reasonCode}</span>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[16px] font-semibold text-[#0A0A0A]">Verification Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-[14px] text-[#6F6C90]">
                <li>Log in to Stripe Dashboard</li>
                <li>Navigate to Payments section</li>
                <li>Find the relevant payment transaction</li>
                <li>Click "Refund" and enter the amount: ${parseFloat(amount).toFixed(2)}</li>
                <li>Add reason code: {reasonCodes.find(r => r.value === reasonCode)?.label || reasonCode}</li>
                <li>Process the refund</li>
                <li>Verify refund completion</li>
              </ol>
            </div>

            <div className="rounded-[10px] border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-[13px] text-blue-800">
                <span className="font-semibold">Compliance Note:</span> Refund must be processed within 5 working days. Customer will be notified via email/SMS upon completion.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
            >
              Cancel
            </button>
            <button
              onClick={handleRefundConfirmed}
              className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95"
            >
              I Understand - Log Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-[16px] bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">Apply Credit / Refund</h2>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Type Selector */}
          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-2">
              Type *
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-[10px] border border-[#DFDBE3] cursor-pointer hover:bg-[#F8F8F8]">
                <input
                  type="radio"
                  name="creditRefundType"
                  value="credit"
                  checked={type === "credit"}
                  onChange={() => setType("credit")}
                  className="h-4 w-4 accent-[#401B60]"
                />
                <div>
                  <div className="text-[14px] font-medium text-[#0A0A0A]">Credit</div>
                  <div className="text-[12px] text-[#6F6C90]">Apply to account balance</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-[10px] border border-[#DFDBE3] cursor-pointer hover:bg-[#F8F8F8]">
                <input
                  type="radio"
                  name="creditRefundType"
                  value="refund"
                  checked={type === "refund"}
                  onChange={() => setType("refund")}
                  className="h-4 w-4 accent-[#401B60]"
                />
                <div>
                  <div className="text-[14px] font-medium text-[#0A0A0A]">Refund</div>
                  <div className="text-[12px] text-[#6F6C90]">Return to payment method</div>
                </div>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] text-[#6F6C90]">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || validateAmount(value)) {
                    setAmount(value);
                  }
                }}
                className="w-full rounded-[10px] border border-[#DFDBE3] pl-8 pr-4 py-3 text-[14px] outline-none focus:border-[#401B60]"
                placeholder="0.00"
              />
            </div>
            <p className="mt-1 text-[12px] text-[#6F6C90]">Enter positive numeric value only</p>
          </div>

          {/* Reason Code */}
          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
              Reason Code *
            </label>
            <select
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60]"
            >
              <option value="">Select reason code</option>
              {reasonCodes.map((code) => (
                <option key={code.value} value={code.value}>
                  {code.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={processing || !type || !amount || !reasonCode}
            className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {processing ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

