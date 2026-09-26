import { AboutExperience } from "@/components/storefront/about-experience";
import { ContactExperience } from "@/components/storefront/contact-experience";
import { getPublicContentBlock, getPublicSiteSettings } from "@/data/cms";

export async function AboutContent() { const block = await getPublicContentBlock("ABOUT", "overview"); return <AboutExperience imageUrl={block?.imageUrl} />; }
export async function ContactContent() { return <ContactExperience settings={await getPublicSiteSettings()} />; }
