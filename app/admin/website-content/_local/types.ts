export type CmsPageKey =
  | "home"
  | "about"
  | "service"
  | "hardship"
  | "policies"
  | "help"
  | "terms"
  | "privacy"
  | "seo"; // dedicated SEO tab

export type HeroBlock = {
  headline: string;
  subtitle?: string;
};

export type FeaturesBlock = {
  title: string;
  subtitle?: string;
};

export type SeoBlock = {
  metaTitle: string;
  metaDescription?: string;
  keywords?: string; // comma-separated
};

export type CmsPageData = {
  hero?: HeroBlock;
  features?: FeaturesBlock;
  bodyContent?: string;
  pageTitle?: string;
  seo: SeoBlock;
};
