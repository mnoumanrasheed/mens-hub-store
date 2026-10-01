import "server-only";

import { AdminAuditAction } from "@/generated/prisma/enums";
import type { ProductFormInput } from "@/validation/product-admin";
import { getPrismaClient } from "@/lib/db/prisma";
import { getSalePresentation } from "@/domain/product/sale";

export type ProductFormOption = { id: string; name: string; subcategories: { id: string; name: string }[] };
export type ProductEditorDto = ProductFormInput & { id: string; imageUrl: string };
const pageSize = 20;

export async function getProductFormOptions(): Promise<ProductFormOption[]> {
  return getPrismaClient().category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true, subcategories: { orderBy: [{ sortOrder: "asc" }, { name: "asc" }], select: { id: true, name: true } } } });
}

export async function getProductForEdit(id: string): Promise<ProductEditorDto | null> {
  const product = await getPrismaClient().product.findUnique({ where: { id }, include: { sizes: { orderBy: { sortOrder: "asc" } }, colors: { orderBy: { sortOrder: "asc" } } } });
  if (!product) return null;
  return {
    id: product.id,
    name: product.name,
    categoryId: product.categoryId,
    subcategoryId: product.subcategoryId,
    sku: product.sku,
    originalPrice: product.originalPrice.toFixed(2),
    salePrice: product.salePrice?.toFixed(2) ?? null,
    stock: product.stock,
    isPublished: product.isPublished,
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    sizes: product.sizes.map(({ label }) => ({ label })),
    colors: product.colors.map(({ name, hexCode }) => ({ name, hexCode })),
    imageUrl: product.imageUrl,
  };
}

export async function productTaxonomyExists(categoryId: string, subcategoryId: string | null): Promise<boolean> {
  const category = await getPrismaClient().category.findUnique({ where: { id: categoryId }, select: { subcategories: subcategoryId ? { where: { id: subcategoryId }, select: { id: true }, take: 1 } : false } });
  return Boolean(category && (!subcategoryId || category.subcategories.length === 1));
}

export async function getProductsForAdmin(requestedPage = 1) {
  const prisma = getPrismaClient();
  const threshold = (await prisma.siteSettings.findUnique({ where: { id: "site" }, select: { lowStockThreshold: true } }))?.lowStockThreshold ?? 3;
  const total = await prisma.product.count();
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize, select: { id: true, name: true, sku: true, imageUrl: true, originalPrice: true, salePrice: true, stock: true, isPublished: true, isFeatured: true, isNewArrival: true, category: { select: { name: true } }, subcategory: { select: { name: true } } } });
  return { products: products.map((product) => ({ ...product, isActiveSale: getSalePresentation({ originalPrice: product.originalPrice.toFixed(2), salePrice: product.salePrice?.toFixed(2) ?? null }).active, originalPrice: product.originalPrice.toFixed(2), salePrice: product.salePrice?.toFixed(2) ?? null })), total, page, pageCount, threshold };
}

function productData(input: ProductFormInput) {
  const { sizes, colors, ...product } = input;
  return { product, sizes, colors };
}

export async function createProduct(adminId: string, input: ProductFormInput, imageUrl: string, imagePublicId: string) {
  const data = productData(input);
  return getPrismaClient().$transaction(async (transaction) => {
    const product = await transaction.product.create({ data: { ...data.product, imageUrl, imagePublicId, sizes: { create: data.sizes.map((size, index) => ({ ...size, sortOrder: index + 1 })) }, colors: { create: data.colors.map((color, index) => ({ ...color, sortOrder: index + 1 })) } } });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.PRODUCT_CREATED, entityId: product.id } });
    return product;
  });
}

export async function updateProduct(adminId: string, id: string, input: ProductFormInput, image?: { imageUrl: string; imagePublicId: string }) {
  const data = productData(input);
  return getPrismaClient().$transaction(async (transaction) => {
    const previous = await transaction.product.findUniqueOrThrow({ where: { id }, select: { imagePublicId: true } });
    await transaction.productSize.deleteMany({ where: { productId: id } });
    await transaction.productColor.deleteMany({ where: { productId: id } });
    const product = await transaction.product.update({ where: { id }, data: { ...data.product, ...(image ?? {}), sizes: { create: data.sizes.map((size, index) => ({ ...size, sortOrder: index + 1 })) }, colors: { create: data.colors.map((color, index) => ({ ...color, sortOrder: index + 1 })) } } });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.PRODUCT_UPDATED, entityId: id } });
    return { product, previous };
  });
}

export async function deleteProduct(adminId: string, id: string) {
  return getPrismaClient().$transaction(async (transaction) => {
    const product = await transaction.product.delete({ where: { id } });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.PRODUCT_DELETED, entityId: id } });
    return product;
  });
}

export async function setProductFlag(adminId: string, id: string, field: "isPublished" | "isFeatured" | "isNewArrival", value: boolean) {
  return getPrismaClient().$transaction(async (transaction) => {
    const product = await transaction.product.update({ where: { id }, data: { [field]: value } });
    await transaction.adminAuditLog.create({ data: { adminId, action: AdminAuditAction.PRODUCT_STATE_CHANGED, entityId: id } });
    return product;
  });
}
