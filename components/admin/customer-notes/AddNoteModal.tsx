'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

type Customer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

const noteTypes = ['General', 'Billing', 'Technical', 'Account', 'Verification', 'Other'];
const priorities = ['Low', 'Medium', 'High', 'Urgent'];

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess?: () => void;
};

export default function AddNoteModal({ open, onOpenChange, onSuccess }: Props) {
  const [customerId, setCustomerId] = useState('');
  const [noteType, setNoteType] = useState('');
  const [priority, setPriority] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [selectOpen, setSelectOpen] = useState<string | null>(null);

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
      setSearchQuery('');
      setError(null);
      setSubmitting(false);
      setSelectOpen(null);
    }
  }, [open]);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const { data } = await apiClient.get<{ success: boolean; users: any[] }>('/auth/users');

      if (data?.users) {
        // Filter customers and map to Customer type
        const customerList = data.users
          .filter((user: any) => user.role?.toLowerCase() === 'customer')
          .map((user: any) => {
            // Ensure ID is always a string
            const userId = user.userId || user.id;
            return {
              id: userId ? String(userId) : '',
              email: user.email || '',
              firstName: user.name?.split(' ')[0] || user.firstName || '',
              lastName: user.name?.split(' ')[1] || user.lastName || '',
            };
          })
          .filter((c: Customer) => c.id && c.email); // Only include valid customers
        setCustomers(customerList);
      }
    } catch (err: any) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Customer filtering is now handled inside CustomerSelect component

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure customerId is a string and validate
    const customerIdStr = typeof customerId === 'string' ? customerId.trim() : String(customerId || '').trim();

    if (!customerIdStr) {
      setError('Customer is required');
      return;
    }

    const contentStr = typeof content === 'string' ? content.trim() : String(content || '').trim();
    if (!contentStr) {
      setError('Note content is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const tagsArray = typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const { data } = await apiClient.post<{ success: boolean; message: string }>(
        '/customer-verification/notes',
        {
          customerId: customerIdStr,
          noteType: noteType || 'General',
          priority: priority || 'Medium',
          content: contentStr,
          tags: tagsArray.length > 0 ? tagsArray : undefined,
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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking directly on backdrop, not on modal content
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        onClick={handleClose}
      />
      <div
        className="relative z-[101] w-full max-w-[940px] rounded-[16px] bg-white p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 sm:mb-5 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-[20px] sm:text-[24px] md:text-[26px] font-bold text-[#0A0A0A]">Add Customer Note</h3>
            <p className="mt-1 text-[12px] sm:text-[14px] text-[#6F6C90]">
              Record a new interaction or note for a customer.
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClose();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex-shrink-0 grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full bg-[#FEECEC] text-[#E54343] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
            aria-label="Close"
            disabled={submitting}
          >
            <span className="text-[16px] sm:text-[18px]">✕</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
            <Field label="Customer" required>
              <CustomerSelect
                customers={customers}
                value={customerId}
                onChange={setCustomerId}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                loading={loadingCustomers}
                disabled={submitting}
                open={selectOpen === 'customer'}
                onOpenChange={(open) => setSelectOpen(open ? 'customer' : null)}
              />
            </Field>
            <Field label="Note Type">
              <Select
                options={noteTypes}
                value={noteType}
                onChange={setNoteType}
                placeholder="Select type"
                disabled={submitting}
                open={selectOpen === 'noteType'}
                onOpenChange={(open) => setSelectOpen(open ? 'noteType' : null)}
              />
            </Field>
            <Field label="Priority">
              <Select
                options={priorities}
                value={priority}
                onChange={setPriority}
                placeholder="Select priority"
                disabled={submitting}
                open={selectOpen === 'priority'}
                onOpenChange={(open) => setSelectOpen(open ? 'priority' : null)}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Note Content" required>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-2.5 sm:p-3 text-[13px] sm:text-[14px] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
                  placeholder="Enter detailed note about the customer interaction..."
                  disabled={submitting}
                  required
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Tags (comma separated)">
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., Billing, Technical, Resolved"
                  className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-2.5 sm:py-[11px] text-[13px] sm:text-[14px] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
                  disabled={submitting}
                />
              </Field>
            </div>
          </div>

          {error && (
            <div className="mt-3 sm:mt-4 rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-3 sm:px-4 py-2 sm:py-3 text-[12px] sm:text-[13px] text-[#C53030]">
              {error}
            </div>
          )}

          <div className="mt-4 sm:mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-full sm:w-auto rounded-[10px] border border-[#DFDBE3] bg-white px-4 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-[16px] text-[#0A0A0A] hover:bg-[#F8F8F8] disabled:opacity-50 cursor-pointer"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto rounded-[10px] bg-[#401B60] px-4 sm:px-6 py-2.5 sm:py-3 text-[14px] sm:text-[16px] font-semibold text-white hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, required }: React.PropsWithChildren<{ label: string; required?: boolean }>) {
  return (
    <label className="block">
      <div className="mb-1.5 sm:mb-2 text-[12px] sm:text-[14px] font-medium text-[#0A0A0A]">
        {label}
        {required && <span className="ml-1 text-[#E0342F]">*</span>}
      </div>
      {children}
    </label>
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
  open,
  onOpenChange,
}: {
  customers: Customer[];
  value: string;
  onChange: (v: string) => void;
  searchQuery: string;
  onSearchChange: (v: string) => void;
  loading: boolean;
  disabled: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [dropdownSearch, setDropdownSearch] = useState('');
  const dropdownInputRef = React.useRef<HTMLInputElement>(null);

  // Ensure value is a string for comparison
  const valueStr = String(value || '');
  const selectedCustomer = customers.find((c) => String(c.id) === valueStr);

  // Filter customers based on dropdown search query
  const filteredCustomers = React.useMemo(() => {
    if (!dropdownSearch.trim()) {
      return customers.slice(0, 50); // Show first 50 if no search
    }
    const query = dropdownSearch.toLowerCase();
    return customers.filter(
      (c) =>
        c.email.toLowerCase().includes(query) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query)
    );
  }, [customers, dropdownSearch]);

  // Display value: show selected customer name
  const displayValue = React.useMemo(() => {
    if (selectedCustomer) {
      const firstName = selectedCustomer.firstName || '';
      const lastName = selectedCustomer.lastName || '';
      const name = `${firstName} ${lastName}`.trim() || 'Customer';
      return `${name} (${selectedCustomer.email})`;
    }
    if (value && !selectedCustomer) {
      return value; // Allow manual ID entry
    }
    return '';
  }, [selectedCustomer, value]);

  const handleInputFocus = () => {
    onOpenChange(true);
    // Focus dropdown search input after a brief delay
    setTimeout(() => {
      dropdownInputRef.current?.focus();
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // If user is typing and no customer is selected, treat as manual ID entry
    if (!selectedCustomer) {
      // Ensure it's a string
      onChange(String(newValue || ''));
    }
    // Open dropdown to show search
    if (!open) {
      onOpenChange(true);
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    // Ensure customer ID is always a string
    const customerIdStr = String(customer.id || '');
    if (customerIdStr) {
      onChange(customerIdStr);
      setDropdownSearch(''); // Clear dropdown search
      onSearchChange(''); // Clear main search query
      onOpenChange(false);
    }
  };

  // Reset dropdown search when dropdown closes
  React.useEffect(() => {
    if (!open) {
      setDropdownSearch('');
    }
  }, [open]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Select customer or enter ID"
          className="flex w-full items-center justify-between rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-2.5 sm:py-[11px] text-left text-[13px] sm:text-[14px] text-[#0A0A0A] outline-none placeholder:text-[#6F6C90] disabled:opacity-50"
          disabled={disabled}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="#6F6C90" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[98]"
            onClick={(e) => {
              e.stopPropagation();
              // This backdrop only closes the dropdown, not the modal
              onOpenChange(false);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              // Prevent modal backdrop from receiving the click
            }}
          />
          <div
            data-customer-dropdown
            className="absolute z-[102] mt-2 w-full rounded-lg border border-[#EEEAF4] bg-white shadow-lg overflow-hidden max-h-[60vh] sm:max-h-[400px] flex flex-col"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            {/* Search input in dropdown */}
            <div className="p-2 border-b border-[#EEEAF4] flex-shrink-0">
              <div className="relative">
                <svg
                  className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#6F6C90]"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M9.58464 18.0003C13.9569 18.0003 17.5013 14.4559 17.5013 10.0837C17.5013 5.7114 13.9569 2.16699 9.58464 2.16699C5.21238 2.16699 1.66797 5.7114 1.66797 10.0837C1.66797 14.4559 5.21238 18.0003 9.58464 18.0003Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.3346 18.8337L16.668 17.167"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  ref={dropdownInputRef}
                  type="text"
                  value={dropdownSearch}
                  onChange={(e) => {
                    e.stopPropagation();
                    setDropdownSearch(e.target.value);
                  }}
                  placeholder="Search customers..."
                  className="w-full rounded-[8px] border border-[#DFDBE3] bg-[#F8F8F8] pl-8 sm:pl-9 pr-2 sm:pr-3 py-1.5 sm:py-2 text-[13px] sm:text-[14px] text-[#0A0A0A] outline-none placeholder:text-[#6F6C90] focus:border-[#401B60] focus:bg-white"
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Customer list */}
            <div className="overflow-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {loading ? (
                <div className="px-3 sm:px-4 py-6 sm:py-8 text-center text-[13px] sm:text-[14px] text-[#6F6C90]">
                  Loading customers...
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="px-3 sm:px-4 py-6 sm:py-8 text-center text-[12px] sm:text-[14px] text-[#6F6C90]">
                  {dropdownSearch.trim()
                    ? 'No customers found. You can enter a customer ID manually in the input above.'
                    : 'No customers available'}
                </div>
              ) : (
                filteredCustomers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left hover:bg-[#F7F4FB] focus:bg-[#F7F4FB] focus:outline-none transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleSelectCustomer(c);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectCustomer(c);
                    }}
                  >
                    <div className="font-medium text-[13px] sm:text-[14px] text-[#0A0A0A]">
                      {`${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Customer'}
                    </div>
                    <div className="text-[11px] sm:text-[12px] text-[#6F6C90] mt-0.5 break-words">{c.email}</div>
                  </button>
                ))
              )}
            </div>
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
  open,
  onOpenChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const handleSelect = (option: string) => {
    onChange(option);
    onOpenChange(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onOpenChange(!open);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        disabled={disabled}
        className="flex w-full items-center justify-between rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-2.5 sm:py-[11px] text-left text-[13px] sm:text-[14px] disabled:opacity-50"
      >
        <span className={value ? 'text-[#0A0A0A]' : 'text-[#6F6C90]'}>{value || placeholder}</span>
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
          <path d="M4 6l4 4 4-4" stroke="#6F6C90" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[98]"
            onClick={(e) => {
              e.stopPropagation();
              onOpenChange(false);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          />
          <div
            className="absolute z-[102] mt-2 w-full overflow-hidden rounded-lg border border-[#EEEAF4] bg-white shadow-lg max-h-[40vh] sm:max-h-[300px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onClick={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          >
            {options.map((o) => (
              <button
                key={o}
                type="button"
                className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-[13px] sm:text-[14px] hover:bg-[#F7F4FB] focus:bg-[#F7F4FB] focus:outline-none transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(o);
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(o);
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
