import { z } from "zod";

export const inventorySchema = z
  .object({
    totalArticles: z.number().int().nonnegative(),
    availableArticles: z.number().int().nonnegative(),
    soldArticles: z.number().int().nonnegative(),
  })
  .superRefine((inventory, context) => {
    if (inventory.availableArticles > inventory.totalArticles) {
      context.addIssue({
        code: "custom",
        path: ["availableArticles"],
        message: "Available articles cannot exceed total articles.",
      });
    }

    if (inventory.soldArticles > inventory.totalArticles) {
      context.addIssue({
        code: "custom",
        path: ["soldArticles"],
        message: "Sold articles cannot exceed total articles.",
      });
    }

    if (
      inventory.availableArticles + inventory.soldArticles >
      inventory.totalArticles
    ) {
      context.addIssue({
        code: "custom",
        path: ["availableArticles"],
        message: "Available and sold articles cannot exceed total articles.",
      });
    }
  });
