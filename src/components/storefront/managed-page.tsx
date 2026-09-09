import { notFound } from "next/navigation";
import { Container } from "@/components/storefront/container";
import { Heading } from "@/components/ui/heading";
import { getPublishedPolicy, getPublicContentBlock, getPublicSiteSettings } from "@/data/cms";
import { StoreContactDetails } from "@/components/storefront/store-contact-details";
import type { Metadata } from "next";

export async function PolicyContent({ slug }: { slug: string }) { const page = await getPublishedPolicy(slug); if (!page) notFound(); return <main className="py-20 sm:py-28"><Container size="narrow"><Heading as="h1" size="lg">{page.title}</Heading><div className="mt-8 whitespace-pre-wrap break-words text-base leading-8 text-muted">{page.text}</div></Container></main>; }

export async function policyMetadata(slug: string): Promise<Metadata> { const page = await getPublishedPolicy(slug); return page ? { title: page.seoTitle || page.title, description: page.seoDescription || undefined, alternates: { canonical: `/${page.slug}` } } : { robots: { index: false, follow: false } }; }

export async function AboutContent() { const block = await getPublicContentBlock("ABOUT", "overview"); const entries = block ? Object.entries(block.fields).filter(([, value]) => value) : []; return <main className="py-20 sm:py-28"><Container size="narrow"><Heading as="h1" size="lg">About Men’s Hub</Heading>{entries.length ? <div className="mt-10 grid gap-10">{entries.map(([key, value]) => <section key={key}><h2 className="font-display text-2xl capitalize text-ivory">{key.replace(/([A-Z])/g, " $1")}</h2><p className="mt-3 whitespace-pre-wrap leading-8 text-muted">{value}</p></section>)}</div> : null}</Container></main>; }

export async function ContactContent() { const [block, settings] = await Promise.all([getPublicContentBlock("CONTACT", "overview"), getPublicSiteSettings()]); const heading = block?.fields.heading || "Contact"; return <main className="py-20 sm:py-28"><Container size="narrow"><Heading as="h1" size="lg">{heading}</Heading>{block?.fields.description ? <p className="mt-5 whitespace-pre-wrap leading-8 text-muted">{block.fields.description}</p> : null}<div className="mt-8"><StoreContactDetails settings={settings} /></div></Container></main>; }
