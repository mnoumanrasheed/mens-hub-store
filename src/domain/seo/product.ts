import type { Metadata } from "next";

type SeoProduct = { id: string; name: string; imageUrl: string; effectivePrice: string; stock: number };

export function createProductMetadata(product: SeoProduct): Metadata {
  const title = `${product.name} | Men's Hub`;
  const description = `Shop ${product.name} at Men's Hub.`;
  const url = `/product/${product.id}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, type: "website", url, images: [{ url: product.imageUrl, alt: product.name }] }, twitter: { card: "summary_large_image", title, description, images: [product.imageUrl] } };
}

export function createProductStructuredData(product: SeoProduct, brandName: string, productUrl: string) {
  return { "@context": "https://schema.org", "@type": "Product", name: product.name, image: [product.imageUrl], brand: { "@type": "Brand", name: brandName }, offers: { "@type": "Offer", url: productUrl, priceCurrency: "PKR", price: product.effectivePrice, availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", itemCondition: "https://schema.org/NewCondition" } };
}
