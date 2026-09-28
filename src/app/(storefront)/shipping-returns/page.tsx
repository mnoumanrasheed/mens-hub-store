import type { Metadata } from "next";

import { ShippingReturnsContent } from "@/components/storefront/shipping-returns-content";
import { getPublicSiteSettings } from "@/data/cms";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Shipping, returns and exchange information for Men’s Hub orders across Pakistan.",
  alternates: { canonical: "/shipping-returns" },
};

export default async function ShippingReturnsPage() {
  const settings = await getPublicSiteSettings();
  return <ShippingReturnsContent whatsapp={settings.whatsapp} />;
}
