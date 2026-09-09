import "server-only";

import { AdminAuditAction } from "@/generated/prisma/enums";
import { getPrismaClient } from "@/lib/db/prisma";

export type SubcategoryAdminDto = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
};

export type CategoryAdminDto = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  bannerImageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  subcategories: SubcategoryAdminDto[];
};

export type CategoryWriteInput = {
  name: string;
  slug: string;
  description: string | null;
};

export type CategoryMediaWrite = {
  imageUrl?: string | null;
  imagePublicId?: string | null;
  bannerImageUrl?: string | null;
  bannerImagePublicId?: string | null;
};

export type SubcategoryWriteInput = {
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
};

export async function getCategoriesForAdmin(): Promise<CategoryAdminDto[]> {
  const categories = await getPrismaClient().category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      bannerImageUrl: true,
      sortOrder: true,
      isActive: true,
      _count: { select: { products: true } },
      subcategories: {
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: {
          id: true,
          categoryId: true,
          name: true,
          slug: true,
          description: true,
          sortOrder: true,
          isActive: true,
          _count: { select: { products: true } },
        },
      },
    },
  });

  return categories.map(({ _count, subcategories, ...category }) => ({
    ...category,
    productCount: _count.products,
    subcategories: subcategories.map(({ _count: childCount, ...subcategory }) => ({
      ...subcategory,
      productCount: childCount.products,
    })),
  }));
}

export async function createCategory(
  adminId: string,
  input: CategoryWriteInput,
  media: CategoryMediaWrite,
) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const aggregate = await transaction.category.aggregate({ _max: { sortOrder: true } });
    const category = await transaction.category.create({
      data: {
        ...input,
        ...media,
        sortOrder: (aggregate._max.sortOrder ?? 0) + 1,
      },
    });
    await transaction.adminAuditLog.create({
      data: { adminId, action: AdminAuditAction.CATEGORY_CREATED, entityId: category.id },
    });
    return category;
  });
}

export async function updateCategory(
  adminId: string,
  id: string,
  input: CategoryWriteInput,
  media: CategoryMediaWrite,
) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const previous = await transaction.category.findUniqueOrThrow({
      where: { id },
      select: { slug: true, imagePublicId: true, bannerImagePublicId: true },
    });
    const category = await transaction.category.update({
      where: { id },
      data: { ...input, ...media },
    });
    await transaction.adminAuditLog.create({
      data: { adminId, action: AdminAuditAction.CATEGORY_UPDATED, entityId: id },
    });
    return { category, previous };
  });
}

export async function setCategoryActive(
  adminId: string,
  id: string,
  isActive: boolean,
) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const category = await transaction.category.update({ where: { id }, data: { isActive } });
    await transaction.adminAuditLog.create({
      data: { adminId, action: AdminAuditAction.CATEGORY_STATE_CHANGED, entityId: id },
    });
    return category;
  });
}

export async function moveCategory(
  adminId: string,
  id: string,
  direction: "up" | "down",
) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const current = await transaction.category.findUniqueOrThrow({ where: { id } });
    const neighbor = await transaction.category.findFirst({
      where: {
        sortOrder:
          direction === "up" ? { lt: current.sortOrder } : { gt: current.sortOrder },
      },
      orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
    });
    if (!neighbor) return current;

    await transaction.category.update({
      where: { id: current.id },
      data: { sortOrder: neighbor.sortOrder },
    });
    await transaction.category.update({
      where: { id: neighbor.id },
      data: { sortOrder: current.sortOrder },
    });
    await transaction.adminAuditLog.create({
      data: { adminId, action: AdminAuditAction.CATEGORY_REORDERED, entityId: id },
    });
    return current;
  });
}

export async function safelyDeleteCategory(adminId: string, id: string) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const category = await transaction.category.findUniqueOrThrow({
      where: { id },
      include: { _count: { select: { products: true, subcategories: true } } },
    });
    if (category._count.products > 0 || category._count.subcategories > 0) {
      return { deleted: false as const, category };
    }

    await transaction.category.delete({ where: { id } });
    await transaction.adminAuditLog.create({
      data: { adminId, action: AdminAuditAction.CATEGORY_DELETED, entityId: id },
    });
    return { deleted: true as const, category };
  });
}

export async function createSubcategory(adminId: string, input: SubcategoryWriteInput) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    await transaction.category.findUniqueOrThrow({ where: { id: input.categoryId } });
    const aggregate = await transaction.subcategory.aggregate({
      where: { categoryId: input.categoryId },
      _max: { sortOrder: true },
    });
    const subcategory = await transaction.subcategory.create({
      data: { ...input, sortOrder: (aggregate._max.sortOrder ?? 0) + 1 },
    });
    await transaction.adminAuditLog.create({
      data: { adminId, action: AdminAuditAction.SUBCATEGORY_CREATED, entityId: subcategory.id },
    });
    return subcategory;
  });
}

export async function updateSubcategory(
  adminId: string,
  id: string,
  input: SubcategoryWriteInput,
) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const current = await transaction.subcategory.findUniqueOrThrow({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (current.categoryId !== input.categoryId && current._count.products > 0) {
      return { updated: false as const, subcategory: current };
    }
    const subcategory = await transaction.subcategory.update({
      where: { id },
      data: input,
    });
    await transaction.adminAuditLog.create({
      data: { adminId, action: AdminAuditAction.SUBCATEGORY_UPDATED, entityId: id },
    });
    return { updated: true as const, subcategory };
  });
}

export async function setSubcategoryActive(
  adminId: string,
  id: string,
  isActive: boolean,
) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const subcategory = await transaction.subcategory.update({ where: { id }, data: { isActive } });
    await transaction.adminAuditLog.create({
      data: { adminId, action: AdminAuditAction.SUBCATEGORY_STATE_CHANGED, entityId: id },
    });
    return subcategory;
  });
}

export async function moveSubcategory(
  adminId: string,
  id: string,
  direction: "up" | "down",
) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const current = await transaction.subcategory.findUniqueOrThrow({ where: { id } });
    const neighbor = await transaction.subcategory.findFirst({
      where: {
        categoryId: current.categoryId,
        sortOrder:
          direction === "up" ? { lt: current.sortOrder } : { gt: current.sortOrder },
      },
      orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
    });
    if (!neighbor) return current;

    await transaction.subcategory.update({ where: { id }, data: { sortOrder: neighbor.sortOrder } });
    await transaction.subcategory.update({
      where: { id: neighbor.id },
      data: { sortOrder: current.sortOrder },
    });
    await transaction.adminAuditLog.create({
      data: { adminId, action: AdminAuditAction.SUBCATEGORY_REORDERED, entityId: id },
    });
    return current;
  });
}

export async function safelyDeleteSubcategory(adminId: string, id: string) {
  const prisma = getPrismaClient();
  return prisma.$transaction(async (transaction) => {
    const subcategory = await transaction.subcategory.findUniqueOrThrow({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (subcategory._count.products > 0) {
      return { deleted: false as const, subcategory };
    }
    await transaction.subcategory.delete({ where: { id } });
    await transaction.adminAuditLog.create({
      data: { adminId, action: AdminAuditAction.SUBCATEGORY_DELETED, entityId: id },
    });
    return { deleted: true as const, subcategory };
  });
}
