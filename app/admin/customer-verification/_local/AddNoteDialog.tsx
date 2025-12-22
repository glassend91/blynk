'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

type Customer = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
};

const noteTypes = ['General', 'Billing', 'Technical', 'Account', 'Verification', 'Other'];
const priorities = ['Low', 'Medium', 'High', 'Urgent'];

export function AddNoteDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
}) {
  const [customerId, setCustomerId] = useState('');
  const [noteType, setNoteType] = useState('');
  const [priority, setPriority] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isCritical, setIsCritical] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCustomers();
    } else {
      // Reset form when closed
      setCustomerId('');
      setNoteType('');
      setPriority('');
      setContent('');
      setTags('');
      setIsCritical(false);
      setSearchQuery('');
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const { data } = await apiClient.get<{ success: boolean; users: Customer[] }>('/auth/users');

      if (data?.success && data.users) {
        setCustomers(data.users);
      }
    } catch (err: any) {
      console.error('Failed to fetch customers:', err);
      // Continue without customers list - user can enter ID manually
    } finally {
      setLoadingCustomers(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!customerId.trim()) {
      setError('Customer is required');
      return;
    }

    if (!content.trim()) {
      setError('Note content is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const { data } = await apiClient.post<{ success: boolean; message: string }>(
        '/customer-verification/notes',
        {
          customerId: customerId.trim(),
          noteType: noteType || 'General',
          priority: priority || 'Medium',
          content: content.trim(),
          tags: tagsArray.length > 0 ? tagsArray : undefined,
          isCritical: isCritical,
        }
      );

      if (data?.success) {
        onSuccess?.();
        onOpenChange(false);
      } else {
        setError('Failed to save note. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save note. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
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
    }
  }, [open]);

  return (
    <div
      className="fixed z-[80]"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Backdrop */}
      <div
        className="fixed bg-black/70"
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange(false);
        }}
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 80
        }}
      />

      {/* Modal */}
      <div
        className="fixed z-[81] w-full max-w-[780px] rounded-2xl bg-white p-6 shadow-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[22px] font-bold text-[#0A0A0A]">Add Customer Note</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenChange(false);
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F4FB] hover:bg-[#F0EDF5]"
            aria-label="Close"
            disabled={submitting}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path d="m6 6 12 12M6 18 18 6" stroke="#DD3B3B" strokeWidth="1.7" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
              Customer <span className="text-[#E0342F]">*</span>
            </label>
            <CustomerSelect
              customers={filteredCustomers}
              value={customerId}
              onChange={setCustomerId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              loading={loadingCustomers}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">Note Type</label>
            <Select
              options={noteTypes}
              value={noteType}
              onChange={setNoteType}
              placeholder="Select type"
              disabled={submitting}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">Priority</label>
            <Select
              options={priorities}
              value={priority}
              onChange={setPriority}
              placeholder="Select priority"
              disabled={submitting}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
              Note Content <span className="text-[#E0342F]">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Enter detailed note about the customer interaction..."
              className="w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] p-3 text-[14px] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
              disabled={submitting}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-[13px] font-semibold text-[#6F6C90]">
              Tags (comma separated)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., Billing, Technical, Resolved"
              className="w-full rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-[14px] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
              disabled={submitting}
            />
          </div>
          <div className="md:col-span-2 flex items-start gap-3">
            <input
              type="checkbox"
              id="isCriticalDialog"
              checked={isCritical}
              onChange={(e) => setIsCritical(e.target.checked)}
              className="h-4 w-4 accent-[#401B60] mt-0.5 flex-shrink-0"
              disabled={submitting}
            />
            <label htmlFor="isCriticalDialog" className="text-[13px] sm:text-[14px] text-[#0A0A0A] cursor-pointer leading-relaxed">
              Critical Note (pinned to top, highlighted in red)
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="rounded-md bg-[#F1EEF6] px-5 py-3 text-[14px] font-semibold text-[#401B60] hover:bg-[#E7D4FF] disabled:opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              onOpenChange(false);
            }}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-[#401B60] px-5 py-3 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              handleSubmit();
            }}
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CustomerSelect({
  customers,
  value,
  onChange,
  searchQuery,
  onSearchChange,
  loading,
  disabled,
}: {
  customers: Customer[];
  value: string;
  onChange: (v: string) => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  loading: boolean;
  disabled: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  const selectedCustomer = customers.find((c) => c.userId === value);

  const filteredCustomers = customers.filter(
    (c) =>
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${c.name || (c.firstName + ' ' + c.lastName)}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedCustomer) {
      setInputValue(`${selectedCustomer.name || (selectedCustomer.firstName + ' ' + selectedCustomer.lastName)} (${selectedCustomer.email})`);
    } else if (value && !selectedCustomer) {
      setInputValue(value); // Allow manual entry of customer ID
    } else {
      setInputValue('');
    }
  }, [value, selectedCustomer]);

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue || searchQuery}
        onChange={(e) => {
          setInputValue(e.target.value);
          onSearchChange(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search customer or enter ID"
        className="flex w-full items-center justify-between rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-left text-[14px] text-[#0A0A0A] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
        disabled={disabled}
      />
      {open && (
        <>
          <div
            className="fixed inset-0 z-[70]"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div
            className="absolute z-[90] mt-2 max-h-60 w-full overflow-auto rounded-lg border border-[#EEEAF4] bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {loading ? (
              <div className="px-4 py-2 text-[14px] text-[#6F6C90]">Loading...</div>
            ) : filteredCustomers.length === 0 ? (
              <div className="px-4 py-2 text-[14px] text-[#6F6C90]">
                {searchQuery ? 'No customers found' : 'Start typing to search'}
              </div>
            ) : (
              filteredCustomers.map((c) => (
                <button
                  key={c.userId}
                  className="block w-full px-4 py-2 text-left text-[14px] hover:bg-[#F7F4FB]"
                  onClick={() => {
                    onChange(c.userId);
                    setOpen(false);
                    setInputValue(`${c.name || (c.firstName + ' ' + c.lastName)} (${c.email})`);
                    onSearchChange('');
                  }}
                >
                  {c.name || (c.firstName + ' ' + c.lastName)} ({c.email})
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Select({
  options,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className="flex w-full items-center justify-between rounded-lg border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3 text-left text-[14px] text-[#0A0A0A] outline-none disabled:opacity-50"
      >
        <span className={value ? 'text-[#0A0A0A]' : 'text-[#A39FB8]'}>
          {value || placeholder}
        </span>
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path d="m6 9 6 6 6-6" stroke="#6F6C90" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[70]"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div
            className="absolute z-[90] mt-2 w-full overflow-hidden rounded-lg border border-[#EEEAF4] bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((o) => (
              <button
                key={o}
                className="block w-full px-4 py-2 text-left text-[14px] hover:bg-[#F7F4FB]"
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
              >
                {o}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
