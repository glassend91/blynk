"use client";

import dynamic from "next/dynamic";
const CmsPage = dynamic(() => import("@/components/shared/CmsPage"), { ssr: false });

export default function HelpCenterPage() {
  return <CmsPage pageKey="help" />;
}
