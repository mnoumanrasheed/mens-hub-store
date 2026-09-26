import { z } from "zod";

export const inventorySchema = z.object({ stock: z.number().int().nonnegative() });
