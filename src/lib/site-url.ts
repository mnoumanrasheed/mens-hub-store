import "server-only";

import { z } from "zod";

const canonicalUrlSchema = z.string().trim().url().transform((value) => new URL(value));

export function getSiteUrl(): URL {
  const result = canonicalUrlSchema.safeParse(process.env.NEXT_PUBLIC_SITE_URL);
  if (!result.success) throw new Error("NEXT_PUBLIC_SITE_URL must be a valid absolute URL.");
  return result.data;
}
