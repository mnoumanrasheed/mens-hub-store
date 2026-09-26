import "server-only";
import { getPrismaClient } from "@/lib/db/prisma";

export type DashboardMetrics = { totalProducts: number; publishedProducts: number; draftProducts: number; outOfStockProducts: number; categories: number };

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const prisma = getPrismaClient();
  const [totalProducts, publishedProducts, draftProducts, outOfStockProducts, categories] = await Promise.all([
    prisma.product.count(), prisma.product.count({ where: { isPublished: true } }), prisma.product.count({ where: { isPublished: false } }), prisma.product.count({ where: { stock: 0 } }), prisma.category.count(),
  ]);
  return { totalProducts, publishedProducts, draftProducts, outOfStockProducts, categories };
}
