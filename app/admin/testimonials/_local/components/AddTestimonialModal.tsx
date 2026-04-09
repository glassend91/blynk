"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "../types";
import apiClient from "@/lib/apiClient";

type NewTestimonial = Omit<Testimonial, "id" | "createdAt">;

const fieldClass =
  "w-full rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none placeholder-[#6F6C90] focus:border-[#6A1D99]";

export default function AddTestimonialModal({
  open,
  plans,
  onClose,
  onCreate,
  onUpdate,
  editingTestimonial,
}: {
  open: boolean;
  plans: string[];
  onClose: () => void;
  onCreate?: (t: Testimonial) => void;
  onUpdate?: (t: Testimonial) => void;
  editingTestimonial?: Testimonial | null;
}) {
  const isEditMode = !!editingTestimonial;

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [plan, setPlan] = useState<string>("");
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [quote, setQuote] = useState("");
  const [published, setPublished] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (isEditMode && editingTestimonial) {
        setName(editingTestimonial.name || "");
        setLocation(editingTestimonial.location || "");
        setPlan(editingTestimonial.plan || "");
        setRating(editingTestimonial.rating || 5);
        setAvatarUrl(editingTestimonial.avatarUrl || "");
        setQuote(editingTestimonial.quote || "");
        setPublished(editingTestimonial.published ?? true);
      } else {
        setName("");
        setLocation("");
        setPlan("");
        setRating(5);
        setAvatarUrl("");
        setQuote("");
        setPublished(true);
      }
      setError(null);
      setSubmitting(false);
    }
  }, [open, isEditMode, editingTestimonial]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Customer name is required.");
      return;
    }
    if (!location.trim()) {
      setError("Location is required.");
      return;
    }
    if (!quote.trim()) {
      setError("Customer quote is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const testimonialData = {
        name: name.trim(),
        location: location.trim(),
        plan: plan.trim() || undefined,
        rating,
        avatarUrl: avatarUrl.trim() || undefined,
        quote: quote.trim(),
        published,
      };

      if (isEditMode && editingTestimonial) {
        const { data } = await apiClient.put<{
          success: boolean;
          data: Testimonial;
        }>(`/testimonials/${editingTestimonial.id}`, testimonialData);

        if (data?.success && data.data) {
          onUpdate?.(data.data);
          onClose();
          return;
        }
        setError("Failed to update testimonial. Please try again.");
      } else {
        const { data } = await apiClient.post<{
          success: boolean;
          data: Testimonial;
        }>("/testimonials", testimonialData);

        if (data?.success && data.data) {
          onCreate?.(data.data);
          onClose();
          return;
        }
        setError("Failed to create testimonial. Please try again.");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to save testimonial. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed z-[90]"
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        overflow: "auto",
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
          width: "100vw",
          height: "100vh",
          zIndex: 90,
        }}
      />
      <div
        className="fixed left-1/2 top-1/2 max-h-[95vh] w-[880px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[14px] bg-white p-6 shadow-2xl"
        style={{ zIndex: 91 }}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">
            {isEditMode ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F] hover:bg-[#FFE0E0]"
            aria-label="Close"
            disabled={submitting}
          >
            ×
          </button>
        </div>

        <p className="text-[14px] text-[#6F6C90]">
          {isEditMode
            ? "Update the customer testimonial information."
            : "Add a customer testimonial to showcase on your website."}
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Customer Name" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className={fieldClass}
              disabled={submitting}
            />
          </Field>

          <Field label="Location" required>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Sydney, NSW"
              className={fieldClass}
              disabled={submitting}
            />
          </Field>

          <Field label="Service Plan">
            <div className="relative">
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className={`${fieldClass} appearance-none pr-9`}
                disabled={submitting}
              >
                <option value="">Select plan</option>
                {plans.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <Caret />
            </div>
          </Field>

          <Field label="Rating" required>
            <div className="relative">
              <select
                value={rating}
                onChange={(e) =>
                  setRating(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)
                }
                className={`${fieldClass} appearance-none pr-9`}
                disabled={submitting}
              >
                <option value={5}>5</option>
                <option value={4}>4</option>
                <option value={3}>3</option>
                <option value={2}>2</option>
                <option value={1}>1</option>
              </select>
              <Caret />
            </div>
          </Field>

          <div className="md:col-span-2">
            <Field label="Avatar URL (optional)">
              <input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className={fieldClass}
                disabled={submitting}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Customer Quote" required>
              <textarea
                rows={4}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Enter the customer's testimonial…"
                className={fieldClass}
                disabled={submitting}
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center justify-between rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3">
              <span className="text-[14px] text-[#0A0A0A]">
                Publish immediately
              </span>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-5 w-5 accent-[#401B60]"
                disabled={submitting}
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="h-[44px] flex-1 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F1EEF8]"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="h-[44px] flex-1 rounded-[10px] bg-[#401B60] text-[14px] font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Testimonial"
                : "Add Testimonial"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">
        {label}
        {required && <span className="ml-1 text-[#E0342F]">*</span>}
      </label>
      {children}
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
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
