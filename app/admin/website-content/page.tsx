"use client";

import { useMemo, useState } from "react";
import Tabs from "./_local/components/Tabs";
import HeroSectionForm from "./_local/components/HeroSectionForm";
import FeaturesSectionForm from "./_local/components/FeaturesSectionForm";
import SeoForm from "./_local/components/SeoForm";
import { seed, pages } from "./_local/data";
import type { CmsPageKey, HeroBlock, SeoBlock, FeaturesBlock } from "./_local/types";

export default function WebsiteContentPage() {
  const [tab, setTab] = useState<CmsPageKey>("home");
  const [hero, setHero] = useState<Record<CmsPageKey, HeroBlock>>(
    Object.fromEntries(pages.map((k) => [k, seed[k].hero]))
  );
  const [features, setFeatures] = useState<Record<CmsPageKey, FeaturesBlock>>(
    Object.fromEntries(pages.map((k) => [k, seed[k].features]))
  );
  const [seo, setSeo] = useState<Record<CmsPageKey, SeoBlock>>(
    Object.fromEntries(pages.map((k) => [k, seed[k].seo]))
  );

  const isSeoOnly = tab === "seo"; // matches the dedicated SEO Settings page

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

      <div className="rounded-[14px] border border-[#DFDBE3] bg-white p-5">
        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={setTab}
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

        {/* Forms */}
        <div className="mt-5 grid gap-6 xl:grid-cols-2">
          {/* Left column */}
          {!isSeoOnly ? (
            <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-5 shadow-[0_10px_24px_rgba(17,24,39,0.06)]">
              <HeroSectionForm
                title="Hero Section"
                value={hero[tab]}
                onSave={(v) => setHero((s) => ({ ...s, [tab]: v }))}
              />
            </div>
          ) : (
            <div className="hidden xl:block" />
          )}

          {/* Right column */}
          <div className="rounded-[12.75px] border border-[#DFDBE3] bg-white p-5 shadow-[0_10px_24px_rgba(17,24,39,0.06)]">
            {isSeoOnly ? (
              <SeoForm
                title="SEO Settings"
                value={seo[tab]}
                onSave={(v) => setSeo((s) => ({ ...s, [tab]: v }))}
              />
            ) : tab === "home" ? (
              <FeaturesSectionForm
                title="Features Section"
                value={features[tab]}
                onSave={(v) => setFeatures((s) => ({ ...s, [tab]: v }))}
              />
            ) : (
              <SeoForm
                title="SEO Settings"
                value={seo[tab]}
                onSave={(v) => setSeo((s) => ({ ...s, [tab]: v }))}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
