import { StorefrontShell } from "@/components/storefront/storefront-shell";
import { getActiveAnnouncement, getPublicSiteSettings } from "@/data/cms";
import { getPublicContentBlock } from "@/data/cms";
import { getStorefrontShellData } from "@/data/storefront";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return {
    metadataBase: getSiteUrl(),
    title: { default: settings.websiteTitle, template: `%s | ${settings.brandName}` },
    description: settings.metaDescription || settings.tagline,
    applicationName: settings.brandName,
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png" }],
      shortcut: [{ url: "/favicon.png", type: "image/png" }],
      apple: [{ url: "/logo.png", type: "image/png" }],
    },
    openGraph: settings.ogImageUrl ? { images: [settings.ogImageUrl] } : undefined,
  };
}

type StorefrontLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function StorefrontLayout({ children }: StorefrontLayoutProps) {
  const [announcement, shell, footer] = await Promise.all([getActiveAnnouncement(), getStorefrontShellData(), getPublicContentBlock("FOOTER", "overview")]);
  return <StorefrontShell announcement={announcement} brandName={shell.settings.brandName} categories={shell.categories} settings={shell.settings} footerContent={footer?.fields}>{children}</StorefrontShell>;
}
