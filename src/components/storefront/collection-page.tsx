import Link from "next/link";

import { AnimatedCollectionHero } from "@/components/storefront/animated-collection-hero";
import { Container } from "@/components/storefront/container";
import { ProductCard } from "@/components/storefront/product-card";
import type { InternalHeroBreadcrumb } from "@/components/storefront/internal-cinematic-hero";
import type { StorefrontProduct } from "@/data/storefront";
import type { StorefrontFilters } from "@/validation/storefront";
import { getAccessoryStorefrontCategories, getTopLevelStorefrontCategories } from "@/lib/category-navigation";

type CollectionData = {
  products: StorefrontProduct[];
  categories: {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string | null;
    bannerImageUrl?: string | null;
    subcategories: { id: string; name: string; slug: string }[];
  }[];
  options: { sizes: string[]; colors: string[] };
  total: number;
  page: number;
  pageCount: number;
};

function pageHref(action: string, filters: StorefrontFilters, page: number) {
  const query = new URLSearchParams();
  Object.entries({ ...filters, page: String(page) }).forEach(([key, value]) => {
    if (value) query.set(key, String(value));
  });
  return action + "?" + query;
}

export function CollectionPage({
  eyebrow,
  title,
  description,
  data,
  filters,
  action,
  routeCategory,
}: {
  eyebrow: string;
  title: string;
  description?: string | null;
  data: CollectionData;
  filters: StorefrontFilters;
  action: string;
  routeCategory?: string;
}) {
  const activeCategorySlug = routeCategory || filters.category;
  const category = activeCategorySlug
    ? data.categories.find((item) => item.slug === activeCategorySlug)
    : undefined;
  const topLevelCategories = getTopLevelStorefrontCategories(data.categories);
  const accessoryCategories = getAccessoryStorefrontCategories(data.categories);
  const isAccessoryRoute = Boolean(activeCategorySlug && ["accessories", ...accessoryCategories.map((item) => item.slug)].includes(activeCategorySlug));
  const routeDescriptions: Record<string, string> = {
    "new-arrivals": "Recently added clothing, footwear and accessories from Men's Hub.",
    sale: "Selected Men's Hub pieces currently available at reduced prices.",
  };
  const categoryDescriptions: Record<string, string> = {
    shirts: "Dress shirts, polos, casual shirts and T-shirts for everyday and formal wear.",
    pants: "Jeans, cotton pants and dress pants for everyday and smart dressing.",
    trousers: "Clean everyday trouser styles for polished casual and formal looks.",
    "shalwar-qameez": "Casual, cotton and wash-and-wear options for everyday and occasion dressing.",
    shoes: "Sneakers, loafers, sandals and formal shoes selected for everyday use.",
    watches: "Classic and modern watches designed to complete your everyday look.",
    perfumes: "Fragrance selections that add the finishing touch to your style.",
    glasses: "Modern eyewear styles that complement everyday and occasion wear.",
    belts: "Essential belt styles crafted to complete formal and casual outfits.",
    accessories: "Rings, bracelets, chains, wallets and finishing pieces.",
    tracksuits: "Comfort-driven coordinated styles for casual wear and daily movement.",
  };
  const heroDescription = categoryDescriptions[routeCategory || ""] || description || routeDescriptions[action.replace(/^\//, "")] || "Browse the latest products from Men's Hub.";
  const routeKey = action.replace(/^\//, "");
  const breadcrumbItems: InternalHeroBreadcrumb[] = [
    { label: "Home", href: "/" },
    ...(category && category.name !== title ? [{ label: category.name, href: "/shop/" + category.slug }] : []),
    { label: title },
  ];

  return (
    <main className="atelier-collection pb-24 sm:pb-32">
      <AnimatedCollectionHero key={action} routeKey={category?.slug || routeKey} eyebrow={eyebrow} title={title} description={heroDescription} breadcrumbItems={breadcrumbItems}>
          {category?.subcategories.length ? (
            <nav aria-label={category.name + " subcategories"} className="mt-5 flex flex-wrap gap-2">
              {category.subcategories.map((subcategory) => (
                <Link key={subcategory.id} className="inline-flex min-h-10 items-center border border-line px-3 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted transition-colors hover:border-gold hover:text-gold" href={"/shop/" + category.slug + "/" + subcategory.slug}>
                  {subcategory.name}
                </Link>
              ))}
            </nav>
          ) : null}
      </AnimatedCollectionHero>

      <Container size="wide" className="pt-8 sm:pt-12">
        <nav id="collection-navigation" className="collection-category-nav" aria-label="Browse collections">
          <Link href="/shop" aria-current={action === "/shop" && !routeCategory ? "page" : undefined}>All Products</Link>
          {topLevelCategories.map((item) => item.slug === "accessories" ? (
            <div key={item.id} className="collection-category-group">
              <Link href={"/shop/" + item.slug} aria-current={isAccessoryRoute ? "page" : undefined}>{item.name}</Link>
              {isAccessoryRoute ? <div className="collection-category-children" aria-label="Accessories categories">
                {accessoryCategories.map((child) => <Link key={child.id} href={"/shop/" + child.slug} aria-current={routeCategory === child.slug ? "page" : undefined}>{child.name}</Link>)}
              </div> : null}
            </div>
          ) : <Link key={item.id} href={"/shop/" + item.slug} aria-current={routeCategory === item.slug ? "page" : undefined}>{item.name}</Link>)}
        </nav>

        <div className="min-w-0">
          <section className="min-w-0" aria-label="Products">
            <div className="mb-7">
              <p className="text-sm text-muted"><span className="font-semibold text-ivory">{data.total}</span>{" "}{data.total === 1 ? "piece" : "pieces"}{filters.q ? " for “" + filters.q + "”" : ""}</p>
            </div>

            {data.products.length ? (
              <div className="grid grid-cols-1 gap-x-3 gap-y-10 min-[430px]:grid-cols-2 sm:grid-cols-3 sm:gap-x-5 xl:grid-cols-4">
                {data.products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="border border-dashed border-line bg-surface/50 px-5 py-16 text-center sm:py-20">
                <h2 className="font-display text-3xl text-ivory">No products available yet</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">New products will appear here after they are published.</p><a href="#collection-navigation" className="store-cta-secondary mt-6">Browse categories</a>
              </div>
            )}

            {data.pageCount > 1 ? (
              <nav aria-label="Product pages" className="mt-14 flex flex-wrap justify-center gap-2">
                {data.page > 1 ? <Link className="store-cta-secondary" href={pageHref(action, filters, data.page - 1)}>Previous</Link> : null}
                <span className="flex min-h-12 items-center px-3 text-sm text-muted">Page {data.page} of {data.pageCount}</span>
                {data.page < data.pageCount ? <Link className="store-cta-secondary" href={pageHref(action, filters, data.page + 1)}>Next</Link> : null}
              </nav>
            ) : null}
          </section>
        </div>
      </Container>
    </main>
  );
}
