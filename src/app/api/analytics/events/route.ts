import { NextResponse } from "next/server";
import { z } from "zod";
import { AnalyticsEventType } from "@/generated/prisma/enums";
import { acceptPublicRequest } from "@/lib/public-rate-limit";
import { getPrismaClient } from "@/lib/db/prisma";

const eventSchema = z.object({ type: z.enum([AnalyticsEventType.PRODUCT_VIEW, AnalyticsEventType.PRODUCT_CLICK, AnalyticsEventType.WHATSAPP_CLICK]), productId: z.string().trim().min(1).max(150).optional() }).strict().superRefine((value, context) => { if (value.type !== AnalyticsEventType.WHATSAPP_CLICK && !value.productId) context.addIssue({ code: "custom", path: ["productId"], message: "A product is required." }); });

export async function POST(request: Request) {
  if (!(await acceptPublicRequest(request, "analytics", 60))) return new NextResponse(null, { status: 429 });
  const parsed = eventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  if (parsed.data.productId) { const product = await getPrismaClient().product.findFirst({ where: { id: parsed.data.productId, isPublished: true }, select: { id: true } }); if (!product) return new NextResponse(null, { status: 204 }); }
  await getPrismaClient().analyticsEvent.create({ data: { type: parsed.data.type, productId: parsed.data.productId } });
  return new NextResponse(null, { status: 204 });
}
