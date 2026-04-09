"use client";

import { useEffect, useState } from "react";

type Editable = Omit<any, "id" | "lastUpdated"> & {
  id?: number;
  lastUpdated?: string;
};

export default function EditPageModal({
  open,
  title,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  initial?: Editable;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [state, setState] = useState<Editable>({
    title: "",
    slug: "",
    description: "",
    status: "Draft",
  });

  useEffect(() => {
    if (open)
      setState(
        initial ?? { title: "", slug: "", description: "", status: "Draft" },
      );
  }, [open, initial]);

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

  const commit = () =>
    onSave({
      id: state.id ?? Math.floor(Math.random() * 100000),
      title: state.title || "Untitled",
      slug: state.slug || "/new-page",
      description: state.description || "",
      status: state.status ?? "Draft",
      lastUpdated: new Date().toISOString(),
    });

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
        className="fixed left-1/2 top-1/2 w-[880px] -translate-x-1/2 -translate-y-1/2 rounded-[14px] bg-white p-6 shadow-2xl"
        style={{ zIndex: 91 }}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[24px] font-extrabold text-[#0A0A0A]">{title}</h2>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-full bg-[#FFF0F0] text-[#E0342F]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-4 grid gap-4">
          <Field label="Title">
            <input
              value={state.title}
              onChange={(e) =>
                setState((s) => ({ ...s, title: e.target.value }))
              }
              placeholder="Page title"
              className="field"
            />
          </Field>

          <Field label="Slug">
            <input
              value={state.slug}
              onChange={(e) =>
                setState((s) => ({ ...s, slug: e.target.value }))
              }
              placeholder="/page-slug"
              className="field"
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={4}
              value={state.description}
              onChange={(e) =>
                setState((s) => ({ ...s, description: e.target.value }))
              }
              placeholder="Short description…"
              className="field"
            />
          </Field>

          <Field label="Status">
            <div className="relative">
              <select
                value={state.status}
                onChange={(e) =>
                  setState((s) => ({ ...s, status: e.target.value }))
                }
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
            onClick={commit}
            className="h-[44px] flex-1 rounded-[10px] bg-[#401B60] text-[14px] font-semibold text-white"
          >
            Save Page
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">
        {label}
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

// Optional utility (same as service plans)
// .field { @apply w-full rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] placeholder-[#6F6C90] outline-none; }
