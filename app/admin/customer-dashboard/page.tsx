"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CustomerList from "./_local/components/CustomerList";
import CustomerProfile from "./_local/components/CustomerProfile";
import IdentityVerification from "./_local/components/IdentityVerification";
import NotesHistory from "./_local/components/NotesHistory";
import FinancialOverview from "./_local/components/FinancialOverview";
import ActiveServicesList from "./_local/components/ActiveServicesList";

type Customer = {
  id: string;
  email?: string;
  phone?: string;
};

export default function CustomerDashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const customerIdFromUrl = searchParams.get("customerId") || "";
  const queryFromUrl = searchParams.get("q") || "";
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);

  // Check if we should show detail view based on URL params
  useEffect(() => {
    if (customerIdFromUrl) {
      setShowDetailView(true);
    }
  }, [customerIdFromUrl]);

  const handleCustomerSelect = (customerId: string) => {
    const params = new URLSearchParams();
    params.set("customerId", customerId);
    router.push(`/admin/customer-dashboard?${params.toString()}`);
    setShowDetailView(true);
  };

  const handleBackToList = () => {
    router.push("/admin/customer-dashboard");
    setShowDetailView(false);
    setSelectedCustomer(null);
  };

  // Show customer list if no customer is selected
  if (!showDetailView && !customerIdFromUrl) {
    return <CustomerList onCustomerSelect={handleCustomerSelect} />;
  }

  // Show 2-column detail view when a customer is selected
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={handleBackToList}
        className="flex items-center gap-2 text-[14px] text-[#6F6C90] hover:text-[#0A0A0A] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to Customer List
      </button>

      {/* Page Title */}
      <div>
        <h1 className="text-[26px] font-bold text-[#0A0A0A]">Customer Dashboard</h1>
        <p className="mt-1 text-[14px] text-[#6F6C90]">
          Primary command center for all customer interactions, verification, notes, and service plans
        </p>
      </div>

      {/* 2-Column Card Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Identity, Verification & Notes */}
        <div className="space-y-6">
          <CustomerProfile
            customerId={customerIdFromUrl || selectedCustomer?.id}
            searchQuery={customerIdFromUrl ? undefined : queryFromUrl}
            onCustomerLoaded={(customer) => {
              if (customer) {
                setSelectedCustomer({
                  id: customer.id,
                  email: customer.email,
                  phone: customer.phone,
                });
              }
            }}
          />
          <IdentityVerification
            customerId={customerIdFromUrl || selectedCustomer?.id}
            customerEmail={selectedCustomer?.email}
            customerPhone={selectedCustomer?.phone}
            onCustomerDataLoaded={(email, phone) => {
              if (!selectedCustomer) {
                setSelectedCustomer({
                  id: customerIdFromUrl || "",
                  email,
                  phone,
                });
              }
            }}
          />
          <NotesHistory customerId={customerIdFromUrl || selectedCustomer?.id} />
        </div>

        {/* Right Column: Services & Financials */}
        <div className="space-y-6">
          <FinancialOverview
            customerId={customerIdFromUrl || selectedCustomer?.id}
            onCreditRefundApplied={() => {
              // Refresh notes if needed
            }}
          />
          <ActiveServicesList
            customerId={customerIdFromUrl || selectedCustomer?.id}
            onServiceCancelled={() => {
              // Refresh if needed
            }}
          />
        </div>
      </div>
    </div>
  );
}
