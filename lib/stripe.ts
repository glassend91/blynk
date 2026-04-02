import { loadStripe } from '@stripe/stripe-js';
import apiClient from './apiClient';

// Get the publishable key with fallback
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
    console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in environment variables');
}

// Initialize Stripe with your publishable key
export const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

// Stripe configuration
export const STRIPE_CONFIG = {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};

// Payment intent/Invoice creation response
export const createPaymentIntent = async (amount: number, currency: string = 'aud') => {
    try {
        const response = await apiClient.post('/stripe/create-payment-intent', {
            amount: Math.round(amount * 100), // convert to cents
            currency,
        });

        return response.data;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
};
