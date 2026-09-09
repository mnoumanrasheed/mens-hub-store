import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { z } from "zod";

import { PrismaClient } from "../src/generated/prisma/client";

const seedEnvSchema = z.object({
  DATABASE_URL: z.string().trim().refine(
    (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
    "DATABASE_URL must be a PostgreSQL connection string.",
  ),
  ADMIN_SEED_EMAIL: z.email().transform((value) => value.trim().toLowerCase()),
  ADMIN_SEED_PASSWORD: z.string().min(12),
});

type SeedCategory = {
  name: string;
  slug: string;
  directory: string;
  subcategories: readonly string[];
};

const categories: readonly SeedCategory[] = [
  { name: "Shirts", slug: "shirts", directory: "01-Shirts", subcategories: ["Dress Shirts", "Polo Shirts", "Casual Shirts", "T-Shirts", "Down Shoulder Shirts"] },
  { name: "Pants", slug: "pants", directory: "02-Pants", subcategories: ["Jeans", "Cotton Pants", "Dress Pants"] },
  { name: "Shalwar Qameez", slug: "shalwar-qameez", directory: "03-Shalwar-Qameez", subcategories: ["Casual", "Cotton", "Wash & Wear"] },
  { name: "Trousers", slug: "trousers", directory: "04-Trousers", subcategories: [] },
  { name: "Shoes", slug: "shoes", directory: "05-Shoes", subcategories: ["Sneakers", "Formal Shoes", "Loafers", "Sandals"] },
  { name: "Watches", slug: "watches", directory: "06-Watches", subcategories: [] },
  { name: "Perfumes", slug: "perfumes", directory: "07-Perfumes", subcategories: [] },
  { name: "Glasses", slug: "glasses", directory: "08-Glasses", subcategories: [] },
  { name: "Belts", slug: "belts", directory: "09-Belts", subcategories: [] },
  { name: "Accessories", slug: "accessories", directory: "10-Accessories", subcategories: ["Rings", "Bracelets", "Chains", "Wallets"] },
  { name: "Tracksuits", slug: "tracksuits", directory: "11-Tracksuits", subcategories: [] },
];

const imageExtension = /\.(?:jpe?g|png|webp)$/i;
const naturalCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });
const publicDirectory = fileURLToPath(new URL("../public/seed-media/", import.meta.url));

function toSlug(value: string): string {
  return value.trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toWebPath(directory: string, filename: string): string {
  return `/seed-media/${encodeURIComponent(directory)}/${encodeURIComponent(filename)}`;
}

async function findCategoryImages(directory: string): Promise<string[]> {
  try {
    const entries = await readdir(`${publicDirectory}${directory}`, { withFileTypes: true });
    const images = entries
      .filter((entry) => entry.isFile() && imageExtension.test(entry.name))
      .map((entry) => entry.name)
      .sort(naturalCollator.compare);

    if (images.length === 0) {
      console.warn(`[seed] No supported images found in ${directory}.`);
    } else if (images.length === 1) {
      console.warn(`[seed] No banner image found in ${directory}; using primary only.`);
    }
    return images;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      console.warn(`[seed] Missing image directory: ${directory}.`);
      return [];
    }
    throw error;
  }
}

async function main() {
  const env = seedEnvSchema.parse(process.env);
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  try {
    const passwordHash = await hash(env.ADMIN_SEED_PASSWORD, 12);
    await prisma.adminUser.upsert({
      where: { email: env.ADMIN_SEED_EMAIL },
      create: { email: env.ADMIN_SEED_EMAIL, passwordHash },
      update: { passwordHash },
    });

    await prisma.siteSettings.upsert({
      where: { id: "site" },
      create: {
        id: "site",
        brandName: "Men’s Hub",
        tagline: "Style Made for Men",
        proprietors: "Taha Soni / Shahzaib Soni",
        phone: "03081000025",
        whatsapp: "923081000025",
        email: "mens.hub919@gmail.com",
        deliveryChargesMessage: "Calculated / Confirmed on WhatsApp",
        currency: "PKR",
        websiteTitle: "Men’s Hub",
      },
      // Preserve owner-managed settings on repeat seeds.
      update: {},
    });

    const policyPages = [
      ["shipping-policy", "Shipping Policy"],
      ["return-exchange-policy", "Return & Exchange Policy"],
      ["privacy-policy", "Privacy Policy"],
      ["terms-and-conditions", "Terms & Conditions"],
      ["how-to-order", "How to Order"],
      ["size-guide", "Size Guide"],
      ["faq", "FAQ"],
    ] as const;
    for (const [slug, title] of policyPages) {
      await prisma.policyPage.upsert({
        where: { slug },
        create: { slug, title, content: { text: "" }, isPublished: false },
        update: {},
      });
    }

    const homepageBlocks = [
      ["hero", { heading: "MEN’S HUB", tagline: "Style Made for Men", description: "Premium menswear, footwear and accessories crafted for the modern man.", primaryCtaLabel: "SHOP COLLECTION", primaryCtaLink: "/shop", secondaryCtaLabel: "VIEW NEW ARRIVALS", secondaryCtaLink: "/new-arrivals" }],
      ["shop-by-category", { heading: "Shop by Category", description: "" }],
      ["new-arrivals", { heading: "New Arrivals", description: "" }],
      ["sale", { heading: "Sale / Discount Collection", description: "" }],
      ["featured", { heading: "Featured Collection", description: "" }],
      ["why-mens-hub", { heading: "Why Men’s Hub", description: "", point1: "Curated menswear", point2: "Modern designs", point3: "Complete men’s fashion range", point4: "Convenient WhatsApp ordering", point5: "Physical store concept" }],
      ["accessories-spotlight", { heading: "Accessories Spotlight", description: "", ctaLabel: "Explore Accessories", ctaLink: "/shop/accessories" }],
      ["visit-store", { heading: "Visit Our Store", description: "" }],
    ] as const;
    for (const [index, [key, fields]] of homepageBlocks.entries()) {
      await prisma.contentBlock.upsert({
        where: { area_key: { area: "HOMEPAGE", key } },
        create: { area: "HOMEPAGE", key, content: { fields }, sortOrder: index + 1, isActive: true },
        update: {},
      });
    }

    let imageCount = 0;
    let subcategoryCount = 0;
    for (const [categoryIndex, categorySeed] of categories.entries()) {
      const images = await findCategoryImages(categorySeed.directory);
      const primaryImage = images[0] ? toWebPath(categorySeed.directory, images[0]) : null;
      const bannerImage = images[1] ? toWebPath(categorySeed.directory, images[1]) : null;
      imageCount += Math.min(images.length, 2);

      const category = await prisma.category.upsert({
        where: { slug: categorySeed.slug },
        create: {
          name: categorySeed.name,
          slug: categorySeed.slug,
          sortOrder: categoryIndex + 1,
          isActive: true,
          imageUrl: primaryImage,
          bannerImageUrl: bannerImage,
        },
        update: {
          name: categorySeed.name,
          sortOrder: categoryIndex + 1,
          isActive: true,
          ...(primaryImage ? { imageUrl: primaryImage } : {}),
          ...(bannerImage ? { bannerImageUrl: bannerImage } : {}),
        },
      });

      for (const [subcategoryIndex, name] of categorySeed.subcategories.entries()) {
        const slug = toSlug(name);
        await prisma.subcategory.upsert({
          where: { categoryId_slug: { categoryId: category.id, slug } },
          create: {
            categoryId: category.id,
            name,
            slug,
            sortOrder: subcategoryIndex + 1,
            isActive: true,
          },
          update: { name, sortOrder: subcategoryIndex + 1, isActive: true },
        });
        subcategoryCount += 1;
      }
    }

    const productCount = await prisma.product.count();
    console.info(`[seed] Complete: ${categories.length} categories, ${subcategoryCount} subcategories, ${imageCount} category image references, ${productCount} products.`);
    console.info("[seed] No products are created by this seed.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error("[seed] Failed.", error);
  process.exitCode = 1;
});
