import { SettingsForm, type SettingsFormValue } from "@/components/admin/settings-form";
import { getSettingsForAdmin } from "@/data/cms";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function SettingsPage() {
  await requireAdmin();
  const record = await getSettingsForAdmin();
  const settings: SettingsFormValue = { brandName: record.brandName, tagline: record.tagline, proprietors: record.proprietors, phone: record.phone, whatsapp: record.whatsapp, email: record.email, instagramUrl: record.instagramUrl, facebookUrl: record.facebookUrl, tiktokUrl: record.tiktokUrl, address: record.address, googleMapsUrl: record.googleMapsUrl, storeTiming: record.storeTiming, currency: record.currency, lowStockThreshold: record.lowStockThreshold, deliveryChargesMessage: record.deliveryChargesMessage, whatsappGreeting: record.whatsappGreeting, whatsappOrderStatement: record.whatsappOrderStatement, websiteTitle: record.websiteTitle, metaDescription: record.metaDescription, ogImageUrl: record.ogImageUrl };
  return <div className="admin-page"><header className="mb-6"><h1 className="text-3xl font-bold tracking-tight text-admin-ink">Website settings</h1><p className="mt-1 max-w-3xl text-sm text-admin-muted">Manage the single source of truth for business identity, optional store details, ordering and global SEO.</p></header><SettingsForm settings={settings} /></div>;
}
