import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import { useHeroContent, useUpdateHeroContent } from "../../hooks/useQueries";

export default function HeroTab() {
  const { data: heroContent, isLoading } = useHeroContent();
  const updateMutation = useUpdateHeroContent();

  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState("");
  const [existingBgUrl, setExistingBgUrl] = useState("");

  useEffect(() => {
    if (heroContent) {
      setHeadline(heroContent.headline || "");
      setSubheadline(heroContent.subheadline || "");
      setCtaText(heroContent.ctaText || "");
      setCtaLink(heroContent.ctaLink || "");
      const url = heroContent.backgroundImage?.getDirectURL() || "";
      setBgPreview(url);
      setExistingBgUrl(url);
    }
  }, [heroContent]);

  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBgFile(file);
    setBgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let bgBlob: ExternalBlob;
    if (bgFile) {
      bgBlob = ExternalBlob.fromBytes(
        new Uint8Array(await bgFile.arrayBuffer()),
      );
    } else {
      bgBlob = ExternalBlob.fromURL(existingBgUrl);
    }

    try {
      await updateMutation.mutateAsync({
        headline: headline.trim(),
        subheadline: subheadline.trim(),
        ctaText: ctaText.trim(),
        ctaLink: ctaLink.trim(),
        backgroundImage: bgBlob,
      });
      toast.success("Hero content saved!");
    } catch {
      toast.error("Failed to save hero content");
    }
  };

  if (isLoading) {
    return (
      <div
        className="text-center py-12 text-muted-foreground"
        data-ocid="hero.loading_state"
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-black text-xl uppercase tracking-wide">
          Hero Content
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-card rounded-2xl p-8"
      >
        <div>
          <Label htmlFor="hero-headline">Headline</Label>
          <Textarea
            id="hero-headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="BUILT FOR ADVENTURE. FORGED FOR STRENGTH."
            className="mt-1"
            rows={2}
            data-ocid="hero.textarea"
          />
        </div>
        <div>
          <Label htmlFor="hero-sub">Subheadline</Label>
          <Textarea
            id="hero-sub"
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
            placeholder="Premium heavy-duty dog chains..."
            className="mt-1"
            rows={2}
            data-ocid="hero.textarea"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="hero-cta-text">CTA Button Text</Label>
            <Input
              id="hero-cta-text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="SHOP THE CHAIN"
              className="mt-1"
              data-ocid="hero.input"
            />
          </div>
          <div>
            <Label htmlFor="hero-cta-link">CTA Link</Label>
            <Input
              id="hero-cta-link"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="#products"
              className="mt-1"
              data-ocid="hero.input"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="hero-bg">Background Image</Label>
          <Input
            id="hero-bg"
            type="file"
            accept="image/*"
            onChange={handleBgChange}
            className="mt-1"
            data-ocid="hero.upload_button"
          />
          {bgPreview && (
            <img
              src={bgPreview}
              alt="Background preview"
              className="mt-3 w-full max-h-40 object-cover rounded-xl border border-border"
            />
          )}
        </div>
        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="bg-primary text-primary-foreground rounded-full px-8"
          data-ocid="hero.save_button"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Hero Content"
          )}
        </Button>
      </form>
    </div>
  );
}
