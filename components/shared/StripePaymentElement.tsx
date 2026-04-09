"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import { stripePromise, createPaymentIntent } from '@/lib/stripe';
import { activateAccount } from '@/lib/services/billing';

interface StripePaymentElementProps {
    onPaymentSuccess: (paymentIntent: any) => void;
    onPaymentError: (error: any) => void;
    amount: number;
    currency?: string;
    disabled?: boolean;
    hideButton?: boolean; // If true, don't render the submit button
    onPaymentReady?: (ready: boolean) => void; // Callback to notify parent when payment is ready
    onSubmitRef?: (submitFn: () => void) => void; // Callback to expose submit function
    formId?: string; // Form ID for external submission
}

function PaymentForm({
    onPaymentSuccess,
    onPaymentError,
    amount,
    currency = 'aud',
    disabled = false,
    hideButton = false,
    onPaymentReady,
    onSubmitRef,
    formId,
}: StripePaymentElementProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    const stripe = useStripe();
    const elements = useElements();

    // Expose handleSubmit function for external button
    useEffect(() => {
        if (onPaymentReady && stripe && elements) {
            onPaymentReady(true);
        }
    }, [stripe, elements, onPaymentReady]);

    const handleSubmit = useCallback(async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }

        if (!stripe || !elements) {
            return;
        }

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message || 'Payment failed');
            onPaymentError(submitError);
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Create payment intent using apiClient
            const responseData = await createPaymentIntent(amount, currency);

            // If the invoice/payment was already completed (e.g. credit balance)
            if (responseData.status === 'paid') {
                const intentId = responseData.id || 'pre-paid';
                try {
                    await activateAccount(intentId);
                } catch (actErr) {
                    console.warn('Account activation failed, but invoice was already paid:', actErr);
                }
                onPaymentSuccess({ status: 'succeeded', id: intentId });
                return;
            }

            const clientSecret = responseData.clientSecret;

            // Confirm payment with the client secret
            const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    payment_method_data: {
                        billing_details: {
                            name: 'Blynk Customer',
                            address: {
                                line1: '123 Test Street',
                                city: 'Sydney',
                                state: 'NSW',
                                country: 'AU',
                                postal_code: '2000'
                            }
                        }
                    }
                },
                redirect: 'if_required'
            });

            if (stripeError) {
                setError(stripeError.message || 'Payment failed');
                onPaymentError(stripeError);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Activate account on backend before proceeding
                try {
                    await activateAccount(paymentIntent.id);
                } catch (actErr) {
                    console.error('Account activation failed, but payment succeeded:', actErr);
                    // We still proceed because the payment is confirmed, 
                    // support can manually activate if needed, or user can retry login
                }
                onPaymentSuccess(paymentIntent);
            } else {
                // it might be processing or requires action, depending on payment method
                onPaymentSuccess(paymentIntent);
            }
        } catch (err: any) {
            setError(err.message || 'Payment failed');
            onPaymentError(err);
        } finally {
            setIsProcessing(false);
        }
    }, [stripe, elements, amount, currency, onPaymentSuccess, onPaymentError]);

    // Expose submit function to parent via callback
    useEffect(() => {
        if (onSubmitRef) {
            const submitFn = () => {
                if (formRef.current) {
                    formRef.current.requestSubmit();
                } else {
                    handleSubmit();
                }
            };
            onSubmitRef(submitFn);
        }
    }, [onSubmitRef, handleSubmit]);

    return (
        <form
            id={formId}
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <div className="p-4 border border-[#E7E4EC] rounded-[12px] bg-white shadow-sm">
                <PaymentElement
                    options={{
                        layout: 'auto',
                        fields: {
                            billingDetails: {
                                address: 'never',
                                name: 'never'
                            }
                        }
                    }}
                />
            </div>

            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                </div>
            )}

            {!hideButton && (
                <button
                    type="submit"
                    disabled={!stripe || isProcessing || disabled}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)} ${currency.toUpperCase()}`}
                </button>
            )}
        </form>
    );
}

export default function StripePaymentElement(props: StripePaymentElementProps) {
    if (!stripePromise) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                    <p className="font-semibold text-red-800">Stripe Configuration Error</p>
                </div>
            </div>
        );
    }

    // Deferred intent creation requires amount and currency
    return (
        <Elements
            stripe={stripePromise}
            options={{
                mode: 'payment',
                amount: Math.max(1, Math.round(props.amount * 100)), // minimum 1 cent
                currency: props.currency || 'aud',
                paymentMethodTypes: ['card'] // Force card-only to attempt hiding Link without touching dashboard
            }}
        >
            <PaymentForm {...props} />
        </Elements>
    );
}
