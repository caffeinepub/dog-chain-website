import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: bigint;
    featured: boolean;
    inStock: boolean;
    name: string;
    createdAt: Time;
    price_cents: bigint;
    description: string;
    category: string;
    image: ExternalBlob;
}
export type Time = bigint;
export interface HeroContent {
    headline: string;
    backgroundImage: ExternalBlob;
    ctaLink: string;
    ctaText: string;
    subheadline: string;
}
export interface Feature {
    id: bigint;
    title: string;
    order: bigint;
    description: string;
    iconName: string;
    image: ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export interface Testimonial {
    id: bigint;
    authorAvatar: ExternalBlob;
    createdAt: Time;
    authorName: string;
    quote: string;
    rating: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createFeature(feature: Feature): Promise<bigint>;
    createProduct(product: Product): Promise<bigint>;
    createTestimonial(testimonial: Testimonial): Promise<bigint>;
    deleteFeature(id: bigint): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    deleteTestimonial(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getFeatures(): Promise<Array<Feature>>;
    getHeroContent(): Promise<HeroContent | null>;
    getProduct(id: bigint): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateFeature(id: bigint, feature: Feature): Promise<void>;
    updateHeroContent(content: HeroContent): Promise<void>;
    updateProduct(id: bigint, product: Product): Promise<void>;
    updateTestimonial(id: bigint, testimonial: Testimonial): Promise<void>;
}
