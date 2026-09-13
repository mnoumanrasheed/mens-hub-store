import Link from "next/link";

import { AnimatedCollectionHero } from "@/components/storefront/animated-collection-hero";
import { Container } from "@/components/storefront/container";
import { ProductCard } from "@/components/storefront/product-card";
import type { StorefrontProduct } from "@/data/storefront";
import type { StorefrontFilters } from "@/validation/storefront";

type CollectionData = {
  products: StorefrontProduct[];
  categories: {
    id: string;
    name: string;
    slug: string;
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
  const category = routeCategory
    ? data.categories.find((item) => item.slug === routeCategory)
    : undefined;
  const heroDescription = description || "Explore a considered selection of modern menswear, chosen for confident everyday style.";

  return (
    <main className="atelier-collection pb-24 pt-10 sm:pb-32 sm:pt-20">
      <Container size="wide">
        <nav className="collection-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span>{title}</span></nav>
        <AnimatedCollectionHero key={action} eyebrow={eyebrow} title={title} description={heroDescription}>
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

        <nav className="collection-category-nav" aria-label="Browse collections"><Link href="/shop" aria-current={action === "/shop" && !routeCategory ? "page" : undefined}>All pieces</Link>{data.categories.map((item) => <Link key={item.id} href={"/shop/" + item.slug} aria-current={routeCategory === item.slug ? "page" : undefined}>{item.name}</Link>)}</nav>

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
                <p className="store-eyebrow">The edit is evolving</p><h2 className="font-display text-3xl text-ivory">No matching pieces</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">Explore the collection or return as new pieces arrive.</p><Link href={action} className="store-cta-secondary mt-6">Browse collection</Link>
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