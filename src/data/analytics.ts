import "server-only";

import { AnalyticsEventType } from "@/generated/prisma/enums";
import { getPrismaClient } from "@/lib/db/prisma";

const RANKING_LIMIT = 8;
const ACTIVITY_LIMIT = 20;

export async function getAdminAnalytics() {
  const prisma = getPrismaClient();
  const settings = await prisma.siteSettings.findUnique({ where: { id: "site" }, select: { lowStockThreshold: true } });
  const threshold = settings?.lowStockThreshold ?? 3;
  const ranking = (type: AnalyticsEventType) => prisma.analyticsEvent.groupBy({ by: ["productId"], where: { type, productId: { not: null } }, _count: { id: true }, orderBy: { _count: { id: "desc" } }, take: RANKING_LIMIT });
  const [views, clicks, inquiries, recentActivity, inventoryAlerts] = await Promise.all([
    ranking(AnalyticsEventType.PRODUCT_VIEW),
    ranking(AnalyticsEventType.PRODUCT_CLICK),
    ranking(AnalyticsEventType.WHATSAPP_CLICK),
    prisma.analyticsEvent.findMany({ orderBy: { createdAt: "desc" }, take: ACTIVITY_LIMIT, select: { id: true, type: true, createdAt: true, product: { select: { name: true, sku: true } } } }),
    prisma.product.findMany({ where: { availableArticles: { lte: threshold } }, orderBy: [{ availableArticles: "asc" }, { name: "asc" }], take: 20, select: { id: true, name: true, sku: true, availableArticles: true, isPublished: true } }),
  ]);
  const productIds = [...new Set([...views, ...clicks, ...inquiries].flatMap((row) => row.productId ? [row.productId] : []))];
  const products = productIds.length ? await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, name: true, sku: true } }) : [];
  const byId = new Map(products.map((product) => [product.id, product]));
  const hydrate = (rows: typeof views) => rows.flatMap((row) => { const product = row.productId ? byId.get(row.productId) : null; return product ? [{ ...product, count: row._count.id }] : []; });
  return { mostViewed: hydrate(views), mostClicked: hydrate(clicks), mostInquired: hydrate(inquiries), recentActivity, inventoryAlerts };
}
