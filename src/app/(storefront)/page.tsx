import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
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
        mainImage={hero.imageUrl ? { url: hero.imageUrl, alt: "Men’s Hub collection" } : undefined}
        secondaryImages={heroCandidates.slice(hero.imageUrl ? 0 : 1, hero.imageUrl ? 2 : 3)}
      />

      <nav className="atelier-service-strip" aria-label="Shopping services">
        <Link href="/shop"><Gem />Considered collections</Link>
        <Link href="/shipping-policy"><Truck />Delivery guidance</Link>
        <Link href="/return-exchange-policy"><RefreshCcw />Exchange support</Link>
        <Link href="/how-to-order"><MessageCircle />Personal ordering</Link>
      </nav>

      <CollectionSection
        eyebrow="Latest edit"
        content={block("new-arrivals")}
        fallbackHeading="New Arrivals"
        products={data.newProducts}
        href="/new-arrivals"
        empty="New arrivals will appear here when they are published."
      />

      <CategoryShowcase categories={data.categories} content={block("shop-by-category")} />

      <SaleSection products={data.saleProducts} content={block("sale")} />

      <BrandStorySection categories={data.categories} />
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
    <header className="atelier-section-heading mb-9 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
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
    <section className="store-section premium-promise-section border-b border-line bg-canvas">
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

function SaleSection({ products, content }: { products: StorefrontProduct[]; content: CmsBlockValue }) {
  if (!products.length) return null;

  return (
    <section className="store-section overflow-hidden border-b border-line bg-[#0e0e10]">
      <Container size="wide">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Private selection"
            heading={content.fields.heading || "Limited Offers"}
            description={content.fields.description || "A limited selection of distinguished pieces, available for a considered time."}
            href="/sale"
          />
          <div className="grid grid-cols-1 gap-x-3 gap-y-10 min-[430px]:grid-cols-2 sm:grid-cols-4 sm:gap-x-5">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </ScrollReveal>
      </Container>
    </section>
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

function BrandStorySection({ categories }: { categories: Category[] }) {
  const category = categories.find((item) => item.bannerImageUrl || item.imageUrl);
  const image = category?.bannerImageUrl || category?.imageUrl || "/images/atelier-campaign.webp";

  return (
    <section className="atelier-story story-manifesto overflow-hidden border-b border-line bg-canvas" aria-labelledby="brand-story-title">
      <span className="story-manifesto-word" aria-hidden="true">INTENTION</span>
      <div className="story-manifesto-shell">
        <div className="story-manifesto-meta" aria-hidden="true"><span>Men&apos;s Hub / The house</span><span>Modern menswear / 01</span></div>
        <div className="story-manifesto-grid">
          <ScrollReveal className="story-manifesto-copy">
            <p className="store-eyebrow">A point of view</p>
            <h2 id="brand-story-title"><span>More than</span><span>clothing.</span><em>A statement of confidence.</em></h2>
            <div className="story-manifesto-note">
              <span className="story-manifesto-note-index">01</span>
              <p>We believe the modern gentleman dresses with intention. Each piece is selected to move through the day with quiet confidence and lasting ease.</p>
            </div>
            <Link href="/about" className="story-manifesto-link">Discover our story <span aria-hidden="true">&#8599;</span></Link>
          </ScrollReveal>
          <ScrollReveal className="story-manifesto-visual" delay={0.08}>
            <StoreImage src={image} alt="Men's Hub fashion story" fill sizes="(max-width: 767px) 100vw, 48vw" className="story-manifesto-image" />
            <span className="story-manifesto-shade" aria-hidden="true" />
            <span className="story-manifesto-caption">Selected with purpose</span>
            <span className="story-manifesto-seal" aria-hidden="true">MH<small>Style made for men</small></span>
          </ScrollReveal>
        </div>
        <div className="story-manifesto-rail">
          <span><b>01</b> Thoughtful curation</span><span><b>02</b> Quiet confidence</span><span><b>03</b> Lasting style</span>
        </div>
      </div>
    </section>
  );
}
function WhySection({ content }: { content: CmsBlockValue }) {
  const principles = [
    { icon: Gem, title: content.fields.point1 || "Curated menswear", text: "A focused edit chosen for quality, relevance and lasting appeal." },
    { icon: Sparkles, title: content.fields.point2 || "Modern designs", text: "Contemporary silhouettes shaped for confident everyday dressing." },
    { icon: Shirt, title: content.fields.point3 || "Complete men's fashion range", text: "Clothing, footwear and finishing details considered as one wardrobe." },
    { icon: MessageCircle, title: content.fields.point4 || "Convenient WhatsApp ordering", text: "Direct, personal assistance from first question to order confirmation." },
    { icon: Layers3, title: content.fields.point5 || "Physical store concept", text: "A real destination where service and personal style come together." },
  ];

  return (
    <section className="atelier-principles premium-why-section store-section border-b border-black/10 bg-ivory text-canvas">
      <Container size="wide">
        <ScrollReveal className="premium-why-editorial">
          <header className="premium-why-intro">
            <p className="store-eyebrow">01 / The Men&apos;s Hub difference</p>
            <h2>{content.fields.heading || "Why Men's Hub"}</h2>
            <p>{content.fields.description || "A considered destination for men who value strong style, thoughtful choice and service that feels personal."}</p>
            <span className="premium-why-monogram" aria-hidden="true">WHY</span>
          </header>
          <div className="premium-why-principles">
            {principles.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="premium-why-row">
                <span className="premium-why-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="premium-why-row-copy"><h3>{title}</h3><p>{text}</p></div>
                <span className="premium-why-row-icon"><Icon size={19} strokeWidth={1.35} /></span>
              </article>
            ))}
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
    <section className="store-section premium-promise-section border-b border-line bg-canvas">
      <Container size="wide">
        <ScrollReveal>
          <div className="premium-promise-heading"><div><p className="store-eyebrow">The Men&apos;s Hub promise / 02</p><h2 className="store-section-title">Confidence in every order.</h2></div><p>Premium service should feel as considered as the clothes themselves.</p></div>
          <div className="premium-promise-grid">
            {assurances.map(({ icon: Icon, title, text }) => (
              <article key={title} className="premium-promise-card">
                <div className="premium-promise-icon"><Icon size={21} strokeWidth={1.35} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="premium-promise-arrow" aria-hidden="true">&#8599;</span>
              </article>
            ))}
          </div>

          <div className="premium-concierge mt-10 grid gap-8 border-y border-line py-9 sm:mt-14 sm:py-12 lg:grid-cols-[1fr_auto] lg:items-center">
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
    <section id="lookbook" className="store-section scroll-mt-16 overflow-hidden bg-[#09090a]">
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
