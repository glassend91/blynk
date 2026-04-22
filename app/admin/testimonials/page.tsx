"use client";

import { useEffect, useMemo, useState } from "react";
import type { Testimonial } from "./_local/types";
import TestimonialCard from "./_local/components/TestimonialCard";
import AddTestimonialModal from "./_local/components/AddTestimonialModal";
import apiClient from "@/lib/apiClient";

export default function TestimonialsPage() {
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [plans, setPlans] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch testimonials and plans on mount
  useEffect(() => {
    fetchTestimonials();
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data } = await apiClient.get<{
        success: boolean;
        data: any[];
      }>("/wholesaler-plans");
      if (data?.success && data.data) {
        const titles = data.data.map((p) => p.custom_name || p.label);
        setPlans(Array.from(new Set(titles.filter(Boolean))));
      }
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get<{
        success: boolean;
        data: Testimonial[];
      }>("/testimonials");

      if (data?.success && data.data) {
        setRows(data.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch testimonials:", err);
      setError(err?.message || "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.quote.toLowerCase().includes(q) ||
        (r.plan || "").toLowerCase().includes(q),
    );
  }, [rows, query]);

  const handleCreate = (testimonial: Testimonial) => {
    setRows((prev) => [testimonial, ...prev]);
    setOpen(false);
  };

  const handleUpdate = (updatedTestimonial: Testimonial) => {
    setRows((prev) =>
      prev.map((t) =>
        t.id === updatedTestimonial.id ? updatedTestimonial : t,
      ),
    );
    setEditingTestimonial(null);
    setOpen(false);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      const { data } = await apiClient.delete<{ success: boolean }>(
        `/testimonials/${id}`,
      );

      if (data?.success) {
        setRows((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert("Failed to delete testimonial. Please try again.");
      }
    } catch (err: any) {
      alert(err?.message || "Failed to delete testimonial. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditingTestimonial(null);
  };

  const handleOpenModal = () => {
    setEditingTestimonial(null);
    setOpen(true);
  };

  if (loading) {
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
        </header>
        <div className="flex items-center justify-center py-12">
          <p className="text-[16px] text-[#6F6C90]">Loading...</p>
        </div>
      </section>
    );
  }

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
          onClick={handleOpenModal}
          className="h-[40px] rounded-[8px] bg-[#401B60] px-4 text-[14px] font-semibold text-white hover:opacity-95"
        >
          Add Testimonial
        </button>
      </header>

      {error && (
        <div className="rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
          {error}
        </div>
      )}

      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-5">
        <div className="mb-4 flex w-full max-w-[380px] items-center gap-3 rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 20 21" fill="none">
            <path
              d="M9.6 18c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8Z"
              stroke="#292D32"
              strokeWidth="1.5"
            />
            <path
              d="m18.3 18.8-1.7-1.7"
              stroke="#292D32"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
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
              onEdit={() => handleEdit(t)}
              onDelete={() => handleDelete(t.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-[12px] border border-[#E7E4EC] p-8 text-center text-[14px] text-[#6F6C90]">
              {query
                ? "No testimonials found matching your search."
                : "No testimonials yet. Add your first testimonial!"}
            </div>
          )}
        </div>
      </div>

      <AddTestimonialModal
        open={open}
        plans={plans}
        onClose={handleCloseModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        editingTestimonial={editingTestimonial}
      />
    </section>
  );
}
