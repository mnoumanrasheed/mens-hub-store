import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  Gem,
  Layers3,
  MapPin,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  Shirt,
  Sparkles,
  Truck,
} from "lucide-react";

import { CategoryShowcase } from "@/components/storefront/category-showcase";
import { CinematicHero } from "@/components/storefront/cinematic-hero";
import { Container } from "@/components/storefront/container";
import { ProductCard } from "@/components/storefront/product-card";
import { ScrollReveal } from "@/components/storefront/scroll-reveal";
import { StoreImage } from "@/components/storefront/store-image";
import { getHomepageData, type StorefrontProduct } from "@/data/storefront";
import type { CmsBlockValue } from "@/types/cms";

export const metadata: Metadata = {
  title: { absolute: "Men’s Hub — Premium Men’s Fashion" },
  description: "Premium men’s fashion crafted for confidence, from modern wardrobe foundations to the finishing details.",
  alternates: { canonical: "/" },
};

type HomepageData = Awaited<ReturnType<typeof getHomepageData>>;
type Category = HomepageData["categories"][number];

export default async function HomePage() {
  const data = await getHomepageData();
  const block = (key: string): CmsBlockValue => data.blocks[key] ?? { fields: {} };
  const hero = block("hero");
  const heroCandidates = data.categories
    .map((category) => ({
      url: category.bannerImageUrl || category.imageUrl,
      alt: `${category.name} editorial`,
    }))
    .filter((image): image is { url: string; alt: string } => Boolean(image.url));

  return (
    <main>
      <CinematicHero
        heading={hero.fields.heading || "Elevate Your Everyday Style"}
        tagline={hero.fields.tagline || data.settings.tagline}
        description={hero.fields.description || "Premium men's fashion crafted for confidence."}
        primaryLabel={hero.fields.primaryCtaLabel || "Shop Collection"}
        primaryLink={hero.fields.primaryCtaLink || "/shop"}
        secondaryLabel={hero.fields.secondaryCtaLabel || "Explore Categories"}
        secondaryLink={hero.fields.secondaryCtaLink || "/#categories"}
        mainImage={hero.imageUrl ? { url: hero.imageUrl, alt: "Men’s Hub collection" } : heroCandidates[0]}
        secondaryImages={heroCandidates.slice(hero.imageUrl ? 0 : 1, hero.imageUrl ? 2 : 3)}
      />

      <CategoryShowcase categories={data.categories} content={block("shop-by-category")} />

      <CollectionSection
        eyebrow="Latest edit"
        content={block("new-arrivals")}
        fallbackHeading="New Arrivals"
        products={data.newProducts}
        href="/new-arrivals"
        empty="New arrivals will appear here when they are published."
      />

      <PremiumCollectionsSection
        categories={data.categories}
        featured={data.featuredProducts}
        sale={data.saleProducts}
        featuredContent={block("featured")}
        saleContent={block("sale")}
      />

      <WhySection content={block("why-mens-hub")} />
      <TrustSection content={block("visit-store")} settings={data.settings} />
      <FashionShowcase categories={data.categories} instagramUrl={data.settings.instagramUrl} />
    </main>
  );
}

function SectionHeader({
  eyebrow,
  heading,
  description,
  href,
}: {
  eyebrow: string;
  heading: string;
  description?: string;
  href?: string;
}) {
  return (
    <header className="mb-9 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="store-eyebrow">{eyebrow}</p>
        <h2 className="store-section-title">{heading}</h2>
        {description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">{description}</p> : null}
      </div>
      {href ? (
        <Link
          className="group inline-flex min-h-11 items-center gap-2 self-start text-xs font-bold uppercase tracking-[0.16em] text-ivory transition-colors hover:text-gold sm:self-auto"
          href={href}
        >
          View all
          <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
        </Link>
      ) : null}
    </header>
  );
}

function CollectionSection({
  eyebrow,
  content,
  fallbackHeading,
  products,
  href,
  empty,
}: {
  eyebrow: string;
  content: CmsBlockValue;
  fallbackHeading: string;
  products: StorefrontProduct[];
  href: string;
  empty: string;
}) {
  return (
    <section className="store-section border-b border-line bg-canvas">
      <Container size="wide">
        <ScrollReveal>
          <SectionHeader
            eyebrow={eyebrow}
            heading={content.fields.heading || fallbackHeading}
            description={content.fields.description}
            href={products.length ? href : undefined}
          />
          {products.length ? (
            <div className="grid grid-cols-1 gap-x-3 gap-y-10 min-[430px]:grid-cols-2 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <EmptyState text={empty} />
          )}
        </ScrollReveal>
      </Container>
    </section>
  );
}

function PremiumCollectionsSection({
  categories,
  featured,
  sale,
  featuredContent,
  saleContent,
}: {
  categories: Category[];
  featured: StorefrontProduct[];
  sale: StorefrontProduct[];
  featuredContent: CmsBlockValue;
  saleContent: CmsBlockValue;
}) {
  const editorial = [...categories]
    .sort((a, b) => Number(b.slug === "accessories") - Number(a.slug === "accessories"))
    .filter((category) => category.bannerImageUrl || category.imageUrl)
    .slice(0, 2);

  return (
    <section className="store-section overflow-hidden border-b border-line bg-[#0e0e10]">
      <Container size="wide">
        <ScrollReveal>
          <SectionHeader
            eyebrow="The house edit"
            heading={featuredContent.fields.heading || "Premium Collections"}
            description={featuredContent.fields.description || "Considered pieces selected for a modern, confident wardrobe."}
            href={featured.length ? "/shop?sort=featured" : "/shop"}
          />

          {featured.length ? (
            <div className="grid grid-cols-1 gap-x-3 gap-y-10 min-[430px]:grid-cols-2 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
              {featured.slice(0, 8).map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : editorial.length ? (
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {editorial.map((category, index) => (
                <EditorialCollection key={category.id} category={category} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState text="Our premium edit is being prepared." />
          )}

          {sale.length ? (
            <div className="mt-16 border-t border-white/10 pt-12 sm:mt-24 sm:pt-16">
              <SectionHeader
                eyebrow="Private selection"
                heading={saleContent.fields.heading || "Limited Offers"}
                description={saleContent.fields.description || "A limited selection of distinguished pieces, available for a considered time."}
                href="/sale"
              />
              <div className="grid grid-cols-1 gap-x-3 gap-y-10 min-[430px]:grid-cols-2 sm:grid-cols-4 sm:gap-x-5">
                {sale.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            </div>
          ) : null}
        </ScrollReveal>
      </Container>
    </section>
  );
}

function EditorialCollection({ category, index }: { category: Category; index: number }) {
  const image = category.bannerImageUrl || category.imageUrl;
  return (
    <article className="group store-editorial-frame relative min-h-[31rem] sm:min-h-[38rem]">
      <Link className="absolute inset-0" href={`/shop/${category.slug}`}>
        {image ? (
          <StoreImage
            src={image}
            alt={`${category.name} premium collection`}
            fill
            quality={84}
            sizes="(max-width: 639px) 100vw, 50vw"
            className="object-cover transition duration-[1200ms] ease-[var(--mh-ease-out)] motion-safe:group-hover:scale-[1.04]"
          />
        ) : null}
        <span className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,7,8,.9)_0%,rgba(7,7,8,.12)_70%)]" aria-hidden="true" />
        <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
          <span>
            <span className="store-eyebrow block">Edit {String(index + 1).padStart(2, "0")}</span>
            <span className="block font-display text-4xl font-semibold text-ivory sm:text-5xl">{category.name}</span>
            <span className="mt-3 block max-w-md text-sm leading-6 text-white/70">
              {category.description || "Signature pieces chosen for lasting style."}
            </span>
          </span>
          <span className="grid size-11 shrink-0 place-items-center border border-white/30 text-white transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-gold-ink">
            <ArrowUpRight size={17} />
          </span>
        </span>
      </Link>
    </article>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="border border-dashed border-line bg-surface/45 px-5 py-12 text-center sm:py-16">
      <Sparkles className="mx-auto text-gold" size={20} aria-hidden="true" />
      <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-muted">{text}</p>
      <Link href="/shop" className="mt-5 inline-flex min-h-11 items-center text-xs font-bold uppercase tracking-[0.16em] text-ivory hover:text-gold">
        Browse the collection
        <ArrowRight className="ml-2" size={15} />
      </Link>
    </div>
  );
}

function WhySection({ content }: { content: CmsBlockValue }) {
  const defaults = [
    "Curated menswear",
    "Modern designs",
    "Complete men’s fashion range",
    "Convenient WhatsApp ordering",
    "Physical store concept",
  ];
  const icons = [Gem, Sparkles, Shirt, MessageCircle, Layers3];
  const points = defaults.map((fallback, index) => content.fields[`point${index + 1}`] || fallback).filter(Boolean);

  return (
    <section className="store-section border-b border-black/10 bg-ivory text-[#161617]">
      <Container size="wide">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Our point of view"
            heading={content.fields.heading || "Why Men’s Hub"}
            description={content.fields.description}
          />
          <div className="grid gap-px overflow-hidden border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-5">
            {points.map((point, index) => {
              const Icon = icons[index] ?? Gem;
              return (
                <div key={point} className="bg-ivory p-6 transition-colors duration-300 hover:bg-[#ece7dc] sm:p-7">
                  <Icon size={22} strokeWidth={1.5} className="text-[#8b6912]" />
                  <p className="mt-8 font-display text-xl font-semibold leading-tight">{point}</p>
                  <span className="mt-4 block h-px w-8 bg-[#b68d22]" />
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}

function TrustSection({
  content,
  settings,
}: {
  content: CmsBlockValue;
  settings: HomepageData["settings"];
}) {
  const assurances = [
    { icon: ShieldCheck, title: "Quality checked", text: "Every piece is reviewed before it joins our collection." },
    { icon: Truck, title: "Delivery support", text: "Clear delivery guidance confirmed personally on WhatsApp." },
    { icon: RefreshCcw, title: "Easy exchange", text: "Straightforward exchange guidance when the fit is not right." },
    { icon: MessageCircle, title: "Personal ordering", text: "Direct assistance from selection through order confirmation." },
  ];

  return (
    <section className="store-section border-b border-line bg-canvas">
      <Container size="wide">
        <ScrollReveal>
          <SectionHeader
            eyebrow="The Men’s Hub promise"
            heading="Confidence in every order"
            description="Premium service should feel as considered as the clothes themselves."
          />
          <div className="grid border border-line bg-line gap-px sm:grid-cols-2 lg:grid-cols-4">
            {assurances.map(({ icon: Icon, title, text }) => (
              <article key={title} className="bg-[#101011] p-6 sm:p-8">
                <Icon className="text-gold" size={23} strokeWidth={1.45} />
                <h3 className="mt-8 font-display text-2xl font-semibold text-ivory">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{text}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-8 border-y border-line py-9 sm:mt-14 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="store-eyebrow">Personal service</p>
              <h3 className="font-display text-3xl font-semibold text-ivory sm:text-4xl">
                {content.fields.heading || "Visit or speak with our team"}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                {content.fields.description || settings.address || "Ask about availability, sizing and delivery before placing your order."}
              </p>
              {settings.storeTiming ? <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-gold">{settings.storeTiming}</p> : null}
            </div>
            <div className="flex flex-col gap-3 min-[390px]:flex-row">
              <a className="store-cta-primary" href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={17} /> WhatsApp us
              </a>
              {settings.googleMapsUrl ? (
                <a className="store-cta-secondary" href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin size={17} /> View map
                </a>
              ) : (
                <Link className="store-cta-secondary" href="/contact">Contact us</Link>
              )}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}

function FashionShowcase({ categories, instagramUrl }: { categories: Category[]; instagramUrl: string | null }) {
  const images = categories.filter((category) => category.bannerImageUrl || category.imageUrl).slice(0, 5);
  if (!images.length) return null;

  return (
    <section className="store-section overflow-hidden bg-[#09090a]">
      <Container size="wide">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Style journal"
            heading="The Men’s Hub Edit"
            description="A visual study of modern menswear, confident silhouettes and considered finishing details."
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-12">
            {images.map((category, index) => {
              const image = category.bannerImageUrl || category.imageUrl;
              const layout = index === 0
                ? "col-span-2 row-span-2 aspect-[4/5] sm:col-span-2 lg:col-span-5"
                : index === 1
                  ? "aspect-square lg:col-span-3"
                  : index === 2
                    ? "aspect-square lg:col-span-4"
                    : "aspect-[4/5] lg:col-span-3";
              return (
                <Link key={category.id} href={`/shop/${category.slug}`} className={`group relative overflow-hidden bg-surface ${layout}`}>
                  {image ? (
                    <StoreImage
                      src={image}
                      alt={`${category.name} fashion edit`}
                      fill
                      quality={82}
                      sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, 34vw"
                      className="object-cover transition duration-[1000ms] ease-[var(--mh-ease-out)] motion-safe:group-hover:scale-[1.05]"
                    />
                  ) : null}
                  <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/25" aria-hidden="true" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-12 text-xs font-bold uppercase tracking-[0.14em] text-white sm:p-5">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col gap-5 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex max-w-xl items-start gap-3 text-sm leading-7 text-muted">
              <Check className="mt-1 shrink-0 text-gold" size={15} />
              Follow the latest arrivals, styling notes and collection stories from Men’s Hub.
            </p>
            {instagramUrl ? (
              <a className="store-cta-secondary self-start" href={instagramUrl} target="_blank" rel="noopener noreferrer">
                <Camera size={16} /> Follow on Instagram
              </a>
            ) : (
              <Link className="store-cta-secondary self-start" href="/shop">Explore the edit</Link>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
