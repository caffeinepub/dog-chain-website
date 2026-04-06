import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useTestimonials } from "../hooks/useQueries";

const SAMPLE_TESTIMONIALS = [
  {
    id: 1n,
    authorName: "Marcus T.",
    quote:
      "My Rottweiler has broken every chain I've tried. Not this one. CANINE ARMOR is the real deal — solid, sleek, and incredibly strong.",
    rating: 5n,
    authorAvatar: null,
  },
  {
    id: 2n,
    authorName: "Priya K.",
    quote:
      "I was skeptical at first but after 8 months of daily use in rain, mud, and sun, the Gold Premium chain still looks brand new. Absolutely worth it.",
    rating: 5n,
    authorAvatar: null,
  },
  {
    id: 3n,
    authorName: "Derek M.",
    quote:
      "The Black Tactical chain is exactly what I needed for training sessions. Durable, lightweight enough to handle all day, and it looks amazing.",
    rating: 5n,
    authorAvatar: null,
  },
];

export default function TestimonialsSection() {
  const { data: backendTestimonials } = useTestimonials();
  const testimonials =
    backendTestimonials && backendTestimonials.length > 0
      ? backendTestimonials
      : SAMPLE_TESTIMONIALS;

  const [current, setCurrent] = useState(0);
  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];
  const avatarUrl =
    t &&
    "authorAvatar" in t &&
    t.authorAvatar &&
    typeof t.authorAvatar === "object" &&
    "getDirectURL" in t.authorAvatar
      ? (t.authorAvatar as { getDirectURL: () => string }).getDirectURL()
      : null;

  return (
    <section className="py-20 bg-secondary px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-widest text-foreground mb-3">
            WHAT OWNERS SAY
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl shadow-card p-8 md:p-12 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={t.authorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-xl text-primary">
                      {t.authorName.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: Number(t.rating) }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length star array
                    <Star key={i} className="w-4 h-4 fill-star text-star" />
                  ))}
                </div>
                <p className="text-foreground text-lg leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="font-display font-bold uppercase tracking-widest text-sm text-primary">
                  — {t.authorName}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {testimonials.length > 1 && (
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full border-border"
                data-ocid="testimonials.pagination_prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex gap-2 items-center">
                {testimonials.map((item, i) => (
                  <button
                    type="button"
                    key={String(item.id)}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === current ? "bg-primary w-5" : "bg-border"
                    }`}
                    data-ocid="testimonials.toggle"
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full border-border"
                data-ocid="testimonials.pagination_next"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
