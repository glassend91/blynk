"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

type Invoice = {
    _id: string;
    invoiceNumber: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    total: number;
    currency: string;
    dueDate: string;
    createdAt: string;
    billingPeriod?: {
        startDate: string;
        endDate: string;
    };
    paymentDate?: string;
};

type Props = {
    customerId?: string;
};

type SortField = 'createdAt' | 'dueDate' | 'total' | 'status' | 'invoiceNumber';
type SortOrder = 'asc' | 'desc';

export default function BillingHistory({ customerId }: Props) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState<SortField>('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);

    useEffect(() => {
        if (customerId) {
            fetchInvoices();
        }
    }, [customerId, page, sortBy, sortOrder, statusFilter]);

    const fetchInvoices = async () => {
        if (!customerId) return;

        try {
            setLoading(true);
            setError(null);

            const params: any = {
                page,
                limit: 20,
                sortBy,
                sortOrder,
            };

            if (statusFilter) {
                params.status = statusFilter;
            }

            const { data } = await apiClient.get<{
                success: boolean;
                data: {
                    invoices: Invoice[];
                    pagination: {
                        currentPage: number;
                        totalPages: number;
                        totalItems: number;
                        itemsPerPage: number;
                    };
                };
            }>(`/billing/admin/customers/${customerId}/invoices`, { params });

            if (data?.success && data.data) {
                setInvoices(data.data.invoices);
                setTotalPages(data.data.pagination.totalPages);
            }
        } catch (err: any) {
            console.error("Failed to fetch invoices:", err);
            setError(err?.message || "Failed to load billing history");
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (field: SortField) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setPage(1);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-AU', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const formatCurrency = (amount: number, currency: string = 'AUD') => {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { color: string; bg: string; label: string }> = {
            paid: { color: 'text-[#19BF66]', bg: 'bg-[#E6F7ED]', label: 'Paid' },
            overdue: { color: 'text-[#E0342F]', bg: 'bg-[#FFF5F5]', label: 'Overdue' },
            sent: { color: 'text-[#6366F1]', bg: 'bg-[#EEF2FF]', label: 'Sent' },
            draft: { color: 'text-[#F59E0B]', bg: 'bg-[#FEF3C7]', label: 'Draft' },
            cancelled: { color: 'text-[#6F6C90]', bg: 'bg-[#F8F8F8]', label: 'Cancelled' },
        };

        const statusInfo = statusMap[status] || statusMap.draft;
        return (
            <span className={`inline-block px-2.5 py-1 rounded-[6px] text-[12px] font-semibold ${statusInfo.color} ${statusInfo.bg}`}>
                {statusInfo.label}
            </span>
        );
    };

    const handleDownloadPDF = async (invoiceId: string, invoiceNumber: string) => {
        try {
            setDownloadingInvoiceId(invoiceId);
            setError(null);

            // Get auth token
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error('Authentication required');
            }

            // Fetch PDF from admin endpoint
            // Use apiClient's baseURL by constructing the full URL
            const baseURL = typeof window !== 'undefined' && window.location.origin.includes('localhost')
                ? 'http://localhost:5000'
                : 'https://blynk-backend.onrender.com';
            const response = await fetch(`${baseURL}/api/billing/admin/invoices/${invoiceId}/download`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to download invoice PDF');
            }

            // Get PDF blob
            const blob = await response.blob();

            // Extract filename from Content-Disposition header if available
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = `Invoice-${invoiceNumber}.pdf`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error("Failed to download invoice PDF:", err);
            setError(err?.message || "Failed to download invoice PDF");
        } finally {
            setDownloadingInvoiceId(null);
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortBy !== field) {
            return (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1 opacity-40">
                    <path d="M6 2L8 4H4L6 2Z" fill="currentColor" />
                    <path d="M6 10L4 8H8L6 10Z" fill="currentColor" />
                </svg>
            );
        }
        return sortOrder === 'asc' ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1">
                <path d="M6 2L8 4H4L6 2Z" fill="currentColor" />
            </svg>
        ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1">
                <path d="M6 10L4 8H8L6 10Z" fill="currentColor" />
            </svg>
        );
    };

    const DownloadIcon = () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    );

    if (!customerId) {
        return (
            <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
                <h2 className="text-[20px] font-semibold text-[#0A0A0A] mb-4">Billing History</h2>
                <div className="text-center py-8">
                    <p className="text-[14px] text-[#6F6C90]">Select a customer to view billing history</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-6 shadow-[0_37px_37px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-semibold text-[#0A0A0A]">Billing History</h2>
                <div className="flex items-center gap-3">
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="rounded-[8px] border border-[#DFDBE3] bg-white px-3 py-1.5 text-[13px] outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                        <option value="sent">Sent</option>
                        <option value="draft">Draft</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#401B60] border-r-transparent"></div>
                    <p className="mt-4 text-[14px] text-[#6F6C90]">Loading invoices...</p>
                </div>
            ) : invoices.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-[14px] text-[#6F6C90]">No invoices found for this customer</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-[12px] border border-[#E7E4EC]">
                        <table className="w-full border-collapse text-left">
                            <thead className="bg-[#F8F8F8] text-[13px] text-[#6F6C90]">
                                <tr className="[&>th]:px-4 [&>th]:py-3">
                                    <th>
                                        <button
                                            onClick={() => handleSort('invoiceNumber')}
                                            className="flex items-center font-semibold hover:text-[#0A0A0A] transition-colors"
                                        >
                                            Invoice Number
                                            <SortIcon field="invoiceNumber" />
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => handleSort('createdAt')}
                                            className="flex items-center font-semibold hover:text-[#0A0A0A] transition-colors"
                                        >
                                            Issue Date
                                            <SortIcon field="createdAt" />
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => handleSort('dueDate')}
                                            className="flex items-center font-semibold hover:text-[#0A0A0A] transition-colors"
                                        >
                                            Due Date
                                            <SortIcon field="dueDate" />
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => handleSort('total')}
                                            className="flex items-center font-semibold hover:text-[#0A0A0A] transition-colors"
                                        >
                                            Total Amount
                                            <SortIcon field="total" />
                                        </button>
                                    </th>
                                    <th>
                                        <button
                                            onClick={() => handleSort('status')}
                                            className="flex items-center font-semibold hover:text-[#0A0A0A] transition-colors"
                                        >
                                            Status
                                            <SortIcon field="status" />
                                        </button>
                                    </th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-[14px] text-[#0A0A0A]">
                                {invoices.map((invoice) => (
                                    <tr
                                        key={invoice._id}
                                        className="border-t border-[#F0EEF3] hover:bg-[#FBFAFD] [&>td]:px-4 [&>td]:py-3"
                                    >
                                        <td className="font-mono text-[#401B60]">{invoice.invoiceNumber}</td>
                                        <td>{formatDate(invoice.createdAt)}</td>
                                        <td>{formatDate(invoice.dueDate)}</td>
                                        <td className="font-semibold">{formatCurrency(invoice.total, invoice.currency)}</td>
                                        <td>{getStatusBadge(invoice.status)}</td>
                                        <td className="text-center">
                                            <div className="flex items-center justify-center gap-3">
                                                {/* <a
                                                    href={`/dashboard/billing?invoiceId=${invoice._id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#401B60] hover:underline text-[13px] font-medium"
                                                >
                                                    View Details
                                                </a> */}
                                                <button
                                                    onClick={() => handleDownloadPDF(invoice._id, invoice.invoiceNumber)}
                                                    disabled={downloadingInvoiceId === invoice._id}
                                                    className="flex items-center gap-1.5 rounded-[6px] border border-[#DFDBE3] bg-white px-2.5 py-1.5 text-[12px] font-medium text-[#401B60] hover:bg-[#F8F8F8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    title="Download PDF"
                                                >
                                                    {downloadingInvoiceId === invoice._id ? (
                                                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                    ) : (
                                                        <DownloadIcon />
                                                    )}
                                                    PDF
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-[13px] text-[#6F6C90]">
                                Page {page} of {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="rounded-[8px] border border-[#DFDBE3] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="rounded-[8px] border border-[#DFDBE3] bg-white px-3 py-1.5 text-[13px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
