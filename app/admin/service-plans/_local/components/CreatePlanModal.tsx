"use client";

import { useEffect, useState } from "react";
import type { PlanRow, PlanType, PlanStatus } from "../types";

type NewPlan = Omit<PlanRow, "id" | "customers">;

export default function CreatePlanModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (plan: NewPlan) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<PlanType>("NBN");
  const [price, setPrice] = useState("69.95");
  const [speed, setSpeed] = useState("");
  const [features, setFeatures] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<PlanStatus>("Published");

  useEffect(() => {
    if (!open) {
      setName(""); setType("NBN"); setPrice("69.95");
      setSpeed(""); setFeatures(""); setDesc(""); setStatus("Published");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white p-6 shadow-2xl">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">Create New Service Plan</h2>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Plan Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., NBN Premium 100"
              className="field"
            />
          </Field>

          <Field label="Plan Type">
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PlanType)}
                className="field appearance-none pr-9"
              >
                <option value="NBN">NBN</option>
                <option value="Mobile">Mobile</option>
              </select>
              <Caret />
            </div>
          </Field>

          <Field label="Speed/Data">
            <input
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              placeholder="e.g., 100/20 Mbps or 50GB"
              className="field"
            />
          </Field>

          <Field label="Monthly Price (AUD)">
            <div className="relative">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="69.95"
                className="field pr-9"
              />
              <Caret />
            </div>
          </Field>

          <div className="md:col-span-2">
            <Field label="Features (one per line)">
              <input
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="Plan description..."
                className="field"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Plan description..."
                rows={4}
                className="field"
              />
            </Field>
          </div>

          <Field label="Status">
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PlanStatus)}
                className="field appearance-none pr-9"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
              <Caret />
            </div>
          </Field>
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
                name: name || "New Plan",
                details: desc || features || "Plan details",
                type,
                speedOrData: speed || (type === "NBN" ? "25/5 Mbps" : "4G/5G"),
                price: `$${(Number(price) || 0).toFixed(2)}/Month`,
                status,
              })
            }
            className="h-[44px] flex-1 rounded-[10px] bg-[#401B60] text-[14px] font-semibold text-white"
          >
            Create Plan
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

// Tailwind helper class suggestion (add to globals.css if you prefer)
// .field { @apply w-full rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none placeholder-[#6F6C90]; }
