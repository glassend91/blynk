"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { getAuthUser } from "@/lib/auth";

type Service = {
    id: string;
    name: string;
    serviceType: "NBN" | "Mobile";
    status: string;
    planName?: string;
    price?: string;
    billingCycle?: string;
};

type Props = {
    customerId?: string;
    onServiceCancelled?: () => void;
};

export default function ActiveServicesList({ customerId, onServiceCancelled }: Props) {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [cancelServiceId, setCancelServiceId] = useState<string | null>(null);
    const [changePlanServiceId, setChangePlanServiceId] = useState<string | null>(null);

    useEffect(() => {
        if (customerId) {
            fetchServices();
        } else {
            setServices([]);
        }
    }, [customerId]);

    const fetchServices = async () => {
        if (!customerId) return;
        console.log('customerId', customerId);
        console.log('fetching services');
        try {
            setLoading(true);
            setError(null);

            // Fetch customer services
            const response = await apiClient.get<{ success: boolean; data?: { plans?: Service[] }; services?: Service[] }>(
                `/customer-plans/${customerId}`
            ).catch(async () => {
                // Alternative endpoint
                return await apiClient.get<{ success: boolean; services?: Service[] }>(
                    `/customer-plan/${customerId}`
                );
            });
            const data = response.data;
            console.log('data', data);

            if (data?.success) {
                // Handle both response formats
                const servicesList = ('data' in data && data.data?.plans)
                    ? data.data.plans
                    : ('services' in data && data.services)
                        ? data.services
                        : [];
                // Filter to show only active services
                // const activeServices = servicesList.filter(
                //     (s: Service) => s.status === "Active" || s.status === "active"
                // );
                setServices(servicesList);
            } else {
                setServices([]);
            }
        } catch (err: any) {
            console.error("Failed to fetch services:", err);
            setError(err?.message || "Failed to load services");
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (serviceId: string) => {
        setCancelServiceId(serviceId);
    };

    const handleCancelSuccess = () => {
        fetchServices();
        setCancelServiceId(null);
        onServiceCancelled?.();
    };

    if (!customerId) {
        return (
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
                <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-4">Active Services</h2>
                <div className="text-center py-8">
                    <p className="text-[14px] text-[#6F6C90]">
                        Select a customer to view their active services
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
                <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-4">Active Services</h2>
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#401B60] border-r-transparent"></div>
                    <p className="mt-4 text-[14px] text-[#6F6C90]">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
                <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-4">Active Services</h2>

                {error && (
                    <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                        {error}
                    </div>
                )}

                {services.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-[14px] text-[#6F6C90]">No active services found for this customer.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className="rounded-[10px] border border-[#DFDBE3] bg-white p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-[16px] font-semibold text-[#0A0A0A]">{service.name}</h3>
                                            <span
                                                className={`inline-block px-2 py-0.5 rounded-[4px] text-[11px] font-medium ${service.serviceType === "NBN"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-purple-100 text-purple-700"
                                                    }`}
                                            >
                                                {service.serviceType}
                                            </span>
                                        </div>
                                        {service.planName && (
                                            <p className="text-[14px] text-[#6F6C90] mb-1">{service.planName}</p>
                                        )}
                                        {/* <div className="flex items-center gap-4 text-[12px] text-[#6F6C90]">
                                            {service.price && <span>${service.price}</span>}
                                            {service.billingCycle && <span>• {service.billingCycle}</span>}
                                            <span className={`px-2 py-0.5 rounded-[4px] ${service.status === "Active" || service.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                                }`}>
                                                {service.status}
                                            </span>
                                        </div> */}
                                    </div>
                                    <div className="ml-4 flex items-center gap-2">
                                        <button
                                            onClick={() => setChangePlanServiceId(service.id)}
                                            className="rounded-[8px] border border-[#401B60] bg-white px-4 py-2 text-[14px] font-semibold text-[#401B60] hover:bg-[#F8F8F8]"
                                        >
                                            Change Plan
                                        </button>
                                        <button
                                            onClick={() => handleCancelClick(service.id)}
                                            className="rounded-[8px] border border-red-300 bg-red-50 px-4 py-2 text-[14px] font-semibold text-red-700 hover:bg-red-100"
                                        >
                                            Cancel Service
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Service Confirmation Modal */}
            {cancelServiceId && (
                <CancelServiceModal
                    service={services.find((s) => s.id === cancelServiceId)!}
                    customerId={customerId!}
                    onClose={() => setCancelServiceId(null)}
                    onSuccess={handleCancelSuccess}
                />
            )}

            {/* Change Plan Modal */}
            {changePlanServiceId && (
                <ChangePlanModal
                    service={services.find((s) => s.id === changePlanServiceId)!}
                    customerId={customerId!}
                    onClose={() => setChangePlanServiceId(null)}
                />
            )}
        </>
    );
}

// Cancel Service Modal Component
function CancelServiceModal({
    service,
    customerId,
    onClose,
    onSuccess,
}: {
    service: Service;
    customerId: string;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [identityVerified, setIdentityVerified] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showWholesalerAlert, setShowWholesalerAlert] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollY);
        };
    }, []);

    const handleCancel = async () => {
        if (!identityVerified) {
            setError("You must verify the customer's identity before cancelling");
            return;
        }

        try {
            setCancelling(true);
            setError(null);

            if (service.serviceType === "NBN") {
                // DELETE API call for NBN service
                await apiClient.delete(`/customer-plans/services/${service.id}`);

                // Log to notes
                try {
                    await apiClient.post("/customer-verification/notes", {
                        customerId,
                        noteType: "Service",
                        priority: "High",
                        content: `NBN service "${service.name}" cancelled. Customer identity verified.`,
                        tags: ["service", "cancellation", "nbn"],
                    });
                } catch (noteErr) {
                    console.error("Failed to log cancellation to notes:", noteErr);
                }

                onSuccess();
            } else if (service.serviceType === "Mobile") {
                // Update CMS status to "Cancelled" for Mobile service
                await apiClient.put(`/customer-plans/services/${service.id}`, {
                    status: "Cancelled",
                });

                // Log to notes
                try {
                    await apiClient.post("/customer-verification/notes", {
                        customerId,
                        noteType: "Service",
                        priority: "High",
                        content: `Mobile service "${service.name}" status updated to Cancelled. Customer identity verified. ACTION REQUIRED: Log in to Wholesaler Portal to manually cancel this service.`,
                        tags: ["service", "cancellation", "mobile", "wholesaler"],
                    });
                } catch (noteErr) {
                    console.error("Failed to log cancellation to notes:", noteErr);
                }

                setShowWholesalerAlert(true);
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Failed to cancel service");
        } finally {
            setCancelling(false);
        }
    };

    if (showWholesalerAlert) {
        return (
            <div
                className="fixed z-50 flex items-center justify-center"
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    margin: 0,
                    padding: 0,
                    width: '100vw',
                    height: '100vh'
                }}
            >
                <div
                    className="fixed bg-black/70"
                    onClick={() => setShowWholesalerAlert(false)}
                    style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 50
                    }}
                />
                <div
                    className="fixed w-full max-w-md rounded-[16px] bg-white p-6 shadow-2xl"
                    style={{
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '1.5rem',
                        zIndex: 51
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">Action Required</h2>
                        <button
                            onClick={() => {
                                setShowWholesalerAlert(false);
                                onSuccess();
                            }}
                            className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3">
                            <p className="text-[14px] font-semibold text-amber-800 mb-2">
                                ACTION REQUIRED: Log in to Wholesaler Portal to manually cancel this service.
                            </p>
                            <p className="text-[13px] text-amber-700">
                                Service: <span className="font-semibold">{service.name}</span>
                            </p>
                        </div>

                        <div className="text-[14px] text-[#6F6C90]">
                            <p className="mb-2">The service status has been updated to "Cancelled" in the CMS.</p>
                            <p>You must now complete the cancellation process in the Wholesaler Portal.</p>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end">
                        <button
                            onClick={() => {
                                setShowWholesalerAlert(false);
                                onSuccess();
                            }}
                            className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95"
                        >
                            Understood
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed z-50 flex items-center justify-center"
            style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 0,
                padding: 0,
                width: '100vw',
                height: '100vh'
            }}
        >
            <div
                className="fixed bg-black/70"
                onClick={onClose}
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 50
                }}
            />
            <div
                className="fixed w-full max-w-md rounded-[16px] bg-white p-6 shadow-2xl"
                style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '1.5rem',
                    zIndex: 51
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">Cancel Service</h2>
                    <button
                        onClick={onClose}
                        className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-4">
                        <div className="text-[14px] font-semibold text-[#0A0A0A] mb-1">Service Details</div>
                        <div className="text-[14px] text-[#6F6C90]">
                            <p>Name: {service.name}</p>
                            <p>Type: {service.serviceType}</p>
                            {service.planName && <p>Plan: {service.planName}</p>}
                        </div>
                    </div>

                    <div className="rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3">
                        <p className="text-[13px] text-amber-800">
                            <span className="font-semibold">Warning:</span> This action cannot be undone. The service will be cancelled immediately.
                        </p>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-[10px] border border-[#DFDBE3] bg-white">
                        <input
                            type="checkbox"
                            id="identityVerified"
                            checked={identityVerified}
                            onChange={(e) => setIdentityVerified(e.target.checked)}
                            className="mt-1 h-4 w-4 accent-[#401B60] flex-shrink-0"
                        />
                        <label htmlFor="identityVerified" className="text-[14px] text-[#0A0A0A] cursor-pointer">
                            <span className="font-semibold text-red-600">*</span> Customer's Identity Verified
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-[10px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8]"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={cancelling || !identityVerified}
                        className="rounded-[10px] bg-red-600 px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {cancelling ? "Cancelling..." : "Confirm Cancellation"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Change Plan Modal Component
function ChangePlanModal({
    service,
    customerId,
    onClose,
}: {
    service: Service;
    customerId: string;
    onClose: () => void;
}) {
    const [logging, setLogging] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollY);
        };
    }, []);

    const handleUnderstood = async () => {
        try {
            setLogging(true);

            // Get current staff member name
            const authUser = getAuthUser<{ firstName?: string; lastName?: string; email?: string }>();
            const staffName = authUser
                ? [authUser.firstName, authUser.lastName].filter(Boolean).join(" ") || authUser.email || "Staff Member"
                : "Staff Member";

            // Log to notes
            try {
                await apiClient.post("/customer-verification/notes", {
                    customerId,
                    noteType: "Service",
                    priority: "Normal",
                    content: `Staff Member ${staffName} accessed Change Plan instructions for ${service.name} Service.`,
                    tags: ["service", "plan-change", "staff-access"],
                });
            } catch (noteErr) {
                console.error("Failed to log plan change access to notes:", noteErr);
                // Don't block the modal close if logging fails
            }

            onClose();
        } catch (err) {
            console.error("Error logging plan change access:", err);
            // Still close the modal even if logging fails
            onClose();
        } finally {
            setLogging(false);
        }
    };

    return (
        <div
            className="fixed z-50 flex items-center justify-center"
            style={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: 0,
                padding: 0,
                width: '100vw',
                height: '100vh'
            }}
        >
            <div
                className="fixed bg-black/70"
                onClick={onClose}
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 50
                }}
            />
            <div
                className="fixed w-full max-w-md rounded-[16px] bg-white p-6 shadow-2xl"
                style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: '1.5rem',
                    zIndex: 51
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">Change Plan</h2>
                    <button
                        onClick={onClose}
                        className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-4">
                        <div className="text-[14px] font-semibold text-[#0A0A0A] mb-2">Current Plan Details</div>
                        <div className="space-y-2 text-[14px] text-[#6F6C90]">
                            <p><span className="font-medium text-[#0A0A0A]">Service:</span> {service.name}</p>
                            <p><span className="font-medium text-[#0A0A0A]">Type:</span> {service.serviceType}</p>
                            {service.planName && (
                                <p><span className="font-medium text-[#0A0A0A]">Plan Name:</span> {service.planName}</p>
                            )}
                            {service.price && (
                                <p><span className="font-medium text-[#0A0A0A]">Price:</span> ${service.price}</p>
                            )}
                            {service.billingCycle && (
                                <p><span className="font-medium text-[#0A0A0A]">Billing Cycle:</span> {service.billingCycle}</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3">
                        <p className="text-[14px] font-semibold text-amber-800 mb-2">
                            Plan changes cannot be automated.
                        </p>
                        <p className="text-[13px] text-amber-700">
                            Please log in to the Wholesaler Portal to upgrade/downgrade this service manually.
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <button
                        onClick={handleUnderstood}
                        disabled={logging}
                        className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {logging ? "Saving..." : "Understood"}
                    </button>
                </div>
            </div>
        </div>
    );
}

