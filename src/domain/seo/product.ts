import type { Metadata } from "next";

type SeoProduct = { slug: string; name: string; sku: string; imageUrl: string; description: string; seoTitle?: string | null; seoDescription?: string | null; effectivePrice: string; availableArticles: number };

export function createProductMetadata(product: SeoProduct): Metadata {
  const title = product.seoTitle || product.name;
  const description = (product.seoDescription || product.description).trim().slice(0, 160);
  const url = `/product/${product.slug}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, type: "website", url, images: [{ url: product.imageUrl, alt: product.name }] }, twitter: { card: "summary_large_image", title, description, images: [product.imageUrl] } };
}

export function createProductStructuredData(product: SeoProduct, brandName: string, productUrl: string) {
  return { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: [product.imageUrl], sku: product.sku, brand: { "@type": "Brand", name: brandName }, offers: { "@type": "Offer", url: productUrl, priceCurrency: "PKR", price: product.effectivePrice, availability: product.availableArticles > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", itemCondition: "https://schema.org/NewCondition" } };
}
