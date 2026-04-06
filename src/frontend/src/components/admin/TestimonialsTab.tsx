import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import type { Testimonial } from "../../backend";
import {
  useCreateTestimonial,
  useDeleteTestimonial,
  useTestimonials,
  useUpdateTestimonial,
} from "../../hooks/useQueries";

type FormState = {
  authorName: string;
  quote: string;
  rating: string;
  avatarFile: File | null;
  avatarPreview: string;
  existingAvatarUrl: string;
};

const defaultForm: FormState = {
  authorName: "",
  quote: "",
  rating: "5",
  avatarFile: null,
  avatarPreview: "",
  existingAvatarUrl: "",
};

export default function TestimonialsTab() {
  const { data: testimonials, isLoading } = useTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const openCreate = () => {
    setEditingItem(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingItem(t);
    const avatarUrl = t.authorAvatar?.getDirectURL() || "";
    setForm({
      authorName: t.authorName,
      quote: t.quote,
      rating: String(t.rating),
      avatarFile: null,
      avatarPreview: avatarUrl,
      existingAvatarUrl: avatarUrl,
    });
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      avatarFile: file,
      avatarPreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorName.trim()) {
      toast.error("Author name is required");
      return;
    }
    if (!form.quote.trim()) {
      toast.error("Quote is required");
      return;
    }

    let avatarBlob: ExternalBlob;
    if (form.avatarFile) {
      avatarBlob = ExternalBlob.fromBytes(
        new Uint8Array(await form.avatarFile.arrayBuffer()),
      );
    } else {
      avatarBlob = ExternalBlob.fromURL(form.existingAvatarUrl);
    }

    const testimonial: Testimonial = {
      id: editingItem?.id ?? 0n,
      authorName: form.authorName.trim(),
      quote: form.quote.trim(),
      rating: BigInt(Math.min(5, Math.max(1, Number(form.rating) || 5))),
      authorAvatar: avatarBlob,
      createdAt: editingItem?.createdAt ?? 0n,
    };

    try {
      if (editingItem) {
        await updateMutation.mutateAsync({
          id: editingItem.id,
          t: testimonial,
        });
        toast.success("Testimonial updated!");
      } else {
        await createMutation.mutateAsync(testimonial);
        toast.success("Testimonial created!");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save testimonial");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Testimonial deleted");
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteId(null);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-black text-xl uppercase tracking-wide">
          Testimonials
        </h2>
        <Button
          onClick={openCreate}
          className="bg-primary text-primary-foreground rounded-full gap-2"
          data-ocid="testimonials.open_modal_button"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </Button>
      </div>

      {isLoading ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="testimonials.loading_state"
        >
          Loading...
        </div>
      ) : !testimonials || testimonials.length === 0 ? (
        <div
          className="text-center py-16 bg-card rounded-2xl"
          data-ocid="testimonials.empty_state"
        >
          <p className="text-muted-foreground">No testimonials yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t, i) => (
            <div
              key={String(t.id)}
              className="bg-card rounded-xl p-4 flex items-center gap-4"
              data-ocid={`testimonials.row.${i + 1}`}
            >
              <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden shrink-0 flex items-center justify-center font-bold text-primary">
                {t.authorAvatar?.getDirectURL() ? (
                  <img
                    src={t.authorAvatar.getDirectURL()}
                    alt={t.authorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  t.authorName.charAt(0)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{t.authorName}</p>
                <p className="text-muted-foreground text-xs line-clamp-1">
                  {t.quote}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(t)}
                  className="rounded-lg"
                  data-ocid={`testimonials.edit_button.${i + 1}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteId(t.id)}
                  className="rounded-lg text-destructive hover:text-destructive"
                  data-ocid={`testimonials.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="testimonials.dialog">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">
              {editingItem ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="t-name">Author Name *</Label>
              <Input
                id="t-name"
                value={form.authorName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, authorName: e.target.value }))
                }
                placeholder="John D."
                className="mt-1"
                data-ocid="testimonials.input"
              />
            </div>
            <div>
              <Label htmlFor="t-quote">Quote *</Label>
              <Textarea
                id="t-quote"
                value={form.quote}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quote: e.target.value }))
                }
                placeholder="Best chain I've ever used..."
                className="mt-1"
                data-ocid="testimonials.textarea"
              />
            </div>
            <div>
              <Label htmlFor="t-rating">Rating (1–5)</Label>
              <Input
                id="t-rating"
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rating: e.target.value }))
                }
                className="mt-1 w-24"
                data-ocid="testimonials.input"
              />
            </div>
            <div>
              <Label htmlFor="t-avatar">Avatar Image</Label>
              <Input
                id="t-avatar"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1"
                data-ocid="testimonials.upload_button"
              />
              {form.avatarPreview && (
                <img
                  src={form.avatarPreview}
                  alt="Preview"
                  className="mt-2 w-16 h-16 rounded-full object-cover border border-border"
                />
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-ocid="testimonials.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground"
                data-ocid="testimonials.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(o) => {
          if (!o) setDeleteId(null);
        }}
      >
        <AlertDialogContent data-ocid="testimonials.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="testimonials.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
              data-ocid="testimonials.confirm_button"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
