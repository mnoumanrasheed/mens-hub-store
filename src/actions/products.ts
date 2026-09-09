"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  createProduct,
  deleteProduct,
  getProductForEdit,
  productTaxonomyExists,
  setProductFlag,
  updateProduct,
  updateProductInventory,
} from "@/data/products";
import { ImageValidationError } from "@/lib/cloudinary/image-validation";
import { uploadProductImage } from "@/lib/cloudinary/images";
import { deleteOrQueueManagedImage, retryDueMediaCleanupJobs } from "@/lib/cloudinary/cleanup";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { MutationState } from "@/types/mutation-state";
import { inventoryUpdateSchema, productFormSchema, productIdSchema } from "@/validation/product-admin";

const flagSchema = z.enum(["isPublished", "isFeatured", "isNewArrival", "saleEnabled"]);

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(formData: FormData, key: string): string | null {
  return text(formData, key) || null;
}

function integer(formData: FormData, key: string): number {
  return Number(text(formData, key));
}

function checkbox(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function utcDate(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}:00Z`);
  return Number.isNaN(date.getTime()) ? new Date(Number.NaN) : date;
}

function jsonOptions(formData: FormData, key: string): unknown {
  try {
    return JSON.parse(text(formData, key) || "[]");
  } catch {
    return null;
  }
}

function productInput(formData: FormData) {
  return productFormSchema.safeParse({
    name: text(formData, "name"),
    sku: text(formData, "sku"),
    slug: text(formData, "slug"),
    slugMode: text(formData, "slugMode"),
    categoryId: text(formData, "categoryId"),
    subcategoryId: optionalText(formData, "subcategoryId"),
    productType: optionalText(formData, "productType"),
    originalPrice: text(formData, "originalPrice"),
    salePrice: optionalText(formData, "salePrice"),
    description: text(formData, "description"),
    material: optionalText(formData, "material"),
    totalArticles: integer(formData, "totalArticles"),
    availableArticles: integer(formData, "availableArticles"),
    soldArticles: integer(formData, "soldArticles"),
    isPublished: checkbox(formData, "isPublished"),
    isFeatured: checkbox(formData, "isFeatured"),
    isNewArrival: checkbox(formData, "isNewArrival"),
    saleEnabled: checkbox(formData, "saleEnabled"),
    saleStartAt: utcDate(text(formData, "saleStartAt")),
    saleEndAt: utcDate(text(formData, "saleEndAt")),
    seoTitle: optionalText(formData, "seoTitle"),
    seoDescription: optionalText(formData, "seoDescription"),
    sizes: jsonOptions(formData, "sizes"),
    colors: jsonOptions(formData, "colors"),
  });
}

function errorState(error: unknown): MutationState {
  if (error instanceof ImageValidationError) return { status: "error", message: error.message };
  if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
    return { status: "error", message: "That SKU or slug is already in use." };
  }
  return { status: "error", message: "The product could not be saved. Please try again." };
}

function revalidateProductPaths(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/shop", "layout");
  revalidatePath("/new-arrivals");
  revalidatePath("/sale");
  if (slug) revalidatePath(`/product/${slug}`);
}

function uploadedFile(formData: FormData): File | null {
  const value = formData.get("image");
  return value instanceof File && value.size > 0 ? value : null;
}

export async function createProductAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin();
  await retryDueMediaCleanupJobs();
  const parsed = productInput(formData);
  if (!parsed.success) return { status: "error", message: "Correct the highlighted product details.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  if (!(await productTaxonomyExists(parsed.data.categoryId, parsed.data.subcategoryId))) return { status: "error", message: "Choose a valid category and subcategory combination.", fieldErrors: { subcategoryId: ["This subcategory does not belong to the selected category."] } };
  const image = uploadedFile(formData);
  if (!image) return { status: "error", message: "A primary product image is required.", fieldErrors: { image: ["Choose one JPG, PNG, or WebP image."] } };
  let uploaded: Awaited<ReturnType<typeof uploadProductImage>> | null = null;
  try {
    uploaded = await uploadProductImage(image);
    const product = await createProduct(admin.id, parsed.data, uploaded.secureUrl, uploaded.publicId);
    revalidateProductPaths(product.slug);
  } catch (error) {
    if (uploaded) await deleteOrQueueManagedImage("product", uploaded.publicId);
    return errorState(error);
  }
  redirect("/admin/products");
}

export async function updateProductAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin();
  await retryDueMediaCleanupJobs();
  const id = productIdSchema.safeParse(text(formData, "id"));
  const parsed = productInput(formData);
  if (!id.success || !parsed.success) return { status: "error", message: "Correct the highlighted product details.", fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors };
  if (!(await productTaxonomyExists(parsed.data.categoryId, parsed.data.subcategoryId))) return { status: "error", message: "Choose a valid category and subcategory combination.", fieldErrors: { subcategoryId: ["This subcategory does not belong to the selected category."] } };
  const file = uploadedFile(formData);
  let uploaded: Awaited<ReturnType<typeof uploadProductImage>> | null = null;
  try {
    if (file) uploaded = await uploadProductImage(file);
    const result = await updateProduct(admin.id, id.data, parsed.data, uploaded ? { imageUrl: uploaded.secureUrl, imagePublicId: uploaded.publicId } : undefined);
    if (uploaded && result.previous.imagePublicId) await deleteOrQueueManagedImage("product", result.previous.imagePublicId);
    revalidateProductPaths(result.previous.slug);
    revalidateProductPaths(result.product.slug);
    return { status: "success", message: "Product saved." };
  } catch (error) {
    if (uploaded) await deleteOrQueueManagedImage("product", uploaded.publicId);
    return errorState(error);
  }
}

export async function deleteProductAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin();
  const id = productIdSchema.safeParse(text(formData, "id"));
  if (!id.success) return { status: "error", message: "Invalid product." };
  try {
    const product = await deleteProduct(admin.id, id.data);
    if (product.imagePublicId) await deleteOrQueueManagedImage("product", product.imagePublicId);
    revalidateProductPaths(product.slug);
    return { status: "success", message: "Product deleted." };
  } catch {
    return { status: "error", message: "The product could not be deleted." };
  }
}

export async function toggleProductAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin();
  const id = productIdSchema.safeParse(text(formData, "id"));
  const field = flagSchema.safeParse(text(formData, "field"));
  const value = text(formData, "value") === "true";
  if (!id.success || !field.success) return { status: "error", message: "Invalid product action." };
  if (field.data === "saleEnabled" && value) {
    const product = await getProductForEdit(id.data);
    if (!product?.salePrice || Number(product.salePrice) <= 0 || Number(product.salePrice) >= Number(product.originalPrice)) {
      return { status: "error", message: "Add a valid sale price before enabling sale." };
    }
  }
  try {
    const product = await setProductFlag(admin.id, id.data, field.data, value);
    revalidateProductPaths(product.slug);
    return { status: "success", message: "Product status updated." };
  } catch {
    return { status: "error", message: "The product status could not be updated." };
  }
}

export async function updateInventoryAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin();
  const parsed = inventoryUpdateSchema.safeParse({ id: text(formData, "id"), totalArticles: integer(formData, "totalArticles"), availableArticles: integer(formData, "availableArticles"), soldArticles: integer(formData, "soldArticles") });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid inventory values." };
  try {
    const { id, ...inventory } = parsed.data;
    const product = await updateProductInventory(admin.id, id, inventory);
    revalidateProductPaths(product.slug);
    return { status: "success", message: "Inventory updated." };
  } catch {
    return { status: "error", message: "Inventory could not be updated." };
  }
}
