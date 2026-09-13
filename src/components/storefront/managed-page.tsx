import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AboutExperience } from "@/components/storefront/about-experience";
import { ContactExperience } from "@/components/storefront/contact-experience";

import { Container } from "@/components/storefront/container";
import { getPublishedPolicy, getPublicContentBlock, getPublicSiteSettings } from "@/data/cms";

export async function PolicyContent({ slug }: { slug: string }) {
  const page = await getPublishedPolicy(slug);
  if (!page) notFound();

  return (
    <main className="pb-24 pt-12 sm:pb-32 sm:pt-20">
      <Container size="wide">
        <header className="atelier-policy-header border-b border-line pb-8 sm:pb-10">
          <p className="store-eyebrow">Client care</p>
          <h1 className="max-w-[14ch] text-balance font-display text-5xl font-semibold leading-[0.92] tracking-[-0.035em] text-ivory sm:text-7xl">
            {page.title}
          </h1>
          <div className="store-hairline mt-6 w-20" aria-hidden="true" />
        </header>
        <div className="atelier-policy-layout">
        <nav className="atelier-care-nav" aria-label="Customer care"><p className="store-eyebrow">Here to help</p>{[["How to order", "how-to-order"], ["Size guide", "size-guide"], ["Shipping", "shipping-policy"], ["Returns & exchange", "return-exchange-policy"], ["FAQs", "faq"], ["Privacy", "privacy-policy"], ["Terms & conditions", "terms-and-conditions"], ["Contact us", "contact"]].map(([label, path]) => <Link key={path} href={`/${path}`} aria-current={path === slug ? "page" : undefined}>{label}</Link>)}</nav>
        <article className="atelier-policy-text mt-9 border border-line bg-surface px-5 py-7 sm:mt-12 sm:px-10 sm:py-10">
          <div className="whitespace-pre-wrap break-words text-[0.95rem] leading-8 text-muted sm:text-base">
            {page.text}
          </div>
        </article>
        </div>
      </Container>
    </main>
  );
}

export async function policyMetadata(slug: string): Promise<Metadata> {
  const page = await getPublishedPolicy(slug);
  return page
    ? {
        title: page.seoTitle || page.title,
        description: page.seoDescription || undefined,
        alternates: { canonical: `/${page.slug}` },
      }
    : { robots: { index: false, follow: false } };
}

export async function AboutContent() {
  const block = await getPublicContentBlock("ABOUT", "overview");
  return <AboutExperience imageUrl={block?.imageUrl} />;
}

export async function ContactContent() {
  return <ContactExperience settings={await getPublicSiteSettings()} />;
}
