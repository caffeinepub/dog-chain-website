import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { useProducts } from "../hooks/useQueries";

const SAMPLE_PRODUCTS = [
  {
    id: 1n,
    name: "Silver Classic Chain",
    description:
      "Classic stainless steel dog chain with premium polish and secure clasp.",
    price_cents: 316n,
    image: "/assets/generated/dog-chain-product.jpg",
    category: "Classic",
    inStock: true,
    featured: true,
  },
  {
    id: 2n,
    name: "Gold Premium Chain",
    description:
      "Premium gold-plated heavy-duty chain for discerning dog owners.",
    price_cents: 316n,
    image: "/assets/generated/dog-chain-product.jpg",
    category: "Premium",
    inStock: true,
    featured: true,
  },
  {
    id: 3n,
    name: "Black Tactical Chain",
    description:
      "Military-grade tactical dog chain with matte black finish and reinforced links.",
    price_cents: 316n,
    image: "/assets/generated/dog-chain-product.jpg",
    category: "Tactical",
    inStock: true,
    featured: false,
  },
];

function formatPrice(cents: bigint) {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

function StarRating({ rating = 4.9 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= Math.round(rating)
              ? "fill-star text-star"
              : "fill-none text-muted-foreground"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{rating}</span>
    </div>
  );
}

type SampleProduct = (typeof SAMPLE_PRODUCTS)[0];

function ProductCard({
  product,
  imgSrc,
  index,
}: {
  product: SampleProduct | Product;
  imgSrc: string;
  index: number;
}) {
  const priceCents = product.price_cents;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="bg-card rounded-2xl shadow-card overflow-hidden group hover:shadow-card-hover transition-shadow"
      data-ocid={`products.item.${index + 1}`}
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-bold text-foreground text-base uppercase tracking-wide line-clamp-1">
            {product.name}
          </h3>
          <span className="text-primary font-black text-lg whitespace-nowrap">
            {formatPrice(priceCents)}
          </span>
        </div>
        <StarRating />
        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        <Button
          onClick={() => toast.success("Added to cart!")}
          className="w-full mt-4 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
          data-ocid={`products.button.${index + 1}`}
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-2" /> ADD TO CART
        </Button>
      </div>
    </motion.div>
  );
}

export default function ProductShowcase() {
  const { data: backendProducts, isLoading } = useProducts();

  return (
    <section id="products" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-widest text-foreground mb-3">
            OUR COLLECTION
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden">
                <Skeleton className="aspect-square" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : backendProducts && backendProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {backendProducts.map((p, i) => (
              <ProductCard
                key={String(p.id)}
                product={p}
                imgSrc={
                  p.image?.getDirectURL() ||
                  "/assets/generated/dog-chain-product.jpg"
                }
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_PRODUCTS.map((p, i) => (
              <ProductCard
                key={String(p.id)}
                product={p}
                imgSrc={p.image}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
