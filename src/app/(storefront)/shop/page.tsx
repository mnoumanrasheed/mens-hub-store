import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionPage } from "@/components/storefront/collection-page";
import { getStorefrontCollection } from "@/data/storefront";
import { parseStorefrontFilters } from "@/validation/storefront";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse all published clothing, footwear and accessories from Men's Hub.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseStorefrontFilters(await searchParams);
  const data = await getStorefrontCollection({ filters });
  if (!data) notFound();
  return <CollectionPage eyebrow="All products" title="Shop" description="Browse all published products from Men's Hub." data={data} filters={filters} action="/shop" />;
}
