"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, getAuthUser } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Plans from "@/components/Plans";
import Footer from "@/components/Footer";
import SupportCTA from "@/components/SupportCTA";
import TiredOfRunaround from "@/components/TiredOfRunaround";
import StillHaveQuestion from "@/components/StillHaveQuestion";
import WhatOurCustomersSay from "@/components/WhatOurCustomersSay";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Get user role to determine redirect destination
      const user = getAuthUser<{ role?: string }>();
      const role = user?.role || "customer";
      
      if (role === "admin" || role === "superAdmin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [router]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Plans />
      <TiredOfRunaround />
      <WhatOurCustomersSay />
      <StillHaveQuestion />
      <Footer />
    </main>
  );
}
