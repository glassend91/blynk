"use client";

import { useEffect, useState } from "react";
import SearchCustomer from '@/components/admin/customer-plans/SearchCustomer';
import PlanCard, { CustomerPlan } from '@/components/admin/customer-plans/PlanCard';
import AddServiceModal from '@/components/admin/customer-plans/AddServiceModal';
import apiClient from '@/lib/apiClient';

type CustomerInfo = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

type CustomerPlansResponse = {
  customer: CustomerInfo | null;
  plans: CustomerPlan[];
};

type ServicePlan = {
  id: string;
  name: string;
  serviceType: string;
  price: string;
  status: string;
  billingCycle: string;
};

type Props = {
  initialQuery?: string;
};

export default function CustomerPlansTab({ initialQuery }: Props) {
  const [query, setQuery] = useState("");
  const [plans, setPlans] = useState<CustomerPlan[]>([]);
  const [allServicePlans, setAllServicePlans] = useState<ServicePlan[]>([]);
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingServicePlans, setLoadingServicePlans] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedQuery, setSearchedQuery] = useState<string | null>(null);
  const [openAddService, setOpenAddService] = useState(false);
  const [viewMode, setViewMode] = useState<"all" | "customer">("all");
  const [initializedFromQuery, setInitializedFromQuery] = useState(false);

  // Fetch all service plans on mount
  useEffect(() => {
    fetchAllServicePlans();
  }, []);

  // If an initial query is provided (from global search), run a search once on mount
  useEffect(() => {
    if (!initialQuery || initializedFromQuery) return;
    const q = initialQuery.trim();
    if (!q) return;

    setInitializedFromQuery(true);
    setQuery(q);
    void handleSearch(q);
  }, [initialQuery, initializedFromQuery]);

  const fetchAllServicePlans = async () => {
    try {
      setLoadingServicePlans(true);
      const { data } = await apiClient.get<{ success: boolean; services?: any[] }>("/services/admin/list");

      if (data?.success && data.services) {
        const formattedPlans = data.services.map((service: any, index: number) => {
          const price = Number(service.price || 0);
          const currency = service.currency || "AUD";
          const billingCycle = service.billingCycle || "monthly";

          const priceDisplay = service.price;

          return {
            id: service.serviceId || String(index + 1),
            name: service.name || "Service",
            serviceType: service.type || "NBN",
            price: priceDisplay,
            status: service.status || 'Published',
            billingCycle: billingCycle
          };
        });
        setAllServicePlans(formattedPlans);
      }
    } catch (err: any) {
      console.error("Failed to fetch service plans:", err);
    } finally {
      setLoadingServicePlans(false);
    }
  };

  const handleSearch = async (overrideQuery?: string) => {
    const value = (overrideQuery ?? query).trim();
    if (!value) {
      setPlans([]);
      setCustomer(null);
      setSearchedQuery(null);
      setError(null);
      setViewMode('all');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use global search to find customers
      const globalSearchResponse = await apiClient.get<{ success: boolean; data: any[]; count: number }>(
        `/customer-verification/global-search?query=${encodeURIComponent(value)}`
      );

      if (globalSearchResponse.data?.success && globalSearchResponse.data.data && globalSearchResponse.data.data.length > 0) {
        // Use the first matching customer
        const foundCustomer = globalSearchResponse.data.data[0];
        
        // Try to fetch plans using customer email or ID
        try {
          const plansResponse = await apiClient.get<{ success: boolean; data: CustomerPlansResponse }>(
            `/customer-plans/search?query=${encodeURIComponent(foundCustomer.email || foundCustomer.id)}`
          );

          if (plansResponse.data?.success && plansResponse.data.data) {
            setPlans(plansResponse.data.data.plans || []);
            setCustomer(plansResponse.data.data.customer || {
              id: foundCustomer.id,
              firstName: foundCustomer.firstName,
              lastName: foundCustomer.lastName,
              email: foundCustomer.email,
              phone: foundCustomer.phone,
            });
          } else {
            // Customer found but no plans
            setPlans([]);
            setCustomer({
              id: foundCustomer.id,
              firstName: foundCustomer.firstName,
              lastName: foundCustomer.lastName,
              email: foundCustomer.email,
              phone: foundCustomer.phone,
            });
          }
        } catch (planErr) {
          // If plans search fails, still show the customer
          setPlans([]);
          setCustomer({
            id: foundCustomer.id,
            firstName: foundCustomer.firstName,
            lastName: foundCustomer.lastName,
            email: foundCustomer.email,
            phone: foundCustomer.phone,
          });
        }
        
        setSearchedQuery(value);
        setViewMode("customer");
      } else {
        setPlans([]);
        setCustomer(null);
        setSearchedQuery(value);
        setViewMode("all");
      }
    } catch (err: any) {
      console.error("Failed to search:", err);
      setError(err?.message || "Failed to search customer. Please try again.");
      setPlans([]);
      setCustomer(null);
      setSearchedQuery(value);
      setViewMode("all");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceCreated = () => {
    // Refresh service plans list
    fetchAllServicePlans();
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchedQuery(null);
    setCustomer(null);
    setPlans([]);
    setError(null);
    setViewMode('all');
  };

  return (
    <div className="space-y-6">
      {/* Header + CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-semibold text-[#0A0A0A]">Customer Plan Management</h2>
          <p className="mt-1 text-[14px] text-[#6F6C90]">
            Manage customer service plans and subscriptions
          </p>
        </div>
        <button
          className="rounded-[6px] bg-[#401B60] px-[21px] py-3 text-[14px] font-semibold text-white hover:opacity-95 w-full sm:w-auto"
          onClick={() => setOpenAddService(true)}
        >
          Add New Service
        </button>
      </div>

      {/* Search card */}
      <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-4 sm:p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <h3 className="mb-4 text-[16px] sm:text-[18px] font-semibold text-black">Find Customer</h3>
        <SearchCustomer
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
        />
        {searchedQuery && customer && (
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-[13px] sm:text-[14px] text-[#6F6C90]">
              Showing plans for: <span className="font-semibold text-[#0A0A0A]">
                {customer.firstName} {customer.lastName} ({customer.email})
              </span>
            </p>
            <button
              onClick={handleClearSearch}
              className="text-[13px] sm:text-[14px] text-[#401B60] hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
          {error}
        </div>
      )}

      {/* Plans list */}
      <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-4 sm:p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[16px] sm:text-[18px] font-semibold text-black">
            {viewMode === 'customer' ? 'Customer Services' : 'All Service Plans'}
          </h3>
          {viewMode === 'customer' && (
            <button
              onClick={handleClearSearch}
              className="text-[13px] sm:text-[14px] text-[#401B60] hover:underline"
            >
              View All Plans
            </button>
          )}
        </div>

        {viewMode === 'customer' ? (
          // Customer-specific plans view
          loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-[16px] text-[#6F6C90]">Loading...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.length > 0 ? (
                plans.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-4 sm:p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]"
                  >
                    <PlanCard plan={p} />
                  </div>
                ))
              ) : (
                <div className="rounded-[12px] border border-[#E7E4EC] p-8 text-center text-[14px] text-[#6F6C90]">
                  {customer
                    ? `No active plans found for this customer.`
                    : `No customer found matching "${searchedQuery}". Please try a different search.`}
                </div>
              )}
            </div>
          )
        ) : (
          // All service plans view
          loadingServicePlans ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-[16px] text-[#6F6C90]">Loading service plans...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allServicePlans.length > 0 ? (
                allServicePlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-4 sm:p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-[18px] font-bold text-[#0A0A0A]">{plan.name}</h4>
                          <p className="text-[14px] sm:text-[16px] text-[#6F6C90] mt-1">
                            {plan.serviceType} • {plan.billingCycle}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[16px] font-semibold text-[#401B60]">{plan.price}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[11px] sm:text-[12px] font-medium ${plan.status === 'Published'
                            ? 'bg-[#C6F6D5] text-[#16A34A]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                            }`}>
                            {plan.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[12px] border border-[#E7E4EC] p-8 text-center text-[14px] text-[#6F6C90]">
                  No service plans found. Create your first service plan using the "Add New Service" button above.
                </div>
              )}
            </div>
          )
        )}
      </div>

      <AddServiceModal
        open={openAddService}
        onOpenChange={setOpenAddService}
        onSuccess={handleServiceCreated}
      />
    </div>
  );
}

