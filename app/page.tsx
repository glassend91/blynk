import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Plans from "@/components/Plans";
import Footer from "@/components/Footer";
import SupportCTA from "@/components/SupportCTA";
import TiredOfRunaround from "@/components/TiredOfRunaround";
import StillHaveQuestion from "@/components/StillHaveQuestion";
import WhatOurCustomersSay from "@/components/WhatOurCustomersSay";

export default function Page() {
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
