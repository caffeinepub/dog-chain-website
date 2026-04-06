import FeaturesSection from "../components/FeaturesSection";
import FeaturesStrip from "../components/FeaturesStrip";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import PricingSection from "../components/PricingSection";
import ProductShowcase from "../components/ProductShowcase";
import TestimonialsSection from "../components/TestimonialsSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesStrip />
        <ProductShowcase />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
