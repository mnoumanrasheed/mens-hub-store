import { z } from "zod";

const requiredValue = z.string().trim().min(1);

export const databaseEnvSchema = z.object({
  DATABASE_URL: requiredValue.refine(
    (value) => value.startsWith("postgresql://") || value.startsWith("postgres://"),
    "DATABASE_URL must be a PostgreSQL connection string.",
  ),
});

export const sessionEnvSchema = z.object({
  SESSION_SECRET: z.string().min(32),
});

export const cloudinaryEnvSchema = z.object({
  CLOUDINARY_CLOUD_NAME: requiredValue,
  CLOUDINARY_API_KEY: requiredValue,
  CLOUDINARY_API_SECRET: requiredValue,
});

export const serverEnvSchema = z.object({
  DATABASE_URL: databaseEnvSchema.shape.DATABASE_URL,
  DIRECT_URL: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        value.startsWith("postgresql://") ||
        value.startsWith("postgres://"),
      "DIRECT_URL must be empty or a PostgreSQL connection string.",
    )
    .optional(),
  SESSION_SECRET: sessionEnvSchema.shape.SESSION_SECRET,
  ADMIN_SEED_EMAIL: z.email(),
  ADMIN_SEED_PASSWORD: z.string().min(12),
  CLOUDINARY_CLOUD_NAME: cloudinaryEnvSchema.shape.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: cloudinaryEnvSchema.shape.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: cloudinaryEnvSchema.shape.CLOUDINARY_API_SECRET,
  NEXT_PUBLIC_SITE_URL: z.url(),
});

export const publicEnvSchema = serverEnvSchema.pick({
  NEXT_PUBLIC_SITE_URL: true,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type PublicEnv = z.infer<typeof publicEnvSchema>;
