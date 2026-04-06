import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, Shield } from "lucide-react";
import { useState } from "react";
import FeaturesTab from "../components/admin/FeaturesTab";
import HeroTab from "../components/admin/HeroTab";
import ProductsTab from "../components/admin/ProductsTab";
import TestimonialsTab from "../components/admin/TestimonialsTab";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

export default function AdminPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";
  const isLoggedIn = loginStatus === "success";
  const { data: isAdmin, isLoading } = useIsAdmin();
  const [activeTab, setActiveTab] = useState("products");

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-card p-10 max-w-md w-full text-center">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="font-display text-2xl font-black uppercase tracking-widest mb-3">
            Admin Panel
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">
            Please log in to access the CANINE ARMOR management panel.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="bg-primary text-primary-foreground rounded-full px-6 gap-2"
            data-ocid="admin.primary_button"
          >
            <LogIn className="w-4 h-4" />
            {isLoggingIn ? "Logging in..." : "Log In"}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-card p-10 max-w-md w-full text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-black uppercase tracking-widest mb-3">
            Access Restricted
          </h1>
          <p className="text-muted-foreground mb-4 text-sm">
            Your account does not have admin privileges. Please contact the site
            owner to request admin access.
          </p>
          <a href="/">
            <Button
              variant="outline"
              className="rounded-full"
              data-ocid="admin.secondary_button"
            >
              Return to Site
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-display font-black uppercase tracking-widest text-foreground">
              CANINE ARMOR
            </span>
            <span className="text-muted-foreground text-sm ml-2">/ Admin</span>
          </div>
          <a href="/">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              data-ocid="admin.secondary_button"
            >
              ← View Site
            </Button>
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-3xl font-black uppercase tracking-widest text-foreground mb-8">
          Management Panel
        </h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-card border border-border rounded-full p-1 h-auto">
            {["products", "features", "testimonials", "hero"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-full capitalize text-xs font-bold uppercase tracking-wide"
                data-ocid={`admin.${tab}.tab`}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          <TabsContent value="features">
            <FeaturesTab />
          </TabsContent>
          <TabsContent value="testimonials">
            <TestimonialsTab />
          </TabsContent>
          <TabsContent value="hero">
            <HeroTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
