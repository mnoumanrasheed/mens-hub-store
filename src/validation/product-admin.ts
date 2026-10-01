import { z } from "zod";

const id = z.string().trim().min(1).max(64);
const money = z.string().trim().regex(/^\d{1,10}(?:\.\d{1,2})?$/, "Enter a valid amount with up to two decimals.");
const optionLabel = z.string().trim().min(1).max(50);
const sizeSchema = z.object({ label: optionLabel });
const colorSchema = z.object({ name: optionLabel, hexCode: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/).nullable() });

function uniqueBy<T>(items: T[], key: (item: T) => string): boolean {
  return new Set(items.map((item) => key(item).toLowerCase())).size === items.length;
}

export const productFormSchema = z.object({
  name: z.string().trim().min(2).max(150),
  sku: z.string().trim().max(100).nullable(),
  categoryId: id,
  subcategoryId: id.nullable(),
  originalPrice: money,
  salePrice: money.nullable(),
  stock: z.number().int().nonnegative(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  isNewArrival: z.boolean(),
  sizes: z.array(sizeSchema).max(50),
  colors: z.array(colorSchema).max(50),
}).superRefine((value, context) => {
  if (value.salePrice !== null && (Number(value.salePrice) <= 0 || Number(value.salePrice) >= Number(value.originalPrice))) {
    context.addIssue({ code: "custom", path: ["salePrice"], message: "Sale price must be greater than zero and lower than price." });
  }
  if (!uniqueBy(value.sizes, (item) => item.label)) context.addIssue({ code: "custom", path: ["sizes"], message: "Sizes must be unique." });
  if (!uniqueBy(value.colors, (item) => item.name)) context.addIssue({ code: "custom", path: ["colors"], message: "Colors must be unique." });
});

export const productIdSchema = id;

export type ProductFormInput = z.infer<typeof productFormSchema>;
