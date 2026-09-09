import { z } from "zod";

import { cmsBlockDefinitions, policyDefinitions } from "@/types/cms";

const emptyToNull = (value: unknown) => typeof value === "string" && value.trim() === "" ? null : value;
const optionalText = (max: number) => z.preprocess(emptyToNull, z.string().trim().max(max).nullable());
const httpsUrl = z.string().trim().url().refine((value) => new URL(value).protocol === "https:", "Use an HTTPS URL.");
const internalPath = z.string().trim().regex(/^\/(?!\/)[a-zA-Z0-9/_?=&.#%-]*$/, "Use a safe internal path.");
function socialUrl(provider: "instagram" | "facebook" | "tiktok") {
  const hosts: Record<typeof provider, string[]> = {
    instagram: ["instagram.com", "www.instagram.com"],
    facebook: ["facebook.com", "www.facebook.com", "fb.com", "www.fb.com"],
    tiktok: ["tiktok.com", "www.tiktok.com"],
  };
  return z.preprocess(emptyToNull, httpsUrl.refine((value) => hosts[provider].includes(new URL(value).hostname.toLowerCase()), `Use a valid ${provider} URL.`).nullable());
}

const googleMapsUrl = z.preprocess(emptyToNull, httpsUrl.refine((value) => {
  const url = new URL(value);
  return ["google.com", "www.google.com", "maps.google.com", "maps.app.goo.gl"].includes(url.hostname.toLowerCase()) && (url.hostname === "maps.app.goo.gl" || url.pathname.startsWith("/maps"));
}, "Use a valid Google Maps HTTPS URL or embed URL.").nullable());

export const settingsSchema = z.object({
  brandName: z.string().trim().min(2).max(80),
  tagline: z.string().trim().min(2).max(150),
  proprietors: z.string().trim().min(2).max(200),
  phone: z.string().trim().min(7).max(30).regex(/^[+()\-\s0-9]+$/, "Use a valid display phone number."),
  whatsapp: z.string().trim().regex(/^\d{8,15}$/, "Use the normalized international number with digits only."),
  email: z.string().trim().toLowerCase().email().max(254),
  instagramUrl: socialUrl("instagram"),
  facebookUrl: socialUrl("facebook"),
  tiktokUrl: socialUrl("tiktok"),
  address: optionalText(1000),
  googleMapsUrl,
  storeTiming: optionalText(1000),
  currency: z.literal("PKR"),
  lowStockThreshold: z.number().int().min(0).max(10_000),
  deliveryChargesMessage: z.string().trim().min(2).max(250),
  whatsappGreeting: optionalText(250),
  whatsappOrderStatement: optionalText(250),
  websiteTitle: z.string().trim().min(2).max(70),
  metaDescription: optionalText(170),
  removeOgImage: z.boolean(),
});

const contentIdentity = cmsBlockDefinitions.map((item) => `${item.area}:${item.key}`);
export const contentBlockSchema = z.object({
  area: z.enum(["HOMEPAGE", "ABOUT", "CONTACT", "FOOTER"]),
  key: z.string().trim(),
  fields: z.record(z.string(), z.string().trim().max(10_000)),
  removeImage: z.boolean(),
}).superRefine((value, context) => {
  const definition = cmsBlockDefinitions.find((item) => item.area === value.area && item.key === value.key);
  if (!definition || !contentIdentity.includes(`${value.area}:${value.key}`)) {
    context.addIssue({ code: "custom", path: ["key"], message: "Unknown content section." });
    return;
  }
  const allowed = new Set<string>(definition.fields.map((field) => field[0]));
  for (const key of Object.keys(value.fields)) if (!allowed.has(key)) context.addIssue({ code: "custom", path: ["fields", key], message: "Unknown content field." });
  for (const key of allowed) if (!(key in value.fields)) context.addIssue({ code: "custom", path: ["fields", key], message: "Missing content field." });
  for (const [key, fieldValue] of Object.entries(value.fields)) {
    if (key.toLowerCase().includes("link") && fieldValue && !(internalPath.safeParse(fieldValue).success || httpsUrl.safeParse(fieldValue).success)) context.addIssue({ code: "custom", path: ["fields", key], message: "Use an internal path or HTTPS URL." });
  }
});

export const policySchema = z.object({
  slug: z.enum(policyDefinitions.map((item) => item[0])),
  title: z.string().trim().min(2).max(120),
  text: z.string().trim().max(50_000),
  isPublished: z.boolean(),
  seoTitle: optionalText(70),
  seoDescription: optionalText(170),
}).superRefine((value, context) => {
  if (value.isPublished && !value.text) context.addIssue({ code: "custom", path: ["text"], message: "Add approved page content before publishing." });
});

export const announcementSchema = z.object({
  id: optionalText(64),
  text: z.string().trim().min(1).max(250),
  linkUrl: z.preprocess(emptyToNull, z.union([internalPath, httpsUrl]).nullable()),
  linkLabel: optionalText(80),
  background: z.enum(["DARK", "GOLD", "CRITICAL"]),
  enabled: z.boolean(),
  startAt: z.date().nullable(),
  endAt: z.date().nullable(),
}).superRefine((value, context) => {
  if (value.endAt && value.startAt && value.endAt <= value.startAt) context.addIssue({ code: "custom", path: ["endAt"], message: "End date must be after start date." });
  if (value.linkLabel && !value.linkUrl) context.addIssue({ code: "custom", path: ["linkUrl"], message: "Add a link when a label is set." });
});

export type SettingsInput = z.infer<typeof settingsSchema>;
export type ContentBlockInput = z.infer<typeof contentBlockSchema>;
export type PolicyInput = z.infer<typeof policySchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
