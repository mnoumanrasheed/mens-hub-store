import { ContactContent } from "@/components/storefront/managed-page";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact", description: "Contact Men’s Hub for product and ordering assistance.", alternates: { canonical: "/contact" } };
export default function ContactPage() { return <ContactContent />; }
