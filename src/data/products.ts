import "server-only";

import { AdminAuditAction } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import type { ProductFormInput, ProductListFilters } from "@/validation/product-admin";
import { getPrismaClient } from "@/lib/db/prisma";

export type ProductFormOption = {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
};

export type ProductEditorDto = Omit<ProductFormInput, "saleStartAt" | "saleEndAt" | "slugMode"> & {
  id: string;
  imageUrl: string;
  saleStartAt: string | null;
  saleEndAt: string | null;
};

const pageSize = 20;

export async function getProductFormOptions(): Promise<ProductFormOption[]> {
  return getPrismaClient().category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      subcategories: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { id: true, name: true },
      },
    },
  });
}

export async function getProductForEdit(id: string): Promise<ProductEditorDto | null> {
  const product = await getPrismaClient().product.findUnique({
    where: { id },
    include: {
      sizes: { orderBy: { sortOrder: "asc" } },
      colors: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    slug: product.slug,
    categoryId: product.categoryId,
    subcategoryId: product.subcategoryId,
    productType: product.productType,
    imageUrl: product.imageUrl,
    originalPrice: product.originalPrice.toFixed(2),
    salePrice: product.salePrice?.toFixed(2) ?? null,
    description: product.description,
    material: product.material,
    totalArticles: product.totalArticles,
    availableArticles: product.availableArticles,
    soldArticles: product.soldArticles,
    isPublished: product.isPublished,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    saleEnabled: product.saleEnabled,
    saleStartAt: product.saleStartAt?.toISOString() ?? null,
    saleEndAt: product.saleEndAt?.toISOString() ?? null,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    sizes: product.sizes.map(({ label }) => ({ label })),
    colors: product.colors.map(({ name, hexCode }) => ({ name, hexCode })),
  };
}

export async function getUniqueProductSlug(base: string): Promise<string> {
  const prisma = getPrismaClient();
  let candidate = base;
  let suffix = 2;
  while (await prisma.product.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function productTaxonomyExists(categoryId: string, subcategoryId: string | null): Promise<boolean> {
  const category = await getPrismaClient().category.findUnique({
    where: { id: categoryId },
    select: { subcategories: subcategoryId ? { where: { id: subcategoryId }, select: { id: true }, take: 1 } : false },
  });
  return Boolean(category && (!subcategoryId || category.subcategories.length === 1));
}

export async function getProductsForAdmin(filters: ProductListFilters) {
  const prisma = getPrismaClient();
  const threshold =
    (await prisma.siteSettings.findUnique({ where: { id: "site" }, select: { lowStockThreshold: true } }))
      ?.lowStockThreshold ?? 3;
  const now = new Date();
  const activeSale: Prisma.ProductWhereInput = {
    saleEnabled: true,
    salePrice: { not: null },
    AND: [
      { OR: [{ saleStartAt: null }, { saleStartAt: { lte: now } }] },
      { OR: [{ saleEndAt: null }, { saleEndAt: { gte: now } }] },
    ],
  };
  const where: Prisma.ProductWhereInput = {
    ...(filters.q
      ? { OR: [{ name: { contains: filters.q, mode: "insensitive" as const } }, { sku: { contains: filters.q, mode: "insensitive" as const } }] }
      : {}),
    ...(filters.category ? { categoryId: filters.category } : {}),
    ...(filters.subcategory ? { subcategoryId: filters.subcategory } : {}),
    ...(filters.published ? { isPublished: filters.published === "published" } : {}),
    ...(filters.newArrival ? { isNewArrival: filters.newArrival === "yes" } : {}),
    ...(filters.featured ? { isFeatured: filters.featured === "yes" } : {}),
    ...(filters.inventory === "out-of-stock" ? { availableArticles: 0 } : {}),
    ...(filters.inventory === "in-stock" ? { availableArticles: { gt: threshold } } : {}),
    ...(filters.inventory === "low-stock" ? { availableArticles: { gt: 0, lte: threshold } } : {}),
    ...(filters.sale === "active" ? activeSale : {}),
    ...(filters.sale === "inactive" ? { NOT: activeSale } : {}),
  };
  const total = await prisma.product.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(filters.page, pageCount);
  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {
      id: true, name: true, sku: true, slug: true, imageUrl: true,
      originalPrice: true, salePrice: true, saleEnabled: true, saleStartAt: true, saleEndAt: true,
      availableArticles: true, isPublished: true, isFeatured: true, isNewArrival: true,
      category: { select: { name: true } }, subcategory: { select: { name: true } },
    },
  });
  return {
    products: products.map((product) => ({
      ...product,
      isActiveSale:
        product.saleEnabled &&
        product.salePrice !== null &&
        (!product.saleStartAt || product.saleStartAt <= now) &&
        (!product.saleEndAt || product.saleEndAt >= now),
      originalPrice: product.originalPrice.toFixed(2),
      salePrice: product.salePrice?.toFixed(2) ?? null,
      saleStartAt: product.saleStartAt?.toISOString() ?? null,
      saleEndAt: product.saleEndAt?.toISOString() ?? null,
    })),
    total, page, pageCount, threshold,
  };
}

function productData(input: ProductFormInput, slug: string) {
  const { sizes, colors, slugMode: _slugMode, ...product } = input;
  void _slugMode;
  return { product: { ...product, slug }, sizes, colors };
}

export async function createProduct(adminId: string, input: ProductFormInput, imageUrl: string, imagePublicId: string) {
  const prisma = getPrismaClient();
  const slug = input.slugMode === "auto" ? await getUniqueProductSlug(input.slug) : input.slug;
  const data = productData(input, slug);
  return prisma.$transaction(async (transaction) => {
    const product = await transaction.product.create({
      data: {
        ...data.product,
        imageUrl,
        imagePublicId,
        sizes: { create: data.sizes.map((size, index) => ({ ...size, sortOrder: index + 1 })) },
        colors: { create: data.colors.map((color, index) => ({ ...color, sortOrder: index + 1 })) },
      },
    });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.PRODUCT_CREATED, entityId: product.id } });
    return product;
  });
}

export async function updateProduct(adminId: string, id: string, input: ProductFormInput, image?: { imageUrl: string; imagePublicId: string }) {
  const prisma = getPrismaClient();
  const data = productData(input, input.slug);
  return prisma.$transaction(async (transaction) => {
    const previous = await transaction.product.findUniqueOrThrow({ where: { id }, select: { slug: true, imagePublicId: true } });
    await transaction.productSize.deleteMany({ where: { productId: id } });
    await transaction.productColor.deleteMany({ where: { productId: id } });
    const product = await transaction.product.update({
      where: { id },
      data: {
        ...data.product,
        ...(image ?? {}),
        sizes: { create: data.sizes.map((size, index) => ({ ...size, sortOrder: index + 1 })) },
        colors: { create: data.colors.map((color, index) => ({ ...color, sortOrder: index + 1 })) },
      },
    });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.PRODUCT_UPDATED, entityId: id } });
    return { product, previous };
  });
}

export async function deleteProduct(adminId: string, id: string) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const product = await transaction.product.delete({ where: { id } });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.PRODUCT_DELETED, entityId: id } });
    return product;
  });
}

export async function setProductFlag(adminId: string, id: string, field: "isPublished" | "isFeatured" | "isNewArrival" | "saleEnabled", value: boolean) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const product = await transaction.product.update({ where: { id }, data: { [field]: value } });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.PRODUCT_STATE_CHANGED, entityId: id } });
    return product;
  });
}

export async function updateProductInventory(adminId: string, id: string, inventory: { totalArticles: number; availableArticles: number; soldArticles: number }) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const product = await transaction.product.update({ where: { id }, data: inventory });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.INVENTORY_UPDATED, entityId: id } });
    return product;
  });
}

export async function getInventoryForAdmin() {
  const prisma = getPrismaClient();
  const threshold = (await prisma.siteSettings.findUnique({ where: { id: "site" }, select: { lowStockThreshold: true } }))?.lowStockThreshold ?? 3;
  const products = await prisma.product.findMany({
    orderBy: [{ availableArticles: "asc" }, { name: "asc" }],
    select: { id: true, name: true, sku: true, totalArticles: true, availableArticles: true, soldArticles: true },
  });
  return { products, threshold };
}
