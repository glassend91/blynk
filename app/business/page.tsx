import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessServicesLanding from "@/components/business-sme/BusinessServicesLanding";

export default function BusinessPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <BusinessServicesLanding />
      <Footer />
    </main>
  );
}
