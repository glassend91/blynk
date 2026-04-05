"use client";

import { useEffect, useState } from "react";
import type { SeoBlock } from "../types";
import apiClient from "@/lib/apiClient";
import { hasPermission } from "@/lib/permissions";

type Props = {
  open: boolean;
  onClose: () => void;
  pageKey: string;
  initialValue: SeoBlock;
  onSave: (value: SeoBlock) => void;
};

const fieldClass =
  "w-full rounded-[10px] border border-[#DFDBE3] bg-white px-4 py-3 text-[14px] outline-none placeholder-[#6F6C90] focus:border-[#6A1D99]";

export default function SeoModal({ open, onClose, pageKey, initialValue, onSave }: Props) {
  const [metaTitle, setMetaTitle] = useState(initialValue.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialValue.metaDescription || "");
  const [keywords, setKeywords] = useState(initialValue.keywords || "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setMetaTitle(initialValue.metaTitle || "");
      setMetaDescription(initialValue.metaDescription || "");
      setKeywords(initialValue.keywords || "");
      setError(null);
      setSubmitting(false);
    }
  }, [open, initialValue]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async () => {
    // Check permission before submitting
    if (!hasPermission("seo.manage")) {
      setError("You do not have permission to manage SEO settings.");
      return;
    }

    if (!metaTitle.trim()) {
      setError("Meta title is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const blockData = {
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        keywords: keywords.trim(),
      };

      const { data } = await apiClient.patch<{ success: boolean; data: any }>(
        `/website-content/${pageKey}/seo`,
        blockData
      );

      if (data?.success) {
        onSave(blockData);
        onClose();
        return;
      }
      setError("Failed to save changes. Please try again.");
    } catch (err: any) {
      setError(err?.message || "Failed to save changes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
        width: '100vw',
        height: '100vh',
        overflow: 'auto'
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
          width: '100vw',
          height: '100vh',
          zIndex: 90
        }}
      />
      <div
        className="fixed left-1/2 top-1/2 max-h-[95vh] w-[600px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[18px] bg-white p-6 shadow-2xl"
        style={{ zIndex: 91 }}
      >
        <div className="mb-1 flex items-center justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[2px] text-[#6F6C90]">Edit Content</p>
            <h2 className="text-[26px] font-extrabold text-[#0A0A0A]">SEO Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-[#F3E8FF] text-[#5B2DEE] hover:bg-[#E7D4FF]"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <p className="text-[14px] text-[#6F6C90]">
          Update SEO metadata to improve search engine visibility.
        </p>

        <div className="mt-6 space-y-5">
          <Field label="Meta Title" required>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Why Choose Our Services?"
              className={fieldClass}
            />
          </Field>

          <Field label="Meta Description" hint="Max 160 characters recommended">
            <textarea
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Page description for search engines (max 160 characters)"
              className={fieldClass}
            />
            <p className="text-[12px] text-[#8E8CA2]">
              {metaDescription.length}/160 characters
            </p>
          </Field>

          <Field label="Focus Keywords" hint="Comma-separated keywords">
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Main keywords for this page (comma separated)"
              className={fieldClass}
            />
          </Field>
        </div>

        {error && (
          <div className="mt-4 rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
          <button
            onClick={onClose}
            className="h-[46px] flex-1 rounded-[10px] border border-[#DFDBE3] bg-[#F8F8F8] text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F1EEF8]"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="h-[46px] flex-1 rounded-[10px] bg-[#401B60] text-[14px] font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  required,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[13px] font-semibold text-[#0A0A0A]">
        {label}
        {required && <span className="text-[#E0342F]">*</span>}
      </label>
      {children}
      {hint && <p className="text-[12px] text-[#8E8CA2]">{hint}</p>}
    </div>
  );
}

