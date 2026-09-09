import { NextResponse } from "next/server";
import { z } from "zod";
import { AnalyticsEventType } from "@/generated/prisma/enums";
import { initialSettings } from "@/data/cms";
import { getSalePresentation } from "@/domain/product/sale";
import { createCartInquiryMessage, createWhatsAppUrl, WHATSAPP_NUMBER } from "@/domain/whatsapp/product-inquiry";
import { getPrismaClient } from "@/lib/db/prisma";
import { acceptPublicRequest } from "@/lib/public-rate-limit";
import { getSiteUrl } from "@/lib/site-url";

const lineSchema = z.object({
  productId: z.string().trim().min(1).max(150),
  selectedSize: z.string().trim().max(100).default(""),
  selectedColor: z.string().trim().max(100).default(""),
  quantity: z.number().int().min(1).max(100_000),
}).strict();
const requestSchema = z.object({ lines: z.array(lineSchema).min(1).max(50) }).strict();

export async function POST(request: Request) {
  if (!(await acceptPublicRequest(request, "whatsapp", 20))) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "The cart details are invalid." }, { status: 400 });

  const prisma = getPrismaClient();
  const grouped = new Map<string, z.infer<typeof lineSchema>>();
  for (const line of parsed.data.lines) {
    const key = JSON.stringify([line.productId, line.selectedSize, line.selectedColor]);
    const previous = grouped.get(key);
    grouped.set(key, { ...line, quantity: Math.min(100_000, (previous?.quantity ?? 0) + line.quantity) });
  }
  const requestedLines = [...grouped.values()];
  const ids = [...new Set(requestedLines.map((line) => line.productId))];
  const [settings, products] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "site" }, select: { brandName: true, whatsappGreeting: true, whatsappOrderStatement: true, deliveryChargesMessage: true } }),
    prisma.product.findMany({
      where: { id: { in: ids }, isPublished: true, category: { isActive: true }, OR: [{ subcategoryId: null }, { subcategory: { isActive: true } }] },
      select: { id: true, name: true, sku: true, slug: true, imageUrl: true, originalPrice: true, salePrice: true, saleEnabled: true, saleStartAt: true, saleEndAt: true, availableArticles: true, sizes: { select: { label: true } }, colors: { select: { name: true } } },
    }),
  ]);
  const byId = new Map(products.map((product) => [product.id, product]));
  const now = new Date();
  const siteUrl = getSiteUrl();
  const reconciled = [];

  for (const requested of requestedLines) {
    const product = byId.get(requested.productId);
    if (!product || product.availableArticles < 1) return NextResponse.json({ error: "One or more products are no longer available. Review your cart and try again." }, { status: 409 });
    const sizes = product.sizes.map((item) => item.label);
    const colors = product.colors.map((item) => item.name);
    if ((sizes.length && !sizes.includes(requested.selectedSize)) || (!sizes.length && requested.selectedSize)) return NextResponse.json({ error: `${product.name} has an invalid size selection.` }, { status: 409 });
    if ((colors.length && !colors.includes(requested.selectedColor)) || (!colors.length && requested.selectedColor)) return NextResponse.json({ error: `${product.name} has an invalid color selection.` }, { status: 409 });
    const sale = getSalePresentation({ originalPrice: product.originalPrice.toFixed(2), salePrice: product.salePrice?.toFixed(2) ?? null, saleEnabled: product.saleEnabled, saleStartAt: product.saleStartAt, saleEndAt: product.saleEndAt }, now);
    reconciled.push({ lineId: JSON.stringify([product.id, requested.selectedSize, requested.selectedColor]), id: product.id, slug: product.slug, name: product.name, sku: product.sku, imageUrl: product.imageUrl, price: sale.effectivePrice, availableStock: product.availableArticles, sizes, colors, selectedSize: requested.selectedSize, selectedColor: requested.selectedColor, quantity: Math.min(requested.quantity, product.availableArticles), productUrl: new URL(`/product/${product.slug}`, siteUrl).toString() });
  }

  const uniqueProducts = [...new Set(reconciled.map((line) => line.id))];
  await prisma.analyticsEvent.createMany({ data: uniqueProducts.map((productId) => ({ type: AnalyticsEventType.WHATSAPP_CLICK, productId })) });
  const publicSettings = settings ?? initialSettings;
  const message = createCartInquiryMessage({ greeting: publicSettings.whatsappGreeting || `Greeting from ${publicSettings.brandName}`, statement: publicSettings.whatsappOrderStatement || "I would like to place this order.", deliveryMessage: publicSettings.deliveryChargesMessage, lines: reconciled });
  return NextResponse.json({ url: createWhatsAppUrl(WHATSAPP_NUMBER, message), lines: reconciled }, { headers: { "Cache-Control": "private, no-store" } });
}
