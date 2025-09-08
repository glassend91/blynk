"use client";

import { useMemo, useState } from "react";
import { seedTestimonials, servicePlans } from "./_local/data";
import type { Testimonial } from "./_local/types";
import TestimonialCard from "./_local/components/TestimonialCard";
import AddTestimonialModal from "./_local/components/AddTestimonialModal";

export default function TestimonialsPage() {
  const [rows, setRows] = useState<Testimonial[]>(seedTestimonials);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.quote.toLowerCase().includes(q) ||
        (r.plan || "").toLowerCase().includes(q)
    );
  }, [rows, query]);

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold leading-[28px] text-[#0A0A0A]">
            Customer Testimonials
          </h1>
          <p className="text-[16px] leading-[21px] text-[#6F6C90]">
            Manage customer reviews and testimonials for your website
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="h-[40px] rounded-[8px] bg-[#401B60] px-4 text-[14px] font-semibold text-white"
        >
          Add Testimonial
        </button>
      </header>

      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-5">
        <div className="mb-4 flex w-full max-w-[380px] items-center gap-3 rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 20 21" fill="none">
            <path d="M9.6 18c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8Z" stroke="#292D32" strokeWidth="1.5" />
            <path d="m18.3 18.8-1.7-1.7" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search testimonials…"
            className="w-full bg-transparent text-[14px] text-[#0A0A0A] placeholder-[#6F6C90] outline-none"
          />
        </div>

        <div className="space-y-5">
          {filtered.map((t) => (
            <TestimonialCard
              key={t.id}
              t={t}
              onEdit={() => setOpen(true)} // placeholder; wire to edit modal if needed
              onDelete={() => setRows((prev) => prev.filter((r) => r.id !== t.id))}
            />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-[12px] border border-[#E7E4EC] p-8 text-center text-[14px] text-[#6F6C90]">
              No testimonials found.
            </div>
          )}
        </div>
      </div>

      <AddTestimonialModal
        open={open}
        plans={servicePlans}
        onClose={() => setOpen(false)}
        onCreate={(data) => {
          setRows((prev) => [
            {
              id: prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1,
              createdAt: new Date().toISOString(),
              ...data,
            },
            ...prev,
          ]);
          setOpen(false);
        }}
      />
    </section>
  );
}
