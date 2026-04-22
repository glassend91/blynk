import type { CmsPageData, CmsPageKey } from "./types";

export const pages: CmsPageKey[] = [
  "home",
  "about",
  "service",
  "hardship",
  "policies",
  "help",
  "terms",
  "privacy",
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
    bodyContent: "",
    pageTitle: "",
    seo: {
      metaTitle: "Why Choose Our Services?",
      metaDescription:
        "Page description for search engines (max 160 characters)",
      keywords: "",
    },
  },
  about: {
    bodyContent: "",
    pageTitle: "",
    seo: {
      metaTitle: "About Us",
      metaDescription: "Learn more about our company and mission",
      keywords: "about, company, mission, team",
    },
  },
  service: {
    bodyContent: "",
    pageTitle: "",
    seo: {
      metaTitle: "Our Services",
      metaDescription: "Discover our range of internet and mobile services",
      keywords: "services, internet, mobile, nbn",
    },
  },
  hardship: {
    bodyContent: "",
    pageTitle: "",
    seo: {
      metaTitle: "Financial Hardship Support",
      metaDescription: "We're here to help during difficult times",
      keywords: "financial hardship, support, payment assistance",
    },
  },
  policies: {
    bodyContent: "",
    pageTitle: "",
    seo: {
      metaTitle: "Policies",
      metaDescription: "Read our terms, privacy policy, and refund policy",
      keywords: "policies, terms, privacy, refund",
    },
  },
  help: {
    bodyContent: "",
    pageTitle: "",
    seo: {
      metaTitle: "Help Center",
      metaDescription: "Find answers to frequently asked questions",
      keywords: "help, faq, support, questions",
    },
  },
  seo: {
    bodyContent: "",
    pageTitle: "",
    seo: {
      metaTitle: "SEO Settings",
      metaDescription:
        "Page description for search engines (max 160 characters)",
      keywords: "",
    },
  },
  terms: {
    bodyContent: "",
    pageTitle: "",
    seo: {
      metaTitle: "Terms & Conditions",
      metaDescription: "Standard terms and conditions for our services",
      keywords: "terms, conditions, legal",
    },
  },
  privacy: {
    bodyContent: "",
    pageTitle: "",
    seo: {
      metaTitle: "Privacy Policy",
      metaDescription: "How we handle your personal data",
      keywords: "privacy, data, security",
    },
  },
};
