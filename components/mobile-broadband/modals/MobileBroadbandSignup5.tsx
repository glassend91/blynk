"use client";

import { useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import StripePaymentElement from "@/components/shared/StripePaymentElement";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";

export default function MobileBroadbandSignup5({
  onNext,
  onBack,
  onClose,
  selectedPlan,
  onStepClick,
  maxReached,
  onComplete,
}: {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  selectedPlan?: { id?: string | number; name: string; price: number } | null;
  onStepClick?: (step: number) => void;
  maxReached?: number;
  onComplete?: () => Promise<{ success: boolean; message?: string }>;
}) {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signupDone, setSignupDone] = useState(false);
  const [submitPaymentFn, setSubmitPaymentFn] = useState<(() => void) | null>(null);

  // Get payment amount from selected plan, default to 35.00 if no plan selected
  const paymentAmount = selectedPlan?.price || 35.00;
  const planName = selectedPlan?.name || "Data Standard";

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

    // Step 1: Hit the backend API first (Signup)
    if (!signupDone && onComplete) {
      const result = await onComplete();
      if (result.success) {
        setSignupDone(true);
      } else {
        setIsProcessing(false);
        setPaymentError(result.message || "Signup failed");
        return;
      }
    }

    // Step 2: Trigger the Stripe payment
    submitPaymentFn();
  };

  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6"><MbbStepper active={5} onStepClick={onStepClick} maxReached={maxReached} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Payment & Agreement</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Review your order and complete payment</p>
        </div>

        <div className="mx-auto mt-8 max-w-[880px]">
          {paymentSuccess ? (
            <div className="text-center py-8 rounded-[16px] border border-[#E7E4EC] bg-white p-6">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600 mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h3>
              <p className="text-green-600">Your mobile broadband plan payment has been processed successfully.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Order Summary - Left Column */}
              <div className="rounded-[16px] border border-[#E7E4EC] bg-[#FBF8FF] p-6">
                <div className="text-[18px] font-semibold text-[#2F2A3A] mb-4">Order Summary</div>
                <div className="space-y-3 text-[14px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6F6C90]">Selected Plan:</span>
                    <span className="font-semibold text-[#2E2745]">{planName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6F6C90]">Monthly Cost:</span>
                    <span className="font-semibold text-[#2E2745]">${paymentAmount.toFixed(2)}/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6F6C90]">SIM Type:</span>
                    <span className="font-semibold text-[#2E2745]">eSIM (Free)</span>
                  </div>
                  <div className="pt-3 border-t border-[#E7E4EC]">
                    <div className="flex items-center justify-between">
                      <span className="text-[16px] font-semibold text-[#2E2745]">Total:</span>
                      <span className="text-[18px] font-bold text-[#4F1C76]">${paymentAmount.toFixed(2)} AUD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form - Right Column */}
              <div className="rounded-[16px] border border-[#E7E4EC] bg-white p-6">
                <div className="space-y-6">
                  <div className="rounded-[12px] border border-[#EEE8F6] bg-[#FBF8FF] p-4 text-center">
                    <div className="mb-2 text-[#6F6C90] text-[14px]">Amount due today</div>
                    <div className="text-[32px] font-bold text-[#170F49]">${paymentAmount.toFixed(2)}</div>
                  </div>

                  <div className="rounded-[12px] border border-[#E7E4EC] bg-white p-4">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-50">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-800">Secure Payment</p>
                        <p className="text-sm text-blue-600">Your payment information is encrypted and secure</p>
                      </div>
                    </div>
                  </div>

                  <StripePaymentElement
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    amount={paymentAmount}
                    currency="aud"
                    hideButton={true}
                    onSubmitRef={(fn) => setSubmitPaymentFn(() => fn)}
                    formId="payment-form"
                  />

                  {/* Agreement Checkbox - EXACT TEXT AS REQUIRED */}
                  <div className="rounded-[12px] border border-[#EEE8F6] bg-[#FBF8FF] p-4">
                    <label className="flex items-start gap-3 text-[14px] text-[#3B3551] cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 accent-[#4F1C76] flex-shrink-0"
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
                          className="text-[#4F1C76] underline hover:text-[#3F205F]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Terms and Conditions
                        </a>
                        {" "}and{" "}
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4F1C76] underline hover:text-[#3F205F]"
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
                    disabled={!agreeTerms || isProcessing || !submitPaymentFn}
                    className="w-full rounded-[10px] bg-[#4F1C76] px-5 py-3 text-[15px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3F205F] transition-colors"
                  >
                    {isProcessing ? "Processing Payment..." : "Process Payment"}
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
                </div>
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
