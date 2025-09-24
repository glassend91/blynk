import AboutNavbar from "@/components/AboutNavbar";
import AboutHero from "@/components/AboutHero";
import OurVision from "@/components/OurVision";
import BlynkDifference from "@/components/BlynkDifference";
import AlwaysImproving from "@/components/AlwaysImproving";
import MoreThanProvider from "@/components/MoreThanProvider";
import AboutCTA from "@/components/AboutCTA";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutNavbar />
      <AboutHero />
      <OurVision />
      <BlynkDifference />
      <AlwaysImproving />
      <MoreThanProvider />
      <AboutCTA />
      <Footer />
    </main>
  );
}
