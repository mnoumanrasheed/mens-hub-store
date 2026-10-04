import { getSiteUrl } from "@/lib/site-url";

export type ProductUrlInput = { id: string };

export function getProductUrl(product: ProductUrlInput, siteUrl: URL = getSiteUrl()): string {
  return new URL("/product/" + encodeURIComponent(product.id), siteUrl).toString();
}
