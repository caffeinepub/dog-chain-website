import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Feature, HeroContent, Product, Testimonial } from "../backend";
import { useActor } from "./useActor";

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFeatures() {
  const { actor, isFetching } = useActor();
  return useQuery<Feature[]>({
    queryKey: ["features"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeatures();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestimonials();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useHeroContent() {
  const { actor, isFetching } = useActor();
  return useQuery<HeroContent | null>({
    queryKey: ["heroContent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getHeroContent();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product: Product) => actor!.createProduct(product),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, product }: { id: bigint; product: Product }) =>
      actor!.updateProduct(id, product),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useCreateFeature() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (feature: Feature) => actor!.createFeature(feature),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["features"] }),
  });
}

export function useUpdateFeature() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, feature }: { id: bigint; feature: Feature }) =>
      actor!.updateFeature(id, feature),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["features"] }),
  });
}

export function useDeleteFeature() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteFeature(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["features"] }),
  });
}

export function useCreateTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (t: Testimonial) => actor!.createTestimonial(t),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, t }: { id: bigint; t: Testimonial }) =>
      actor!.updateTestimonial(id, t),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => actor!.deleteTestimonial(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["testimonials"] }),
  });
}

export function useUpdateHeroContent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: HeroContent) => actor!.updateHeroContent(content),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["heroContent"] }),
  });
}
