"use client";

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createCustomerSetupIntent, createCustomerPaymentMethod } from '@/lib/services/paymentMethods';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!);

interface AddCustomerPaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    customerId: string;
}

interface PaymentFormProps {
    onClose: () => void;
    onSuccess: () => void;
    customerId: string;
}

function PaymentForm({ onClose, onSuccess, customerId }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Create setup intent for the customer
            const { clientSecret } = await createCustomerSetupIntent(customerId);

            // Confirm the setup intent with the card element
            const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!
                }
            });

            if (stripeError) {
                setError(stripeError.message || 'An error occurred');
                setLoading(false);
                return;
            }

            if (setupIntent?.payment_method) {
                // Save the payment method to our backend for the customer
                await createCustomerPaymentMethod(customerId, {
                    paymentMethodId: setupIntent.payment_method as string
                });

                onSuccess();
                onClose();
            }
        } catch (err: any) {
            console.error('Error adding payment method:', err);
            setError(err?.response?.data?.message || err?.message || 'Failed to add payment method');
        } finally {
            setLoading(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                    color: '#aab7c4',
                },
                fontFamily: 'Mulish, sans-serif',
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: true,
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
                    Card Information
                </label>
                <div className="p-4 border border-[#DFDBE3] rounded-[10px] bg-white">
                    <CardElement options={cardElementOptions} />
                </div>
                <p className="text-[12px] text-[#6F6C90] mt-2">
                    Your card information is encrypted and secure.
                </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="rounded-[8px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-50"
                >
                    {loading ? 'Adding...' : 'Add Payment Method'}
                </button>
            </div>
        </form>
    );
}

export default function AddCustomerPaymentMethodModal({
    isOpen,
    onClose,
    onSuccess,
    customerId
}: AddCustomerPaymentMethodModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed z-[90]"
            style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 0,
                padding: 0,
                width: '100vw',
                height: '100vh',
                overflow: 'auto'
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
                    zIndex: 90
                }}
            />
            <div
                className="fixed left-1/2 top-1/2 max-h-[90vh] w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[18px] bg-white p-6 shadow-2xl"
                style={{ zIndex: 91 }}
            >
                <div className="mb-1 flex items-center justify-between">
                    <div>
                        <p className="text-[12px] uppercase tracking-[2px] text-[#6F6C90]">Payment Method</p>
                        <h2 className="text-[26px] font-extrabold text-[#0A0A0A]">Add Payment Method</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="grid h-8 w-8 place-items-center rounded-full bg-[#F3E8FF] text-[#5B2DEE]"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-4">
                    <p className="text-[14px] text-[#6F6C90]">
                        Add a new payment method for this customer. The card information will be securely stored.
                    </p>
                </div>

                <Elements stripe={stripePromise}>
                    <PaymentForm onClose={onClose} onSuccess={onSuccess} customerId={customerId} />
                </Elements>
            </div>
        </div>
    );
}
