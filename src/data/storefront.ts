import "server-only";

import { getSalePresentation } from "@/domain/product/sale";
import { getPrismaClient } from "@/lib/db/prisma";
import type { CmsBlockValue } from "@/types/cms";
import { initialSettings } from "@/data/cms";
import type { Prisma } from "@/generated/prisma/client";
import type { StorefrontFilters } from "@/validation/storefront";
import { cache } from "react";

export type StorefrontCategory = { id: string; name: string; slug: string; description: string | null; imageUrl: string | null; bannerImageUrl: string | null };
export type StorefrontProduct = { id: string; name: string; sku: string; slug: string; imageUrl: string; originalPrice: string; effectivePrice: string; discountPercent: number | null; isSale: boolean; isNewArrival: boolean; availableArticles: number; lowStockThreshold: number; sizes: { label: string }[]; colors: { name: string; hexCode: string | null }[] };
export type PublicSettings = Omit<typeof initialSettings, "ogImagePublicId"> & { createdAt?: Date; updatedAt?: Date };

const productSelect = {
  id: true, name: true, sku: true, slug: true, imageUrl: true, originalPrice: true, salePrice: true, saleEnabled: true, saleStartAt: true, saleEndAt: true, isNewArrival: true, availableArticles: true,
  sizes: { orderBy: { sortOrder: "asc" as const }, select: { label: true } },
  colors: { orderBy: { sortOrder: "asc" as const }, select: { name: true, hexCode: true } },
};

function readFields(content: unknown): CmsBlockValue {
  if (!content || typeof content !== "object" || Array.isArray(content)) return { fields: {} };
  const raw = content as Record<string, unknown>;
  const fields = raw.fields && typeof raw.fields === "object" && !Array.isArray(raw.fields) ? Object.fromEntries(Object.entries(raw.fields).filter((entry): entry is [string, string] => typeof entry[1] === "string")) : {};
  return { fields, imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : null };
}

function productDto(product: { id: string; name: string; sku: string; slug: string; imageUrl: string; originalPrice: { toFixed(value: number): string }; salePrice: { toFixed(value: number): string } | null; saleEnabled: boolean; saleStartAt: Date | null; saleEndAt: Date | null; isNewArrival: boolean; availableArticles: number; sizes: { label: string }[]; colors: { name: string; hexCode: string | null }[] }, threshold: number, now: Date): StorefrontProduct {
  const originalPrice = product.originalPrice.toFixed(2);
  const salePrice = product.salePrice?.toFixed(2) ?? null;
  const sale = getSalePresentation({ originalPrice, salePrice, saleEnabled: product.saleEnabled, saleStartAt: product.saleStartAt, saleEndAt: product.saleEndAt }, now);
  return { id: product.id, name: product.name, sku: product.sku, slug: product.slug, imageUrl: product.imageUrl, originalPrice, effectivePrice: sale.effectivePrice, discountPercent: sale.discountPercent, isSale: sale.active, isNewArrival: product.isNewArrival, availableArticles: product.availableArticles, lowStockThreshold: threshold, sizes: product.sizes, colors: product.colors };
}

export async function getStorefrontShellData() {
  const prisma = getPrismaClient();
  const [settings, categories] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "site" } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true, slug: true } }),
  ]);
  return { settings: settings ?? initialSettings, categories };
}

export async function getHomepageData() {
  const prisma = getPrismaClient();
  const now = new Date();
  const [settings, blockRows, categories, newProducts, saleProducts, featuredProducts] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "site" } }),
    prisma.contentBlock.findMany({ where: { area: "HOMEPAGE", isActive: true }, orderBy: { sortOrder: "asc" }, select: { key: true, content: true } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true, slug: true, description: true, imageUrl: true, bannerImageUrl: true } }),
    prisma.product.findMany({ where: { isPublished: true, isNewArrival: true, category: { isActive: true }, OR: [{ subcategoryId: null }, { subcategory: { isActive: true } }] }, orderBy: { createdAt: "desc" }, take: 8, select: productSelect }),
    prisma.product.findMany({ where: { isPublished: true, saleEnabled: true, salePrice: { not: null }, category: { isActive: true }, OR: [{ subcategoryId: null }, { subcategory: { isActive: true } }], AND: [{ OR: [{ saleStartAt: null }, { saleStartAt: { lte: now } }] }, { OR: [{ saleEndAt: null }, { saleEndAt: { gte: now } }] }] }, orderBy: { createdAt: "desc" }, take: 8, select: productSelect }),
    prisma.product.findMany({ where: { isPublished: true, isFeatured: true, category: { isActive: true }, OR: [{ subcategoryId: null }, { subcategory: { isActive: true } }] }, orderBy: { createdAt: "desc" }, take: 8, select: productSelect }),
  ]);
  const publicSettings = settings ?? initialSettings;
  const threshold = publicSettings.lowStockThreshold;
  const blocks = Object.fromEntries(blockRows.map((block) => [block.key, readFields(block.content)]));
  return { settings: publicSettings, blocks, categories, newProducts: newProducts.map((product) => productDto(product, threshold, now)), saleProducts: saleProducts.map((product) => productDto(product, threshold, now)), featuredProducts: featuredProducts.map((product) => productDto(product, threshold, now)) };
}

type CollectionKind = "all" | "new" | "sale";
const pageSize = 24;

export async function getStorefrontCollection({ kind = "all", categorySlug, subcategorySlug, filters }: { kind?: CollectionKind; categorySlug?: string; subcategorySlug?: string; filters: StorefrontFilters }) {
  const prisma = getPrismaClient();
  const now = new Date();
  const [settings, categories] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "site" }, select: { lowStockThreshold: true } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true, slug: true, description: true, subcategories: { where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true, slug: true } } } }),
  ]);
  const requestedCategorySlug = categorySlug || filters.category;
  const category = requestedCategorySlug ? categories.find((item) => item.slug === requestedCategorySlug) ?? null : null;
  if (requestedCategorySlug && !category) return null;
  const requestedSubcategorySlug = subcategorySlug || filters.subcategory;
  const subcategory = requestedSubcategorySlug ? category?.subcategories.find((item) => item.slug === requestedSubcategorySlug) ?? null : null;
  if (requestedSubcategorySlug && !subcategory) return null;
  const threshold = settings?.lowStockThreshold ?? 3;
  const clauses: Prisma.ProductWhereInput[] = [
    { isPublished: true },
    { category: { isActive: true } },
    { OR: [{ subcategoryId: null }, { subcategory: { isActive: true } }] },
  ];
  if (category) clauses.push({ categoryId: category.id });
  if (subcategory) clauses.push({ subcategoryId: subcategory.id });
  if (filters.q) clauses.push({ OR: [{ name: { contains: filters.q, mode: "insensitive" } }, { sku: { contains: filters.q, mode: "insensitive" } }, { productType: { contains: filters.q, mode: "insensitive" } }, { category: { name: { contains: filters.q, mode: "insensitive" } } }, { subcategory: { name: { contains: filters.q, mode: "insensitive" } } }] });
  if (filters.size) clauses.push({ sizes: { some: { label: { equals: filters.size, mode: "insensitive" } } } });
  if (filters.color) clauses.push({ colors: { some: { name: { equals: filters.color, mode: "insensitive" } } } });
  if (filters.newArrival === "1" || kind === "new") clauses.push({ isNewArrival: true });
  if (filters.availability === "out-of-stock") clauses.push({ availableArticles: 0 });
  if (filters.availability === "low-stock") clauses.push({ availableArticles: { gt: 0, lte: threshold } });
  if (filters.availability === "in-stock") clauses.push({ availableArticles: { gt: threshold } });
  if (filters.sale === "1" || kind === "sale") clauses.push({ saleEnabled: true, salePrice: { not: null }, AND: [{ OR: [{ saleStartAt: null }, { saleStartAt: { lte: now } }] }, { OR: [{ saleEndAt: null }, { saleEndAt: { gte: now } }] }] });
  const where: Prisma.ProductWhereInput = { AND: clauses };
  const candidates = await prisma.product.findMany({ where, select: { id: true, originalPrice: true, salePrice: true, saleEnabled: true, saleStartAt: true, saleEndAt: true, createdAt: true, isFeatured: true } });
  const ordered = candidates.map((candidate) => ({ candidate, sale: getSalePresentation({ originalPrice: candidate.originalPrice.toFixed(2), salePrice: candidate.salePrice?.toFixed(2) ?? null, saleEnabled: candidate.saleEnabled, saleStartAt: candidate.saleStartAt, saleEndAt: candidate.saleEndAt }, now) })).filter(({ sale }) => (!filters.minPrice || Number(sale.effectivePrice) >= Number(filters.minPrice)) && (!filters.maxPrice || Number(sale.effectivePrice) <= Number(filters.maxPrice)));
  ordered.sort((left, right) => {
    if (filters.sort === "price-asc") return Number(left.sale.effectivePrice) - Number(right.sale.effectivePrice);
    if (filters.sort === "price-desc") return Number(right.sale.effectivePrice) - Number(left.sale.effectivePrice);
    if (filters.sort === "discount") return (right.sale.discountPercent ?? 0) - (left.sale.discountPercent ?? 0) || right.candidate.createdAt.getTime() - left.candidate.createdAt.getTime();
    if (filters.sort === "featured") return Number(right.candidate.isFeatured) - Number(left.candidate.isFeatured) || right.candidate.createdAt.getTime() - left.candidate.createdAt.getTime();
    return right.candidate.createdAt.getTime() - left.candidate.createdAt.getTime();
  });
  const total = ordered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(filters.page, pageCount);
  const ids = ordered.slice((page - 1) * pageSize, page * pageSize).map(({ candidate }) => candidate.id);
  const rows = ids.length ? await prisma.product.findMany({ where: { id: { in: ids } }, select: productSelect }) : [];
  const byId = new Map(rows.map((row) => [row.id, row]));
  const optionWhere: Prisma.ProductWhereInput = { isPublished: true, category: { isActive: true }, OR: [{ subcategoryId: null }, { subcategory: { isActive: true } }], ...(category ? { categoryId: category.id } : {}) };
  const [sizeRows, colorRows] = await Promise.all([
    prisma.productSize.findMany({ where: { product: optionWhere }, distinct: ["label"], orderBy: { label: "asc" }, select: { label: true } }),
    prisma.productColor.findMany({ where: { product: optionWhere }, distinct: ["name"], orderBy: { name: "asc" }, select: { name: true } }),
  ]);
  return { category, subcategory, categories, products: ids.flatMap((id) => { const row = byId.get(id); return row ? [productDto(row, threshold, now)] : []; }), options: { sizes: sizeRows.map((item) => item.label), colors: colorRows.map((item) => item.name) }, total, page, pageCount };
}

export async function getSearchSuggestions(query: string) {
  return getPrismaClient().product.findMany({ where: { isPublished: true, category: { isActive: true }, AND: [{ OR: [{ subcategoryId: null }, { subcategory: { isActive: true } }] }, { OR: [{ name: { contains: query, mode: "insensitive" } }, { sku: { contains: query, mode: "insensitive" } }, { productType: { contains: query, mode: "insensitive" } }, { category: { name: { contains: query, mode: "insensitive" } } }, { subcategory: { name: { contains: query, mode: "insensitive" } } }] }] }, orderBy: { createdAt: "desc" }, take: 6, select: { id: true, name: true, sku: true, slug: true, imageUrl: true, category: { select: { name: true } } } });
}

export const getStorefrontProduct = cache(async function getStorefrontProduct(slug: string) {
  const prisma = getPrismaClient(); const now = new Date();
  const [settings, product] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "site" }, select: { brandName: true, whatsapp: true, whatsappGreeting: true, whatsappOrderStatement: true, deliveryChargesMessage: true, lowStockThreshold: true } }),
    prisma.product.findFirst({ where: { slug, isPublished: true, category: { isActive: true }, OR: [{ subcategoryId: null }, { subcategory: { isActive: true } }] }, select: { ...productSelect, description: true, material: true, productType: true, seoTitle: true, seoDescription: true, category: { select: { id: true, name: true, slug: true } }, subcategory: { select: { id: true, name: true, slug: true } } } }),
  ]);
  if (!product) return null;
  const publicSettings = settings ?? initialSettings;
  const presentation = productDto(product, publicSettings.lowStockThreshold, now);
  const relatedRows = await prisma.product.findMany({ where: { id: { not: product.id }, isPublished: true, categoryId: product.category.id, category: { isActive: true }, OR: [{ subcategoryId: null }, { subcategory: { isActive: true } }] }, orderBy: { createdAt: "desc" }, take: 12, select: { ...productSelect, subcategoryId: true } });
  relatedRows.sort((left, right) => Number(right.subcategoryId === product.subcategory?.id) - Number(left.subcategoryId === product.subcategory?.id));
  return { ...presentation, description: product.description, material: product.material, productType: product.productType, category: product.category, subcategory: product.subcategory, sizes: product.sizes, seoTitle: product.seoTitle, seoDescription: product.seoDescription, relatedProducts: relatedRows.slice(0, 4).map((row) => productDto(row, publicSettings.lowStockThreshold, now)), ordering: { brandName: publicSettings.brandName, whatsapp: publicSettings.whatsapp, greeting: publicSettings.whatsappGreeting, statement: publicSettings.whatsappOrderStatement, deliveryMessage: publicSettings.deliveryChargesMessage } };
});

export const getCategorySeo = cache(async function getCategorySeo(categorySlug: string, subcategorySlug?: string) {
  const category = await getPrismaClient().category.findFirst({ where: { slug: categorySlug, isActive: true }, select: { name: true, slug: true, description: true, imageUrl: true, bannerImageUrl: true, subcategories: subcategorySlug ? { where: { slug: subcategorySlug, isActive: true }, take: 1, select: { name: true, slug: true, description: true } } : false } });
  if (!category || (subcategorySlug && !category.subcategories[0])) return null;
  return { category, subcategory: subcategorySlug ? category.subcategories[0] : null };
});

export async function getSitemapData() {
  const prisma = getPrismaClient();
  const [products, categories, policies] = await Promise.all([
    prisma.product.findMany({ where: { isPublished: true, category: { isActive: true }, OR: [{ subcategoryId: null }, { subcategory: { isActive: true } }] }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true, subcategories: { where: { isActive: true }, select: { slug: true, updatedAt: true } } } }),
    prisma.policyPage.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);
  return { products, categories, policies };
}
