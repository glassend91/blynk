"use client";

import { useEffect, useState } from "react";
import Tabs from "./_local/components/Tabs";
import HeroSectionModal from "./_local/components/HeroSectionModal";
import FeaturesSectionModal from "./_local/components/FeaturesSectionModal";
import SeoModal from "./_local/components/SeoModal";
import StaticPageEditor from "./_local/components/StaticPageEditor";
import { pages, seed } from "./_local/data";
import type { CmsPageKey, HeroBlock, SeoBlock, FeaturesBlock, CmsPageData } from "./_local/types";
import apiClient from "@/lib/apiClient";
import { usePermission } from "@/lib/permissions";

export default function WebsiteContentPage() {
  const [tab, setTab] = useState<CmsPageKey>("home");
  const [content, setContent] = useState<Record<CmsPageKey, CmsPageData>>(
    Object.fromEntries(pages.map((k) => [k, seed[k]])) as Record<CmsPageKey, CmsPageData>
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canManageSeo = usePermission("seo.manage");

  // Modal states
  const [heroModalOpen, setHeroModalOpen] = useState(false);
  const [featuresModalOpen, setFeaturesModalOpen] = useState(false);
  const [seoModalOpen, setSeoModalOpen] = useState(false);

  // Fetch all website content on mount
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get<{ success: boolean; data: any[] }>("/website-content");

      if (data?.success && data.data) {
        // Transform API response into our content structure
        const contentMap: Record<CmsPageKey, CmsPageData> = { ...seed };

        data.data.forEach((page: any) => {
          if (pages.includes(page.pageKey as CmsPageKey)) {
            contentMap[page.pageKey as CmsPageKey] = {
              hero: page.hero || seed[page.pageKey as CmsPageKey].hero,
              features: page.features || seed[page.pageKey as CmsPageKey].features,
              bodyContent: page.bodyContent || seed[page.pageKey as CmsPageKey].bodyContent || '',
              pageTitle: page.pageTitle || seed[page.pageKey as CmsPageKey].pageTitle || '',
              seo: page.seo || seed[page.pageKey as CmsPageKey].seo,
            };
          }
        });

        setContent(contentMap);
      }
    } catch (err: any) {
      console.error("Failed to fetch content:", err);
      setError(err?.message || "Failed to load website content");
      // Keep using seed data as fallback
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSave = (value: HeroBlock) => {
    setContent((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], hero: value },
    }));
  };

  const handleFeaturesSave = (value: FeaturesBlock) => {
    setContent((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], features: value },
    }));
  };

  const handleSeoSave = (value: SeoBlock) => {
    setContent((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], seo: value },
    }));
  };

  const isSeoOnly = tab === "seo";

  if (loading) {
    return (
      <section className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-[26px] font-bold leading-[28px] text-[#0A0A0A]">
            Website Content & SEO
          </h1>
          <p className="text-[16px] leading-[21px] text-[#6F6C90]">
            Manage website content and search engine optimization
          </p>
        </header>
        <div className="flex items-center justify-center py-12">
          <p className="text-[16px] text-[#6F6C90]">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-[26px] font-bold leading-[28px] text-[#0A0A0A]">
          Website Content & SEO
        </h1>
        <p className="text-[16px] leading-[21px] text-[#6F6C90]">
          Manage website content and search engine optimization
        </p>
      </header>

      {error && (
        <div className="rounded-[10px] border border-[#FCD1D2] bg-[#FFF5F5] px-4 py-3 text-[13px] text-[#C53030]">
          {error}
        </div>
      )}

      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-5">
        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={(k) => setTab(k as CmsPageKey)}
          items={[
            { key: "home", label: "Home Page" },
            { key: "about", label: "About Us" },
            { key: "service", label: "Service" },
            { key: "hardship", label: "Financial Hardship" },
            { key: "policies", label: "Policies" },
            { key: "help", label: "Help Center" },
            { key: "seo", label: "SEO Settings" },
          ]}
        />

        {/* Static Page Editor */}
        <div className="mt-5">
          <StaticPageEditor
            pageKey={tab}
            initialData={{
              bodyContent: content[tab].bodyContent,
              pageTitle: content[tab].pageTitle,
              seo: content[tab].seo,
            }}
            onSave={() => {
              fetchContent();
            }}
          />
        </div>

        {/* Additional Content Cards for Home Page */}
        {tab === "home" && (
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <ContentCard
              title="Hero Section"
              onEdit={() => setHeroModalOpen(true)}
            >
              <div className="space-y-3">
                <div>
                  <p className="text-[12px] font-medium text-[#6F6C90]">Headline</p>
                  <p className="text-[14px] font-semibold text-[#0A0A0A]">
                    {content[tab].hero?.headline || "Not set"}
                  </p>
                </div>
                {content[tab].hero?.subtitle && (
                  <div>
                    <p className="text-[12px] font-medium text-[#6F6C90]">Subtitle</p>
                    <p className="text-[14px] text-[#0A0A0A]">
                      {content[tab].hero.subtitle}
                    </p>
                  </div>
                )}
              </div>
            </ContentCard>

            <ContentCard
              title="Features Section"
              onEdit={() => setFeaturesModalOpen(true)}
            >
              <div className="space-y-3">
                <div>
                  <p className="text-[12px] font-medium text-[#6F6C90]">Title</p>
                  <p className="text-[14px] font-semibold text-[#0A0A0A]">
                    {content[tab].features?.title || "Not set"}
                  </p>
                </div>
                {content[tab].features?.subtitle && (
                  <div>
                    <p className="text-[12px] font-medium text-[#6F6C90]">Subtitle</p>
                    <p className="text-[14px] text-[#0A0A0A]">
                      {content[tab].features.subtitle}
                    </p>
                  </div>
                )}
              </div>
            </ContentCard>
          </div>
        )}
      </div>

      {/* Modals */}
      {!isSeoOnly && (
        <HeroSectionModal
          open={heroModalOpen}
          onClose={() => setHeroModalOpen(false)}
          pageKey={tab}
          initialValue={content[tab].hero}
          onSave={handleHeroSave}
        />
      )}

      {tab === "home" && (
        <FeaturesSectionModal
          open={featuresModalOpen}
          onClose={() => setFeaturesModalOpen(false)}
          pageKey={tab}
          initialValue={content[tab].features}
          onSave={handleFeaturesSave}
        />
      )}

      {canManageSeo && (
        <SeoModal
          open={seoModalOpen}
          onClose={() => setSeoModalOpen(false)}
          pageKey={tab}
          initialValue={content[tab].seo}
          onSave={handleSeoSave}
        />
      )}
    </section>
  );
}

function ContentCard({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: React.ReactNode;
  onEdit?: () => void;
}) {
  return (
    <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-5 shadow-[0_10px_24px_rgba(17,24,39,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[16px] font-semibold text-[#0A0A0A]">{title}</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="h-[36px] rounded-[8px] bg-[#401B60] px-4 text-[14px] font-semibold text-white hover:opacity-95"
          >
            Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
