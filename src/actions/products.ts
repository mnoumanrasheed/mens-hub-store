"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createProduct, deleteProduct, productTaxonomyExists, setProductFlag, updateProduct } from "@/data/products";
import { ImageValidationError } from "@/lib/cloudinary/image-validation";
import { uploadProductImage } from "@/lib/cloudinary/images";
import { deleteOrQueueManagedImage, retryDueMediaCleanupJobs } from "@/lib/cloudinary/cleanup";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { MutationState } from "@/types/mutation-state";
import { productFormSchema, productIdSchema } from "@/validation/product-admin";

const flagSchema = z.enum(["isPublished", "isFeatured", "isNewArrival"]);
function text(formData: FormData, key: string): string { const value = formData.get(key); return typeof value === "string" ? value.trim() : ""; }
function optionalText(formData: FormData, key: string): string | null { return text(formData, key) || null; }
function integer(formData: FormData, key: string): number { return Number(text(formData, key)); }
function checkbox(formData: FormData, key: string): boolean { return formData.get(key) === "on" || formData.get(key) === "true"; }
function jsonOptions(formData: FormData, key: string): unknown { try { return JSON.parse(text(formData, key) || "[]"); } catch { return null; } }
function productInput(formData: FormData) { return productFormSchema.safeParse({ name: text(formData, "name"), sku: optionalText(formData, "sku"), categoryId: text(formData, "categoryId"), subcategoryId: optionalText(formData, "subcategoryId"), originalPrice: text(formData, "originalPrice"), salePrice: optionalText(formData, "salePrice"), stock: integer(formData, "stock"), isPublished: text(formData, "publish") === "true", isFeatured: checkbox(formData, "isFeatured"), isNewArrival: checkbox(formData, "isNewArrival"), sizes: jsonOptions(formData, "sizes"), colors: jsonOptions(formData, "colors") }); }
function errorState(error: unknown): MutationState { if (error instanceof ImageValidationError) return { status: "error", message: error.message }; if (typeof error === "object" && error && "code" in error && error.code === "P2002") return { status: "error", message: "That product already exists." }; return { status: "error", message: "The product could not be saved. Please try again." }; }
function revalidateProductPaths(id?: string) { revalidatePath("/admin"); revalidatePath("/admin/products"); revalidatePath("/shop", "layout"); revalidatePath("/new-arrivals"); revalidatePath("/sale"); if (id) revalidatePath(`/product/${id}`); }
function uploadedFile(formData: FormData): File | null { const value = formData.get("image"); return value instanceof File && value.size > 0 ? value : null; }

export async function createProductAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin(); await retryDueMediaCleanupJobs(); const parsed = productInput(formData);
  if (!parsed.success) return { status: "error", message: "Correct the highlighted product details.", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  if (!(await productTaxonomyExists(parsed.data.categoryId, parsed.data.subcategoryId))) return { status: "error", message: "Choose a valid category and subcategory combination.", fieldErrors: { subcategoryId: ["This subcategory does not belong to the selected category."] } };
  const image = uploadedFile(formData); if (!image) return { status: "error", message: "A primary product image is required.", fieldErrors: { image: ["Choose one JPG, PNG, or WebP image."] } };
  let uploaded: Awaited<ReturnType<typeof uploadProductImage>> | null = null;
  try { uploaded = await uploadProductImage(image); const product = await createProduct(admin.id, parsed.data, uploaded.secureUrl, uploaded.publicId); revalidateProductPaths(product.id); } catch (error) { if (uploaded) await deleteOrQueueManagedImage("product", uploaded.publicId); return errorState(error); }
  redirect("/admin/products");
}

export async function updateProductAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin(); await retryDueMediaCleanupJobs(); const id = productIdSchema.safeParse(text(formData, "id")); const parsed = productInput(formData);
  if (!id.success || !parsed.success) return { status: "error", message: "Correct the highlighted product details.", fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors };
  if (!(await productTaxonomyExists(parsed.data.categoryId, parsed.data.subcategoryId))) return { status: "error", message: "Choose a valid category and subcategory combination.", fieldErrors: { subcategoryId: ["This subcategory does not belong to the selected category."] } };
  const file = uploadedFile(formData); let uploaded: Awaited<ReturnType<typeof uploadProductImage>> | null = null;
  try { if (file) uploaded = await uploadProductImage(file); const result = await updateProduct(admin.id, id.data, parsed.data, uploaded ? { imageUrl: uploaded.secureUrl, imagePublicId: uploaded.publicId } : undefined); if (uploaded && result.previous.imagePublicId) await deleteOrQueueManagedImage("product", result.previous.imagePublicId); revalidateProductPaths(result.product.id); return { status: "success", message: "Product saved." }; } catch (error) { if (uploaded) await deleteOrQueueManagedImage("product", uploaded.publicId); return errorState(error); }
}

export async function deleteProductAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin(); const id = productIdSchema.safeParse(text(formData, "id")); if (!id.success) return { status: "error", message: "Invalid product." };
  try { const product = await deleteProduct(admin.id, id.data); if (product.imagePublicId) await deleteOrQueueManagedImage("product", product.imagePublicId); revalidateProductPaths(product.id); return { status: "success", message: "Product deleted." }; } catch { return { status: "error", message: "The product could not be deleted." }; }
}

export async function toggleProductAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin(); const id = productIdSchema.safeParse(text(formData, "id")); const field = flagSchema.safeParse(text(formData, "field")); const value = text(formData, "value") === "true";
  if (!id.success || !field.success) return { status: "error", message: "Invalid product action." };
  try { const product = await setProductFlag(admin.id, id.data, field.data, value); revalidateProductPaths(product.id); return { status: "success", message: "Product status updated." }; } catch { return { status: "error", message: "The product status could not be updated." }; }
}
