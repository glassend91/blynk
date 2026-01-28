"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import ModalShell from "@/components/shared/ModalShell";
import SectionPanel from "@/components/shared/SectionPanel";
import FormField from "@/components/shared/FormField";
import { getAuthUser } from "@/lib/auth";

type Customer = {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
};

// NBN Service Modal
export function NBNServiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const customerIdFromUrl = searchParams.get("customerId");

    const [step, setStep] = useState(1);
    const [customerId, setCustomerId] = useState(customerIdFromUrl || "");
    const [serviceAddress, setServiceAddress] = useState("");
    const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number; serviceType: string } | null>(null);
    const [staticIP, setStaticIP] = useState(false);
    const [useCardOnFile, setUseCardOnFile] = useState(true);
    const [termsVerified, setTermsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [availableServices, setAvailableServices] = useState<Array<{ id: string; name: string; serviceType: string; originalPrice: number }>>([]);
    const [loadingServices, setLoadingServices] = useState(false);

    useEffect(() => {
        if (customerIdFromUrl) {
            setCustomerId(customerIdFromUrl);
            setStep(2); // Skip customer selection if already on customer dashboard
        }
        fetchCustomers();
        fetchAvailableServices();
    }, [customerIdFromUrl]);

    const fetchCustomers = async () => {
        try {
            const { data } = await apiClient.get<{ success: boolean; users?: Customer[]; data?: Customer[] }>(
                "/auth/users?role=customer"
            );
            if (data?.success) {
                setCustomers(data.users || data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch customers:", err);
        }
    };

    const fetchAvailableServices = async (): Promise<Array<{ id: string; name: string; serviceType: string; originalPrice: number }>> => {
        try {
            setLoadingServices(true);
            const { data } = await apiClient.get<{ success: boolean; data?: Array<{ id: string; name: string; serviceType: string; originalPrice: number }> }>(
                "/customer-plans/services"
            );
            if (data?.success && data.data) {
                const nbnServices = data.data.filter(s => s.serviceType === "NBN");
                setAvailableServices(nbnServices);
                console.log("Fetched NBN services:", nbnServices);
                return nbnServices;
            } else {
                console.warn("No services data returned from API");
                return [];
            }
        } catch (err) {
            console.error("Failed to fetch available services:", err);
            setError("Failed to load available services. Please try again.");
            return [];
        } finally {
            setLoadingServices(false);
        }
    };

    const filteredCustomers = customers.filter(
        (c) =>
            !searchQuery ||
            c.firstName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            c.lastName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            c.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );

    const handleSubmit = async () => {
        // Validate customerId - ensure it's the actual userId, not just "1"
        const actualCustomerId = customerId && customerId !== "1"
            ? customerId
            : customers.find(c => (c.id || c.userId) === customerId)?.userId || customerId;

        if (!actualCustomerId || actualCustomerId === "1") {
            setError("Please select a valid customer");
            return;
        }

        if (!serviceAddress || !selectedPlan || !termsVerified) {
            setError("Please complete all required fields and verify terms");
            return;
        }

        // Use the serviceId directly from selectedPlan (which now includes the id)
        if (!selectedPlan?.id) {
            setError("Service ID is missing. Please select a plan again.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Create service order
            await apiClient.post("/customer-plans/add-service", {
                customerId: actualCustomerId,
                serviceId: selectedPlan.id,
                assignedAddress: serviceAddress,
                assignedNumber: undefined, // NBN doesn't need number
            });

            // Log to notes
            const authUser = getAuthUser<{ firstName?: string; lastName?: string; email?: string }>();
            const staffName = authUser
                ? [authUser.firstName, authUser.lastName].filter(Boolean).join(" ") || authUser.email || "Staff Member"
                : "Staff Member";

            await apiClient.post("/customer-verification/notes", {
                customerId: actualCustomerId,
                noteType: "Service",
                priority: "Normal",
                content: `NBN service added: ${selectedPlan.name} at ${serviceAddress}. Static IP: ${staticIP ? "Yes" : "No"}. Added by ${staffName}.`,
                tags: ["service", "nbn", "plan-added"],
            });

            onClose();
            // Refresh customer dashboard if on customer page
            if (customerIdFromUrl) {
                router.refresh();
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to add service");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <ModalShell onClose={onClose} size="wide">
            <SectionPanel>
                <div className="mx-auto max-w-[760px]">
                    <h2 className="text-[24px] font-bold text-[#0A0A0A] mb-6">Add NBN Service</h2>

                    {error && (
                        <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Customer Selection (skip if customerIdFromUrl exists) */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <FormField label="Select Customer">
                                <input
                                    type="text"
                                    placeholder="Search customers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none"
                                />
                            </FormField>
                            <div className="max-h-[400px] overflow-y-auto space-y-2">
                                {filteredCustomers.map((customer) => (
                                    <button
                                        key={customer.id || customer.userId}
                                        onClick={() => {
                                            // Always use userId if available, otherwise use id
                                            const customerIdToUse = customer.userId || customer.id;
                                            setCustomerId(customerIdToUse);
                                            setStep(2);
                                        }}
                                        className="w-full text-left p-4 rounded-[10px] border border-[#DFDBE3] hover:border-[#401B60] hover:bg-[#F8F8F8] transition-all"
                                    >
                                        <div className="font-semibold text-[#0A0A0A]">
                                            {customer.firstName} {customer.lastName}
                                        </div>
                                        <div className="text-[13px] text-[#6F6C90]">{customer.email}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Address Check */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <FormField label="Service Address *">
                                <input
                                    type="text"
                                    value={serviceAddress}
                                    onChange={(e) => setServiceAddress(e.target.value)}
                                    placeholder="Enter service address"
                                    className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none"
                                />
                            </FormField>
                            <div className="flex items-center justify-between gap-3 mt-6">
                                {!customerIdFromUrl && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                    >
                                        ← Back
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (serviceAddress) {
                                            // TODO: Call OneView API for serviceability check
                                            // Fetch services from database when moving to plan selection step
                                            await fetchAvailableServices();
                                            setStep(3);
                                        } else {
                                            setError("Please enter a service address");
                                        }
                                    }}
                                    className={`rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 ${!customerIdFromUrl ? "ml-auto" : "w-full"}`}
                                >
                                    Check Availability →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Plan Selection */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <FormField label="Select Plan *">
                                {loadingServices ? (
                                    <div className="text-center py-8 text-[#6F6C90]">
                                        <svg className="animate-spin h-6 w-6 mx-auto mb-2 text-[#401B60]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading plans...
                                    </div>
                                ) : availableServices.length === 0 ? (
                                    <div className="text-center py-8 text-[#6F6C90]">
                                        No NBN plans available. Please contact support.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {availableServices.map((service) => (
                                            <button
                                                key={service.id}
                                                type="button"
                                                onClick={() => setSelectedPlan({
                                                    id: service.id,
                                                    name: service.name,
                                                    price: service.originalPrice,
                                                    serviceType: service.serviceType
                                                })}
                                                className={`w-full text-left p-4 rounded-[10px] border-2 transition-all ${selectedPlan?.id === service.id
                                                    ? "border-[#401B60] bg-[#F8F8F8]"
                                                    : "border-[#DFDBE3] hover:border-[#401B60]"
                                                    }`}
                                            >
                                                <div className="font-semibold text-[#0A0A0A]">{service.name}</div>
                                                <div className="text-[14px] text-[#6F6C90]">${service.originalPrice}/month</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </FormField>
                            <div className="flex items-center justify-between gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedPlan) {
                                            setStep(4);
                                        } else {
                                            setError("Please select a plan");
                                        }
                                    }}
                                    disabled={!selectedPlan}
                                    className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed ml-auto"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Static IP */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <FormField label="Static IP">
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="staticIP"
                                            checked={!staticIP}
                                            onChange={() => setStaticIP(false)}
                                            className="h-4 w-4 accent-[#401B60]"
                                        />
                                        <span className="text-[14px] text-[#0A0A0A]">No</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="staticIP"
                                            checked={staticIP}
                                            onChange={() => setStaticIP(true)}
                                            className="h-4 w-4 accent-[#401B60]"
                                        />
                                        <span className="text-[14px] text-[#0A0A0A]">Yes</span>
                                    </label>
                                </div>
                            </FormField>
                            <div className="flex items-center justify-between gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(5)}
                                    className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 ml-auto"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Payment & Agreements */}
                    {step === 5 && (
                        <div className="space-y-4">
                            <FormField label="Payment Method">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={useCardOnFile}
                                        onChange={() => setUseCardOnFile(true)}
                                        className="h-4 w-4 accent-[#401B60]"
                                    />
                                    <span className="text-[14px] text-[#0A0A0A]">Use card on file</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={!useCardOnFile}
                                        onChange={() => setUseCardOnFile(false)}
                                        className="h-4 w-4 accent-[#401B60]"
                                    />
                                    <span className="text-[14px] text-[#0A0A0A]">Add new payment method</span>
                                </label>
                            </FormField>

                            <div className="rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={termsVerified}
                                        onChange={(e) => setTermsVerified(e.target.checked)}
                                        className="mt-1 h-4 w-4 accent-[#401B60] flex-shrink-0"
                                    />
                                    <span className="text-[14px] text-[#0A0A0A]">
                                        <span className="font-semibold text-red-600">*</span> Have you verified the plan details and price with the customer and directed them to our terms of service and terms of conditions?
                                    </span>
                                </label>
                            </div>

                            <div className="flex items-center justify-between gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(4)}
                                    className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading || !termsVerified}
                                    className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed ml-auto"
                                >
                                    {loading ? "Processing..." : "Complete"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </SectionPanel>
        </ModalShell>
    );
}

// Business NBN Service Modal
export function BusinessNBNServiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const customerIdFromUrl = searchParams.get("customerId");

    const [step, setStep] = useState(1);
    const [customerId, setCustomerId] = useState(customerIdFromUrl || "");
    const [serviceAddress, setServiceAddress] = useState("");
    const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number; serviceType: string } | null>(null);
    const [staticIP, setStaticIP] = useState(false);
    const [useCardOnFile, setUseCardOnFile] = useState(true);
    const [termsVerified, setTermsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [availableServices, setAvailableServices] = useState<Array<{ id: string; name: string; serviceType: string; originalPrice: number }>>([]);
    const [loadingServices, setLoadingServices] = useState(false);

    useEffect(() => {
        if (customerIdFromUrl) {
            setCustomerId(customerIdFromUrl);
            setStep(2); // Skip customer selection if already on customer dashboard
        }
        fetchCustomers();
        fetchAvailableServices();
    }, [customerIdFromUrl]);

    const fetchCustomers = async () => {
        try {
            const { data } = await apiClient.get<{ success: boolean; users?: Customer[]; data?: Customer[] }>(
                "/auth/users?role=customer"
            );
            if (data?.success) {
                setCustomers(data.users || data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch customers:", err);
        }
    };

    const fetchAvailableServices = async (): Promise<Array<{ id: string; name: string; serviceType: string; originalPrice: number }>> => {
        try {
            setLoadingServices(true);
            const { data } = await apiClient.get<{ success: boolean; data?: Array<{ id: string; name: string; serviceType: string; originalPrice: number }> }>(
                "/customer-plans/services"
            );
            if (data?.success && data.data) {
                const businessNbnServices = data.data.filter(s => s.serviceType === "Business NBN");
                setAvailableServices(businessNbnServices);
                console.log("Fetched Business NBN services:", businessNbnServices);
                return businessNbnServices;
            } else {
                console.warn("No services data returned from API");
                return [];
            }
        } catch (err) {
            console.error("Failed to fetch available services:", err);
            setError("Failed to load available services. Please try again.");
            return [];
        } finally {
            setLoadingServices(false);
        }
    };

    const filteredCustomers = customers.filter(
        (c) =>
            !searchQuery ||
            c.firstName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            c.lastName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            c.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );

    const handleSubmit = async () => {
        // Validate customerId - ensure it's the actual userId, not just "1"
        const actualCustomerId = customerId && customerId !== "1"
            ? customerId
            : customers.find(c => (c.id || c.userId) === customerId)?.userId || customerId;

        if (!actualCustomerId || actualCustomerId === "1") {
            setError("Please select a valid customer");
            return;
        }

        if (!serviceAddress || !selectedPlan || !termsVerified) {
            setError("Please complete all required fields and verify terms");
            return;
        }

        // Use the serviceId directly from selectedPlan (which now includes the id)
        if (!selectedPlan?.id) {
            setError("Service ID is missing. Please select a plan again.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Create service order
            await apiClient.post("/customer-plans/add-service", {
                customerId: actualCustomerId,
                serviceId: selectedPlan.id,
                assignedAddress: serviceAddress,
                assignedNumber: undefined, // Business NBN doesn't need number
            });

            // Log to notes
            const authUser = getAuthUser<{ firstName?: string; lastName?: string; email?: string }>();
            const staffName = authUser
                ? [authUser.firstName, authUser.lastName].filter(Boolean).join(" ") || authUser.email || "Staff Member"
                : "Staff Member";

            await apiClient.post("/customer-verification/notes", {
                customerId: actualCustomerId,
                noteType: "Service",
                priority: "Normal",
                content: `Business NBN service added: ${selectedPlan.name} at ${serviceAddress}. Static IP: ${staticIP ? "Yes" : "No"}. Added by ${staffName}.`,
                tags: ["service", "business-nbn", "plan-added"],
            });

            onClose();
            // Refresh customer dashboard if on customer page
            if (customerIdFromUrl) {
                router.refresh();
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to add service");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <ModalShell onClose={onClose} size="wide">
            <SectionPanel>
                <div className="mx-auto max-w-[760px]">
                    <h2 className="text-[24px] font-bold text-[#0A0A0A] mb-6">Add Business NBN Service</h2>

                    {error && (
                        <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Customer Selection (skip if customerIdFromUrl exists) */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <FormField label="Select Customer">
                                <input
                                    type="text"
                                    placeholder="Search customers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none"
                                />
                            </FormField>
                            <div className="max-h-[400px] overflow-y-auto space-y-2">
                                {filteredCustomers.map((customer) => (
                                    <button
                                        key={customer.id || customer.userId}
                                        onClick={() => {
                                            // Always use userId if available, otherwise use id
                                            const customerIdToUse = customer.userId || customer.id;
                                            setCustomerId(customerIdToUse);
                                            setStep(2);
                                        }}
                                        className="w-full text-left p-4 rounded-[10px] border border-[#DFDBE3] hover:border-[#401B60] hover:bg-[#F8F8F8] transition-all"
                                    >
                                        <div className="font-semibold text-[#0A0A0A]">
                                            {customer.firstName} {customer.lastName}
                                        </div>
                                        <div className="text-[13px] text-[#6F6C90]">{customer.email}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Address Check */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <FormField label="Service Address *">
                                <input
                                    type="text"
                                    value={serviceAddress}
                                    onChange={(e) => setServiceAddress(e.target.value)}
                                    placeholder="Enter service address"
                                    className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none"
                                />
                            </FormField>
                            <div className="flex items-center justify-between gap-3 mt-6">
                                {!customerIdFromUrl && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                    >
                                        ← Back
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (serviceAddress) {
                                            // TODO: Call OneView API for serviceability check
                                            // Fetch services from database when moving to plan selection step
                                            await fetchAvailableServices();
                                            setStep(3);
                                        } else {
                                            setError("Please enter a service address");
                                        }
                                    }}
                                    className={`rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 ${!customerIdFromUrl ? "ml-auto" : "w-full"}`}
                                >
                                    Check Availability →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Plan Selection */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <FormField label="Select Plan *">
                                {loadingServices ? (
                                    <div className="text-center py-8 text-[#6F6C90]">
                                        <svg className="animate-spin h-6 w-6 mx-auto mb-2 text-[#401B60]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading plans...
                                    </div>
                                ) : availableServices.length === 0 ? (
                                    <div className="text-center py-8 text-[#6F6C90]">
                                        No Business NBN plans available. Please contact support.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {availableServices.map((service) => (
                                            <button
                                                key={service.id}
                                                type="button"
                                                onClick={() => setSelectedPlan({
                                                    id: service.id,
                                                    name: service.name,
                                                    price: service.originalPrice,
                                                    serviceType: service.serviceType
                                                })}
                                                className={`w-full text-left p-4 rounded-[10px] border-2 transition-all ${selectedPlan?.id === service.id
                                                    ? "border-[#401B60] bg-[#F8F8F8]"
                                                    : "border-[#DFDBE3] hover:border-[#401B60]"
                                                    }`}
                                            >
                                                <div className="font-semibold text-[#0A0A0A]">{service.name}</div>
                                                <div className="text-[14px] text-[#6F6C90]">${service.originalPrice}/month</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </FormField>
                            <div className="flex items-center justify-between gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedPlan) {
                                            setStep(4);
                                        } else {
                                            setError("Please select a plan");
                                        }
                                    }}
                                    disabled={!selectedPlan}
                                    className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed ml-auto"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Static IP */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <FormField label="Static IP">
                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="staticIP"
                                            checked={!staticIP}
                                            onChange={() => setStaticIP(false)}
                                            className="h-4 w-4 accent-[#401B60]"
                                        />
                                        <span className="text-[14px] text-[#0A0A0A]">No</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="staticIP"
                                            checked={staticIP}
                                            onChange={() => setStaticIP(true)}
                                            className="h-4 w-4 accent-[#401B60]"
                                        />
                                        <span className="text-[14px] text-[#0A0A0A]">Yes</span>
                                    </label>
                                </div>
                            </FormField>
                            <div className="flex items-center justify-between gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(5)}
                                    className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 ml-auto"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Payment & Agreements */}
                    {step === 5 && (
                        <div className="space-y-4">
                            <FormField label="Payment Method">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={useCardOnFile}
                                        onChange={() => setUseCardOnFile(true)}
                                        className="h-4 w-4 accent-[#401B60]"
                                    />
                                    <span className="text-[14px] text-[#0A0A0A]">Use card on file</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={!useCardOnFile}
                                        onChange={() => setUseCardOnFile(false)}
                                        className="h-4 w-4 accent-[#401B60]"
                                    />
                                    <span className="text-[14px] text-[#0A0A0A]">Add new payment method</span>
                                </label>
                            </FormField>

                            <div className="rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={termsVerified}
                                        onChange={(e) => setTermsVerified(e.target.checked)}
                                        className="mt-1 h-4 w-4 accent-[#401B60] flex-shrink-0"
                                    />
                                    <span className="text-[14px] text-[#0A0A0A]">
                                        <span className="font-semibold text-red-600">*</span> Have you verified the plan details and price with the customer and directed them to our terms of service and terms of conditions?
                                    </span>
                                </label>
                            </div>

                            <div className="flex items-center justify-between gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(4)}
                                    className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading || !termsVerified}
                                    className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed ml-auto"
                                >
                                    {loading ? "Processing..." : "Complete"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </SectionPanel>
        </ModalShell>
    );
}

// Mobile Voice Service Modal
export function MobileVoiceServiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const customerIdFromUrl = searchParams.get("customerId");

    const [step, setStep] = useState(1);
    const [customerId, setCustomerId] = useState(customerIdFromUrl || "");
    const [simType, setSimType] = useState<"eSim" | "physical">("eSim");
    const [simNumber, setSimNumber] = useState<string>(""); // ICCID for physical SIM
    const [esimNotificationEmail, setEsimNotificationEmail] = useState<string>(""); // Email for eSIM notifications
    const [numberChoice, setNumberChoice] = useState<"new" | "port">("new");
    const [selectedNumber, setSelectedNumber] = useState("");
    const [portingNumber, setPortingNumber] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [useCardOnFile, setUseCardOnFile] = useState(true);
    const [termsVerified, setTermsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [availableNumbers, setAvailableNumbers] = useState<string[]>([]);
    const [otpSent, setOtpSent] = useState(false);
    const [showNumbersList, setShowNumbersList] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");
    const [availableServices, setAvailableServices] = useState<Array<{ id: string; name: string; serviceType: string; originalPrice: number }>>([]);
    const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number; serviceType: string } | null>(null);
    const [loadingServices, setLoadingServices] = useState(false);

    useEffect(() => {
        if (customerIdFromUrl) {
            setCustomerId(customerIdFromUrl);
            setStep(2); // Start at plan selection if customerId is provided
            fetchAvailableServices();
        }
        fetchCustomers();
    }, [customerIdFromUrl]);

    const fetchCustomers = async () => {
        try {
            const { data } = await apiClient.get<{ success: boolean; users?: Customer[]; data?: Customer[] }>(
                "/auth/users?role=customer"
            );
            if (data?.success) {
                setCustomers(data.users || data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch customers:", err);
        }
    };

    const fetchAvailableServices = async (): Promise<Array<{ id: string; name: string; serviceType: string; originalPrice: number }>> => {
        try {
            setLoadingServices(true);
            const { data } = await apiClient.get<{ success: boolean; data?: Array<{ id: string; name: string; serviceType: string; originalPrice: number }> }>(
                "/customer-plans/services"
            );
            if (data?.success && data.data) {
                const mobileVoiceServices = data.data.filter(s =>
                    s.serviceType === "Mobile Voice" ||
                    s.serviceType === "Mobile" ||
                    s.name?.toLowerCase().includes("mobile voice") ||
                    s.name?.toLowerCase().includes("voice")
                );
                setAvailableServices(mobileVoiceServices);
                console.log("Fetched Mobile Voice services:", mobileVoiceServices);
                return mobileVoiceServices;
            } else {
                console.warn("No services data returned from API");
                return [];
            }
        } catch (err) {
            console.error("Failed to fetch available services:", err);
            setError("Failed to load available services. Please try again.");
            return [];
        } finally {
            setLoadingServices(false);
        }
    };

    const fetchAvailableNumbers = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching available numbers from /api/v1/mobile/reserve/numbers");
            // Use the correct endpoint
            const response = await apiClient.get<{ success: boolean; numbers?: string[]; data?: string[] }>(
                "/api/v1/mobile/reserve/numbers"
            );

            console.log("Available numbers response:", response.data);

            if (response.data?.success) {
                const numbers = response.data.numbers || response.data.data || [];
                console.log("Setting available numbers:", numbers);
                setAvailableNumbers(numbers);
                setShowNumbersList(true); // Show the list after fetching
                if (numbers.length === 0) {
                    setError("No available numbers found. Please try again later.");
                }
            } else {
                setError("Failed to fetch available numbers");
            }
        } catch (err: any) {
            console.error("Failed to fetch available numbers:", err);
            const errorMessage = err?.response?.data?.message || "Failed to fetch available numbers. Please try again.";
            setError(errorMessage);
            // Set some mock numbers for development/testing if API fails
            console.log("Setting fallback mock numbers");
            const mockNumbers = [
                "0412345678",
                "0412345679",
                "0412345680",
                "0412345681",
                "0412345682",
            ];
            setAvailableNumbers(mockNumbers);
            setShowNumbersList(true); // Show the list even with mock numbers
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        if (!portingNumber) {
            setError("Please enter the number to port");
            return;
        }
        try {
            await apiClient.post("/mobile/port-otp", { number: portingNumber });
            setOtpSent(true);
            setError(null);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to send OTP");
        }
    };

    const handleSubmit = async () => {
        // Validate customerId - ensure it's the actual userId, not just "1"
        const actualCustomerId = customerId && customerId !== "1"
            ? customerId
            : customers.find(c => (c.id || c.userId) === customerId)?.userId || customerId;

        if (!actualCustomerId || actualCustomerId === "1") {
            setError("Please select a valid customer");
            return;
        }

        if (!selectedPlan?.id) {
            setError("Please select a plan");
            return;
        }

        if (!termsVerified) {
            setError("Please verify the terms and conditions");
            return;
        }

        if (numberChoice === "new" && !selectedNumber) {
            setError("Please select a number");
            return;
        }

        if (numberChoice === "port" && (!portingNumber || !otpCode)) {
            setError("Please complete porting verification");
            return;
        }

        // Validate conditional SIM fields
        if (simType === "physical" && !simNumber?.trim()) {
            setError("SIM Card Number (ICCID) is required for physical SIM");
            return;
        }

        if (simType === "eSim") {
            // Get customer email to default esimNotificationEmail if not provided
            const customer = customers.find(c => (c.id || c.userId) === actualCustomerId);
            const defaultEmail = customer?.email || "";
            const finalEsimEmail = esimNotificationEmail?.trim() || defaultEmail;
            
            if (!finalEsimEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEsimEmail)) {
                setError("eSIM Notification Email is required and must be a valid email address");
                return;
            }
        }

        try {
            setLoading(true);
            setError(null);

            // Get customer email for eSIM notification email default
            const customer = customers.find(c => (c.id || c.userId) === actualCustomerId);
            const defaultEmail = customer?.email || "";
            const finalEsimEmail = simType === "eSim" ? (esimNotificationEmail?.trim() || defaultEmail) : undefined;

            await apiClient.post("/customer-plans/add-service", {
                customerId: actualCustomerId,
                serviceId: selectedPlan.id,
                assignedNumber: numberChoice === "new" ? selectedNumber : portingNumber,
                assignedAddress: undefined, // Mobile Voice doesn't need address
                simType: simType,
                simNumber: simType === "physical" ? simNumber?.trim() : undefined, // Only include if physical SIM
                esimNotificationEmail: finalEsimEmail, // Include if eSIM
            });

            const authUser = getAuthUser<{ firstName?: string; lastName?: string; email?: string }>();
            const staffName = authUser
                ? [authUser.firstName, authUser.lastName].filter(Boolean).join(" ") || authUser.email || "Staff Member"
                : "Staff Member";

            await apiClient.post("/customer-verification/notes", {
                customerId: actualCustomerId,
                noteType: "Service",
                priority: "Normal",
                content: `Mobile Voice service added. SIM Type: ${simType}. Number: ${numberChoice === "new" ? selectedNumber : `Porting ${portingNumber}`}. Added by ${staffName}.`,
                tags: ["service", "mobile-voice", "plan-added"],
            });

            onClose();
            if (customerIdFromUrl) {
                router.refresh();
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to add service");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <ModalShell onClose={onClose} size="wide">
            <SectionPanel>
                <div className="mx-auto max-w-[760px]">
                    <h2 className="text-[24px] font-bold text-[#0A0A0A] mb-6">Add Mobile Voice Service</h2>

                    {error && (
                        <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Customer Selection */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <FormField label="Select Customer">
                                <input
                                    type="text"
                                    placeholder="Search customers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none"
                                />
                            </FormField>
                            <div className="max-h-[400px] overflow-y-auto space-y-2">
                                {customers
                                    .filter(
                                        (c) =>
                                            !searchQuery ||
                                            c.firstName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                                            c.lastName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                                            c.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
                                    )
                                    .map((customer) => (
                                        <button
                                            key={customer.id || customer.userId}
                                            onClick={async () => {
                                                // Always use userId if available, otherwise use id
                                                const customerIdToUse = customer.userId || customer.id;
                                                setCustomerId(customerIdToUse);
                                                // Fetch services when moving to plan selection step
                                                await fetchAvailableServices();
                                                setStep(2);
                                            }}
                                            className="w-full text-left p-4 rounded-[10px] border border-[#DFDBE3] hover:border-[#401B60] hover:bg-[#F8F8F8] transition-all"
                                        >
                                            <div className="font-semibold text-[#0A0A0A]">
                                                {customer.firstName} {customer.lastName}
                                            </div>
                                            <div className="text-[13px] text-[#6F6C90]">{customer.email}</div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Plan Selection */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <FormField label="Select Plan *">
                                {loadingServices ? (
                                    <div className="text-center py-8 text-[#6F6C90]">
                                        <svg className="animate-spin h-6 w-6 mx-auto mb-2 text-[#401B60]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading plans...
                                    </div>
                                ) : availableServices.length === 0 ? (
                                    <div className="text-center py-8 text-[#6F6C90]">
                                        No Mobile Voice plans available. Please contact support.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {availableServices.map((service) => (
                                            <button
                                                key={service.id}
                                                type="button"
                                                onClick={() => setSelectedPlan({
                                                    id: service.id,
                                                    name: service.name,
                                                    price: service.originalPrice,
                                                    serviceType: service.serviceType
                                                })}
                                                className={`w-full text-left p-4 rounded-[10px] border-2 transition-all ${selectedPlan?.id === service.id
                                                    ? "border-[#401B60] bg-[#F8F8F8]"
                                                    : "border-[#DFDBE3] hover:border-[#401B60]"
                                                    }`}
                                            >
                                                <div className="font-semibold text-[#0A0A0A]">{service.name}</div>
                                                <div className="text-[14px] text-[#6F6C90]">${service.originalPrice}/month</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </FormField>
                            <div className="flex items-center justify-between gap-3 mt-6">
                                {!customerIdFromUrl && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                    >
                                        ← Back
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedPlan) {
                                            setStep(3);
                                        } else {
                                            setError("Please select a plan");
                                        }
                                    }}
                                    disabled={!selectedPlan}
                                    className={`rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed ${!customerIdFromUrl ? "ml-auto" : "w-full"}`}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: SIM Type */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <FormField label="SIM Type *">
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="simType"
                                            value="eSim"
                                            checked={simType === "eSim"}
                                            onChange={() => {
                                                setSimType("eSim");
                                                setSimNumber(""); // Clear ICCID when switching to eSIM
                                            }}
                                            className="h-4 w-4 accent-[#401B60]"
                                        />
                                        <span className="text-[14px] text-[#0A0A0A]">eSIM</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="simType"
                                            value="physical"
                                            checked={simType === "physical"}
                                            onChange={() => {
                                                setSimType("physical");
                                                setEsimNotificationEmail(""); // Clear eSIM email when switching to physical
                                            }}
                                            className="h-4 w-4 accent-[#401B60]"
                                        />
                                        <span className="text-[14px] text-[#0A0A0A]">Physical SIM</span>
                                    </label>
                                </div>
                            </FormField>

                            {/* Conditional SIM Fields */}
                            {simType === "physical" && (
                                <FormField label="SIM Card Number (ICCID) *">
                                    <input
                                        type="text"
                                        value={simNumber}
                                        onChange={(e) => setSimNumber(e.target.value)}
                                        className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
                                        placeholder="Enter SIM Card Number (ICCID)"
                                    />
                                    <p className="mt-1 text-xs text-[#6F6C90]">
                                        The ICCID is printed on the physical SIM card. This is required for physical SIM provisioning.
                                    </p>
                                </FormField>
                            )}

                            {simType === "eSim" && (
                                <FormField label="eSIM Notification Email *">
                                    <input
                                        type="email"
                                        value={esimNotificationEmail}
                                        onChange={(e) => setEsimNotificationEmail(e.target.value)}
                                        className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
                                        placeholder={(() => {
                                            const customer = customers.find(c => (c.id || c.userId) === customerId);
                                            return customer?.email || "Enter email for eSIM notifications";
                                        })()}
                                    />
                                    <p className="mt-1 text-xs text-[#6F6C90]">
                                        This email will receive the eSIM activation QR code and instructions. Defaults to customer's account email but can be changed.
                                    </p>
                                </FormField>
                            )}

                            <div className="flex items-center justify-between gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Validate SIM fields before proceeding
                                        if (simType === "physical" && !simNumber?.trim()) {
                                            setError("SIM Card Number (ICCID) is required for physical SIM");
                                            return;
                                        }
                                        if (simType === "eSim") {
                                            const customer = customers.find(c => (c.id || c.userId) === customerId);
                                            const defaultEmail = customer?.email || "";
                                            const finalEsimEmail = esimNotificationEmail?.trim() || defaultEmail;
                                            if (!finalEsimEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEsimEmail)) {
                                                setError("eSIM Notification Email is required and must be a valid email address");
                                                return;
                                            }
                                        }
                                        setError(null);
                                        setStep(4);
                                    }}
                                    className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 ml-auto"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Number Choice */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <FormField label="Number Choice *">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="numberChoice"
                                            value="new"
                                            checked={numberChoice === "new"}
                                            onChange={() => {
                                                setNumberChoice("new");
                                                setPortingNumber("");
                                                setOtpCode("");
                                                setOtpSent(false);
                                            }}
                                            className="h-4 w-4 accent-[#401B60]"
                                        />
                                        <span className="text-[14px] text-[#0A0A0A]">New Number</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="numberChoice"
                                            value="port"
                                            checked={numberChoice === "port"}
                                            onChange={() => {
                                                setNumberChoice("port");
                                                setSelectedNumber("");
                                            }}
                                            className="h-4 w-4 accent-[#401B60]"
                                        />
                                        <span className="text-[14px] text-[#0A0A0A]">Port Existing Number</span>
                                    </label>
                                </div>
                            </FormField>

                            {numberChoice === "new" && (
                                <FormField label="Select Number *">
                                    <div className="space-y-2">
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                console.log("Button clicked, availableNumbers.length:", availableNumbers.length);
                                                if (availableNumbers.length === 0 || !showNumbersList) {
                                                    await fetchAvailableNumbers();
                                                } else {
                                                    // Toggle visibility if numbers are already loaded
                                                    setShowNumbersList(!showNumbersList);
                                                }
                                            }}
                                            disabled={loading}
                                            className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] text-left hover:border-[#401B60] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-between"
                                        >
                                            <span>{selectedNumber || "Click to select from available numbers"}</span>
                                            {loading ? (
                                                <svg className="animate-spin h-4 w-4 text-[#401B60]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : showNumbersList ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#401B60]">
                                                    <path d="M18 15l-6-6-6 6" />
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#401B60]">
                                                    <path d="M6 9l6 6 6-6" />
                                                </svg>
                                            )}
                                        </button>
                                        {showNumbersList && availableNumbers.length > 0 && (
                                            <div className="mt-2 max-h-[200px] overflow-y-auto space-y-1 border border-[#DFDBE3] rounded-[10px] p-2 bg-white">
                                                <div className="text-[12px] font-semibold text-[#6F6C90] mb-2 px-2">Available Numbers ({availableNumbers.length}):</div>
                                                {availableNumbers.map((num) => (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedNumber(num);
                                                            setError(null);
                                                            setShowNumbersList(false); // Hide list after selection
                                                        }}
                                                        className={`w-full text-left p-2 rounded-[6px] text-[13px] transition-colors ${selectedNumber === num
                                                            ? "bg-[#401B60] text-white"
                                                            : "bg-[#F8F8F8] hover:bg-[#DFDBE3]"
                                                            }`}
                                                    >
                                                        {num}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {!loading && availableNumbers.length === 0 && selectedNumber === "" && (
                                            <div className="text-[13px] text-[#6F6C90] mt-2">
                                                Click the button above to load available numbers
                                            </div>
                                        )}
                                        {selectedNumber && (
                                            <div className="text-[13px] text-green-600 font-medium">
                                                ✓ Selected: {selectedNumber}
                                            </div>
                                        )}
                                    </div>
                                </FormField>
                            )}

                            {numberChoice === "port" && (
                                <div className="space-y-3">
                                    <FormField label="Number to Port *">
                                        <input
                                            type="text"
                                            value={portingNumber}
                                            onChange={(e) => setPortingNumber(e.target.value)}
                                            placeholder="Enter phone number"
                                            className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none"
                                        />
                                    </FormField>
                                    {!otpSent ? (
                                        <button
                                            onClick={handleSendOTP}
                                            className="w-full rounded-[10px] bg-[#401B60] px-4 py-3 text-[14px] font-semibold text-white hover:opacity-95"
                                        >
                                            Send OTP
                                        </button>
                                    ) : (
                                        <>
                                            <FormField label="Enter OTP Code *">
                                                <input
                                                    type="text"
                                                    value={otpCode}
                                                    onChange={(e) => setOtpCode(e.target.value)}
                                                    placeholder="Enter 6-digit code"
                                                    maxLength={6}
                                                    className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none"
                                                />
                                            </FormField>
                                            <button
                                                onClick={async () => {
                                                    if (!otpCode || otpCode.length !== 6) {
                                                        setError("Please enter a 6-digit OTP code");
                                                        return;
                                                    }
                                                    try {
                                                        setLoading(true);
                                                        setError(null);
                                                        await apiClient.post("/mobile/verify-port-otp", {
                                                            number: portingNumber,
                                                            otp: otpCode,
                                                        });
                                                        setStep(5);
                                                    } catch (err: any) {
                                                        setError(err?.response?.data?.message || "Invalid OTP");
                                                    } finally {
                                                        setLoading(false);
                                                    }
                                                }}
                                                disabled={loading || !otpCode || otpCode.length !== 6}
                                                className="w-full rounded-[10px] bg-[#401B60] px-4 py-3 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {loading ? "Verifying..." : "Verify OTP"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            {numberChoice === "new" && (
                                <div className="flex items-center justify-between gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setStep(3)}
                                        className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (selectedNumber) {
                                                setStep(5);
                                            } else {
                                                setError("Please select a number");
                                            }
                                        }}
                                        disabled={!selectedNumber}
                                        className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed ml-auto"
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                            {numberChoice === "port" && otpSent && (
                                <div className="flex items-center justify-start gap-3 mt-6">
                                    <button
                                        onClick={() => {
                                            setOtpSent(false);
                                            setOtpCode("");
                                            setError(null);
                                        }}
                                        className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                    >
                                        ← Back
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 5: Payment & Agreements */}
                    {step === 5 && (
                        <div className="space-y-4">
                            <FormField label="Payment Method">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={useCardOnFile}
                                        onChange={() => setUseCardOnFile(true)}
                                        className="h-4 w-4 accent-[#401B60]"
                                    />
                                    <span className="text-[14px] text-[#0A0A0A]">Use card on file</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={!useCardOnFile}
                                        onChange={() => setUseCardOnFile(false)}
                                        className="h-4 w-4 accent-[#401B60]"
                                    />
                                    <span className="text-[14px] text-[#0A0A0A]">Add new payment method</span>
                                </label>
                            </FormField>

                            <div className="rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={termsVerified}
                                        onChange={(e) => setTermsVerified(e.target.checked)}
                                        className="mt-1 h-4 w-4 accent-[#401B60] flex-shrink-0"
                                    />
                                    <span className="text-[14px] text-[#0A0A0A]">
                                        <span className="font-semibold text-red-600">*</span> Have you verified the plan details and price with the customer and directed them to our terms of service and terms of conditions?
                                    </span>
                                </label>
                            </div>

                            <div className="flex items-center justify-between gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(4)}
                                    className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading || !termsVerified}
                                    className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed ml-auto"
                                >
                                    {loading ? "Processing..." : "Complete"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </SectionPanel>
        </ModalShell>
    );
}

// Mobile Broadband Service Modal
export function MobileBroadbandServiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const customerIdFromUrl = searchParams.get("customerId");

    const [step, setStep] = useState(1);
    const [customerId, setCustomerId] = useState(customerIdFromUrl || "");
    const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; price: number; serviceType: string } | null>(null);
    const [simType, setSimType] = useState<"eSim" | "physical">("eSim");
    const [simNumber, setSimNumber] = useState<string>(""); // ICCID for physical SIM
    const [esimNotificationEmail, setEsimNotificationEmail] = useState<string>(""); // Email for eSIM notifications
    const [useCardOnFile, setUseCardOnFile] = useState(true);
    const [termsVerified, setTermsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [availableServices, setAvailableServices] = useState<Array<{ id: string; name: string; serviceType: string; originalPrice: number }>>([]);
    const [loadingServices, setLoadingServices] = useState(false);

    useEffect(() => {
        if (customerIdFromUrl) {
            setCustomerId(customerIdFromUrl);
            setStep(2);
            // Fetch services when opening with customerId from URL
            fetchAvailableServices();
        }
        fetchCustomers();
    }, [customerIdFromUrl]);

    const fetchCustomers = async () => {
        try {
            const { data } = await apiClient.get<{ success: boolean; users?: Customer[]; data?: Customer[] }>(
                "/auth/users?role=customer"
            );
            if (data?.success) {
                setCustomers(data.users || data.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch customers:", err);
        }
    };

    const fetchAvailableServices = async (): Promise<Array<{ id: string; name: string; serviceType: string; originalPrice: number }>> => {
        try {
            setLoadingServices(true);
            const { data } = await apiClient.get<{ success: boolean; data?: Array<{ id: string; name: string; serviceType: string; originalPrice: number }> }>(
                "/customer-plans/services"
            );
            if (data?.success && data.data) {
                const mobileBroadbandServices = data.data.filter(s =>
                    s.serviceType === "Data Only" ||
                    s.name?.toLowerCase().includes("mobile broadband") ||
                    s.name?.toLowerCase().includes("broadband")
                );
                setAvailableServices(mobileBroadbandServices);
                console.log("Fetched Mobile Broadband services:", mobileBroadbandServices);
                return mobileBroadbandServices;
            } else {
                console.warn("No services data returned from API");
                return [];
            }
        } catch (err) {
            console.error("Failed to fetch available services:", err);
            setError("Failed to load available services. Please try again.");
            return [];
        } finally {
            setLoadingServices(false);
        }
    };

    const handleSubmit = async () => {
        // Validate customerId - ensure it's the actual userId, not just "1"
        const actualCustomerId = customerId && customerId !== "1"
            ? customerId
            : customers.find(c => (c.id || c.userId) === customerId)?.userId || customerId;

        if (!actualCustomerId || actualCustomerId === "1") {
            setError("Please select a valid customer");
            return;
        }

        if (!selectedPlan || !termsVerified) {
            setError("Please complete all required fields and verify terms");
            return;
        }

        // Use the serviceId directly from selectedPlan (which now includes the id)
        if (!selectedPlan?.id) {
            setError("Service ID is missing. Please select a plan again.");
            return;
        }

        // Validate conditional SIM fields
        if (simType === "physical" && !simNumber?.trim()) {
            setError("SIM Card Number (ICCID) is required for physical SIM");
            return;
        }

        if (simType === "eSim") {
            // Get customer email to default esimNotificationEmail if not provided
            const customer = customers.find(c => (c.id || c.userId) === actualCustomerId);
            const defaultEmail = customer?.email || "";
            const finalEsimEmail = esimNotificationEmail?.trim() || defaultEmail;
            
            if (!finalEsimEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEsimEmail)) {
                setError("eSIM Notification Email is required and must be a valid email address");
                return;
            }
        }

        try {
            setLoading(true);
            setError(null);

            // Get customer email for eSIM notification email default
            const customer = customers.find(c => (c.id || c.userId) === actualCustomerId);
            const defaultEmail = customer?.email || "";
            const finalEsimEmail = simType === "eSim" ? (esimNotificationEmail?.trim() || defaultEmail) : undefined;

            await apiClient.post("/customer-plans/add-service", {
                customerId: actualCustomerId,
                serviceId: selectedPlan.id,
                assignedAddress: undefined, // Mobile Broadband doesn't need address
                assignedNumber: undefined, // Mobile Broadband doesn't need number
                simType: simType,
                simNumber: simType === "physical" ? simNumber?.trim() : undefined, // Only include if physical SIM
                esimNotificationEmail: finalEsimEmail, // Include if eSIM
            });

            const authUser = getAuthUser<{ firstName?: string; lastName?: string; email?: string }>();
            const staffName = authUser
                ? [authUser.firstName, authUser.lastName].filter(Boolean).join(" ") || authUser.email || "Staff Member"
                : "Staff Member";

            await apiClient.post("/customer-verification/notes", {
                customerId: actualCustomerId,
                noteType: "Service",
                priority: "Normal",
                content: `Mobile Broadband service added: ${selectedPlan.name}. Added by ${staffName}.`,
                tags: ["service", "mobile-broadband", "plan-added"],
            });

            onClose();
            if (customerIdFromUrl) {
                router.refresh();
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to add service");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <ModalShell onClose={onClose} size="wide">
            <SectionPanel>
                <div className="mx-auto max-w-[760px]">
                    <h2 className="text-[24px] font-bold text-[#0A0A0A] mb-6">Add Mobile Broadband Service</h2>

                    {error && (
                        <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Customer Selection */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <FormField label="Select Customer">
                                <input
                                    type="text"
                                    placeholder="Search customers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none"
                                />
                            </FormField>
                            <div className="max-h-[400px] overflow-y-auto space-y-2">
                                {customers
                                    .filter(
                                        (c) =>
                                            !searchQuery ||
                                            c.firstName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                                            c.lastName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                                            c.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
                                    )
                                    .map((customer) => (
                                        <button
                                            key={customer.id || customer.userId}
                                            onClick={async () => {
                                                // Always use userId if available, otherwise use id
                                                const customerIdToUse = customer.userId || customer.id;
                                                setCustomerId(customerIdToUse);
                                                // Fetch services when moving to plan selection step
                                                await fetchAvailableServices();
                                                setStep(2);
                                            }}
                                            className="w-full text-left p-4 rounded-[10px] border border-[#DFDBE3] hover:border-[#401B60] hover:bg-[#F8F8F8] transition-all"
                                        >
                                            <div className="font-semibold text-[#0A0A0A]">
                                                {customer.firstName} {customer.lastName}
                                            </div>
                                            <div className="text-[13px] text-[#6F6C90]">{customer.email}</div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Plan Selection */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <FormField label="Select Plan *">
                                {loadingServices ? (
                                    <div className="text-center py-8 text-[#6F6C90]">
                                        <svg className="animate-spin h-6 w-6 mx-auto mb-2 text-[#401B60]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading plans...
                                    </div>
                                ) : availableServices.length === 0 ? (
                                    <div className="text-center py-8 text-[#6F6C90]">
                                        No Mobile Broadband plans available. Please contact support.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {availableServices.map((service) => (
                                            <button
                                                key={service.id}
                                                type="button"
                                                onClick={() => setSelectedPlan({
                                                    id: service.id,
                                                    name: service.name,
                                                    price: service.originalPrice,
                                                    serviceType: service.serviceType
                                                })}
                                                className={`w-full text-left p-4 rounded-[10px] border-2 transition-all ${selectedPlan?.id === service.id
                                                    ? "border-[#401B60] bg-[#F8F8F8]"
                                                    : "border-[#DFDBE3] hover:border-[#401B60]"
                                                    }`}
                                            >
                                                <div className="font-semibold text-[#0A0A0A]">{service.name}</div>
                                                <div className="text-[14px] text-[#6F6C90]">${service.originalPrice}/month</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </FormField>
                            <div className="flex items-center justify-between gap-3 mt-6">
                                {!customerIdFromUrl && (
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                    >
                                        ← Back
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className={`rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 ${!customerIdFromUrl ? "ml-auto" : "w-full"}`}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: SIM Type */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <FormField label="SIM Type *">
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="simType"
                                            value="eSim"
                                            checked={simType === "eSim"}
                                            onChange={() => {
                                                setSimType("eSim");
                                                setSimNumber(""); // Clear ICCID when switching to eSIM
                                            }}
                                            className="h-4 w-4 accent-[#401B60]"
                                        />
                                        <span className="text-[14px] text-[#0A0A0A]">eSIM</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="simType"
                                            value="physical"
                                            checked={simType === "physical"}
                                            onChange={() => {
                                                setSimType("physical");
                                                setEsimNotificationEmail(""); // Clear eSIM email when switching to physical
                                            }}
                                            className="h-4 w-4 accent-[#401B60]"
                                        />
                                        <span className="text-[14px] text-[#0A0A0A]">Physical SIM</span>
                                    </label>
                                </div>
                            </FormField>

                            {/* Conditional SIM Fields */}
                            {simType === "physical" && (
                                <FormField label="SIM Card Number (ICCID) *">
                                    <input
                                        type="text"
                                        value={simNumber}
                                        onChange={(e) => setSimNumber(e.target.value)}
                                        className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
                                        placeholder="Enter SIM Card Number (ICCID)"
                                    />
                                    <p className="mt-1 text-xs text-[#6F6C90]">
                                        The ICCID is printed on the physical SIM card. This is required for physical SIM provisioning.
                                    </p>
                                </FormField>
                            )}

                            {simType === "eSim" && (
                                <FormField label="eSIM Notification Email *">
                                    <input
                                        type="email"
                                        value={esimNotificationEmail}
                                        onChange={(e) => setEsimNotificationEmail(e.target.value)}
                                        className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#401B60]/20"
                                        placeholder={(() => {
                                            const customer = customers.find(c => (c.id || c.userId) === customerId);
                                            return customer?.email || "Enter email for eSIM notifications";
                                        })()}
                                    />
                                    <p className="mt-1 text-xs text-[#6F6C90]">
                                        This email will receive the eSIM activation QR code and instructions. Defaults to customer's account email but can be changed.
                                    </p>
                                </FormField>
                            )}

                            <div className="flex items-center justify-between gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Validate SIM fields before proceeding
                                        if (simType === "physical" && !simNumber?.trim()) {
                                            setError("SIM Card Number (ICCID) is required for physical SIM");
                                            return;
                                        }
                                        if (simType === "eSim") {
                                            const customer = customers.find(c => (c.id || c.userId) === customerId);
                                            const defaultEmail = customer?.email || "";
                                            const finalEsimEmail = esimNotificationEmail?.trim() || defaultEmail;
                                            if (!finalEsimEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(finalEsimEmail)) {
                                                setError("eSIM Notification Email is required and must be a valid email address");
                                                return;
                                            }
                                        }
                                        setError(null);
                                        setStep(4);
                                    }}
                                    className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 ml-auto"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Payment & Agreements */}
                    {step === 4 && (
                        <div className="space-y-4">
                            <FormField label="Payment Method">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={useCardOnFile}
                                        onChange={() => setUseCardOnFile(true)}
                                        className="h-4 w-4 accent-[#401B60]"
                                    />
                                    <span className="text-[14px] text-[#0A0A0A]">Use card on file</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={!useCardOnFile}
                                        onChange={() => setUseCardOnFile(false)}
                                        className="h-4 w-4 accent-[#401B60]"
                                    />
                                    <span className="text-[14px] text-[#0A0A0A]">Add new payment method</span>
                                </label>
                            </FormField>

                            <div className="rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={termsVerified}
                                        onChange={(e) => setTermsVerified(e.target.checked)}
                                        className="mt-1 h-4 w-4 accent-[#401B60] flex-shrink-0"
                                    />
                                    <span className="text-[14px] text-[#0A0A0A]">
                                        <span className="font-semibold text-red-600">*</span> Have you verified the plan details and price with the customer and directed them to our terms of service and terms of conditions?
                                    </span>
                                </label>
                            </div>

                            <div className="flex items-center justify-between gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                                >
                                    ← Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading || !termsVerified}
                                    className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed ml-auto"
                                >
                                    {loading ? "Processing..." : "Complete"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </SectionPanel>
        </ModalShell>
    );
}

