import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import { AdminAuditAction } from "@/generated/prisma/enums";
import { getPrismaClient } from "@/lib/db/prisma";
import type { CmsBlockValue } from "@/types/cms";
import type { AnnouncementInput, ContentBlockInput, PolicyInput, SettingsInput } from "@/validation/cms";

export const initialSettings = {
  brandName: "Men’s Hub",
  tagline: "Style Made for Men",
  proprietors: "Taha Soni / Shahzaib Soni",
  phone: "03081000025",
  whatsapp: "923081000025",
  email: "mens.hub919@gmail.com",
  deliveryChargesMessage: "Calculated / Confirmed on WhatsApp",
  whatsappGreeting: null,
  whatsappOrderStatement: null,
  currency: "PKR" as const,
  lowStockThreshold: 3,
  websiteTitle: "Men’s Hub",
  instagramUrl: null,
  facebookUrl: null,
  tiktokUrl: null,
  address: null,
  googleMapsUrl: null,
  storeTiming: null,
  metaDescription: null,
  ogImageUrl: null,
  ogImagePublicId: null,
};

export async function getSettingsForAdmin() {
  return (await getPrismaClient().siteSettings.findUnique({ where: { id: "site" } })) ?? initialSettings;
}

export async function saveSettings(adminId: string, input: SettingsInput, image?: { ogImageUrl: string; ogImagePublicId: string }) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const previous = await transaction.siteSettings.findUnique({ where: { id: "site" }, select: { ogImagePublicId: true } });
    const { removeOgImage, ...values } = input;
    const media = image ?? (removeOgImage ? { ogImageUrl: null, ogImagePublicId: null } : {});
    const settings = await transaction.siteSettings.upsert({
      where: { id: "site" },
      create: { id: "site", ...values, ...media },
      update: { ...values, ...media },
    });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.SETTINGS_UPDATED, entityId: "site" } });
    return { settings, previousPublicId: previous?.ogImagePublicId ?? null };
  });
}

function readBlock(value: Prisma.JsonValue): CmsBlockValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { fields: {} };
  const candidate = value as Record<string, unknown>;
  const fields = candidate.fields && typeof candidate.fields === "object" && !Array.isArray(candidate.fields)
    ? Object.fromEntries(Object.entries(candidate.fields).filter((entry): entry is [string, string] => typeof entry[1] === "string"))
    : {};
  return { fields, imageUrl: typeof candidate.imageUrl === "string" ? candidate.imageUrl : null, imagePublicId: typeof candidate.imagePublicId === "string" ? candidate.imagePublicId : null };
}

export async function getContentForAdmin() {
  const prisma = getPrismaClient();
  const [blocks, policies, announcement] = await Promise.all([
    prisma.contentBlock.findMany({ orderBy: [{ area: "asc" }, { sortOrder: "asc" }] }),
    prisma.policyPage.findMany({ orderBy: { slug: "asc" } }),
    prisma.announcement.findFirst({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
  ]);
  return {
    blocks: blocks.map((block) => ({ id: block.id, area: block.area, key: block.key, title: block.title, content: readBlock(block.content), isActive: block.isActive })),
    policies: policies.map((policy) => ({ ...policy, content: typeof readBlock(policy.content).fields.text === "string" ? readBlock(policy.content).fields.text : (typeof (policy.content as { text?: unknown })?.text === "string" ? (policy.content as { text: string }).text : ""), publishedAt: policy.publishedAt?.toISOString() ?? null, createdAt: policy.createdAt.toISOString(), updatedAt: policy.updatedAt.toISOString() })),
    announcement: announcement ? { ...announcement, startAt: announcement.startAt?.toISOString() ?? null, endAt: announcement.endAt?.toISOString() ?? null, createdAt: announcement.createdAt.toISOString(), updatedAt: announcement.updatedAt.toISOString() } : null,
  };
}

export async function saveContentBlock(adminId: string, input: ContentBlockInput, image?: { imageUrl: string; imagePublicId: string }) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const existing = await transaction.contentBlock.findUnique({ where: { area_key: { area: input.area, key: input.key } } });
    const previousContent = existing ? readBlock(existing.content) : { fields: {} };
    const content: CmsBlockValue = { fields: input.fields, imageUrl: image?.imageUrl ?? (input.removeImage ? null : previousContent.imageUrl), imagePublicId: image?.imagePublicId ?? (input.removeImage ? null : previousContent.imagePublicId) };
    const definitionOrder = input.area === "HOMEPAGE" ? ["hero", "shop-by-category", "new-arrivals", "sale", "featured", "why-mens-hub", "accessories-spotlight", "visit-store"].indexOf(input.key) + 1 : 1;
    const block = await transaction.contentBlock.upsert({ where: { area_key: { area: input.area, key: input.key } }, create: { area: input.area, key: input.key, content: content as Prisma.InputJsonValue, sortOrder: Math.max(1, definitionOrder) }, update: { content: content as Prisma.InputJsonValue } });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.CONTENT_UPDATED, entityId: block.id } });
    return { block, previousPublicId: previousContent.imagePublicId ?? null };
  });
}

export async function savePolicy(adminId: string, input: PolicyInput) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const existing = await transaction.policyPage.findUnique({ where: { slug: input.slug }, select: { id: true, publishedAt: true } });
    const policy = await transaction.policyPage.upsert({ where: { slug: input.slug }, create: { slug: input.slug, title: input.title, content: { text: input.text }, isPublished: input.isPublished, seoTitle: input.seoTitle, seoDescription: input.seoDescription, publishedAt: input.isPublished ? new Date() : null }, update: { title: input.title, content: { text: input.text }, isPublished: input.isPublished, seoTitle: input.seoTitle, seoDescription: input.seoDescription, publishedAt: input.isPublished ? existing?.publishedAt ?? new Date() : null } });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.POLICY_UPDATED, entityId: policy.id } });
    return policy;
  });
}

export async function saveAnnouncement(adminId: string, input: AnnouncementInput) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const values = { text: input.text, linkUrl: input.linkUrl, linkLabel: input.linkLabel, background: input.background, enabled: input.enabled, startAt: input.startAt, endAt: input.endAt };
    const announcement = input.id ? await transaction.announcement.update({ where: { id: input.id }, data: values }) : await transaction.announcement.create({ data: values });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.ANNOUNCEMENT_UPDATED, entityId: announcement.id } });
    return announcement;
  });
}

export async function getPublicSiteSettings() {
  const settings = await getPrismaClient().siteSettings.findUnique({ where: { id: "site" } });
  if (!settings) return initialSettings;
  const { ogImagePublicId: _privateMediaId, ...publicSettings } = settings;
  void _privateMediaId;
  return publicSettings;
}

export async function getActiveAnnouncement(at = new Date()) {
  return getPrismaClient().announcement.findFirst({ where: { enabled: true, AND: [{ OR: [{ startAt: null }, { startAt: { lte: at } }] }, { OR: [{ endAt: null }, { endAt: { gte: at } }] }] }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], select: { text: true, linkUrl: true, linkLabel: true, background: true } });
}

export async function getPublishedPolicy(slug: string) {
  const policy = await getPrismaClient().policyPage.findFirst({ where: { slug, isPublished: true }, select: { slug: true, title: true, content: true, seoTitle: true, seoDescription: true, updatedAt: true } });
  if (!policy) return null;
  const raw = policy.content as { text?: unknown };
  return { ...policy, text: typeof raw?.text === "string" ? raw.text : "" };
}

export async function getPublicContentBlock(area: "HOMEPAGE" | "ABOUT" | "CONTACT" | "FOOTER", key: string) {
  const block = await getPrismaClient().contentBlock.findUnique({ where: { area_key: { area, key } }, select: { content: true, isActive: true } });
  return block?.isActive ? readBlock(block.content) : null;
}
