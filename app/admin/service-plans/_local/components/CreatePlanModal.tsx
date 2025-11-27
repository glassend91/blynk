"use client";

import { useEffect, useMemo, useState } from "react";
import type { PlanRow, PlanType, PlanStatus } from "../types";
import apiClient from "@/lib/apiClient";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (plan: PlanRow) => void;
};

const planTypeOptions: PlanType[] = ["NBN", "Mobile", "Data Only", "Voice Only"];
const statusOptions: PlanStatus[] = ["Published", "Draft"];
const billingCycleOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];
const currencyOptions = ["AUD", "USD", "EUR", "GBP"];

const fieldClass =
  "w-full rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none placeholder-[#6F6C90]";

export default function CreatePlanModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState<PlanType>("NBN");
  const [price, setPrice] = useState("69.95");
  const [currency, setCurrency] = useState("AUD");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly" | "yearly">("monthly");
  const [speed, setSpeed] = useState("");
  const [features, setFeatures] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<PlanStatus>("Published");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setType("NBN");
      setPrice("69.95");
      setCurrency("AUD");
      setBillingCycle("monthly");
      setSpeed("");
      setFeatures("");
      setDesc("");
      setStatus("Published");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const featurePreview = useMemo(() => {
    return features
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [features]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Plan name is required.");
      return;
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setError("Enter a valid monthly price.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const payload = {
        serviceName: name.trim(),
        serviceType: type,
        price: numericPrice,
        currency,
        billingCycle,
        status,
        description: desc.trim(),
        speedOrData: speed.trim(),
        features: featurePreview,
      };

      const { data } = await apiClient.post<{ success: boolean; service: PlanRow }>("/services/admin", payload);
      if (data?.success && data.service) {
        onCreate(data.service);
        onClose();
        return;
      }
      setError("Failed to create plan. Please try again.");
    } catch (err: any) {
      setError(err?.message || "Failed to create plan. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 max-h-[95vh] w-[960px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[18px] bg-white p-6 shadow-2xl">
        <div className="mb-1 flex items-center justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[2px] text-[#6F6C90]">Plan Builder</p>
            <h2 className="text-[26px] font-extrabold text-[#0A0A0A]">Create New Service Plan</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#F3E8FF] text-[#5B2DEE]"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <p className="text-[14px] text-[#6F6C90]">
          Define how this plan appears in the catalogue. Customers will see the name, highlights, pricing, and speed/data
          headline.
        </p>

        <div className="mt-6 space-y-5">
          <SectionCard title="General details" description="Core information customers use to compare plans.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Plan name" required>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., NBN Premium 100"
                  className={fieldClass}
                />
              </Field>

              <Field label="Plan status">
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PlanStatus)}
                    className={`${fieldClass} appearance-none pr-9`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <Caret />
                </div>
              </Field>

              <Field label="Plan type">
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PlanType)}
                    className={`${fieldClass} appearance-none pr-9`}
                  >
                    {planTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <Caret />
                </div>
              </Field>

              <Field label="Monthly price" hint="Customers will see currency + billing cadence.">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="69.95"
                    className={fieldClass}
                  />
                  <div className="relative">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className={`${fieldClass} appearance-none pr-9`}
                    >
                      {currencyOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <Caret />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="relative">
                    <select
                      value={billingCycle}
                      onChange={(e) => setBillingCycle(e.target.value as "monthly" | "quarterly" | "yearly")}
                      className={`${fieldClass} appearance-none pr-9`}
                    >
                      {billingCycleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Caret />
                  </div>
                </div>
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Plan experience" description="Highlight the performance headline and key callouts.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label={type === "NBN" ? "Speed headline" : type === "Voice Only" ? "Voice minutes headline" : "Data headline"}
                hint={
                  type === "NBN"
                    ? "Examples: 100/20 Mbps, 50 Mbps"
                    : type === "Voice Only"
                      ? "Examples: Unlimited mins + SMS"
                      : "Examples: 40GB 5G data"
                }
              >
                <input
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  placeholder={type === "NBN" ? "100/20 Mbps" : type === "Voice Only" ? "Unlimited mins" : "50GB + 5G"}
                  className={fieldClass}
                />
              </Field>

              <Field label="Feature highlights" hint="Separate by comma or new line.">
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Unlimited data, No lock-in contract, Free modem"
                  rows={3}
                  className={fieldClass}
                />
                {featurePreview.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {featurePreview.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full bg-[#F3E8FF] px-3 py-1 text-[12px] font-semibold text-[#5B2DEE]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </Field>
            </div>

            <Field label="Plan description" hint="What makes this plan perfect for your customers?">
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                placeholder="e.g., Optimised for households that stream, work, and game simultaneously."
                className={fieldClass}
              />
            </Field>
          </SectionCard>
        </div>

        {error && (
          <div className="mt-4 rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <button
            onClick={onClose}
            className="h-[46px] flex-1 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F1EEF8]"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="h-[46px] flex-1 rounded-[10px] bg-[#401B60] text-[14px] font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create plan"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-[#E7E4EC] bg-[#FBFBFD] p-4">
      <div className="mb-4">
        <h3 className="text-[16px] font-semibold text-[#0A0A0A]">{title}</h3>
        <p className="text-[13px] text-[#6F6C90]">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
  required,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0A0A0A]">
        {label}
        {required && <span className="text-[#E0342F]">*</span>}
      </label>
      {children}
      {hint && <p className="text-[12px] text-[#8E8CA2]">{hint}</p>}
    </div>
  );
}

function Caret() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6C90]"
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
