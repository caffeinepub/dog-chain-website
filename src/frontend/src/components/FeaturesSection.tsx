import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import type { Feature } from "../backend";
import { useFeatures } from "../hooks/useQueries";

const SAMPLE_FEATURES = [
  {
    id: 1n,
    title: "Marine-Grade Durability",
    description:
      "Built with 316L marine-grade stainless steel, rust and corrosion resistant even in saltwater environments.",
    iconName: "shield",
    image: "/assets/generated/feature-durability.dim_400x400.jpg",
    order: 1n,
  },
  {
    id: 2n,
    title: "Unbreakable Links",
    description:
      "Each link pressure-tested to 500 lbs breaking strength — built for the most powerful breeds.",
    iconName: "link",
    image: "/assets/generated/product-chain-1.dim_600x600.jpg",
    order: 2n,
  },
  {
    id: 3n,
    title: "Comfort Grip Handle",
    description:
      "Padded leather handle for comfortable long walks. Reduces hand strain during training sessions.",
    iconName: "hand",
    image: "/assets/generated/product-chain-2.dim_600x600.jpg",
    order: 3n,
  },
  {
    id: 4n,
    title: "Universal Fit",
    description:
      "Adjustable sizing fits all breeds from 20–150 lbs. One chain, every dog.",
    iconName: "star",
    image: "/assets/generated/product-chain-3.dim_600x600.jpg",
    order: 4n,
  },
];

function FeatureCard({
  feature,
  imgSrc,
  index,
}: {
  feature: (typeof SAMPLE_FEATURES)[0] | Feature;
  imgSrc: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="bg-card rounded-2xl shadow-card overflow-hidden"
      data-ocid={`features.item.${index + 1}`}
    >
      <div className="aspect-video overflow-hidden bg-secondary">
        <img
          src={imgSrc}
          alt={feature.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-6">
        <h3 className="font-display font-black text-foreground text-base uppercase tracking-wide mb-2">
          {feature.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const { data: backendFeatures, isLoading } = useFeatures();

  return (
    <section id="features" className="py-20 bg-secondary px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-widest text-foreground mb-3">
            THE ARMOR ADVANTAGE
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Every CANINE ARMOR chain is built to outlast the toughest conditions
            — because your dog deserves the best.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-video" />
                <div className="p-6 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : backendFeatures && backendFeatures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {backendFeatures.map((f, i) => (
              <FeatureCard
                key={String(f.id)}
                feature={f}
                imgSrc={
                  f.image?.getDirectURL() ||
                  "/assets/generated/feature-durability.dim_400x400.jpg"
                }
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SAMPLE_FEATURES.map((f, i) => (
              <FeatureCard
                key={String(f.id)}
                feature={f}
                imgSrc={f.image}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
