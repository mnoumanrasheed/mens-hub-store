"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createCategory, createSubcategory, moveCategory, moveSubcategory, safelyDeleteCategory, safelyDeleteSubcategory, setCategoryActive, setSubcategoryActive, updateCategory, updateSubcategory } from "@/data/categories";
import { ImageValidationError } from "@/lib/cloudinary/image-validation";
import { uploadCategoryImage } from "@/lib/cloudinary/images";
import { deleteOrQueueManagedImage, retryDueMediaCleanupJobs } from "@/lib/cloudinary/cleanup";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { MutationState } from "@/types/mutation-state";
import { categoryInputSchema, entityIdSchema, moveInputSchema, subcategoryInputSchema } from "@/validation/category";

function text(data: FormData, key: string) { const value = data.get(key); return typeof value === "string" ? value.trim() : ""; }
function nullable(data: FormData, key: string) { return text(data, key) || null; }
function checked(data: FormData, key: string) { return data.get(key) === "true" || data.get(key) === "on"; }
function file(data: FormData, key: string) { const value = data.get(key); return value instanceof File && value.size > 0 ? value : null; }
function refresh() { revalidatePath("/admin"); revalidatePath("/admin/categories"); revalidatePath("/admin/products"); revalidatePath("/shop", "layout"); }
function failure(error: unknown): MutationState { if (error instanceof ImageValidationError) return { status: "error", message: error.message }; if (typeof error === "object" && error && "code" in error && error.code === "P2002") return { status: "error", message: "That name or slug is already in use." }; return { status: "error", message: "The taxonomy change could not be saved." }; }

export async function saveCategoryAction(_state: MutationState, data: FormData): Promise<MutationState> {
  const admin = await requireAdmin();
  await retryDueMediaCleanupJobs();
  const id = text(data, "id");
  const parsed = categoryInputSchema.safeParse({ name: text(data, "name"), slug: text(data, "slug"), description: nullable(data, "description"), removeImage: checked(data, "removeImage"), removeBannerImage: checked(data, "removeBannerImage") });
  if (!parsed.success || (id && !entityIdSchema.safeParse(id).success)) return { status: "error", message: "Correct the category details.", fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors };
  const { removeImage, removeBannerImage, ...input } = parsed.data;
  let image: Awaited<ReturnType<typeof uploadCategoryImage>> | null = null;
  let banner: Awaited<ReturnType<typeof uploadCategoryImage>> | null = null;
  try {
    const imageFile = file(data, "image"); const bannerFile = file(data, "bannerImage");
    if (imageFile) image = await uploadCategoryImage(imageFile);
    if (bannerFile) banner = await uploadCategoryImage(bannerFile);
    if (!id) await createCategory(admin.id, input, { ...(image ? { imageUrl: image.secureUrl, imagePublicId: image.publicId } : {}), ...(banner ? { bannerImageUrl: banner.secureUrl, bannerImagePublicId: banner.publicId } : {}) });
    else {
      const result = await updateCategory(admin.id, id, input, { ...(image ? { imageUrl: image.secureUrl, imagePublicId: image.publicId } : removeImage ? { imageUrl: null, imagePublicId: null } : {}), ...(banner ? { bannerImageUrl: banner.secureUrl, bannerImagePublicId: banner.publicId } : removeBannerImage ? { bannerImageUrl: null, bannerImagePublicId: null } : {}) });
      if ((image || removeImage) && result.previous.imagePublicId) await deleteOrQueueManagedImage("category", result.previous.imagePublicId);
      if ((banner || removeBannerImage) && result.previous.bannerImagePublicId) await deleteOrQueueManagedImage("category", result.previous.bannerImagePublicId);
    }
    refresh(); return { status: "success", message: id ? "Category saved." : "Category created." };
  } catch (error) { if (image) await deleteOrQueueManagedImage("category", image.publicId); if (banner) await deleteOrQueueManagedImage("category", banner.publicId); return failure(error); }
}

export async function categoryStateAction(_state: MutationState, data: FormData): Promise<MutationState> { const admin = await requireAdmin(); const id = entityIdSchema.safeParse(text(data, "id")); if (!id.success) return { status: "error", message: "Invalid category." }; try { await setCategoryActive(admin.id, id.data, checked(data, "value")); refresh(); return { status: "success", message: "Category status updated." }; } catch (error) { return failure(error); } }
export async function moveCategoryAction(_state: MutationState, data: FormData): Promise<MutationState> { const admin = await requireAdmin(); const parsed = moveInputSchema.safeParse({ id: text(data, "id"), direction: text(data, "direction") }); if (!parsed.success) return { status: "error", message: "Invalid category movement." }; try { await moveCategory(admin.id, parsed.data.id, parsed.data.direction); refresh(); return { status: "success", message: "Category moved." }; } catch (error) { return failure(error); } }
export async function deleteCategoryAction(_state: MutationState, data: FormData): Promise<MutationState> { const admin = await requireAdmin(); const id = entityIdSchema.safeParse(text(data, "id")); if (!id.success) return { status: "error", message: "Invalid category." }; try { const result = await safelyDeleteCategory(admin.id, id.data); if (!result.deleted) return { status: "error", message: "Remove or reassign its products and subcategories first." }; if (result.category.imagePublicId) await deleteOrQueueManagedImage("category", result.category.imagePublicId); if (result.category.bannerImagePublicId) await deleteOrQueueManagedImage("category", result.category.bannerImagePublicId); refresh(); return { status: "success", message: "Category deleted." }; } catch (error) { return failure(error); } }

export async function saveSubcategoryAction(_state: MutationState, data: FormData): Promise<MutationState> { const admin = await requireAdmin(); const id = text(data, "id"); const parsed = subcategoryInputSchema.safeParse({ categoryId: text(data, "categoryId"), name: text(data, "name"), slug: text(data, "slug"), description: nullable(data, "description") }); if (!parsed.success || (id && !entityIdSchema.safeParse(id).success)) return { status: "error", message: "Correct the subcategory details.", fieldErrors: parsed.success ? undefined : z.flattenError(parsed.error).fieldErrors }; try { if (id) { const result = await updateSubcategory(admin.id, id, parsed.data); if (!result.updated) return { status: "error", message: "A subcategory with products cannot be moved to another category." }; } else await createSubcategory(admin.id, parsed.data); refresh(); return { status: "success", message: id ? "Subcategory saved." : "Subcategory created." }; } catch (error) { return failure(error); } }
export async function subcategoryStateAction(_state: MutationState, data: FormData): Promise<MutationState> { const admin = await requireAdmin(); const id = entityIdSchema.safeParse(text(data, "id")); if (!id.success) return { status: "error", message: "Invalid subcategory." }; try { await setSubcategoryActive(admin.id, id.data, checked(data, "value")); refresh(); return { status: "success", message: "Subcategory status updated." }; } catch (error) { return failure(error); } }
export async function moveSubcategoryAction(_state: MutationState, data: FormData): Promise<MutationState> { const admin = await requireAdmin(); const parsed = moveInputSchema.safeParse({ id: text(data, "id"), direction: text(data, "direction") }); if (!parsed.success) return { status: "error", message: "Invalid subcategory movement." }; try { await moveSubcategory(admin.id, parsed.data.id, parsed.data.direction); refresh(); return { status: "success", message: "Subcategory moved." }; } catch (error) { return failure(error); } }
export async function deleteSubcategoryAction(_state: MutationState, data: FormData): Promise<MutationState> { const admin = await requireAdmin(); const id = entityIdSchema.safeParse(text(data, "id")); if (!id.success) return { status: "error", message: "Invalid subcategory." }; try { const result = await safelyDeleteSubcategory(admin.id, id.data); if (!result.deleted) return { status: "error", message: "Reassign its products before deleting this subcategory." }; refresh(); return { status: "success", message: "Subcategory deleted." }; } catch (error) { return failure(error); } }
