"use client";

import { useState } from "react";
import type { SeoBlock } from "../types";

export default function SeoForm({
  title,
  value,
  onSave,
}: {
  title: string;
  value: SeoBlock;
  onSave: (v: SeoBlock) => void;
}) {
  const [state, setState] = useState<SeoBlock>(value);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-[#0A0A0A]">{title}</h3>
        <button
          onClick={() => onSave(state)}
          className="h-[36px] rounded-[8px] bg-[#401B60] px-4 text-[14px] font-semibold text-white"
        >
          Save Change
        </button>
      </div>

      <Field label="Meta Title">
        <input
          value={state.metaTitle}
          onChange={(e) =>
            setState((s) => ({ ...s, metaTitle: e.target.value }))
          }
          placeholder="Why Choose Our Services?"
          className="field"
        />
      </Field>

      <Field label="Meta Description" extraClass="mt-4">
        <textarea
          rows={3}
          value={state.metaDescription || ""}
          onChange={(e) =>
            setState((s) => ({ ...s, metaDescription: e.target.value }))
          }
          placeholder="Page description for search engines (max 160 characters)"
          className="field"
        />
      </Field>

      <Field label="Focus Keywords" extraClass="mt-4">
        <input
          value={state.keywords || ""}
          onChange={(e) =>
            setState((s) => ({ ...s, keywords: e.target.value }))
          }
          placeholder="Main keywords for this page (comma separated)"
          className="field"
        />
      </Field>
    </div>
  );
}

function Field({
  label,
  children,
  extraClass,
}: {
  label: string;
  children: React.ReactNode;
  extraClass?: string;
}) {
  return (
    <div className={extraClass}>
      <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">
        {label}
      </label>
      {children}
    </div>
  );
}
