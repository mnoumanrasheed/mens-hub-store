import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/storefront/collection-page";
import { getStorefrontCollection } from "@/data/storefront";
import { parseStorefrontFilters } from "@/validation/storefront";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "New Arrivals", description: "Explore the latest published pieces from Men’s Hub.", alternates: { canonical: "/new-arrivals" } };
export default async function NewArrivalsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) { const filters = parseStorefrontFilters(await searchParams); const data = await getStorefrontCollection({ kind: "new", filters }); if (!data) notFound(); return <CollectionPage eyebrow="Latest edit" title="New Arrivals" data={data} filters={filters} action="/new-arrivals" />; }
