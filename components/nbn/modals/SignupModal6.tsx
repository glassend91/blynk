"use client";

import { useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import Stepper from "@/components/shared/Stepper";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import StripePaymentElement from "@/components/shared/StripePaymentElement";

export default function SignupModal6({
  onNext,
  onBack,
  onClose,
  selectedPlan,
  wantsStaticIp = true,
  onStepClick,
  maxReached,
  onComplete,
  apiError,
  apiLoading,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  selectedPlan?: { name: string; price: number } | null;
  wantsStaticIp?: boolean;
  onStepClick?: (step: number) => void;
  maxReached?: number;
  onComplete?: () => Promise<{ success: boolean; message?: string }>;
  apiError?: string | null;
  apiLoading?: boolean;
}) {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const [submitPaymentFn, setSubmitPaymentFn] = useState<(() => void) | null>(null);

  // Get payment amount from selected plan, default to 69.99 if no plan selected
  const planName = selectedPlan?.name || "NBN Plan";
  const planPrice = selectedPlan?.price || 69.99;
  const staticIpCost = wantsStaticIp ? 10 : 0;
  const paymentAmount = planPrice + staticIpCost;

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment succeeded:', paymentIntent);
    setPaymentSuccess(true);
    setPaymentError(null);
    setIsProcessing(false);
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    setPaymentError(error.message || 'Payment failed');
    setPaymentSuccess(false);
    setIsProcessing(false);
  };

  const handleProcessPayment = async () => {
    if (!agreeTerms || !submitPaymentFn) return;

    setIsProcessing(true);
    setPaymentError(null);

    // Step 1: Hit the backend API first (Wholesaler provisioning)
    // Only call signup if not already successful
    if (!signupDone && onComplete) {
      const result = await onComplete();
      if (result.success) {
        setSignupDone(true);
      } else {
        // If API failed, stop here. The apiError will be displayed via props.
        setIsProcessing(false);
        return;
      }
    }

    // Step 2: Trigger the Stripe payment
    submitPaymentFn();
  };

  return (
    <ModalShell onClose={onClose} size="wide">
      <Stepper active={6} onStepClick={onStepClick} maxReached={maxReached} />

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--cl-brand-ink)] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="12" rx="2" stroke="white" strokeWidth="1.5" /><path d="M3 10h18" stroke="white" strokeWidth="1.5" /></svg>
          </div>
          <h2 className="modal-h1 mt-4">Payment & Agreement</h2>
          <p className="modal-sub mt-1">Review your order and complete payment</p>
        </div>

        <div className="mx-auto mt-8 max-w-[880px]">
          {paymentSuccess ? (
            <div className="text-center py-8 card p-6">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600 mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h3>
              <p className="text-green-600">Your payment has been processed successfully.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Order Summary - Left Column */}
              <div className="card p-6">
                <div className="text-[18px] font-semibold text-[#2E2745] mb-4">Order Summary</div>
                <div className="space-y-3 text-[15px]">
                  <div className="flex items-center justify-between border-b border-[#E9E3F2] pb-3">
                    <span className="text-[#6A6486]">{planName}:</span>
                    <span className="font-semibold text-[#2E2745]">${planPrice.toFixed(2)}/mo</span>
                  </div>
                  {wantsStaticIp && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#6A6486]">Static IP Add-on:</span>
                      <span className="font-semibold text-[#2E2745]">${staticIpCost.toFixed(2)}/mo</span>
                    </div>
                  )}
                  {/* <div className="flex items-center justify-between">
                    <span className="text-[#6A6486]">Setup Fee:</span>
                    <span className="font-semibold text-[#2E2745]">$0.00</span>
                  </div> */}
                  <div className="pt-3 border-t border-[#E9E3F2]">
                    <div className="flex items-center justify-between">
                      <span className="text-[16px] font-semibold text-[#2E2745]">Total:</span>
                      <span className="text-[18px] font-bold text-[var(--cl-brand)]">${paymentAmount.toFixed(2)} AUD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form - Right Column */}
              <div className="card p-6">
                <StripePaymentElement
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  amount={paymentAmount}
                  currency="aud"
                  hideButton={true}
                  onSubmitRef={(fn) => setSubmitPaymentFn(() => fn)}
                  formId="payment-form-nbn"
                />

                {/* Agreement Checkbox - EXACT TEXT AS REQUIRED */}
                <div className="rounded-[12px] border border-[#EEE8F6] bg-[#FBF8FF] p-4">
                  <label className="flex items-start gap-3 text-[14px] text-[#3B3551] cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 accent-[#401B60] flex-shrink-0"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      required
                    />
                    <span className="leading-relaxed">
                      I agree to the{" "}
                      <a
                        href="/terms-and-conditions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#401B60] underline hover:text-[#3F205F]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Terms and Conditions
                      </a>
                      {" "}and{" "}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#401B60] underline hover:text-[#3F205F]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Privacy Policy
                      </a>
                      , and I confirm I am 18 years of age or older.
                    </span>
                  </label>
                </div>

                {/* Process Payment Button - Disabled by default, enabled only after checkbox */}
                <button
                  type="button"
                  onClick={handleProcessPayment}
                  disabled={!agreeTerms || isProcessing || apiLoading || !submitPaymentFn}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (apiLoading ? "Provisioning..." : "Processing Payment...") : "Confirm & Pay"}
                </button>

                {paymentError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-red-100">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-red-800">Error</p>
                        <p className="text-sm text-red-600">{paymentError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {apiError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-red-100">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-red-800">Signup Error</p>
                        <p className="text-sm text-red-600">{apiError}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SectionPanel>

      <BarActions
        onBack={onBack}
        onNext={paymentSuccess ? onNext : undefined}
        disabled={!paymentSuccess}
        label={paymentSuccess ? "Continue" : undefined}
      />
    </ModalShell>
  );
}
