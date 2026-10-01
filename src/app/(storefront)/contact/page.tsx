import { ContactExperiencePremium } from "@/contact-experience-premium";
import { getPublicSiteSettings } from "@/data/cms";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact", description: "Contact Men’s Hub for product and ordering assistance.", alternates: { canonical: "/contact" } };
export default async function ContactPage() { return <ContactExperiencePremium settings={await getPublicSiteSettings()} />; }
