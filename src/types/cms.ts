export const cmsBlockDefinitions = [
  { area: "HOMEPAGE", key: "hero", label: "Hero", image: true, fields: [["heading", "Heading", false], ["tagline", "Tagline", false], ["description", "Description", true], ["primaryCtaLabel", "Primary CTA label", false], ["primaryCtaLink", "Primary CTA link", false], ["secondaryCtaLabel", "Secondary CTA label", false], ["secondaryCtaLink", "Secondary CTA link", false]] },
  { area: "HOMEPAGE", key: "shop-by-category", label: "Shop by Category", fields: [["heading", "Heading", false], ["description", "Description", true]] },
  { area: "HOMEPAGE", key: "new-arrivals", label: "New Arrivals", fields: [["heading", "Heading", false], ["description", "Description", true]] },
  { area: "HOMEPAGE", key: "sale", label: "Sale / Discount Collection", fields: [["heading", "Heading", false], ["description", "Description", true]] },
  { area: "HOMEPAGE", key: "featured", label: "Featured Collection", fields: [["heading", "Heading", false], ["description", "Description", true]] },
  { area: "HOMEPAGE", key: "why-mens-hub", label: "Why Men’s Hub", fields: [["heading", "Heading", false], ["description", "Description", true], ["point1", "Value 1", false], ["point2", "Value 2", false], ["point3", "Value 3", false], ["point4", "Value 4", false], ["point5", "Value 5", false]] },
  { area: "HOMEPAGE", key: "accessories-spotlight", label: "Accessories Spotlight", fields: [["heading", "Heading", false], ["description", "Description", true], ["ctaLabel", "CTA label", false], ["ctaLink", "CTA link", false]] },
  { area: "HOMEPAGE", key: "visit-store", label: "Visit Our Store", fields: [["heading", "Heading", false], ["description", "Description", true]] },
  { area: "ABOUT", key: "overview", label: "About", fields: [["story", "Story", true], ["mission", "Mission", true], ["vision", "Vision", true], ["values", "Values", true], ["whyMensHub", "Why Men’s Hub", true], ["proprietorSection", "Proprietor section", true]] },
  { area: "CONTACT", key: "overview", label: "Contact", fields: [["heading", "Heading", false], ["description", "Description", true]] },
  { area: "FOOTER", key: "overview", label: "Footer", fields: [["heading", "Heading", false], ["description", "Description", true]] },
] as const;

export type CmsArea = (typeof cmsBlockDefinitions)[number]["area"];
export type CmsBlockKey = (typeof cmsBlockDefinitions)[number]["key"];
export type CmsFieldValues = Record<string, string>;

export type CmsBlockValue = {
  fields: CmsFieldValues;
  imageUrl?: string | null;
  imagePublicId?: string | null;
};

export const policyDefinitions = [
  ["shipping-policy", "Shipping Policy"],
  ["return-exchange-policy", "Return & Exchange Policy"],
  ["privacy-policy", "Privacy Policy"],
  ["terms-and-conditions", "Terms & Conditions"],
  ["how-to-order", "How to Order"],
  ["size-guide", "Size Guide"],
  ["faq", "FAQ"],
] as const;
