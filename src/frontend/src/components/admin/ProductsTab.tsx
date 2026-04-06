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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../../backend";
import type { Product } from "../../backend";
import {
  useCreateProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "../../hooks/useQueries";

type FormState = {
  name: string;
  description: string;
  price: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  imageFile: File | null;
  imagePreview: string;
  existingImageUrl: string;
};

const defaultForm: FormState = {
  name: "",
  description: "",
  price: "",
  category: "",
  inStock: true,
  featured: false,
  imageFile: null,
  imagePreview: "",
  existingImageUrl: "",
};

export default function ProductsTab() {
  const { data: products, isLoading } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    const imgUrl = p.image?.getDirectURL() || "";
    setForm({
      name: p.name,
      description: p.description,
      price: (Number(p.price_cents) / 100).toFixed(2),
      category: p.category,
      inStock: p.inStock,
      featured: p.featured,
      imageFile: null,
      imagePreview: imgUrl,
      existingImageUrl: imgUrl,
    });
    setDialogOpen(true);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageFile: file, imagePreview: preview }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.price || Number.isNaN(Number(form.price))) {
      toast.error("Valid price is required");
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

    const product: Product = {
      id: editingProduct?.id ?? 0n,
      name: form.name.trim(),
      description: form.description.trim(),
      price_cents: BigInt(Math.round(Number(form.price) * 100)),
      category: form.category.trim(),
      inStock: form.inStock,
      featured: form.featured,
      image: imageBlob,
      createdAt: editingProduct?.createdAt ?? 0n,
    };

    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({ id: editingProduct.id, product });
        toast.success("Product updated!");
      } else {
        await createMutation.mutateAsync(product);
        toast.success("Product created!");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
    setDeleteId(null);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-black text-xl uppercase tracking-wide">
          Products
        </h2>
        <Button
          onClick={openCreate}
          className="bg-primary text-primary-foreground rounded-full gap-2"
          data-ocid="products.open_modal_button"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {isLoading ? (
        <div
          className="text-muted-foreground text-center py-12"
          data-ocid="products.loading_state"
        >
          Loading...
        </div>
      ) : !products || products.length === 0 ? (
        <div
          className="text-center py-16 bg-card rounded-2xl"
          data-ocid="products.empty_state"
        >
          <p className="text-muted-foreground">
            No products yet. Add your first product!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p, i) => (
            <div
              key={String(p.id)}
              className="bg-card rounded-xl p-4 flex items-center gap-4"
              data-ocid={`products.row.${i + 1}`}
            >
              <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                {p.image?.getDirectURL() ? (
                  <img
                    src={p.image.getDirectURL()}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-border" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{p.name}</p>
                <p className="text-muted-foreground text-xs">
                  ${(Number(p.price_cents) / 100).toFixed(2)} · {p.category}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEdit(p)}
                  className="rounded-lg"
                  data-ocid={`products.edit_button.${i + 1}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteId(p.id)}
                  className="rounded-lg text-destructive hover:text-destructive"
                  data-ocid={`products.delete_button.${i + 1}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="products.dialog">
          <DialogHeader>
            <DialogTitle className="font-display uppercase tracking-wide">
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="prod-name">Name *</Label>
              <Input
                id="prod-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Silver Classic Chain"
                className="mt-1"
                data-ocid="products.input"
              />
            </div>
            <div>
              <Label htmlFor="prod-desc">Description</Label>
              <Textarea
                id="prod-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Premium stainless steel..."
                className="mt-1"
                data-ocid="products.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="prod-price">Price (USD) *</Label>
                <Input
                  id="prod-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="49.99"
                  className="mt-1"
                  data-ocid="products.input"
                />
              </div>
              <div>
                <Label htmlFor="prod-cat">Category</Label>
                <Input
                  id="prod-cat"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  placeholder="Classic"
                  className="mt-1"
                  data-ocid="products.input"
                />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="prod-stock"
                  checked={form.inStock}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, inStock: v }))
                  }
                  data-ocid="products.switch"
                />
                <Label htmlFor="prod-stock">In Stock</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="prod-feat"
                  checked={form.featured}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, featured: v }))
                  }
                  data-ocid="products.switch"
                />
                <Label htmlFor="prod-feat">Featured</Label>
              </div>
            </div>
            <div>
              <Label htmlFor="prod-img">Product Image</Label>
              <Input
                id="prod-img"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1"
                data-ocid="products.upload_button"
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
                data-ocid="products.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-primary text-primary-foreground"
                data-ocid="products.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Product"
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
        <AlertDialogContent data-ocid="products.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="products.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
              data-ocid="products.confirm_button"
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
