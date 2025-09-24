import type { CmsPageData, CmsPageKey } from "./types";

export const pages: CmsPageKey[] = [
  "home",
  "about",
  "service",
  "hardship",
  "policies",
  "help",
  "seo",
];

export const seed: Record<CmsPageKey, CmsPageData> = {
  home: {
    hero: {
      headline: "Fast, Reliable Internet & Mobile Plans",
      subtitle:
        "Experience lightning-fast NBN and unlimited mobile plans designed for Australian families and businesses.",
    },
    features: {
      title: "Why Choose Our Services?",
      subtitle:
        "We provide comprehensive telecommunications solutions with exceptional customer service.",
    },
    seo: {
      metaTitle: "Why Choose Our Services?",
      metaDescription: "Page description for search engines (max 160 characters)",
      keywords: "",
    },
  },
  about: {
    hero: {
      headline: "Fast, Reliable Internet & Mobile Plans",
      subtitle: "Supporting text for the hero section",
    },
    features: { title: "", subtitle: "" },
    seo: {
      metaTitle: "Why Choose Our Services?",
      metaDescription: "Page description for search engines (max 160 characters)",
      keywords: "Main keywords for this page (comma separated)",
    },
  },
  service: {
    hero: {
      headline: "Fast, Reliable Internet & Mobile Plans",
      subtitle: "Supporting text for the hero section",
    },
    features: { title: "", subtitle: "" },
    seo: {
      metaTitle: "Why Choose Our Services?",
      metaDescription: "Page description for search engines (max 160 characters)",
      keywords: "Main keywords for this page (comma separated)",
    },
  },
  hardship: {
    hero: {
      headline: "Fast, Reliable Internet & Mobile Plans",
      subtitle: "Supporting text for the hero section",
    },
    features: { title: "", subtitle: "" },
    seo: {
      metaTitle: "Why Choose Our Services?",
      metaDescription: "Page description for search engines (max 160 characters)",
      keywords: "Main keywords for this page (comma separated)",
    },
  },
  policies: {
    hero: {
      headline: "Fast, Reliable Internet & Mobile Plans",
      subtitle: "Supporting text for the hero section",
    },
    features: { title: "", subtitle: "" },
    seo: {
      metaTitle: "Why Choose Our Services?",
      metaDescription: "Page description for search engines (max 160 characters)",
      keywords: "Main keywords for this page (comma separated)",
    },
  },
  help: {
    hero: {
      headline: "Fast, Reliable Internet & Mobile Plans",
      subtitle: "Supporting text for the hero section",
    },
    features: { title: "", subtitle: "" },
    seo: {
      metaTitle: "Why Choose Our Services?",
      metaDescription: "Page description for search engines (max 160 characters)",
      keywords: "Main keywords for this page (comma separated)",
    },
  },
  seo: {
    hero: { headline: "", subtitle: "" },
    features: { title: "", subtitle: "" },
    seo: {
      metaTitle: "Why Choose Our Services?",
      metaDescription: "Page description for search engines (max 160 characters)",
      keywords: "",
    },
  },
};
