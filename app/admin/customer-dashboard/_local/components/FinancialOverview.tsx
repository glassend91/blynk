"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import apiClient from "@/lib/apiClient";
import { getAuthUser } from "@/lib/auth";
import { usePermission } from "@/lib/permissions";
import ManualChargeModal from "./ManualChargeModal";

type CreditEntry = {
  id: string;
  amount: number;
  reasonCode: string;
  appliedBy: string;
  appliedAt: string;
};

type ChargeEntry = {
  id: string;
  amount: number;
  description: string;
  status: string;
  appliedAt: string;
  invoiceNumber: string;
};

type FinancialData = {
  accountBalance: number;
  nextBillDueDate?: string;
  autoPayStatus: "Active" | "Inactive";
  paymentMethod?: string;
  credits?: CreditEntry[];
  charges?: ChargeEntry[];
};

type Props = {
  customerId?: string;
  customerName?: string;
  onCreditRefundApplied?: () => void;
};

export default function FinancialOverview({
  customerId,
  customerName,
  onCreditRefundApplied,
}: Props) {
  const [financialData, setFinancialData] = useState<FinancialData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreditRefundModal, setShowCreditRefundModal] = useState(false);
  const [showManualChargeModal, setShowManualChargeModal] = useState(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [creditIdToRemove, setCreditIdToRemove] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const canIssueCreditsRefunds = usePermission("billing.credits_refunds");

  useEffect(() => {
    if (customerId) {
      fetchFinancialData();
    } else {
      setFinancialData(null);
    }
  }, [customerId]);

  const handleRemoveCredit = (creditId: string) => {
    setCreditIdToRemove(creditId);
    setShowRemoveConfirmation(true);
  };

  const confirmRemoveCredit = async () => {
    if (!customerId || !creditIdToRemove) return;

    try {
      setIsRemoving(true);
      setError(null);
      const { data } = await apiClient.post("/v1/customer/remove-credit", {
        customerId,
        creditId: creditIdToRemove,
      });

      if (data.success) {
        // Log to notes
        try {
          await apiClient.post("/customer-verification/notes", {
            customerId,
            noteType: "Billing",
            priority: "Normal",
            content: `Credit ID ${creditIdToRemove} was removed/corrected.`,
            tags: ["credit-removed", "billing"],
          });
        } catch (noteErr) {
          console.error("Failed to log credit removal to notes:", noteErr);
        }

        fetchFinancialData();
        onCreditRefundApplied?.();
        setShowRemoveConfirmation(false);
        setCreditIdToRemove(null);
      } else {
        setError(data.message || "Failed to remove credit");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while removing credit");
    } finally {
      setIsRemoving(false);
    }
  };

  const fetchFinancialData = async () => {
    if (!customerId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch financial data from API
      const { data } = await apiClient
        .get<{
          success: boolean;
          data?: FinancialData;
          financial?: FinancialData;
        }>(`/customer-verification/financial/${customerId}`)
        .catch(async () => {
          // Fallback: try alternative endpoint
          return await apiClient.get<{
            success: boolean;
            data?: FinancialData;
            financial?: FinancialData;
          }>(`/customer-plans/financial/${customerId}`);
        });

      if (data?.success) {
        let financial: FinancialData;

        if ("data" in data) {
          financial = data.data;
        } else if ("financial" in data) {
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
        <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-4">
          Financial Overview
        </h2>
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
        <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-4">
          Financial Overview
        </h2>
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#401B60] border-r-transparent"></div>
          <p className="mt-4 text-[14px] text-[#6F6C90]">
            Loading financial data...
          </p>
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
          <h2 className="text-[20px] font-semibold text-[#0A0A0A]">
            Financial Overview
          </h2>
          {canIssueCreditsRefunds && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowManualChargeModal(true)}
                className="rounded-[8px] bg-[#19BF66] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#15A357] transition-all"
              >
                One-Off Charge
              </button>
              <button
                onClick={() => setShowCreditRefundModal(true)}
                className="rounded-[8px] bg-[#401B60] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-95"
              >
                Apply Credit / Refund
              </button>
            </div>
          )}
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
            <div
              className={`text-[18px] font-semibold ${isCredit ? "text-green-600" : "text-[#0A0A0A]"}`}
            >
              {balanceDisplay}
            </div>
          </div>

          {financialData?.nextBillDueDate && (
            <div>
              <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">
                Next Bill Due Date
              </div>
              <div className="text-[14px] text-[#0A0A0A]">
                {new Date(financialData.nextBillDueDate).toLocaleDateString(
                  "en-AU",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  },
                )}
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
              <div className="text-[14px] text-[#0A0A0A]">
                {financialData.paymentMethod}
              </div>
            </div>
          )}
        </div>

        {/* Credit History Section */}
        {financialData?.credits && financialData.credits.length > 0 && (
          <div className="mt-8 border-t border-[#DFDBE3] pt-6">
            <h3 className="text-[16px] font-semibold text-[#0A0A0A] mb-4">
              Recently Applied Credits
            </h3>
            <div className="space-y-3">
              {financialData.credits.map((credit) => (
                <div
                  key={credit.id}
                  className="flex items-center justify-between rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-3"
                >
                  <div>
                    <div className="text-[14px] font-medium text-[#0A0A0A]">
                      ${credit.amount.toFixed(2)} Credit applied
                    </div>
                    <div className="text-[12px] text-[#6F6C90]">
                      Reason: {credit.reasonCode} •{" "}
                      {new Date(credit.appliedAt).toLocaleDateString("en-AU")}
                    </div>
                  </div>
                  {canIssueCreditsRefunds && (
                    <button
                      onClick={() => handleRemoveCredit(credit.id)}
                      className="rounded-[6px] border border-red-200 bg-white px-3 py-1.5 text-[12px] font-medium text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* One-Off Charges History Section */}
        {financialData?.charges && financialData.charges.length > 0 && (
          <div className="mt-8 border-t border-[#DFDBE3] pt-6">
            <h3 className="text-[16px] font-semibold text-[#0A0A0A] mb-4">
              Recently Processed Charges
            </h3>
            <div className="space-y-3">
              {financialData.charges.map((charge) => (
                <div
                  key={charge.id}
                  className="flex items-center justify-between rounded-[10px] border border-[#E7F7ED] bg-[#F4FBF7] p-3 shadow-sm hover:border-[#19BF66]/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#19BF66]/10 text-[#19BF66]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2v20M17 5H9.5a4.5 4.5 0 0 0 0 9h5a4.5 4.5 0 0 1 0 9H7"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#0A0A0A]">
                        ${charge.amount.toFixed(2)} Charge processed
                      </div>
                      <div className="text-[12px] text-[#6F6C90]">
                        {charge.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-bold text-[#19BF66]">
                      {new Date(charge.appliedAt).toLocaleDateString("en-AU")}
                    </div>
                    <div className="text-[11px] font-medium text-[#6F6C90]">
                      {charge.invoiceNumber}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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

      {/* Manual Charge Modal */}
      {showManualChargeModal && (
        <ManualChargeModal
          customerId={customerId}
          customerName={customerName || "Selected Customer"}
          onClose={() => setShowManualChargeModal(false)}
          onSuccess={() => {
            fetchFinancialData();
            onCreditRefundApplied?.();
          }}
        />
      )}

      {/* Remove Credit Confirmation Modal */}
      {showRemoveConfirmation && (
        <ConfirmationModal
          title="Remove Credit"
          message="Are you sure you want to remove this credit? This will add the credit amount back to the customer's balance."
          confirmLabel={isRemoving ? "Removing..." : "Remove Credit"}
          cancelLabel="Cancel"
          onConfirm={confirmRemoveCredit}
          onCancel={() => {
            if (!isRemoving) {
              setShowRemoveConfirmation(false);
              setCreditIdToRemove(null);
            }
          }}
          isDanger={true}
          isLoading={isRemoving}
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
  const [detailedNote, setDetailedNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRefundInstructions, setShowRefundInstructions] = useState(false);
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

    if (!detailedNote.trim()) {
      setError("Please enter a detailed note for this transaction");
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Get current staff member name
      const authUser = getAuthUser<{
        firstName?: string;
        lastName?: string;
        email?: string;
      }>();
      const staffName = authUser
        ? [authUser.firstName, authUser.lastName].filter(Boolean).join(" ") ||
          authUser.email ||
          "Staff Member"
        : "Staff Member";

      const timestamp = new Date().toLocaleString("en-AU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const reasonLabel =
        reasonCodes.find((r) => r.value === reasonCode)?.label || reasonCode;

      const formattedNote = `[${timestamp}] ${staffName} - ${reasonLabel}: ${detailedNote}`;

      if (type === "credit") {
        // Apply credit via OneView API
        const { data } = await apiClient.post<{
          success: boolean;
          message?: string;
        }>("/v1/customer/credit", {
          customerId,
          amount: parseFloat(amount),
          reasonCode,
        });

        if (data?.success) {
          // Log to notes
          try {
            await apiClient.post("/customer-verification/notes", {
              customerId,
              noteType: "Billing",
              priority: "Normal",
              content: formattedNote,
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
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to process request",
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleRefundConfirmed = async () => {
    try {
      setProcessing(true);
      setError(null);

      // Get current staff member name
      const authUser = getAuthUser<{
        firstName?: string;
        lastName?: string;
        email?: string;
      }>();
      const staffName = authUser
        ? [authUser.firstName, authUser.lastName].filter(Boolean).join(" ") ||
          authUser.email ||
          "Staff Member"
        : "Staff Member";

      const timestamp = new Date().toLocaleString("en-AU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const reasonLabel =
        reasonCodes.find((r) => r.value === reasonCode)?.label || reasonCode;

      const formattedNote = `[${timestamp}] ${staffName} - ${reasonLabel}: ${detailedNote}`;

      // Log refund attempt to notes
      await apiClient.post("/customer-verification/notes", {
        customerId,
        noteType: "Billing",
        priority: "High",
        content: `REFUND REQUESTED: ${formattedNote}. ACTION REQUIRED: Process manually in Stripe Dashboard. Must be completed within 5 working days for compliance.`,
        tags: ["refund", "billing", "stripe", reasonCode],
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to log refund request");
    } finally {
      setProcessing(false);
    }
  };

  if (showRefundInstructions) {
    return createPortal(
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 sm:p-6 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-[16px] bg-white p-6 shadow-2xl my-auto"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">
              Manual Refund Required
            </h2>
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
                Amount:{" "}
                <span className="font-semibold">
                  ${parseFloat(amount).toFixed(2)}
                </span>
              </p>
              <p className="text-[13px] text-amber-700">
                Reason:{" "}
                <span className="font-semibold">
                  {reasonCodes.find((r) => r.value === reasonCode)?.label ||
                    reasonCode}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-[16px] font-semibold text-[#0A0A0A]">
                Verification Steps:
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-[14px] text-[#6F6C90]">
                <li>Log in to Stripe Dashboard</li>
                <li>Navigate to Payments section</li>
                <li>Find the relevant payment transaction</li>
                <li>
                  Click "Refund" and enter the amount: $
                  {parseFloat(amount).toFixed(2)}
                </li>
                <li>
                  Add reason code:{" "}
                  {reasonCodes.find((r) => r.value === reasonCode)?.label ||
                    reasonCode}
                </li>
                <li>Process the refund</li>
                <li>Verify refund completion</li>
              </ol>
            </div>

            <div className="rounded-[10px] border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-[13px] text-blue-800">
                <span className="font-semibold">Compliance Note:</span> Refund
                must be processed within 5 working days. Customer will be
                notified via email/SMS upon completion.
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
      </div>,
      document.body
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-[16px] bg-white p-8 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[28px] font-extrabold text-[#0A0A0A]">
            Apply Credit / Refund
          </h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F] hover:bg-[#FFE0E0] transition-colors"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Type Selection */}
          <div className="space-y-4">
            <label className="block text-[15px] font-bold text-[#0A0A0A]">
              Transaction Type *
            </label>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-4 p-4 rounded-[12px] border transition-all cursor-pointer ${
                  type === "credit"
                    ? "border-[#401B60] bg-[#FBFAFD] shadow-sm"
                    : "border-[#DFDBE3] hover:bg-[#F8F8F8]"
                }`}
              >
                <input
                  type="radio"
                  name="creditRefundType"
                  value="credit"
                  checked={type === "credit"}
                  onChange={() => setType("credit")}
                  className="h-5 w-5 accent-[#401B60]"
                />
                <div>
                  <div className="text-[16px] font-bold text-[#0A0A0A]">
                    Credit
                  </div>
                  <div className="text-[13px] text-[#6F6C90]">
                    Apply to account balance
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center gap-4 p-4 rounded-[12px] border transition-all cursor-pointer ${
                  type === "refund"
                    ? "border-[#401B60] bg-[#FBFAFD] shadow-sm"
                    : "border-[#DFDBE3] hover:bg-[#F8F8F8]"
                }`}
              >
                <input
                  type="radio"
                  name="creditRefundType"
                  value="refund"
                  checked={type === "refund"}
                  onChange={() => setType("refund")}
                  className="h-5 w-5 accent-[#401B60]"
                />
                <div>
                  <div className="text-[16px] font-bold text-[#0A0A0A]">
                    Refund
                  </div>
                  <div className="text-[13px] text-[#6F6C90]">
                    Return to payment method
                  </div>
                </div>
              </label>
            </div>

            {/* Amount (Moved to left column if spacing allows, or keep in right) */}
            <div className="pt-2">
              <label className="block text-[15px] font-bold text-[#0A0A0A] mb-2">
                Amount (AUD) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-semibold text-[#6F6C90]">
                  $
                </span>
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
                  className="w-full rounded-[12px] border border-[#DFDBE3] bg-white pl-10 pr-4 py-3.5 text-[16px] font-semibold outline-none focus:border-[#401B60] transition-colors shadow-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Reason & Notes */}
          <div className="space-y-6">
            <div>
              <label className="block text-[15px] font-bold text-[#0A0A0A] mb-2">
                Reason Code *
              </label>
              <select
                value={reasonCode}
                onChange={(e) => setReasonCode(e.target.value)}
                className="w-full rounded-[12px] border border-[#DFDBE3] bg-white px-4 py-3.5 text-[15px] outline-none focus:border-[#401B60] transition-colors shadow-sm cursor-pointer"
              >
                <option value="">Select reason code</option>
                {reasonCodes.map((code) => (
                  <option key={code.value} value={code.value}>
                    {code.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[15px] font-bold text-[#0A0A0A] mb-2">
                Detailed Note *
              </label>
              <textarea
                value={detailedNote}
                onChange={(e) => setDetailedNote(e.target.value)}
                placeholder="Briefly explain the reason for this adjustment..."
                className="w-full h-[155px] rounded-[12px] border border-[#DFDBE3] bg-white px-4 py-3.5 text-[15px] outline-none focus:border-[#401B60] transition-colors shadow-sm resize-none"
              />
              <p className="mt-2 text-[12px] text-[#6F6C90] italic">
                Note: This description will be logged to the customer's permanent record for audit purposes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-4 border-t border-[#F0EEF3] pt-6">
          <button
            onClick={onClose}
            className="rounded-[12px] border border-[#DFDBE3] px-6 py-3 text-[15px] font-bold text-[#6F6C90] hover:bg-[#F8F8F8] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              processing || !type || !amount || !reasonCode || !detailedNote.trim()
            }
            className="group flex items-center gap-2 rounded-[12px] bg-[#401B60] px-8 py-3 text-[15px] font-bold text-white shadow-lg hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                Submit Transaction
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="transition-transform group-hover:translate-x-1"
                >
                  <path
                    d="M13.5 4.5l7.5 7.5-7.5 7.5m-11-7.5h18.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
function ConfirmationModal({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isDanger = false,
  isLoading = false,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
  isLoading?: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    setMounted(true);
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

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 sm:p-6 overflow-y-auto"
      onClick={isLoading ? undefined : onCancel}
    >
      <div
        className="relative w-full max-w-sm rounded-[16px] bg-white p-6 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[20px] font-bold text-[#0A0A0A] mb-2">{title}</h2>
        <p className="text-[14px] text-[#6F6C90] mb-6">{message}</p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-[10px] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 ${
              isDanger ? "bg-red-600" : "bg-[#401B60]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
