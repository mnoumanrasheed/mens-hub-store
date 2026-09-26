import { AboutExperience } from "@/components/storefront/about-experience";
import { ContactExperience } from "@/components/storefront/contact-experience";
import { getPublicSiteSettings } from "@/data/cms";

export function AboutContent() { return <AboutExperience />; }
export async function ContactContent() { return <ContactExperience settings={await getPublicSiteSettings()} />; }
