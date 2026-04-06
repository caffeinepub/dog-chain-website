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
import type { Feature } from "../../backend";
import {
  useCreateFeature,
  useDeleteFeature,
  useFeatures,
  useUpdateFeature,
} from "../../hooks/useQueries";

type FormState = {
  title: string;
  description: string;
  iconName: string;
  order: string;
  imageFile: File | null;
  imagePreview: string;
  existingImageUrl: string;
};

const defaultForm: FormState = {
  title: "",
  description: "",
  iconName: "",
  order: "0",
  imageFile: null,
  imagePreview: "",
  existingImageUrl: "",
};

export default function FeaturesTab() {
  const { data: features, isLoading } = useFeatures();
  const createMutation = useCreateFeature();
  const updateMutation = useUpdateFeature();
  const deleteMutation = useDeleteFeature();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const openCreate = () => {
    setEditingFeature(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (f: Feature) => {
    setEditingFeature(f);
    const imgUrl = f.image?.getDirectURL() || "";
    setForm({
      title: f.title,
      description: f.description,
      iconName: f.iconName,
      order: String(f.order),
      imageFile: null,
      imagePreview: imgUrl,
      existingImageUrl: imgUrl,
    });
    setDialogOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    let imageBlob: ExternalBlob;
    if (form.imageFile) {
      imageBlob = ExternalBlob.fromBytes(
        new Uint8Array(await form.imageFile.arrayBuffer()),
      );
    } else {
      imageBlob = ExternalBlob.fromURL(form.existingImageUrl);
    }

    const feature: Feature = {
      id: editingFeature?.id ?? 0n,
      title: form.title.trim(),
      description: form.description.trim(),
      iconName: form.iconName.trim(),
      order: BigInt(Number(form.order) || 0),
      image: imageBlob,
    };

    try {
      if (editingFeature) {
        await updateMutation.mutateAsync({ id: editingFeature.id, feature });
        toast.success("Feature updated!");
      } else {
        await createMutation.mutateAsync(feature);
        toast.success("Feature created!");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save feature");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Feature deleted");
    } catch {
      toast.error("Failed to delete feature");
    }
    setDeleteId(null);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-black text-xl uppercase tracking-wide">
          Features
        </h2>
        <Button
          onClick={openCreate}
          className="bg-primary text-primary-foreground rounded-full gap-2"
          data-ocid="features.open_modal_button"
        >
          <Plus className="w-4 h-4" /> Add Feature
        </Button>
      </div>

      {isLoading ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="features.loading_state"
        >
          Loading...
        </div>
      ) : !features || features.length === 0 ? (
        <div
          className="text-center py-16 bg-card rounded-2xl"
          data-ocid="features.empty_state"
        >
          <p className="text-muted-foreground">No features yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {features.map((f, i) => (
            <div
              key={String(f.id)}
              className="bg-card rounded-xl p-4 flex items-center gap-4"
              data-ocid={`features.row.${i + 1}`}
            >
              <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                {f.image?.getDirectURL() ? (
                  <img
                    src={f.image.getDirectURL()}
                    alt={f.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-border" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{f.title}</p>
                <p className="text-muted-foreground text-xs line-clamp-1">
                  {f.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(f)}
                  className="rounded-lg"
                  data-ocid={`features.edit_button.${i + 1}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteId(f.id)}
                  className="rounded-lg text-destructive hover:text-destructive"
                  data-ocid={`features.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="features.dialog">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">
              {editingFeature ? "Edit Feature" : "Add Feature"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="feat-title">Title *</Label>
              <Input
                id="feat-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Marine-Grade Durability"
                className="mt-1"
                data-ocid="features.input"
              />
            </div>
            <div>
              <Label htmlFor="feat-desc">Description</Label>
              <Textarea
                id="feat-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Built with marine-grade steel..."
                className="mt-1"
                data-ocid="features.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="feat-icon">Icon Name</Label>
                <Input
                  id="feat-icon"
                  value={form.iconName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, iconName: e.target.value }))
                  }
                  placeholder="shield"
                  className="mt-1"
                  data-ocid="features.input"
                />
              </div>
              <div>
                <Label htmlFor="feat-order">Order</Label>
                <Input
                  id="feat-order"
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, order: e.target.value }))
                  }
                  placeholder="1"
                  className="mt-1"
                  data-ocid="features.input"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="feat-img">Image</Label>
              <Input
                id="feat-img"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1"
                data-ocid="features.upload_button"
              />
              {form.imagePreview && (
                <img
                  src={form.imagePreview}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg border border-border"
                />
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-ocid="features.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground"
                data-ocid="features.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Feature"
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
        <AlertDialogContent data-ocid="features.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feature?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="features.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
              data-ocid="features.confirm_button"
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
