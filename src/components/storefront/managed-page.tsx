import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/storefront/container";
import { StoreContactDetails } from "@/components/storefront/store-contact-details";
import { getPublishedPolicy, getPublicContentBlock, getPublicSiteSettings } from "@/data/cms";

export async function PolicyContent({ slug }: { slug: string }) {
  const page = await getPublishedPolicy(slug);
  if (!page) notFound();

  return (
    <main className="pb-24 pt-12 sm:pb-32 sm:pt-20">
      <Container size="narrow">
        <header className="border-b border-line pb-8 sm:pb-10">
          <p className="store-eyebrow">Client care</p>
          <h1 className="max-w-[14ch] text-balance font-display text-5xl font-semibold leading-[0.92] tracking-[-0.035em] text-ivory sm:text-7xl">
            {page.title}
          </h1>
          <div className="store-hairline mt-6 w-20" aria-hidden="true" />
        </header>
        <article className="mt-9 border border-line bg-surface px-5 py-7 sm:mt-12 sm:px-10 sm:py-10">
          <div className="whitespace-pre-wrap break-words text-[0.95rem] leading-8 text-muted sm:text-base">
            {page.text}
          </div>
        </article>
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
  const entries = block
    ? Object.entries(block.fields).filter(([, value]) => value)
    : [];

  return (
    <main className="pb-24 pt-12 sm:pb-32 sm:pt-20">
      <Container size="wide">
        <header className="grid gap-8 border-b border-line pb-10 lg:grid-cols-[1fr_minmax(20rem,32rem)] lg:items-end">
          <div>
            <p className="store-eyebrow">The house</p>
            <h1 className="max-w-[10ch] text-balance font-display text-5xl font-semibold leading-[0.88] tracking-[-0.04em] text-ivory sm:text-7xl lg:text-8xl">
              About Men’s Hub
            </h1>
          </div>
          <p className="text-sm leading-7 text-muted sm:text-base">
            A considered destination for modern menswear—bringing confidence, personal service and a complete wardrobe together.
          </p>
        </header>

        {entries.length ? (
          <div className="mt-12 grid gap-px border border-line bg-line sm:mt-16 lg:grid-cols-2">
            {entries.map(([key, value], index) => (
              <section key={key} className="bg-[#101011] p-6 sm:p-9">
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-5 font-display text-3xl font-semibold capitalize text-ivory">
                  {key.replace(/([A-Z])/g, " $1")}
                </h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-8 text-muted sm:text-base">{value}</p>
              </section>
            ))}
          </div>
        ) : null}
      </Container>
    </main>
  );
}

export async function ContactContent() {
  const [block, settings] = await Promise.all([
    getPublicContentBlock("CONTACT", "overview"),
    getPublicSiteSettings(),
  ]);
  const heading = block?.fields.heading || "Let’s talk";

  return (
    <main className="pb-24 pt-12 sm:pb-32 sm:pt-20">
      <Container size="wide">
        <div className="grid overflow-hidden border border-line bg-surface lg:grid-cols-[0.9fr_1.1fr]">
          <header className="flex min-h-[24rem] flex-col justify-between bg-ivory p-6 text-[#161617] sm:p-10 lg:min-h-[38rem] lg:p-14">
            <div>
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-[#76580c]">Personal service</p>
              <h1 className="mt-4 max-w-[10ch] text-balance font-display text-5xl font-semibold leading-[0.9] tracking-[-0.04em] sm:text-7xl">
                {heading}
              </h1>
            </div>
            <p className="max-w-md text-sm leading-7 text-[#615e57] sm:text-base">
              {block?.fields.description || "Speak directly with our team about products, sizing, availability and delivery."}
            </p>
          </header>
          <section className="flex flex-col justify-center p-6 sm:p-10 lg:p-14" aria-label="Contact details">
            <p className="store-eyebrow">Contact Men’s Hub</p>
            <h2 className="font-display text-3xl font-semibold text-ivory sm:text-4xl">How can we help?</h2>
            <div className="mt-7 border-t border-line pt-5">
              <StoreContactDetails settings={settings} />
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
