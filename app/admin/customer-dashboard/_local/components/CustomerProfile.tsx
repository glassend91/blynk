"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

type Customer = {
    id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    serviceAddress?: string;
    billingAddress?: string;
    type?: "residential" | "business";
    businessDetails?: {
        businessName?: string;
        ABN?: string;
        ACN?: string;
        authorizedContacts?: Array<{
            firstName: string;
            lastName: string;
            email?: string;
            phone?: string;
        }>;
    };
};

type Props = {
    customerId?: string;
    searchQuery?: string;
    onCustomerLoaded?: (customer: Customer | null) => void;
};

export default function CustomerProfile({ customerId, searchQuery, onCustomerLoaded }: Props) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (customerId || searchQuery) {
            fetchCustomer();
        }
    }, [customerId, searchQuery]);

    const fetchCustomer = async () => {
        try {
            setLoading(true);
            setError(null);

            // If customerId is provided, fetch directly by ID
            if (customerId) {
                try {
                    const customerResponse = await apiClient.get<{ success: boolean; user?: any; customer?: any; data?: any }>(
                        `/auth/users/${customerId}`
                    );
                    const customerData = customerResponse.data?.user || customerResponse.data?.customer || customerResponse.data?.data;

                    if (customerData) {
                        const formattedCustomer: Customer = {
                            id: customerData._id || customerData.id || customerId,
                            userId: customerData._id || customerData.id || customerId,
                            firstName: customerData.firstName,
                            lastName: customerData.lastName,
                            email: customerData.email,
                            phone: customerData.phone,
                            dateOfBirth: customerData.dateOfBirth,
                            serviceAddress: customerData.serviceAddress,
                            billingAddress: customerData.billingAddress,
                            type: customerData.type === "business" || customerData.businessDetails ? "business" : "residential",
                            businessDetails: customerData.businessDetails || (customerData.type === "business" ? {
                                businessName: customerData.businessName,
                                ABN: customerData.businessDetails?.ABN || customerData.ABN,
                                ACN: customerData.businessDetails?.ACN || customerData.ACN,
                                authorizedContacts: customerData.businessDetails?.authorizedContacts || [],
                            } : undefined),
                        };

                        setCustomer(formattedCustomer);
                        onCustomerLoaded?.(formattedCustomer);
                        return;
                    }
                } catch (err) {
                    console.error("Failed to fetch customer by ID, trying search:", err);
                    // Fall through to search method
                }
            }

            // Use global search to find customer if no direct ID fetch worked
            const query = customerId || searchQuery || "";
            if (!query) return;

            const { data } = await apiClient.get<{ success: boolean; data: any[] }>(
                `/customer-verification/global-search?query=${encodeURIComponent(query)}`
            );

            if (data?.success && data.data && data.data.length > 0) {
                // If customerId was provided, find the exact match
                let foundCustomer = customerId
                    ? data.data.find(c => (c.id || c.userId) === customerId) || data.data[0]
                    : data.data[0];

                // If customerId was provided but not found in search results, try direct fetch
                if (customerId && (!foundCustomer || (foundCustomer.id !== customerId && foundCustomer.userId !== customerId))) {
                    try {
                        const directResponse = await apiClient.get<{ success: boolean; user?: any; customer?: any; data?: any }>(
                            `/auth/users/${customerId}`
                        );
                        const directData = directResponse.data?.user || directResponse.data?.customer || directResponse.data?.data;
                        if (directData) {
                            foundCustomer = {
                                id: directData._id || directData.id || customerId,
                                userId: directData._id || directData.id || customerId,
                                firstName: directData.firstName,
                                lastName: directData.lastName,
                                email: directData.email,
                                phone: directData.phone,
                                serviceAddress: directData.serviceAddress,
                                businessName: directData.businessDetails?.businessName || directData.businessName,
                                ABN: directData.businessDetails?.ABN || directData.ABN,
                            };
                        }
                    } catch (directErr) {
                        console.error("Failed to fetch customer directly:", directErr);
                    }
                }

                // Use the found customer data directly, or fetch full details if needed
                let customerData = foundCustomer;

                // Try to fetch full customer details if available
                try {
                    const customerResponse = await apiClient.get<{ success: boolean; user?: any; customer?: any; data?: any }>(
                        `/auth/users/${foundCustomer.id}`
                    );
                    customerData = customerResponse.data?.user || customerResponse.data?.customer || customerResponse.data?.data || foundCustomer;
                } catch (err) {
                    // If that fails, use the found customer data
                    customerData = foundCustomer;
                }

                const formattedCustomer: Customer = {
                    id: customerData._id || customerData.id || foundCustomer.id,
                    userId: customerData._id || customerData.id || foundCustomer.id,
                    firstName: customerData.firstName || foundCustomer.firstName,
                    lastName: customerData.lastName || foundCustomer.lastName,
                    email: customerData.email || foundCustomer.email,
                    phone: customerData.phone || foundCustomer.phone,
                    dateOfBirth: customerData.dateOfBirth,
                    serviceAddress: customerData.serviceAddress || foundCustomer.serviceAddress,
                    billingAddress: customerData.billingAddress,
                    type: customerData.type === "business" || customerData.businessDetails ? "business" : "residential",
                    businessDetails: customerData.businessDetails || (customerData.type === "business" ? {
                        businessName: customerData.businessName || foundCustomer.businessName,
                        ABN: customerData.businessDetails?.ABN || customerData.ABN || foundCustomer.ABN,
                        ACN: customerData.businessDetails?.ACN || customerData.ACN,
                        authorizedContacts: customerData.businessDetails?.authorizedContacts || [],
                    } : undefined),
                };

                setCustomer(formattedCustomer);
                onCustomerLoaded?.(formattedCustomer);
            } else {
                setCustomer(null);
                onCustomerLoaded?.(null);
            }
        } catch (err: any) {
            console.error("Failed to fetch customer:", err);
            setError(err?.message || "Failed to load customer");
            setCustomer(null);
            onCustomerLoaded?.(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (updatedCustomer: Customer) => {
        try {
            setSaving(true);
            setError(null);

            const payload: any = {
                firstName: updatedCustomer.firstName,
                lastName: updatedCustomer.lastName,
                email: updatedCustomer.email,
                phone: updatedCustomer.phone,
                serviceAddress: updatedCustomer.serviceAddress,
                billingAddress: updatedCustomer.billingAddress,
            };

            if (updatedCustomer.type === "business" && updatedCustomer.businessDetails) {
                payload.businessDetails = {
                    businessName: updatedCustomer.businessDetails.businessName,
                    ABN: updatedCustomer.businessDetails.ABN,
                    ACN: updatedCustomer.businessDetails.ACN,
                    authorizedContacts: updatedCustomer.businessDetails.authorizedContacts,
                };
            } else if (updatedCustomer.dateOfBirth) {
                payload.dateOfBirth = updatedCustomer.dateOfBirth;
            }

            await apiClient.put(`/auth/users/${updatedCustomer.id}`, payload);

            setCustomer(updatedCustomer);
            setEditModalOpen(false);
        } catch (err: any) {
            setError(err?.message || "Failed to update customer");
            throw err;
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#401B60] border-r-transparent"></div>
                    <p className="mt-4 text-[14px] text-[#6F6C90]">Loading customer profile...</p>
                </div>
            </div>
        );
    }

    if (error && !customer) {
        return (
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
                <div className="text-center py-8">
                    <p className="text-[14px] text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
                <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-4">Customer Profile</h2>
                <div className="text-center py-8">
                    <p className="text-[14px] text-[#6F6C90]">No customer selected. Search for a customer to view their profile.</p>
                </div>
            </div>
        );
    }

    const primaryName = customer.type === "business" && customer.businessDetails?.businessName
        ? customer.businessDetails.businessName
        : `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Unknown";

    return (
        <>
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[20px] font-semibold text-[#0A0A0A]">Customer Profile</h2>
                    <button
                        onClick={() => setEditModalOpen(true)}
                        className="rounded-[8px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95"
                    >
                        Edit Details
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Primary Name / Business Name */}
                    <div>
                        <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">
                            {customer.type === "business" ? "Business Name" : "Full Name"}
                        </div>
                        <div className="text-[16px] font-semibold text-[#0A0A0A]">{primaryName}</div>
                    </div>

                    {/* Customer Type */}
                    <div>
                        <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">Customer Type</div>
                        <div className="text-[14px] text-[#0A0A0A]">
                            <span className="inline-block px-3 py-1 rounded-[6px] bg-[#F8F8F8] text-[#401B60] font-medium">
                                {customer.type === "business" ? "Business" : "Residential"}
                            </span>
                        </div>
                    </div>

                    {/* Business Details */}
                    {customer.type === "business" && customer.businessDetails && (
                        <>
                            {customer.businessDetails.ABN && (
                                <div>
                                    <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">ABN</div>
                                    <div className="text-[14px] text-[#0A0A0A]">{customer.businessDetails.ABN}</div>
                                </div>
                            )}
                            {customer.businessDetails.ACN && (
                                <div>
                                    <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">ACN</div>
                                    <div className="text-[14px] text-[#0A0A0A]">{customer.businessDetails.ACN}</div>
                                </div>
                            )}
                            {customer.businessDetails.authorizedContacts && customer.businessDetails.authorizedContacts.length > 0 && (
                                <div>
                                    <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-2">Authorized Contacts</div>
                                    <div className="space-y-2">
                                        {customer.businessDetails.authorizedContacts.map((contact, idx) => (
                                            <div key={idx} className="text-[14px] text-[#0A0A0A]">
                                                {contact.firstName} {contact.lastName}
                                                {contact.email && <span className="text-[#6F6C90]"> • {contact.email}</span>}
                                                {contact.phone && <span className="text-[#6F6C90]"> • {contact.phone}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Residential Details */}
                    {customer.type === "residential" && (
                        <>
                            {customer.firstName && (
                                <div>
                                    <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">First Name</div>
                                    <div className="text-[14px] text-[#0A0A0A]">{customer.firstName}</div>
                                </div>
                            )}
                            {customer.lastName && (
                                <div>
                                    <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">Last Name</div>
                                    <div className="text-[14px] text-[#0A0A0A]">{customer.lastName}</div>
                                </div>
                            )}
                            {customer.dateOfBirth && (
                                <div>
                                    <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">Date of Birth</div>
                                    <div className="text-[14px] text-[#0A0A0A]">
                                        {new Date(customer.dateOfBirth).toLocaleDateString()}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Common Fields */}
                    <div>
                        <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">Billing Email</div>
                        <div className="text-[14px] text-[#0A0A0A]">{customer.email}</div>
                    </div>

                    {customer.phone && (
                        <div>
                            <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">Mobile Contact</div>
                            <div className="text-[14px] text-[#0A0A0A]">{customer.phone}</div>
                        </div>
                    )}

                    {customer.serviceAddress && (
                        <div>
                            <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">Service Address</div>
                            <div className="text-[14px] text-[#0A0A0A]">{customer.serviceAddress}</div>
                        </div>
                    )}

                    {customer.billingAddress && customer.billingAddress !== customer.serviceAddress && (
                        <div>
                            <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">Billing Address</div>
                            <div className="text-[14px] text-[#0A0A0A]">{customer.billingAddress}</div>
                        </div>
                    )}

                    <div>
                        <div className="text-[12px] uppercase tracking-wide text-[#6F6C90] mb-1">Customer ID</div>
                        <div className="text-[14px] text-[#0A0A0A] font-mono">{customer.id}</div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editModalOpen && (
                <EditCustomerModal
                    customer={customer}
                    onClose={() => setEditModalOpen(false)}
                    onSave={handleSave}
                    saving={saving}
                />
            )}
        </>
    );
}

// Edit Customer Modal Component
function EditCustomerModal({
    customer,
    onClose,
    onSave,
    saving,
}: {
    customer: Customer;
    onClose: () => void;
    onSave: (customer: Customer) => Promise<void>;
    saving: boolean;
}) {
    const [editedCustomer, setEditedCustomer] = useState<Customer>({ ...customer });
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const validateABN = (abn: string) => {
        const digits = abn.replace(/\s/g, "");
        return digits.length === 11;
    };

    const validateACN = (acn: string) => {
        const digits = acn.replace(/\s/g, "");
        return digits.length === 9;
    };

    const handleSave = async () => {
        const newErrors: Record<string, string> = {};

        if (!editedCustomer.email) newErrors.email = "Email is required";
        if (!editedCustomer.phone) newErrors.phone = "Phone is required";
        if (!editedCustomer.serviceAddress) newErrors.serviceAddress = "Service address is required";

        if (editedCustomer.type === "business" && editedCustomer.businessDetails) {
            if (!editedCustomer.businessDetails.businessName) {
                newErrors.businessName = "Business name is required";
            }
            if (editedCustomer.businessDetails.ABN && !validateABN(editedCustomer.businessDetails.ABN)) {
                newErrors.ABN = "ABN must be 11 digits";
            }
            if (editedCustomer.businessDetails.ACN && !validateACN(editedCustomer.businessDetails.ACN)) {
                newErrors.ACN = "ACN must be 9 digits";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await onSave(editedCustomer);
        } catch (err) {
            // Error handled in parent
        }
    };

    const addAuthorizedContact = () => {
        if (!editedCustomer.businessDetails) return;
        const contacts = editedCustomer.businessDetails.authorizedContacts || [];
        if (contacts.length < 5) {
            setEditedCustomer({
                ...editedCustomer,
                businessDetails: {
                    ...editedCustomer.businessDetails,
                    authorizedContacts: [...contacts, { firstName: "", lastName: "", email: "", phone: "" }],
                },
            });
        }
    };

    const removeAuthorizedContact = (index: number) => {
        if (!editedCustomer.businessDetails) return;
        const contacts = editedCustomer.businessDetails.authorizedContacts || [];
        setEditedCustomer({
            ...editedCustomer,
            businessDetails: {
                ...editedCustomer.businessDetails,
                authorizedContacts: contacts.filter((_, i) => i !== index),
            },
        });
    };

    const updateAuthorizedContact = (index: number, field: string, value: string) => {
        if (!editedCustomer.businessDetails) return;
        const contacts = [...(editedCustomer.businessDetails.authorizedContacts || [])];
        contacts[index] = { ...contacts[index], [field]: value };
        setEditedCustomer({
            ...editedCustomer,
            businessDetails: {
                ...editedCustomer.businessDetails,
                authorizedContacts: contacts,
            },
        });
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
                className="fixed w-full max-w-2xl rounded-[16px] bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
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
                    <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">Edit Customer Details</h2>
                    <button
                        onClick={onClose}
                        className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
                    >
                        ×
                    </button>
                </div>

                <div className="space-y-4">
                    {editedCustomer.type === "business" && editedCustomer.businessDetails && (
                        <>
                            <div>
                                <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
                                    Business Name *
                                </label>
                                <input
                                    type="text"
                                    value={editedCustomer.businessDetails.businessName || ""}
                                    onChange={(e) =>
                                        setEditedCustomer({
                                            ...editedCustomer,
                                            businessDetails: {
                                                ...editedCustomer.businessDetails!,
                                                businessName: e.target.value,
                                            },
                                        })
                                    }
                                    className={`w-full rounded-[10px] border px-4 py-3 text-[14px] outline-none ${errors.businessName ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"
                                        }`}
                                />
                                {errors.businessName && (
                                    <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">ABN</label>
                                    <input
                                        type="text"
                                        value={editedCustomer.businessDetails.ABN || ""}
                                        onChange={(e) =>
                                            setEditedCustomer({
                                                ...editedCustomer,
                                                businessDetails: {
                                                    ...editedCustomer.businessDetails!,
                                                    ABN: e.target.value,
                                                },
                                            })
                                        }
                                        className={`w-full rounded-[10px] border px-4 py-3 text-[14px] outline-none ${errors.ABN ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"
                                            }`}
                                        placeholder="11 digits"
                                    />
                                    {errors.ABN && <p className="mt-1 text-xs text-red-600">{errors.ABN}</p>}
                                </div>
                                <div>
                                    <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">ACN</label>
                                    <input
                                        type="text"
                                        value={editedCustomer.businessDetails.ACN || ""}
                                        onChange={(e) =>
                                            setEditedCustomer({
                                                ...editedCustomer,
                                                businessDetails: {
                                                    ...editedCustomer.businessDetails!,
                                                    ACN: e.target.value,
                                                },
                                            })
                                        }
                                        className={`w-full rounded-[10px] border px-4 py-3 text-[14px] outline-none ${errors.ACN ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"
                                            }`}
                                        placeholder="9 digits"
                                    />
                                    {errors.ACN && <p className="mt-1 text-xs text-red-600">{errors.ACN}</p>}
                                </div>
                            </div>

                            <div className="mt-6 border-t border-[#E9E3F2] pt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[16px] font-semibold text-[#0A0A0A]">
                                        Authorized Contacts (up to 5)
                                    </h3>
                                    {(editedCustomer.businessDetails.authorizedContacts?.length || 0) < 5 && (
                                        <button
                                            type="button"
                                            onClick={addAuthorizedContact}
                                            className="text-[14px] text-[#401B60] hover:underline"
                                        >
                                            + Add Contact
                                        </button>
                                    )}
                                </div>

                                {(editedCustomer.businessDetails.authorizedContacts || []).map((contact, idx) => (
                                    <div key={idx} className="mb-4 rounded-[10px] border border-[#E7E4EC] bg-[#FBF9FF] p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[14px] font-semibold text-[#2E2745]">Contact {idx + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAuthorizedContact(idx)}
                                                className="text-[12px] text-red-600 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                value={contact.firstName}
                                                onChange={(e) => updateAuthorizedContact(idx, "firstName", e.target.value)}
                                                className="w-full rounded-[10px] border border-[#DFDBE3] px-3 py-2 text-[14px] outline-none"
                                                placeholder="First Name"
                                            />
                                            <input
                                                type="text"
                                                value={contact.lastName}
                                                onChange={(e) => updateAuthorizedContact(idx, "lastName", e.target.value)}
                                                className="w-full rounded-[10px] border border-[#DFDBE3] px-3 py-2 text-[14px] outline-none"
                                                placeholder="Last Name"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <input
                                                type="email"
                                                value={contact.email || ""}
                                                onChange={(e) => updateAuthorizedContact(idx, "email", e.target.value)}
                                                className="w-full rounded-[10px] border border-[#DFDBE3] px-3 py-2 text-[14px] outline-none"
                                                placeholder="Email"
                                            />
                                            <input
                                                type="tel"
                                                value={contact.phone || ""}
                                                onChange={(e) => updateAuthorizedContact(idx, "phone", e.target.value)}
                                                className="w-full rounded-[10px] border border-[#DFDBE3] px-3 py-2 text-[14px] outline-none"
                                                placeholder="Phone"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {editedCustomer.type === "residential" && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">First Name</label>
                                    <input
                                        type="text"
                                        value={editedCustomer.firstName || ""}
                                        onChange={(e) =>
                                            setEditedCustomer({ ...editedCustomer, firstName: e.target.value })
                                        }
                                        className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        value={editedCustomer.lastName || ""}
                                        onChange={(e) =>
                                            setEditedCustomer({ ...editedCustomer, lastName: e.target.value })
                                        }
                                        className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    value={editedCustomer.dateOfBirth || ""}
                                    onChange={(e) =>
                                        setEditedCustomer({ ...editedCustomer, dateOfBirth: e.target.value })
                                    }
                                    className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
                            Billing Email *
                        </label>
                        <input
                            type="email"
                            value={editedCustomer.email}
                            onChange={(e) => setEditedCustomer({ ...editedCustomer, email: e.target.value })}
                            className={`w-full rounded-[10px] border px-4 py-3 text-[14px] outline-none ${errors.email ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"
                                }`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
                            Mobile Contact *
                        </label>
                        <input
                            type="tel"
                            value={editedCustomer.phone || ""}
                            onChange={(e) => setEditedCustomer({ ...editedCustomer, phone: e.target.value })}
                            className={`w-full rounded-[10px] border px-4 py-3 text-[14px] outline-none ${errors.phone ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"
                                }`}
                        />
                        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                    </div>

                    <div>
                        <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
                            Service Address *
                        </label>
                        <textarea
                            value={editedCustomer.serviceAddress || ""}
                            onChange={(e) =>
                                setEditedCustomer({ ...editedCustomer, serviceAddress: e.target.value })
                            }
                            className={`w-full rounded-[10px] border px-4 py-3 text-[14px] outline-none ${errors.serviceAddress ? "border-red-300 bg-red-50" : "border-[#DFDBE3]"
                                }`}
                            rows={3}
                        />
                        {errors.serviceAddress && (
                            <p className="mt-1 text-xs text-red-600">{errors.serviceAddress}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-[13px] font-medium text-[#0A0A0A] mb-1">
                            Billing Address (if different)
                        </label>
                        <textarea
                            value={editedCustomer.billingAddress || ""}
                            onChange={(e) =>
                                setEditedCustomer({ ...editedCustomer, billingAddress: e.target.value })
                            }
                            className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none"
                            rows={3}
                        />
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
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-[10px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

