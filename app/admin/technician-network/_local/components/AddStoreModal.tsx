"use client";

import { useEffect, useState } from "react";
import type { PartnerStore } from "../types";

type NewStore = Omit<PartnerStore, "id" | "rating">;

export default function AddStoreModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (s: NewStore) => void;
}) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [phone, setPhone] = useState("");
  const [reviews, setReviews] = useState("");
  const [blurb, setBlurb] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setAddress("");
      setHours("");
      setPhone("");
      setReviews("");
      setBlurb("");
    }
  }, [open]);

  if (!open) return null;

  const city = address.split(",")[1]?.trim() || "";

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white p-6 shadow-2xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">Add Partner Store</h2>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="text-[14px] text-[#6F6C90]">
          Add a new partner store location to the technician network map.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Store Name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tech Solutions Melbourne" className="field" />
          </Field>

          <div className="md:col-span-2">
            <Field label="Address">
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Collins Street, Melbourne VIC 3000" className="field" />
            </Field>
          </div>

          <Field label="Phone Number">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(03) 9123 4567" className="field" />
          </Field>

          <Field label="Operating Hours">
            <input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Mon–Fri: 9AM–6PM" className="field" />
          </Field>

          <div className="md:col-span-2">
            <Field label="Google Reviews Link">
              <input value={reviews} onChange={(e) => setReviews(e.target.value)} placeholder="https://g.page/your-store" className="field" />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Store Bio/Pitch">
              <textarea rows={4} value={blurb} onChange={(e) => setBlurb(e.target.value)} placeholder="Describe the store’s expertise and services…" className="field" />
            </Field>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button onClick={onClose} className="h-[44px] flex-1 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] text-[14px] font-semibold text-[#6F6C90]">
            Cancel
          </button>
          <button
            onClick={() =>
              onCreate({
                name: name || "New Partner Store",
                address: address || "—",
                city,
                hours: hours || "Mon–Fri 9am–5pm",
                phone: phone || "—",
                googleReviewsUrl: reviews || "https://google.com/maps",
                blurb: blurb || "",
              })
            }
            className="h-[44px] flex-1 rounded-[10px] bg-[#401B60] text-[14px] font-semibold text-white"
          >
            Add Store
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
