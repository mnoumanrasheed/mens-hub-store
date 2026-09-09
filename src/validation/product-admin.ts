import { z } from "zod";

import { inventorySchema } from "./product";

const id = z.string().trim().min(1).max(64);
const money = z.string().trim().regex(/^\d{1,10}(?:\.\d{1,2})?$/, "Enter a valid amount with up to two decimals.");
const slug = z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const optionLabel = z.string().trim().min(1).max(50);

const sizeSchema = z.object({ label: optionLabel });
const colorSchema = z.object({
  name: optionLabel,
  hexCode: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/).nullable(),
});

function uniqueBy<T>(items: T[], key: (item: T) => string): boolean {
  return new Set(items.map((item) => key(item).toLowerCase())).size === items.length;
}

export const productFormSchema = z
  .object({
    name: z.string().trim().min(2).max(150),
    sku: z.string().trim().min(1).max(80).transform((value) => value.toUpperCase()),
    slug,
    slugMode: z.enum(["auto", "manual"]),
    categoryId: id,
    subcategoryId: id.nullable(),
    productType: z.string().trim().max(80).nullable(),
    originalPrice: money,
    salePrice: money.nullable(),
    description: z.string().trim().min(1).max(10_000),
    material: z.string().trim().max(500).nullable(),
    totalArticles: z.number().int().nonnegative(),
    availableArticles: z.number().int().nonnegative(),
    soldArticles: z.number().int().nonnegative(),
    isPublished: z.boolean(),
    isFeatured: z.boolean(),
    isNewArrival: z.boolean(),
    saleEnabled: z.boolean(),
    saleStartAt: z.date().nullable(),
    saleEndAt: z.date().nullable(),
    seoTitle: z.string().trim().max(70).nullable(),
    seoDescription: z.string().trim().max(170).nullable(),
    sizes: z.array(sizeSchema).max(50),
    colors: z.array(colorSchema).max(50),
  })
  .superRefine((value, context) => {
    const inventory = inventorySchema.safeParse(value);
    if (!inventory.success) {
      for (const issue of inventory.error.issues) {
        context.addIssue({ code: "custom", path: issue.path, message: issue.message });
      }
    }
    if (value.salePrice !== null && Number(value.salePrice) <= 0) {
      context.addIssue({ code: "custom", path: ["salePrice"], message: "Sale price must be greater than zero." });
    } else if (value.salePrice !== null && Number(value.salePrice) >= Number(value.originalPrice)) {
      context.addIssue({ code: "custom", path: ["salePrice"], message: "Sale price must be lower than original price." });
    }
    if (value.saleEnabled && value.salePrice === null) {
      context.addIssue({ code: "custom", path: ["salePrice"], message: "Sale price is required when sale is enabled." });
    }
    if (value.saleStartAt && value.saleEndAt && value.saleEndAt <= value.saleStartAt) {
      context.addIssue({ code: "custom", path: ["saleEndAt"], message: "Sale end must be after sale start." });
    }
    if (!uniqueBy(value.sizes, (item) => item.label)) {
      context.addIssue({ code: "custom", path: ["sizes"], message: "Sizes must be unique." });
    }
    if (!uniqueBy(value.colors, (item) => item.name)) {
      context.addIssue({ code: "custom", path: ["colors"], message: "Colors must be unique." });
    }
  });

export const productIdSchema = id;
export const inventoryUpdateSchema = z
  .object({
    id,
    totalArticles: z.number().int().nonnegative(),
    availableArticles: z.number().int().nonnegative(),
    soldArticles: z.number().int().nonnegative(),
  })
  .superRefine((value, context) => {
    const result = inventorySchema.safeParse(value);
    if (!result.success) {
      for (const issue of result.error.issues) {
        context.addIssue({ code: "custom", path: issue.path, message: issue.message });
      }
    }
  });

export const productListFilterSchema = z.object({
  q: z.string().trim().max(100).default(""),
  category: z.string().trim().max(64).default(""),
  subcategory: z.string().trim().max(64).default(""),
  published: z.enum(["", "published", "unpublished"]).default(""),
  inventory: z.enum(["", "in-stock", "low-stock", "out-of-stock"]).default(""),
  sale: z.enum(["", "active", "inactive"]).default(""),
  newArrival: z.enum(["", "yes", "no"]).default(""),
  featured: z.enum(["", "yes", "no"]).default(""),
  page: z.coerce.number().int().positive().default(1),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
export type ProductListFilters = z.infer<typeof productListFilterSchema>;
