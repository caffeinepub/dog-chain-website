import { Button } from "@/components/ui/button";
import { Shield, ShoppingCart, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-card border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-2 font-display font-bold text-foreground"
            data-ocid="nav.link"
          >
            <Shield className="w-7 h-7 text-primary" strokeWidth={2.5} />
            <span
              className={`text-lg tracking-widest uppercase ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              CANINE ARMOR
            </span>
          </a>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {["Our Story", "Features", "Shop"].map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => scrollTo(item.toLowerCase().replace(" ", "-"))}
                className={`text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${
                  scrolled ? "text-foreground" : "text-white"
                }`}
                data-ocid="nav.link"
              >
                {item}
              </button>
            ))}
            <button
              type="button"
              onClick={() => scrollTo("products")}
              className={`text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-white"
              }`}
              data-ocid="nav.link"
            >
              Products
            </button>
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              className={`text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${
                scrolled ? "text-foreground" : "text-white"
              }`}
              data-ocid="nav.link"
            >
              Contact
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <>
                <a href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:flex gap-1 items-center"
                    data-ocid="nav.link"
                  >
                    <User className="w-4 h-4" /> Admin
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className={scrolled ? "" : "text-white hover:text-primary"}
                  data-ocid="nav.button"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={login}
                className="hidden sm:flex gap-1 items-center"
                data-ocid="nav.button"
              >
                <User className="w-4 h-4" /> Account
              </Button>
            )}
            <Button
              size="sm"
              className="bg-primary text-primary-foreground rounded-full px-4 gap-1"
              data-ocid="nav.button"
            >
              <ShoppingCart className="w-4 h-4" /> Cart
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
