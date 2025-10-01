"use client";

import { useState } from "react";
import SectionPanel from "@/components/shared/SectionPanel";
import BarActions from "@/components/shared/BarActions";
import StripeProvider from "@/components/shared/StripeProvider";
import StripeCardElement from "@/components/shared/StripeCardElement";

export default function BusinessSmeSignup6({
  onNext, onBack,
}: { onNext: () => void; onBack: () => void }) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [invoiceRequested, setInvoiceRequested] = useState(false);

  // Example amount for business SME plan
  const paymentAmount = 99.00; // $99/month for business SME plan

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
    <SectionPanel>
      <div className="text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#4F1C76] text-white">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="6" width="14" height="12" rx="2" /><path d="M5 10h14" /></svg>
        </div>
        <h2 className="mt-4 text-[28px] font-extrabold leading-[34px] text-[#170F49]">Business Payment Details</h2>
        <p className="mt-1 text-[14px] leading-[22px] text-[#6F6C90]">Enter your business payment information</p>
      </div>

      <div className="mx-auto mt-8 max-w-[760px] rounded-[16px] border border-[#E7E4EC] bg-white p-6 shadow-[0_24px_60px_rgba(64,27,118,0.08)]">
        {paymentSuccess ? (
          <div className="text-center py-8">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600 mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Payment Successful!</h3>
            <p className="text-green-600">Your business plan payment has been processed successfully.</p>
            {invoiceRequested && (
              <p className="text-sm text-green-600 mt-2">Monthly invoices will be sent to your business email.</p>
            )}
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
                    <p className="font-semibold text-blue-800">Secure Business Payment</p>
                    <p className="text-sm text-blue-600">Your payment information is encrypted and secure</p>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-700">Business SME Plan</span>
                  <span className="text-lg font-bold text-gray-900">${paymentAmount.toFixed(2)} AUD</span>
                </div>
                <div className="text-sm text-gray-500">
                  First month payment - includes business features and priority support
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

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4"
                  checked={invoiceRequested}
                  onChange={(e) => setInvoiceRequested(e.target.checked)}
                />
                <span className="text-[14px] text-[#3B3551]">Request monthly invoices for business records</span>
              </label>
              <div className="text-[12px] text-[#9A93B3]">
                Invoices will be sent to your registered business email
              </div>
            </div>
          </StripeProvider>
        )}
      </div>

      <BarActions
        onBack={onBack}
        onNext={paymentSuccess ? onNext : undefined}
        disabled={!paymentSuccess}
        label={paymentSuccess ? "Continue" : "Complete Payment"}
      />
    </SectionPanel>
  );
}
