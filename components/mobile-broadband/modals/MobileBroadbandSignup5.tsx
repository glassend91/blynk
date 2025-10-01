"use client";

import { useState } from "react";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import StripeProvider from "@/components/shared/StripeProvider";
import StripeCardElement from "@/components/shared/StripeCardElement";
import MbbHeaderBanner from "../MbbHeaderBanner";
import MbbStepper from "../MbbStepper";

export default function MobileBroadbandSignup5({
  onNext, onBack, onClose,
}: { onNext: () => void; onBack: () => void; onClose: () => void; }) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Example amount for mobile broadband plan
  const paymentAmount = 45.00; // $45/month for mobile broadband plan

  const handlePaymentSuccess = (paymentIntent: any) => {
    console.log('Payment succeeded:', paymentIntent);
    setPaymentSuccess(true);
    setPaymentError(null);
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment failed:', error);
    setPaymentError(error.message || 'Payment failed');
    setPaymentSuccess(false);
  };

  return (
    <ModalShell onClose={onClose} size="wide">
      <MbbHeaderBanner />
      <div className="mt-6"><MbbStepper active={5} /></div>

      <SectionPanel>
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
          </div>
          <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Payment Details</h2>
          <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Secure payment information</p>
        </div>

        <div className="mx-auto mt-8 max-w-[760px] rounded-[16px] border border-[#E7E4EC] bg-white p-6">
          {paymentSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600 mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h3>
              <p className="text-green-600">Your mobile broadband plan payment has been processed successfully.</p>
            </div>
          ) : (
            <StripeProvider>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-100">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800">Secure Payment</p>
                      <p className="text-sm text-blue-600">Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-gray-700">Mobile Broadband Plan</span>
                    <span className="text-lg font-bold text-gray-900">${paymentAmount.toFixed(2)} AUD</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    First month payment - includes data allowance and device
                  </div>
                </div>

                <StripeCardElement
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  amount={paymentAmount}
                  currency="aud"
                />

                {paymentError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-red-100">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-red-800">Payment Error</p>
                        <p className="text-sm text-red-600">{paymentError}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </StripeProvider>
          )}
        </div>
      </SectionPanel>

      <BarActions
        onBack={onBack}
        onNext={paymentSuccess ? onNext : undefined}
        disabled={!paymentSuccess}
        label={paymentSuccess ? "Continue" : "Complete Payment"}
      />
    </ModalShell>
  );
}
