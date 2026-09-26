"use client";

import type { ReactNode } from "react";

import { InternalCinematicHero, type InternalHeroBreadcrumb, type InternalHeroVisual } from "@/components/storefront/internal-cinematic-hero";

const collectionFallbacks: Record<string, { image: string; secondaryImage: string; visual: InternalHeroVisual }> = {
  shop: { image: "/seed-media/01-Shirts/shirt-02.jpg", secondaryImage: "/seed-media/02-Pants/pants-02.jpg", visual: "wardrobe" },
  "new-arrivals": { image: "/seed-media/01-Shirts/shirt-02.jpg", secondaryImage: "/seed-media/03-Shalwar-Qameez/shalwar-qameez-02.jpg", visual: "new-arrivals" },
  sale: { image: "/seed-media/04-Trousers/trousers-02.jpg", secondaryImage: "/seed-media/05-Shoes/shoes-02.jpg", visual: "sale" },
  category: { image: "/seed-media/01-Shirts/shirt-02.jpg", secondaryImage: "/seed-media/06-Watches/watch-02.jpg", visual: "category" },
};

export function AnimatedCollectionHero({ eyebrow, title, description, routeKey = "category", image, secondaryImage, imageAlt, breadcrumbItems, children }: { eyebrow: string; title: string; description: string; routeKey?: string; image?: string; secondaryImage?: string; imageAlt?: string; breadcrumbItems?: InternalHeroBreadcrumb[]; children?: ReactNode }) {
  const fallback = collectionFallbacks[routeKey] || collectionFallbacks.category;
  return <InternalCinematicHero eyebrow={eyebrow} title={title} description={description} visual={fallback.visual} image={image || fallback.image} secondaryImage={secondaryImage || fallback.secondaryImage} imageAlt={imageAlt || `${title} fashion editorial`} breadcrumbItems={breadcrumbItems}>{children}</InternalCinematicHero>;
}
