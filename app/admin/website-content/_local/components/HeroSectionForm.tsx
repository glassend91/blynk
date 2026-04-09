"use client";

import { useState } from "react";
import type { HeroBlock } from "../types";

export default function HeroSectionForm({
  title,
  value,
  onSave,
}: {
  title: string;
  value: HeroBlock;
  onSave: (v: HeroBlock) => void;
}) {
  const [state, setState] = useState<HeroBlock>(value);

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

      <Field label="Main Headline">
        <input
          value={state.headline}
          onChange={(e) =>
            setState((s) => ({ ...s, headline: e.target.value }))
          }
          placeholder="Fast, Reliable Internet & Mobile Plans"
          className="field focus:border-[#6A1D99]"
        />
      </Field>

      <Field label="Hero Subtitle" extraClass="mt-4">
        <input
          value={state.subtitle || ""}
          onChange={(e) =>
            setState((s) => ({ ...s, subtitle: e.target.value }))
          }
          placeholder="Supporting text for the hero section"
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
