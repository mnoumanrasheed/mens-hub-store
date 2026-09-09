import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/storefront/collection-page";
import { getStorefrontCollection } from "@/data/storefront";
import { parseStorefrontFilters } from "@/validation/storefront";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Sale", description: "Browse currently active Men’s Hub offers.", alternates: { canonical: "/sale" } };
export default async function SalePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) { const filters = parseStorefrontFilters(await searchParams); const data = await getStorefrontCollection({ kind: "sale", filters }); if (!data) notFound(); return <CollectionPage eyebrow="Limited offers" title="Sale" data={data} filters={filters} action="/sale" />; }
