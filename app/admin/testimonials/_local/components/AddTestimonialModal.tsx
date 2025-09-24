"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "../types";

type NewTestimonial = Omit<Testimonial, "id" | "createdAt">;

export default function AddTestimonialModal({
  open,
  plans,
  onClose,
  onCreate,
}: {
  open: boolean;
  plans: string[];
  onClose: () => void;
  onCreate: (t: NewTestimonial) => void;
}) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [plan, setPlan] = useState<string>("");
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [quote, setQuote] = useState("");
  const [published, setPublished] = useState(true);

  useEffect(() => {
    if (!open) {
      setName("");
      setLocation("");
      setPlan("");
      setRating(5);
      setAvatarUrl("");
      setQuote("");
      setPublished(true);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white p-6 shadow-2xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">Add New Testimonial</h2>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="text-[14px] text-[#6F6C90]">
          Add a customer testimonial to showcase on your website.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Customer Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="field"
            />
          </Field>

          <Field label="Location">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Sydney, NSW"
              className="field"
            />
          </Field>

          <Field label="Service Plan">
            <div className="relative">
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="field appearance-none pr-9"
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

          <Field label="Rating">
            <div className="relative">
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                className="field appearance-none pr-9"
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
                className="field"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Customer Quote">
              <textarea
                rows={4}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Enter the customer's testimonial…"
                className="field"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center justify-between rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] px-4 py-3">
              <span className="text-[14px] text-[#0A0A0A]">Publish immediately</span>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-5 w-5 accent-[#401B60]"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="h-[44px] flex-1 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] text-[14px] font-semibold text-[#6F6C90]"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              onCreate({
                name: name || "Anonymous",
                location: location || "—",
                plan: plan || undefined,
                rating,
                avatarUrl: avatarUrl || undefined,
                quote: quote || "—",
                published,
              })
            }
            className="h-[44px] flex-1 rounded-[10px] bg-[#401B60] text-[14px] font-semibold text-white"
          >
            Add Testimonial
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">{label}</label>
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
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
