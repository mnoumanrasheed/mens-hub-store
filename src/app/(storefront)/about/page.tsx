import { AboutContent } from "@/components/storefront/managed-page";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "About", description: "Learn about Men’s Hub and its approach to modern menswear.", alternates: { canonical: "/about" } };
export default function AboutPage() { return <AboutContent />; }
