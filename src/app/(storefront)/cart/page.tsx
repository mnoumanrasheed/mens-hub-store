import type { Metadata } from "next";
import { CartView } from "@/components/storefront/cart-view";
import { Container } from "@/components/storefront/container";
import { getPublicSiteSettings } from "@/data/cms";

export const metadata: Metadata = { title: "Cart", robots: { index: false, follow: false } };

export default async function CartPage() {
  const settings = await getPublicSiteSettings();
  return <main className="py-14 sm:py-20"><Container size="wide"><CartView brandName={settings.brandName} greeting={settings.whatsappGreeting} statement={settings.whatsappOrderStatement} /></Container></main>;
}
