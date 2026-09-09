import { z } from "zod";

const identifier = z.string().trim().min(1).max(64);
const slug = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

export const categoryInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug,
  description: z.string().trim().max(1000).nullable(),
  removeImage: z.boolean(),
  removeBannerImage: z.boolean(),
});

export const subcategoryInputSchema = z.object({
  categoryId: identifier,
  name: z.string().trim().min(2).max(80),
  slug,
  description: z.string().trim().max(1000).nullable(),
});

export const entityIdSchema = identifier;
export const moveInputSchema = z.object({
  id: identifier,
  direction: z.enum(["up", "down"]),
});

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
