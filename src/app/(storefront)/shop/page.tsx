import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/storefront/collection-page";
import { getStorefrontCollection } from "@/data/storefront";
import { parseStorefrontFilters } from "@/validation/storefront";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop", description: "Browse the Men’s Hub menswear, footwear, and accessories catalogue.", alternates: { canonical: "/shop" } };

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) { const filters = parseStorefrontFilters(await searchParams); const data = await getStorefrontCollection({ filters }); if (!data) notFound(); return <CollectionPage eyebrow="Men’s Hub catalogue" title="Shop" data={data} filters={filters} action="/shop" />; }
