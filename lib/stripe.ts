import { loadStripe } from '@stripe/stripe-js';
import apiClient from './apiClient';

// Fetch the publishable key from the server
const getPublishableKey = async () => {
    if (typeof window === 'undefined') return ''; // Don't run on server during build
    try {
        const response = await fetch('/api/config/stripe');
        const data = await response.json();
        return data.publishableKey || '';
    } catch (error) {
        console.error('Error fetching Stripe publishable key:', error);
        return '';
    }
};

// Initialize Stripe with the fetched key
export const stripePromise = typeof window !== 'undefined' 
    ? getPublishableKey().then(key => key ? loadStripe(key) : null)
    : Promise.resolve(null);

// Stripe configuration (only exported if needed on server)
// Note: secret keys should only be accessed via process.env directly in server-side code

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
