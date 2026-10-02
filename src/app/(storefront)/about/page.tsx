import { AboutExperience } from "@/components/storefront/about-experience";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Our Story", description: "Discover Men\u2019s Hub \u2014 modern menswear curated for confidence, individuality and effortless style.", alternates: { canonical: "/about" } };
export default function AboutPage() { return <AboutExperience />; }
