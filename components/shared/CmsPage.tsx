"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CmsPage({ pageKey }: { pageKey: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log(`Fetching CMS page: ${pageKey}`);
    apiClient.get(`website-content/${pageKey}`)
      .then(res => {
        console.log("CMS API Response:", res.data);
        if(res.data?.success && res.data.data) {
          setData(res.data.data);
        } else {
          console.warn("CMS Data missing or success=false", res.data);
          setError("Content not found");
        }
      })
      .catch(err => {
        console.error("CMS Load Error:", err);
        setError("Failed to connect to server");
      })
      .finally(() => setLoading(false));
  }, [pageKey]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="bg-[#FBFAFD] py-20 text-center border-b border-[#dfdbe3]">
         <h1 className="text-4xl font-extrabold text-[#170F49] mb-4">
            {loading ? "Loading..." : (data?.pageTitle || data?.seo?.metaTitle || "Page")}
         </h1>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#401B60]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-semibold">{error}</p>
            <p className="text-[#6F6C90] mt-2 text-sm">Please check the backend API connection.</p>
          </div>
        ) : data?.bodyContent ? (
          <div 
            className="text-[#6F6C90] leading-relaxed space-y-4" 
            dangerouslySetInnerHTML={{ __html: data.bodyContent }} 
          />
        ) : (
          <div className="text-center py-20">
            <p className="text-[#6F6C90]">Content is currently being published. Please check back later.</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
