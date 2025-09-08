"use client";

import { useMemo, useState } from "react";
import { seedStores } from "./_local/data";
import type { PartnerStore } from "./_local/types";
import StoreCard from "./_local/components/StoreCard";
import AddStoreModal from "./_local/components/AddStoreModal";
import AddTechnicianModal from "./_local/components/AddTechnicianModal";

export default function TechnicianNetworkPage() {
  const [stores, setStores] = useState<PartnerStore[]>(seedStores);
  const [q, setQ] = useState("");
  const [openStore, setOpenStore] = useState(false);
  const [openTech, setOpenTech] = useState(false);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return stores;
    return stores.filter(
      (r) =>
        r.name.toLowerCase().includes(s) ||
        r.address.toLowerCase().includes(s) ||
        r.phone.toLowerCase().includes(s) ||
        r.city.toLowerCase().includes(s)
    );
  }, [q, stores]);

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold leading-[28px] text-[#0A0A0A]">
            Technician Network
          </h1>
          <p className="text-[16px] leading-[21px] text-[#6F6C90]">
            Manage partner stores and technician profiles
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Optional: expose technician profile modal */}
          <button
            onClick={() => setOpenTech(true)}
            className="h-[40px] rounded-[8px] border border-[#E7E4EC] bg-white px-4 text-[14px] font-semibold text-[#0A0A0A]"
          >
            Add Technician
          </button>
          <button
            onClick={() => setOpenStore(true)}
            className="h-[40px] rounded-[8px] bg-[#401B60] px-4 text-[14px] font-semibold text-white"
          >
            Add Store
          </button>
        </div>
      </header>

      {/* Search */}
      <div className="flex w-full max-w-[420px] items-center gap-3 rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3">
        <svg width="18" height="18" viewBox="0 0 20 21" fill="none">
          <path d="M9.6 18c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8Z" stroke="#292D32" strokeWidth="1.5" />
          <path d="m18.3 18.8-1.7-1.7" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search stores…"
          className="w-full bg-transparent text-[14px] text-[#0A0A0A] placeholder-[#6F6C90] outline-none"
        />
      </div>

      {/* List */}
      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-5">
        <div className="space-y-5">
          {filtered.map((s) => (
            <StoreCard
              key={s.id}
              store={s}
              onEdit={() => setOpenStore(true)}
              onView={() => window.open(s.googleReviewsUrl, "_blank")}
            />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-[12px] border border-[#E7E4EC] p-8 text-center text-[14px] text-[#6F6C90]">
              No stores found.
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddStoreModal
        open={openStore}
        onClose={() => setOpenStore(false)}
        onCreate={(data) => {
          setStores((prev) => [
            {
              id: prev.length ? Math.max(...prev.map((x) => x.id)) + 1 : 1,
              rating: 4.8,
              ...data,
            },
            ...prev,
          ]);
          setOpenStore(false);
        }}
      />

      <AddTechnicianModal open={openTech} onClose={() => setOpenTech(false)} />
    </section>
  );
}
