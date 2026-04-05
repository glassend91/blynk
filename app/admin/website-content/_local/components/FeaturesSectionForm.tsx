"use client";

import { useState } from "react";
import type { FeaturesBlock } from "../types";

export default function FeaturesSectionForm({
  title,
  value,
  onSave,
}: {
  title: string;
  value: FeaturesBlock;
  onSave: (v: FeaturesBlock) => void;
}) {
  const [state, setState] = useState<FeaturesBlock>(value);

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

      <Field label="Section Title">
        <input
          value={state.title}
          onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
          placeholder="Why Choose Our Services?"
          className="field"
        />
      </Field>

      <Field label="Subtitle" extraClass="mt-4">
        <input
          value={state.subtitle || ""}
          onChange={(e) => setState((s) => ({ ...s, subtitle: e.target.value }))}
          placeholder="We provide comprehensive telecommunications solutions..."
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
      <label className="mb-1 block text-[13px] font-medium text-[#0A0A0A]">{label}</label>
      {children}
    </div>
  );
}
