"use client";

import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';

interface StripeProviderProps {
    children: React.ReactNode;
}

export default function StripeProvider({ children }: StripeProviderProps) {
    if (!stripePromise) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-red-100">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-red-800">Stripe Configuration Error</p>
                        <p className="text-sm text-red-600">Please set STRIPE_PUBLISHABLE_KEY in your environment variables</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise}>
            {children}
        </Elements>
    );
}
