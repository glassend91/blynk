'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '../lib/stripe';
import { createSetupIntent, createPaymentMethod, type CreatePaymentMethodRequest } from '../lib/services/paymentMethods';

interface AddPaymentMethodModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface PaymentFormProps {
    onClose: () => void;
    onSuccess: () => void;
}

function PaymentForm({ onClose, onSuccess }: PaymentFormProps) {
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
            // Trigger form validation and wallet collection
            const { error: submitError } = await elements.submit();
            if (submitError) {
                setError(submitError.message || 'Validation failed');
                setLoading(false);
                return;
            }

            // Create setup intent
            const { clientSecret } = await createSetupIntent();

            // Confirm the setup intent with the payment element
            const { error: stripeError, setupIntent } = await stripe.confirmSetup({
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
                setError(stripeError.message || 'An error occurred');
                setLoading(false);
                return;
            }

            if (setupIntent?.payment_method) {
                // Save the payment method to our backend
                const paymentMethodData: CreatePaymentMethodRequest = {
                    paymentMethodId: setupIntent.payment_method as string
                };

                await createPaymentMethod(paymentMethodData);
                onSuccess();
                onClose();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
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
            },
            invalid: {
                color: '#9e2146',
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                </div>
            )}

            <div>
                <div className="border border-gray-300 rounded-md p-3">
                    <PaymentElement options={{
                        layout: 'auto',
                        fields: {
                            billingDetails: {
                                address: 'never',
                                name: 'never'
                            }
                        }
                    }} />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3F205F]"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#3F205F] border border-transparent rounded-md hover:bg-[#2D1A4A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3F205F] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Adding...' : 'Add Payment Method'}
                </button>
            </div>
        </form>
    );
}

export default function AddPaymentMethodModal({ isOpen, onClose, onSuccess }: AddPaymentMethodModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Add Payment Method
                                </h3>
                                <Elements stripe={stripePromise} options={{ mode: 'setup', currency: 'aud', paymentMethodTypes: ['card'] }}>
                                    <PaymentForm onClose={onClose} onSuccess={onSuccess} />
                                </Elements>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
