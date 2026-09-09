import { describe, expect, it } from "vitest";
import { createProductMetadata, createProductStructuredData } from "@/domain/seo/product";

const product = { slug: "oxford-shirt", name: "Oxford Shirt", sku: "MH-01", imageUrl: "https://res.cloudinary.com/demo/image/upload/oxford.jpg", description: "A refined cotton shirt.", seoTitle: "Oxford Shirt", seoDescription: "Shop the Oxford Shirt.", effectivePrice: "2500.00", availableArticles: 4 };

describe("product SEO", () => {
  it("emits the canonical product URL and product Open Graph image", () => { const metadata = createProductMetadata(product); expect(metadata.alternates?.canonical).toBe("/product/oxford-shirt"); expect(metadata.openGraph).toMatchObject({ url: "/product/oxford-shirt", images: [{ url: product.imageUrl, alt: product.name }] }); });
  it("uses truthful product data without ratings or reviews", () => { const value = createProductStructuredData(product, "Men's Hub", "https://example.com/product/oxford-shirt"); expect(value.offers.availability).toBe("https://schema.org/InStock"); expect(value).not.toHaveProperty("aggregateRating"); expect(value).not.toHaveProperty("review"); });
});
