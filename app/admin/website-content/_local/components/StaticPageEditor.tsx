"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";
import apiClient from "@/lib/apiClient";
import type { CmsPageKey, SeoBlock } from "../types";

type StaticPageEditorProps = {
  pageKey: CmsPageKey;
  initialData?: {
    bodyContent?: string;
    pageTitle?: string;
    seo?: SeoBlock;
  };
  onSave?: () => void;
  onCancel?: () => void;
};

export default function StaticPageEditor({
  pageKey,
  initialData,
  onSave,
  onCancel,
}: StaticPageEditorProps) {
  const [bodyContent, setBodyContent] = useState(
    initialData?.bodyContent || "",
  );
  const [pageTitle, setPageTitle] = useState(initialData?.pageTitle || "");
  const [metaTitle, setMetaTitle] = useState(initialData?.seo?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.seo?.metaDescription || "",
  );
  const [keywords, setKeywords] = useState(initialData?.seo?.keywords || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (initialData) {
      setBodyContent(initialData.bodyContent || "");
      setPageTitle(initialData.pageTitle || "");
      setMetaTitle(initialData.seo?.metaTitle || "");
      setMetaDescription(initialData.seo?.metaDescription || "");
      setKeywords(initialData.seo?.keywords || "");
    }
  }, [initialData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      if (!metaTitle.trim()) {
        setError("Meta Title is required");
        setSaving(false);
        return;
      }

      const { data } = await apiClient.put<{
        success: boolean;
        message?: string;
      }>(`/website-content/${pageKey}`, {
        bodyContent: bodyContent.trim(),
        pageTitle: pageTitle.trim(),
        seo: {
          metaTitle: metaTitle.trim(),
          metaDescription: metaDescription.trim(),
          keywords: keywords.trim(),
        },
      });

      if (data?.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSave?.();
        }, 2000);
      } else {
        setError(data?.message || "Failed to save content");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to save content",
      );
    } finally {
      setSaving(false);
    }
  };

  const pageLabels: Record<CmsPageKey, string> = {
    home: "Home Page",
    about: "About Us",
    service: "Service",
    hardship: "Financial Hardship",
    policies: "Policies",
    help: "Help Center",
    seo: "SEO Settings",
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-[10px] border border-green-200 bg-green-50 px-4 py-3 text-[13px] text-green-700">
          Content saved and published successfully!
        </div>
      )}

      {/* Page Title */}
      <div>
        <label className="block text-[13px] font-medium text-[#0A0A0A] mb-2">
          Page Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          placeholder={`Enter title for ${pageLabels[pageKey]}`}
          className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors bg-white"
        />
        <p className="mt-1 text-[12px] text-[#6F6C90]">
          The main heading displayed on the page
        </p>
      </div>

      {/* Rich Text Editor for Body Content */}
      <div>
        <label className="block text-[13px] font-medium text-[#0A0A0A] mb-2">
          Page Content
        </label>
        <RichTextEditor
          value={bodyContent}
          onChange={setBodyContent}
          placeholder="Enter page content... Use the toolbar to format your text."
        />
        <p className="mt-2 text-[12px] text-[#6F6C90]">
          Add and format the main content for this page
        </p>
      </div>

      {/* SEO Section */}
      <div className="rounded-[12px] border border-[#DFDBE3] bg-[#F8F8F8] p-5">
        <h3 className="text-[16px] font-semibold text-[#0A0A0A] mb-4">
          SEO Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-2">
              Meta Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Enter meta title (50-60 characters recommended)"
              maxLength={60}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors bg-white"
            />
            <p className="mt-1 text-[12px] text-[#6F6C90]">
              {metaTitle.length}/60 characters
            </p>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-2">
              Meta Description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Enter meta description (150-160 characters recommended)"
              maxLength={160}
              rows={3}
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors resize-none bg-white"
            />
            <p className="mt-1 text-[12px] text-[#6F6C90]">
              {metaDescription.length}/160 characters
            </p>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-[#0A0A0A] mb-2">
              Meta Keywords
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords (comma-separated)"
              className="w-full rounded-[10px] border border-[#DFDBE3] px-4 py-3 text-[14px] outline-none focus:border-[#401B60] transition-colors bg-white"
            />
            <p className="mt-1 text-[12px] text-[#6F6C90]">
              Separate keywords with commas (e.g., internet, mobile, nbn)
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DFDBE3]">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-[10px] border border-[#DFDBE3] px-6 py-3 text-[14px] font-semibold text-[#6F6C90] hover:bg-[#F8F8F8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !metaTitle.trim()}
          className="rounded-[10px] bg-[#401B60] px-6 py-3 text-[14px] font-semibold text-white hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
        >
          {saving ? "Saving..." : "Save & Publish"}
        </button>
      </div>
    </div>
  );
}
