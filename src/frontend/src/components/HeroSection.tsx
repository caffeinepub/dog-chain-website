import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { useHeroContent } from "../hooks/useQueries";

export default function HeroSection() {
  const { data: heroContent } = useHeroContent();

  const bgImage = heroContent?.backgroundImage?.getDirectURL()
    ? heroContent.backgroundImage.getDirectURL()
    : "/assets/generated/hero-dog.dim_1400x700.jpg";

  const headline =
    heroContent?.headline || "BUILT FOR ADVENTURE.\nFORGED FOR STRENGTH.";
  const subheadline =
    heroContent?.subheadline ||
    "Premium heavy-duty dog chains engineered for powerful breeds and active lifestyles.";
  const ctaText = heroContent?.ctaText || "SHOP THE CHAIN";

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="hero-overlay absolute inset-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="max-w-2xl"
        >
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black text-white uppercase leading-tight tracking-tight mb-6">
            {headline.split("\n").map((line, i) => (
              // Static content lines - index is stable
              // biome-ignore lint/suspicious/noArrayIndexKey: static content
              <span key={i} className={i > 0 ? "block" : ""}>
                {line}
              </span>
            ))}
          </h1>
          <p className="text-white/85 text-lg sm:text-xl mb-8 max-w-xl leading-relaxed">
            {subheadline}
          </p>
          <Button
            onClick={scrollToProducts}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-lg"
            data-ocid="hero.primary_button"
          >
            {ctaText}
          </Button>
        </motion.div>
      </div>
      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.8 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2">
          <div className="w-1 h-2.5 rounded-full bg-white/70" />
        </div>
      </motion.div>
    </section>
  );
}
