'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

const serviceTypes = ['NBN', 'Mobile', 'Data Only', 'Voice Only'];
const billingCycles = ['monthly', 'quarterly', 'yearly'];
const currencies = ['AUD', 'USD', 'EUR', 'GBP'];
const statuses = ['Published', 'Draft'];

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onSuccess?: () => void;
};

export default function AddServiceModal({ open, onOpenChange, onSuccess }: Props) {
    const [serviceName, setServiceName] = useState('');
    const [serviceType, setServiceType] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('AUD');
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [status, setStatus] = useState('Published');
    const [description, setDescription] = useState('');
    const [speedOrData, setSpeedOrData] = useState('');
    const [features, setFeatures] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [selectOpen, setSelectOpen] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            // Reset form when closed
            setServiceName('');
            setServiceType('');
            setPrice('');
            setCurrency('AUD');
            setBillingCycle('monthly');
            setStatus('Published');
            setDescription('');
            setSpeedOrData('');
            setFeatures('');
            setError(null);
            setSubmitting(false);
            setSelectOpen(null);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!serviceName.trim()) {
            setError('Service name is required');
            return;
        }

        if (!serviceType) {
            setError('Service type is required');
            return;
        }

        const priceNum = parseFloat(price);
        if (!price || isNaN(priceNum) || priceNum < 0) {
            setError('Valid price is required');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const featuresArray = features
                .split(',')
                .map((f) => f.trim())
                .filter(Boolean);

            const { data } = await apiClient.post<{ success: boolean; message?: string }>(
                '/services/admin',
                {
                    serviceName: serviceName.trim(),
                    serviceType,
                    price: priceNum,
                    currency,
                    billingCycle,
                    status,
                    description: description.trim() || undefined,
                    speedOrData: speedOrData.trim() || undefined,
                    features: featuresArray.length > 0 ? featuresArray : undefined,
                }
            );

            if (data?.success) {
                onSuccess?.();
                onOpenChange(false);
            } else {
                setError('Failed to create service plan. Please try again.');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to create service plan. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!open) return null;

    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="fixed bg-black/60 backdrop-blur-sm z-[100]"
                onClick={handleClose}
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    height: '100vh'
                }}
            />
            <div
                className="fixed z-[101] w-full max-w-[940px] rounded-[16px] bg-white p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <div className="mb-4 sm:mb-5 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-[20px] sm:text-[24px] md:text-[26px] font-bold text-[#0A0A0A]">Create Service Plan</h3>
                        <p className="mt-1 text-[12px] sm:text-[14px] text-[#6F6C90]">
                            Create a new service plan that customers can subscribe to
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
                        <div className="md:col-span-2">
                            <Field label="Service Name" required>
                                <input
                                    type="text"
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    placeholder="e.g., NBN Premium 100, Mobile 20GB"
                                    className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-2.5 sm:py-[11px] text-[13px] sm:text-[14px] text-[#0A0A0A] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
                                    disabled={submitting}
                                    required
                                />
                            </Field>
                        </div>

                        <Field label="Service Type" required>
                            <Select
                                options={serviceTypes}
                                value={serviceType}
                                onChange={setServiceType}
                                placeholder="Select service type"
                                disabled={submitting}
                                open={selectOpen === 'serviceType'}
                                onOpenChange={(open) => setSelectOpen(open ? 'serviceType' : null)}
                            />
                        </Field>

                        <Field label="Billing Cycle" required>
                            <Select
                                options={billingCycles}
                                value={billingCycle}
                                onChange={setBillingCycle}
                                placeholder="Select billing cycle"
                                disabled={submitting}
                                open={selectOpen === 'billingCycle'}
                                onOpenChange={(open) => setSelectOpen(open ? 'billingCycle' : null)}
                            />
                        </Field>

                        <Field label="Price" required>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0.00"
                                className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-2.5 sm:py-[11px] text-[13px] sm:text-[14px] text-[#0A0A0A] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
                                disabled={submitting}
                                required
                            />
                        </Field>

                        <Field label="Currency">
                            <Select
                                options={currencies}
                                value={currency}
                                onChange={setCurrency}
                                placeholder="Select currency"
                                disabled={submitting}
                                open={selectOpen === 'currency'}
                                onOpenChange={(open) => setSelectOpen(open ? 'currency' : null)}
                            />
                        </Field>

                        <Field label="Status">
                            <Select
                                options={statuses}
                                value={status}
                                onChange={setStatus}
                                placeholder="Select status"
                                disabled={submitting}
                                open={selectOpen === 'status'}
                                onOpenChange={(open) => setSelectOpen(open ? 'status' : null)}
                            />
                        </Field>

                        <div className="md:col-span-2">
                            <Field label="Speed or Data Allowance">
                                <input
                                    type="text"
                                    value={speedOrData}
                                    onChange={(e) => setSpeedOrData(e.target.value)}
                                    placeholder="e.g., 100/40 Mbps (NBN) or 20GB (Mobile)"
                                    className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-2.5 sm:py-[11px] text-[13px] sm:text-[14px] text-[#0A0A0A] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
                                    disabled={submitting}
                                />
                            </Field>
                        </div>

                        <div className="md:col-span-2">
                            <Field label="Description">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    placeholder="Enter service description..."
                                    className="w-full resize-none rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] p-2.5 sm:p-3 text-[13px] sm:text-[14px] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
                                    disabled={submitting}
                                />
                            </Field>
                        </div>

                        <div className="md:col-span-2">
                            <Field label="Features (comma separated)">
                                <input
                                    type="text"
                                    value={features}
                                    onChange={(e) => setFeatures(e.target.value)}
                                    placeholder="e.g., Unlimited data, 24/7 support, Free installation"
                                    className="w-full rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-3 py-2.5 sm:py-[11px] text-[13px] sm:text-[14px] text-[#0A0A0A] outline-none placeholder:text-[#A39FB8] disabled:opacity-50"
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
                            {submitting ? 'Creating...' : 'Create Service Plan'}
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
                        onMouseDown={(e) => e.stopPropagation()}
                    />
                    <div
                        className="absolute z-[102] mt-2 w-full overflow-hidden rounded-lg border border-[#EEEAF4] bg-white shadow-lg max-h-[40vh] sm:max-h-[300px] overflow-y-auto"
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
