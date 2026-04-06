import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const PLANS = [
  {
    name: "Starter",
    price: "$3.16",
    features: ["3ft Standard Chain", "Single Link Style", "1 Year Warranty"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$3.16",
    features: [
      "5ft Heavy Duty Chain",
      "Reinforced Links",
      "5 Year Warranty",
      "Free Engraving",
    ],
    highlight: true,
  },
  {
    name: "Elite",
    price: "$3.16",
    features: [
      "6ft Marine-Grade Chain",
      "Custom Link Style",
      "Lifetime Warranty",
      "Premium Handle",
    ],
    highlight: false,
  },
];

export default function PricingSection() {
  return (
    <section id="shop" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-widest text-foreground mb-3">
            CHOOSE YOUR CHAIN
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
          <p className="text-muted-foreground mt-4">
            Select the perfect chain for your dog's size and lifestyle.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? "bg-primary text-primary-foreground shadow-card-hover scale-105"
                  : "bg-card shadow-card"
              }`}
              data-ocid={`pricing.item.${i + 1}`}
            >
              <div className="mb-6">
                <p
                  className={`text-xs font-bold uppercase tracking-widest mb-2 ${
                    plan.highlight
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {plan.name}
                </p>
                <p
                  className={`font-display text-4xl font-black ${
                    plan.highlight
                      ? "text-primary-foreground"
                      : "text-foreground"
                  }`}
                >
                  {plan.price}
                </p>
              </div>
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-center gap-2 text-sm ${
                      plan.highlight
                        ? "text-primary-foreground/90"
                        : "text-foreground"
                    }`}
                  >
                    <Check
                      className={`w-4 h-4 shrink-0 ${
                        plan.highlight
                          ? "text-primary-foreground"
                          : "text-primary"
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  toast.success(`${plan.name} chain added to cart!`)
                }
                className={`rounded-full font-bold uppercase tracking-widest text-xs w-full ${
                  plan.highlight
                    ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                data-ocid={`pricing.button.${i + 1}`}
              >
                BUY NOW
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
