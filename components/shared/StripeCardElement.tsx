"use client";

import {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { stripePromise, createPaymentIntent } from "@/lib/stripe";

interface StripeCardElementProps {
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

export default function StripeCardElement({
  onPaymentSuccess,
  onPaymentError,
  amount,
  currency = "aud",
  disabled = false,
  hideButton = false,
  onPaymentReady,
  onSubmitRef,
  formId,
}: StripeCardElementProps) {
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

  const handleSubmit = useCallback(
    async (event?: React.FormEvent) => {
      if (event) {
        event.preventDefault();
      }

      if (!stripe || !elements) {
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        // Create payment intent using apiClient
        const clientSecret = await createPaymentIntent(amount, currency);

        // Confirm payment
        const { error: stripeError, paymentIntent } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement)!,
            },
          });

        if (stripeError) {
          setError(stripeError.message || "Payment failed");
          onPaymentError(stripeError);
        } else if (paymentIntent.status === "succeeded") {
          onPaymentSuccess(paymentIntent);
        }
      } catch (err: any) {
        setError(err.message || "Payment failed");
        onPaymentError(err);
      } finally {
        setIsProcessing(false);
      }
    },
    [stripe, elements, amount, currency, onPaymentSuccess, onPaymentError],
  );

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

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: "Mulish, sans-serif",
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: true,
  };

  return (
    <form
      id={formId}
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
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

      {!hideButton && (
        <button
          type="submit"
          disabled={!stripe || isProcessing || disabled}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing
            ? "Processing..."
            : `Pay $${amount.toFixed(2)} ${currency.toUpperCase()}`}
        </button>
      )}
    </form>
  );
}

// Export a version that can be controlled externally
export const StripeCardElementWithRef = forwardRef<
  { submitPayment: () => Promise<void> },
  Omit<StripeCardElementProps, "hideButton" | "onPaymentReady">
>((props, ref) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const clientSecret = await createPaymentIntent(
        props.amount,
        props.currency || "aud",
      );
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        props.onPaymentError(stripeError);
      } else if (paymentIntent.status === "succeeded") {
        props.onPaymentSuccess(paymentIntent);
      }
    } catch (err: any) {
      setError(err.message || "Payment failed");
      props.onPaymentError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  useImperativeHandle(ref, () => ({
    submitPayment: handleSubmit,
  }));

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: "Mulish, sans-serif",
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
});
