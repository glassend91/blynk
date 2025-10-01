"use client";

import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { stripePromise, createPaymentIntent } from '@/lib/stripe';

interface StripeCardElementProps {
    onPaymentSuccess: (paymentIntent: any) => void;
    onPaymentError: (error: any) => void;
    amount: number;
    currency?: string;
    disabled?: boolean;
}

export default function StripeCardElement({
    onPaymentSuccess,
    onPaymentError,
    amount,
    currency = 'aud',
    disabled = false,
}: StripeCardElementProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Create payment intent using apiClient
            const clientSecret = await createPaymentIntent(amount, currency);

            // Confirm payment
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement)!,
                    },
                }
            );

            if (stripeError) {
                setError(stripeError.message || 'Payment failed');
                onPaymentError(stripeError);
            } else if (paymentIntent.status === 'succeeded') {
                onPaymentSuccess(paymentIntent);
            }
        } catch (err: any) {
            setError(err.message || 'Payment failed');
            onPaymentError(err);
        } finally {
            setIsProcessing(false);
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
            <div className="p-4 border border-gray-300 rounded-lg bg-white">
                <CardElement
                    options={cardElementOptions}
                    className="stripe-card-element"
                />
            </div>

            {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing || disabled}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)} ${currency.toUpperCase()}`}
            </button>
        </form>
    );
}
