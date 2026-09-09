import { z } from "zod";

const queryValue = z.union([z.string(), z.array(z.string())]).optional().transform((value) => Array.isArray(value) ? value[0] ?? "" : value ?? "");
const optionalMoney = queryValue.refine((value) => value === "" || /^\d{1,10}(?:\.\d{1,2})?$/.test(value), "Invalid price.");

export const storefrontFiltersSchema = z.object({
  q: queryValue.transform((value) => value.trim().slice(0, 100)),
  category: queryValue.transform((value) => value.trim().slice(0, 120)),
  subcategory: queryValue.transform((value) => value.trim().slice(0, 120)),
  minPrice: optionalMoney,
  maxPrice: optionalMoney,
  size: queryValue.transform((value) => value.trim().slice(0, 50)),
  color: queryValue.transform((value) => value.trim().slice(0, 50)),
  sale: queryValue.transform((value) => value === "1" ? "1" : ""),
  newArrival: queryValue.transform((value) => value === "1" ? "1" : ""),
  availability: queryValue.pipe(z.enum(["", "in-stock", "low-stock", "out-of-stock"]).catch("")),
  sort: queryValue.pipe(z.enum(["newest", "price-asc", "price-desc", "discount", "featured"]).catch("newest")),
  page: queryValue.transform((value) => Number(value || 1)).pipe(z.number().int().positive().catch(1)),
}).superRefine((value, context) => {
  if (value.minPrice && value.maxPrice && Number(value.minPrice) > Number(value.maxPrice)) context.addIssue({ code: "custom", path: ["maxPrice"], message: "Maximum price must be at least the minimum price." });
});

export const suggestionQuerySchema = z.string().trim().min(2).max(80);
export type StorefrontFilters = z.infer<typeof storefrontFiltersSchema>;

export function parseStorefrontFilters(input: Record<string, string | string[] | undefined>): StorefrontFilters {
  const parsed = storefrontFiltersSchema.safeParse(input);
  return parsed.success ? parsed.data : storefrontFiltersSchema.parse({});
}
