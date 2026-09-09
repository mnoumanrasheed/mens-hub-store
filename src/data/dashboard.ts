import "server-only";

import { AnalyticsEventType } from "@/generated/prisma/enums";
import { getPrismaClient } from "@/lib/db/prisma";

export type DashboardMetrics = {
  totalProducts: number;
  availableProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  saleProducts: number;
  newArrivals: number;
  categories: number;
  subcategories: number;
  whatsappClicks: number;
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const prisma = getPrismaClient();
  const now = new Date();
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "site" },
    select: { lowStockThreshold: true },
  });
  const lowStockThreshold = settings?.lowStockThreshold ?? 3;

  const [
    totalProducts,
    availableProducts,
    outOfStockProducts,
    lowStockProducts,
    saleProducts,
    newArrivals,
    categories,
    subcategories,
    whatsappClicks,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { availableArticles: { gt: 0 } } }),
    prisma.product.count({ where: { availableArticles: 0 } }),
    prisma.product.count({
      where: {
        availableArticles: { gt: 0, lte: lowStockThreshold },
      },
    }),
    prisma.product.count({
      where: {
        saleEnabled: true,
        salePrice: { not: null },
        AND: [
          { OR: [{ saleStartAt: null }, { saleStartAt: { lte: now } }] },
          { OR: [{ saleEndAt: null }, { saleEndAt: { gte: now } }] },
        ],
      },
    }),
    prisma.product.count({ where: { isNewArrival: true } }),
    prisma.category.count(),
    prisma.subcategory.count(),
    prisma.analyticsEvent.count({
      where: { type: AnalyticsEventType.WHATSAPP_CLICK },
    }),
  ]);

  return {
    totalProducts,
    availableProducts,
    outOfStockProducts,
    lowStockProducts,
    saleProducts,
    newArrivals,
    categories,
    subcategories,
    whatsappClicks,
  };
}
