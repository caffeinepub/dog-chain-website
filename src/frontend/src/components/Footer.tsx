import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Shield } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";
import { toast } from "sonner";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const cafLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  const handleNewsletter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Subscribed! Welcome to the pack.");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <footer id="contact" className="bg-footer text-footer-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <span className="font-display font-black text-lg uppercase tracking-widest">
                CANINE ARMOR
              </span>
            </div>
            <p className="text-footer-foreground/70 text-sm leading-relaxed">
              Premium heavy-duty dog chains engineered for powerful breeds and
              adventure-loving owners.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                data-ocid="footer.link"
                aria-label="Instagram"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                data-ocid="footer.link"
                aria-label="X (Twitter)"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                data-ocid="footer.link"
                aria-label="Facebook"
              >
                <SiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-footer-foreground/60 hover:text-footer-foreground transition-colors"
                data-ocid="footer.link"
                aria-label="YouTube"
              >
                <SiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-footer-foreground/70">
              {[
                { label: "Our Story", id: "features" },
                { label: "Products", id: "products" },
                { label: "Features", id: "features" },
                { label: "Shop", id: "shop" },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => scrollTo(item.id)}
                    className="hover:text-footer-foreground transition-colors"
                    data-ocid="footer.link"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-4">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-footer-foreground/70">
              {[
                "Silver Classic",
                "Gold Premium",
                "Black Tactical",
                "Custom Orders",
              ].map((l) => (
                <li key={l}>
                  <button
                    type="button"
                    onClick={() => scrollTo("products")}
                    className="hover:text-footer-foreground transition-colors"
                    data-ocid="footer.link"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-sm mb-4">
              Stay Updated
            </h4>
            <p className="text-footer-foreground/70 text-sm mb-4">
              Get exclusive deals and updates delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                required
                className="bg-footer-foreground/10 border-footer-foreground/20 text-footer-foreground placeholder:text-footer-foreground/40 rounded-full text-sm"
                data-ocid="footer.input"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-primary hover:bg-primary/90 rounded-full shrink-0"
                data-ocid="footer.submit_button"
              >
                <Mail className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-footer-foreground/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-footer-foreground/50">
          <p>&copy; {year} CANINE ARMOR. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={cafLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-footer-foreground/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
