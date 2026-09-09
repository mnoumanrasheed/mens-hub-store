"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { saveAnnouncement, saveContentBlock, savePolicy, saveSettings } from "@/data/cms";
import { requireAdmin } from "@/lib/auth/require-admin";
import { uploadContentImage } from "@/lib/cloudinary/images";
import { deleteOrQueueManagedImage, retryDueMediaCleanupJobs } from "@/lib/cloudinary/cleanup";
import { ImageValidationError } from "@/lib/cloudinary/image-validation";
import type { MutationState } from "@/types/mutation-state";
import { cmsBlockDefinitions } from "@/types/cms";
import { announcementSchema, contentBlockSchema, policySchema, settingsSchema } from "@/validation/cms";

const text = (formData: FormData, key: string) => typeof formData.get(key) === "string" ? String(formData.get(key)).trim() : "";
const checked = (formData: FormData, key: string) => ["on", "true"].includes(text(formData, key));
const file = (formData: FormData, key: string) => { const value = formData.get(key); return value instanceof File && value.size > 0 ? value : null; };
const utcDate = (value: string) => value ? new Date(`${value}:00Z`) : null;

function validationError(error: z.ZodError): MutationState {
  return { status: "error", message: "Correct the highlighted information and try again.", fieldErrors: z.flattenError(error).fieldErrors };
}

function saveError(error: unknown): MutationState {
  return { status: "error", message: error instanceof ImageValidationError ? error.message : "The changes could not be saved. Please try again." };
}

function revalidateSettings() {
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/contact");
}

export async function saveSettingsAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin();
  await retryDueMediaCleanupJobs();
  const parsed = settingsSchema.safeParse({ brandName: text(formData, "brandName"), tagline: text(formData, "tagline"), proprietors: text(formData, "proprietors"), phone: text(formData, "phone"), whatsapp: text(formData, "whatsapp"), email: text(formData, "email"), instagramUrl: text(formData, "instagramUrl"), facebookUrl: text(formData, "facebookUrl"), tiktokUrl: text(formData, "tiktokUrl"), address: text(formData, "address"), googleMapsUrl: text(formData, "googleMapsUrl"), storeTiming: text(formData, "storeTiming"), currency: text(formData, "currency"), lowStockThreshold: Number(text(formData, "lowStockThreshold")), deliveryChargesMessage: text(formData, "deliveryChargesMessage"), whatsappGreeting: text(formData, "whatsappGreeting"), whatsappOrderStatement: text(formData, "whatsappOrderStatement"), websiteTitle: text(formData, "websiteTitle"), metaDescription: text(formData, "metaDescription"), removeOgImage: checked(formData, "removeOgImage") });
  if (!parsed.success) return validationError(parsed.error);
  const ogImage = file(formData, "ogImage");
  let uploaded: Awaited<ReturnType<typeof uploadContentImage>> | null = null;
  try {
    if (ogImage) uploaded = await uploadContentImage(ogImage);
    const result = await saveSettings(admin.id, parsed.data, uploaded ? { ogImageUrl: uploaded.secureUrl, ogImagePublicId: uploaded.publicId } : undefined);
    if ((uploaded || parsed.data.removeOgImage) && result.previousPublicId && result.previousPublicId !== uploaded?.publicId) await deleteOrQueueManagedImage("content", result.previousPublicId);
    revalidateSettings();
    return { status: "success", message: "Website settings saved." };
  } catch (error) {
    if (uploaded) await deleteOrQueueManagedImage("content", uploaded.publicId);
    return saveError(error);
  }
}

export async function saveContentBlockAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin();
  await retryDueMediaCleanupJobs();
  const area = text(formData, "area"); const key = text(formData, "key");
  const definition = cmsBlockDefinitions.find((item) => item.area === area && item.key === key);
  const fields = Object.fromEntries(definition?.fields.map(([name]) => [name, text(formData, `field:${name}`)]) ?? []);
  const parsed = contentBlockSchema.safeParse({ area, key, fields, removeImage: checked(formData, "removeImage") });
  if (!parsed.success) return validationError(parsed.error);
  const heroImage = file(formData, "image");
  if (heroImage && !(definition && "image" in definition && definition.image)) return { status: "error", message: "This content section does not accept an image." };
  let uploaded: Awaited<ReturnType<typeof uploadContentImage>> | null = null;
  try {
    if (heroImage) uploaded = await uploadContentImage(heroImage);
    const result = await saveContentBlock(admin.id, parsed.data, uploaded ? { imageUrl: uploaded.secureUrl, imagePublicId: uploaded.publicId } : undefined);
    if ((uploaded || parsed.data.removeImage) && result.previousPublicId && result.previousPublicId !== uploaded?.publicId) await deleteOrQueueManagedImage("content", result.previousPublicId);
    revalidatePath("/admin/content"); revalidatePath("/"); revalidatePath("/about"); revalidatePath("/contact");
    return { status: "success", message: `${definition?.label ?? "Content"} saved.` };
  } catch (error) {
    if (uploaded) await deleteOrQueueManagedImage("content", uploaded.publicId);
    return saveError(error);
  }
}

export async function savePolicyAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin();
  const parsed = policySchema.safeParse({ slug: text(formData, "slug"), title: text(formData, "title"), text: text(formData, "content"), isPublished: checked(formData, "isPublished"), seoTitle: text(formData, "seoTitle"), seoDescription: text(formData, "seoDescription") });
  if (!parsed.success) return validationError(parsed.error);
  try { await savePolicy(admin.id, parsed.data); revalidatePath("/admin/content"); revalidatePath(`/${parsed.data.slug}`); return { status: "success", message: `${parsed.data.title} saved.` }; } catch (error) { return saveError(error); }
}

export async function saveAnnouncementAction(_state: MutationState, formData: FormData): Promise<MutationState> {
  const admin = await requireAdmin();
  const parsed = announcementSchema.safeParse({ id: text(formData, "id"), text: text(formData, "text"), linkUrl: text(formData, "linkUrl"), linkLabel: text(formData, "linkLabel"), background: text(formData, "background"), enabled: checked(formData, "enabled"), startAt: utcDate(text(formData, "startAt")), endAt: utcDate(text(formData, "endAt")) });
  if (!parsed.success) return validationError(parsed.error);
  try { await saveAnnouncement(admin.id, parsed.data); revalidatePath("/admin/content"); revalidatePath("/", "layout"); return { status: "success", message: "Announcement saved." }; } catch (error) { return saveError(error); }
}
