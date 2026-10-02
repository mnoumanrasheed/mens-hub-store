import type { ReactNode } from "react";

import { InternalCinematicHero, type InternalHeroBreadcrumb, type InternalHeroVisual } from "@/components/storefront/internal-cinematic-hero";

const collectionVisuals: Record<string, InternalHeroVisual> = {
  shop: "wardrobe",
  "new-arrivals": "new-arrivals",
  sale: "sale",
  category: "category",
};

export function AnimatedCollectionHero({ eyebrow, title, description, routeKey = "category", breadcrumbItems, children }: { eyebrow: string; title: string; description: string; routeKey?: string; breadcrumbItems?: InternalHeroBreadcrumb[]; children?: ReactNode }) {
  const visual = collectionVisuals[routeKey] || collectionVisuals.category;
  return <InternalCinematicHero eyebrow={eyebrow} title={title} description={description} visual={visual} breadcrumbItems={breadcrumbItems}>{children}</InternalCinematicHero>;
}
