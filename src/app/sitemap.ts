import type { MetadataRoute } from "next";
import { getSitemapData } from "@/data/storefront";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteUrl();
  const data = await getSitemapData();
  const url = (path: string) => new URL(path, origin).toString();
  const staticRoutes: MetadataRoute.Sitemap = ["/", "/shop", "/new-arrivals", "/sale", "/about", "/contact"].map((path) => ({ url: url(path), changeFrequency: path === "/" ? "daily" : "weekly", priority: path === "/" ? 1 : 0.7 }));
  const categories: MetadataRoute.Sitemap = data.categories.flatMap((category) => [{ url: url(`/shop/${category.slug}`), lastModified: category.updatedAt, changeFrequency: "weekly", priority: 0.8 }, ...category.subcategories.map((subcategory) => ({ url: url(`/shop/${category.slug}/${subcategory.slug}`), lastModified: subcategory.updatedAt, changeFrequency: "weekly" as const, priority: 0.7 }))]);
  const products: MetadataRoute.Sitemap = data.products.map((product) => ({ url: url(`/product/${product.slug}`), lastModified: product.updatedAt, changeFrequency: "weekly", priority: 0.8 }));
  const policies: MetadataRoute.Sitemap = data.policies.map((policy) => ({ url: url(`/${policy.slug}`), lastModified: policy.updatedAt, changeFrequency: "monthly", priority: 0.4 }));
  return [...staticRoutes, ...categories, ...products, ...policies];
}
