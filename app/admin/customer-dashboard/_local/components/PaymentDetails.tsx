"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { usePermission } from "@/lib/permissions";
import AddCustomerPaymentMethodModal from "./AddCustomerPaymentMethodModal";

type PaymentMethod = {
    id: string;
    type: 'card' | 'bank_account';
    displayName: string;
    expiryDisplay?: string;
    isDefault: boolean;
    isActive: boolean;
    card?: {
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
        funding: string;
        country: string;
    };
    bankAccount?: {
        bankName: string;
        last4: string;
        routingNumber: string;
        accountType: string;
        country: string;
    };
    billingDetails?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: {
            line1?: string;
            line2?: string;
            city?: string;
            state?: string;
            postalCode?: string;
            country?: string;
        };
    };
    createdAt: string;
    updatedAt: string;
};

type Props = {
    customerId?: string;
};

export default function PaymentDetails({ customerId }: Props) {
    const canManagePaymentDetails = usePermission("can_manage_customer_payment_details");

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (customerId) {
            fetchPaymentMethods();
        }
    }, [customerId]);

    const fetchPaymentMethods = async () => {
        if (!customerId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.get<{
                success: boolean;
                data?: { paymentMethods: PaymentMethod[] };
                message?: string;
            }>(`/v1/customer/${customerId}/payment-methods`);

            if (response.data?.success && response.data.data) {
                setPaymentMethods(response.data.data.paymentMethods);
            } else {
                setPaymentMethods([]);
            }
        } catch (err: any) {
            console.error("Failed to fetch payment methods:", err);
            setError(err?.response?.data?.message || err?.message || "Failed to load payment methods");
            setPaymentMethods([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPaymentMethod = () => {
        if (!customerId) return;
        setAddModalOpen(true);
    };

    const handlePaymentMethodAdded = () => {
        // Refresh payment methods after successful addition
        fetchPaymentMethods();
    };

    const handleSetDefault = async (paymentMethodId: string) => {
        if (!customerId) return;

        try {
            setSaving(true);
            setError(null);

            await apiClient.put(`/v1/customer/${customerId}/payment-methods/${paymentMethodId}/default`);

            // Refresh payment methods
            await fetchPaymentMethods();
        } catch (err: any) {
            console.error("Failed to set default payment method:", err);
            setError(err?.response?.data?.message || err?.message || "Failed to set default payment method");
        } finally {
            setSaving(false);
        }
    };

    const handleDeletePaymentMethod = async (paymentMethodId: string) => {
        if (!customerId) return;

        if (!confirm('Are you sure you want to delete this payment method?')) {
            return;
        }

        try {
            setSaving(true);
            setError(null);

            await apiClient.delete(`/v1/customer/${customerId}/payment-methods/${paymentMethodId}`);

            // Refresh payment methods
            await fetchPaymentMethods();
        } catch (err: any) {
            console.error("Failed to delete payment method:", err);
            setError(err?.response?.data?.message || err?.message || "Failed to delete payment method");
        } finally {
            setSaving(false);
        }
    };

    const getCardBrandIcon = (brand: string) => {
        const icons: Record<string, string> = {
            visa: '💳',
            mastercard: '💳',
            amex: '💳',
            discover: '💳',
            diners: '💳',
            jcb: '💳',
            unionpay: '💳',
        };
        return icons[brand.toLowerCase()] || '💳';
    };

    // Hide component if user doesn't have permission
    if (!canManagePaymentDetails) {
        return null;
    }

    if (loading && paymentMethods.length === 0) {
        return (
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-center py-8">
                    <div className="text-[14px] text-[#6F6C90]">Loading payment methods...</div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[20px] font-semibold text-[#0A0A0A]">Payment Details</h2>
                    <button
                        onClick={handleAddPaymentMethod}
                        disabled={saving}
                        className="rounded-[8px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-50"
                    >
                        {saving ? 'Loading...' : 'Add Payment Method'}
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {paymentMethods.length === 0 ? (
                        <div className="text-center py-8">
                            <div className="text-[14px] text-[#6F6C90] mb-2">No payment methods found</div>
                            <div className="text-[12px] text-[#9CA3AF]">
                                Add a payment method to enable automatic billing
                            </div>
                        </div>
                    ) : (
                        paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className="flex items-center justify-between p-4 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8]"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-[20px]">
                                        {method.type === 'card' ? getCardBrandIcon(method.card?.brand || '') : '🏦'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-[16px] font-semibold text-[#0A0A0A]">
                                                {method.displayName}
                                            </div>
                                            {method.isDefault && (
                                                <span className="inline-block px-2 py-1 rounded-[4px] bg-[#401B60] text-[10px] font-medium text-white">
                                                    DEFAULT
                                                </span>
                                            )}
                                        </div>
                                        {method.expiryDisplay && (
                                            <div className="text-[12px] text-[#6F6C90]">
                                                Expires {method.expiryDisplay}
                                            </div>
                                        )}
                                        <div className="text-[12px] text-[#9CA3AF]">
                                            Added {new Date(method.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {!method.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(method.id)}
                                            disabled={saving}
                                            className="rounded-[6px] border border-[#401B60] px-3 py-1 text-[12px] font-medium text-[#401B60] hover:bg-[#401B60] hover:text-white disabled:opacity-50"
                                        >
                                            Set as Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeletePaymentMethod(method.id)}
                                        disabled={saving}
                                        className="rounded-[6px] border border-red-300 px-3 py-1 text-[12px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Payment Method Modal */}
            <AddCustomerPaymentMethodModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onSuccess={handlePaymentMethodAdded}
                customerId={customerId || ''}
            />
        </>
    );
}
