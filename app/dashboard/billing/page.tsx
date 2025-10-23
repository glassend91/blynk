'use client';

import { useState, useEffect } from 'react';
import Panel from "../Panel";
import { Pill } from "../Pill";
import {
  getBillingSummary,
  getInvoices,
  getCurrentMonthCharges,
  downloadInvoice,
  type BillingSummary,
  type Invoice,
  type CurrentMonthCharges
} from "../../../lib/services/billing";

export default function Billing() {
  const [billingSummary, setBillingSummary] = useState<BillingSummary | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentMonthCharges, setCurrentMonthCharges] = useState<CurrentMonthCharges | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryData, invoicesData, chargesData] = await Promise.all([
        getBillingSummary(),
        getInvoices({ limit: 5 }),
        getCurrentMonthCharges()
      ]);

      setBillingSummary(summaryData);
      setInvoices(invoicesData.invoices);
      setCurrentMonthCharges(chargesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      setDownloadingInvoice(invoiceId);
      const result = await downloadInvoice(invoiceId);
      // In a real implementation, you would trigger the download here
      console.log('Download URL:', result.downloadUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download invoice');
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const getStatusTone = (status: string) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'overdue':
        return 'red';
      case 'sent':
        return 'yellow';
      case 'draft':
        return 'grey';
      case 'cancelled':
        return 'grey';
      default:
        return 'grey';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading billing information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }
  return (
    <>
      <h1 className="mb-6 text-[26px] font-bold text-[#0A0A0A]">Billing & Invoices</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Current Balance */}
        <Panel className="p-6">
          <div className="text-[14px] font-semibold text-[#0A0A0A]">Current Balance</div>
          <div className="mt-3 text-[28px] font-extrabold text-[#0A0A0A]">
            {billingSummary ? formatCurrency(billingSummary.currentBalance) : '$0.00'}
          </div>
          <div className="text-[13px] text-[#6F6C90]">
            {billingSummary && billingSummary.currentBalance > 0 ? 'Outstanding balance' : 'No outstanding balance'}
          </div>
        </Panel>

        {/* Next Bill Date */}
        <Panel className="p-6">
          <div className="text-[14px] font-semibold text-[#0A0A0A]">Next Bill Date</div>
          <div className="mt-3 text-[22px] font-bold text-[#0A0A0A]">
            {billingSummary ? formatDate(billingSummary.nextBillingDate) : 'N/A'}
          </div>
          <div className="text-[13px] text-[#6F6C90]">
            {billingSummary ? billingSummary.billingAccount.status : 'Active'}
          </div>
        </Panel>

        {/* Monthly Amount */}
        <Panel className="p-6">
          <div className="text-[14px] font-semibold text-[#0A0A0A]">Monthly Amount</div>
          <div className="mt-3 text-[22px] font-bold text-[#0A0A0A]">
            {billingSummary ? formatCurrency(billingSummary.monthlyAmount) : '$0.00'}
          </div>
          <div className="text-[13px] text-[#6F6C90]">
            {billingSummary?.billingAccount.autoPayEnabled ? 'Auto-pay enabled' : 'Manual payment'}
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <Panel className="col-span-2 p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[16px] font-semibold text-[#0A0A0A]">Recent Invoices</div>
            <button className="rounded-[10px] border border-[#D9D4E5] px-3 py-1.5 text-[12px] font-semibold text-[#3F205F]">View All</button>
          </div>
          <div className="space-y-3">
            {invoices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No invoices found.
              </div>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice._id} className="flex items-center justify-between rounded-[12px] border border-[#EEEAF4] bg-[#FAFAFD] px-4 py-3">
                  <div>
                    <div className="text-[14px] font-semibold text-[#0A0A0A]">{invoice.invoiceNumber}</div>
                    <div className="text-[12px] text-[#6F6C90]">
                      {formatDate(invoice.billingPeriod.startDate)} • {invoice.lineItems.map(item => item.description).join(', ')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-[14px] font-semibold text-[#0A0A0A]">{formatCurrency(invoice.total)}</div>
                    <Pill tone={getStatusTone(invoice.status) as any}>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</Pill>
                    <button
                      onClick={() => handleDownloadInvoice(invoice._id)}
                      disabled={downloadingInvoice === invoice._id}
                      className="rounded-[8px] border border-[#D9D4E5] px-2.5 py-1 text-[12px] text-[#3F205F] hover:bg-gray-50 disabled:opacity-50"
                    >
                      {downloadingInvoice === invoice._id ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Panel>

        {/* Current Month Charges */}
        <Panel className="p-6">
          <div className="text-[16px] font-semibold text-[#0A0A0A]">Current Month Charges</div>
          <div className="mt-3 divide-y divide-[#EEEAF4] text-[14px]">
            {currentMonthCharges ? (
              <>
                {currentMonthCharges.lineItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="text-[#0A0A0A]">{item.description}</div>
                    <div className="text-[#0A0A0A]">{formatCurrency(item.amount)}</div>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2">
                  <div className="text-[#0A0A0A]">Subtotal</div>
                  <div className="text-[#0A0A0A]">{formatCurrency(currentMonthCharges.subtotal)}</div>
                </div>
                {currentMonthCharges.discount > 0 && (
                  <div className="flex items-center justify-between py-2">
                    <div className="text-[#0A0A0A]">Bundle Discount</div>
                    <div className="text-[#0A0A0A] text-green-600">-{formatCurrency(currentMonthCharges.discount)}</div>
                  </div>
                )}
                <div className="flex items-center justify-between py-2">
                  <div className="text-[#0A0A0A]">GST (10%)</div>
                  <div className="text-[#0A0A0A]">{formatCurrency(currentMonthCharges.tax)}</div>
                </div>
                <div className="flex items-center justify-between pt-3 font-semibold">
                  <div>Total</div>
                  <div>{formatCurrency(currentMonthCharges.total)}</div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No charges for current month.
              </div>
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}
