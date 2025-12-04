"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

type Customer = {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phone?: string;
    type?: string;
    status?: string;
    customerType?: string;
    businessName?: string;
    serviceAddress?: string;
};

type Props = {
    onCustomerSelect: (customerId: string) => void;
};

export default function CustomerList({ onCustomerSelect }: Props) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        fetchCustomers();
    }, [currentPage, searchQuery]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError(null);

            // If there's a search query, use global search
            if (searchQuery.trim()) {
                const { data } = await apiClient.get<{ success: boolean; data: Customer[] }>(
                    `/customer-verification/global-search?query=${encodeURIComponent(searchQuery.trim())}`
                );

                if (data?.success && data.data) {
                    setCustomers(data.data);
                    setTotalPages(1);
                } else {
                    setCustomers([]);
                }
            } else {
                // Fetch all customers with pagination
                const { data } = await apiClient.get<{ success: boolean; users?: Customer[]; data?: Customer[]; total?: number }>(
                    `/auth/users?role=customer&page=${currentPage}&limit=${itemsPerPage}`
                ).catch(async () => {
                    // Fallback: try alternative endpoint
                    return await apiClient.get<{ success: boolean; users?: Customer[]; data?: Customer[]; total?: number }>(
                        `/customer-verification/customers?page=${currentPage}&limit=${itemsPerPage}`
                    );
                });

                if (data?.success) {
                    let customersList: Customer[] = [];

                    if ('users' in data) {
                    customersList = data.users;
                    } else if ('data' in data) {
                    customersList = data.data;
                    }
                    setCustomers(customersList);
                    const total = data.total || customersList.length;
                    setTotalPages(Math.ceil(total / itemsPerPage));
                } else {
                    setCustomers([]);
                }
            }
        } catch (err: any) {
            console.error("Failed to fetch customers:", err);
            setError(err?.message || "Failed to load customers");
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchCustomers();
    };

    const handleCustomerClick = (customer: Customer) => {
        onCustomerSelect(customer.userId || customer.id);
    };

    const displayedCustomers = customers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-[26px] font-bold text-[#0A0A0A]">Customer Dashboard</h1>
                <p className="mt-1 text-[14px] text-[#6F6C90]">
                    Select a customer to view their details, verification, notes, and services
                </p>
            </div>

            {/* Search Bar */}
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
                <form onSubmit={handleSearch} className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-3 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3">
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path
                                d="M9.585 18c4.372 0 7.917-3.544 7.917-7.917S13.957 2.167 9.585 2.167 1.668 5.711 1.668 10.083 5.212 18 9.585 18Z"
                                stroke="#292D32"
                                strokeWidth="1.5"
                            />
                            <path
                                d="m18.335 18.833-1.667-1.667"
                                stroke="#292D32"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search customers by name, email, phone, or ID..."
                            className="flex-1 bg-transparent text-[14px] text-[#0A0A0A] placeholder-[#6F6C90] outline-none"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchQuery("");
                                    setCurrentPage(1);
                                }}
                                className="text-[#6F6C90] hover:text-[#0A0A0A]"
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="rounded-[8px] bg-[#401B60] px-6 py-3 text-[14px] font-semibold text-white hover:opacity-95"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                    {error}
                </div>
            )}

            {/* Customer List */}
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white shadow-[0_37px_37px_rgba(0,0,0,0.05)] overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#401B60] border-r-transparent"></div>
                        <p className="mt-4 text-[14px] text-[#6F6C90]">Loading customers...</p>
                    </div>
                ) : displayedCustomers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-[14px] text-[#6F6C90]">
                            {searchQuery ? `No customers found matching "${searchQuery}"` : "No customers found"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F8F8F8] border-b border-[#DFDBE3]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-[12px] font-semibold text-[#6F6C90] uppercase tracking-wide">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-[12px] font-semibold text-[#6F6C90] uppercase tracking-wide">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-[12px] font-semibold text-[#6F6C90] uppercase tracking-wide">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-[12px] font-semibold text-[#6F6C90] uppercase tracking-wide">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-[12px] font-semibold text-[#6F6C90] uppercase tracking-wide">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-[12px] font-semibold text-[#6F6C90] uppercase tracking-wide">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#DFDBE3]">
                                    {displayedCustomers.map((customer) => {
                                        const displayName =
                                            customer.customerType === "business" && customer.businessName
                                                ? customer.businessName
                                                : `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || customer.name;

                                        return (
                                            <tr
                                                key={customer.id || customer.userId}
                                                className="hover:bg-[#F8F8F8] cursor-pointer transition-colors"
                                                onClick={() => handleCustomerClick(customer)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="text-[14px] font-semibold text-[#0A0A0A]">{displayName}</div>
                                                    {customer.customerType === "business" && customer.businessName && (
                                                        <div className="text-[12px] text-[#6F6C90] mt-1">
                                                            {customer.firstName} {customer.lastName}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-[14px] text-[#0A0A0A]">{customer.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-[14px] text-[#0A0A0A]">{customer.phone || "—"}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-[6px] text-[12px] font-medium ${customer.customerType === "business"
                                                            ? "bg-purple-100 text-purple-700"
                                                            : "bg-blue-100 text-blue-700"
                                                            }`}
                                                    >
                                                        {customer.customerType === "business" ? "Business" : "Residential"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-[6px] text-[12px] font-medium ${customer.status === "Active" || customer.status === "active"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-700"
                                                            }`}
                                                    >
                                                        {customer.status || "Active"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCustomerClick(customer);
                                                        }}
                                                        className="rounded-[8px] bg-[#401B60] px-4 py-2 text-[14px] font-semibold text-white hover:opacity-95"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {!searchQuery && totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-[#DFDBE3] flex items-center justify-between">
                                <div className="text-[14px] text-[#6F6C90]">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="rounded-[8px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="rounded-[8px] border border-[#DFDBE3] px-4 py-2 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

