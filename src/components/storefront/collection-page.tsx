import Link from "next/link";

import { Container } from "@/components/storefront/container";
import { ProductCard } from "@/components/storefront/product-card";
import { ShopFilters } from "@/components/storefront/shop-filters";
import { SortSelect } from "@/components/storefront/sort-select";
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
  return `${action}?${query}`;
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

  return (
    <main className="pb-24 pt-10 sm:pb-32 sm:pt-20">
      <Container size="wide">
        <header className="mb-8 grid gap-7 border-b border-line pb-8 sm:mb-10 sm:pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,28rem)] lg:items-end">
          <div>
            <p className="store-eyebrow">{eyebrow}</p>
            <h1 className="break-words font-display text-5xl font-semibold leading-[0.9] tracking-[-0.035em] text-ivory sm:text-7xl">
              {title}
            </h1>
            <div className="store-hairline mt-6 w-20" aria-hidden="true" />
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-xl text-sm leading-7 text-muted sm:text-base">
              {description || "Explore a considered selection of modern menswear, chosen for confident everyday style."}
            </p>
            {category?.subcategories.length ? (
              <nav aria-label={`${category.name} subcategories`} className="mt-5 flex flex-wrap gap-2">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    className="inline-flex min-h-10 items-center border border-line px-3 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-muted transition-colors hover:border-gold hover:text-gold"
                    href={`/shop/${category.slug}/${subcategory.slug}`}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8">
          <ShopFilters
            action={action}
            filters={filters}
            categories={data.categories}
            sizes={data.options.sizes}
            colors={data.options.colors}
            routeCategory={routeCategory}
          />

          <section className="min-w-0" aria-label="Products">
            <div className="mb-7 grid gap-3 min-[430px]:grid-cols-[1fr_auto] min-[430px]:items-center">
              <p className="text-sm text-muted">
                <span className="font-semibold text-ivory">{data.total}</span>{" "}
                {data.total === 1 ? "piece" : "pieces"}
                {filters.q ? ` for “${filters.q}”` : ""}
              </p>
              <form action={action} className="w-full min-[430px]:w-auto">
                {Object.entries(filters)
                  .filter(([key, value]) => key !== "sort" && key !== "page" && value)
                  .map(([key, value]) => (
                    <input key={key} type="hidden" name={key} value={String(value)} />
                  ))}
                <SortSelect value={filters.sort} />
              </form>
            </div>

            {data.products.length ? (
              <div className="grid grid-cols-1 gap-x-3 gap-y-10 min-[430px]:grid-cols-2 sm:grid-cols-3 sm:gap-x-5 xl:grid-cols-4">
                {data.products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="border border-dashed border-line bg-surface/50 px-5 py-16 text-center sm:py-20">
                <p className="store-eyebrow">The edit is evolving</p>
                <h2 className="font-display text-3xl text-ivory">No matching pieces</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
                  Try clearing a filter or return as the collection continues to grow.
                </p>
                <Link href={action} className="store-cta-secondary mt-6">Clear filters</Link>
              </div>
            )}

            {data.pageCount > 1 ? (
              <nav aria-label="Product pages" className="mt-14 flex flex-wrap justify-center gap-2">
                {data.page > 1 ? (
                  <Link className="store-cta-secondary" href={pageHref(action, filters, data.page - 1)}>Previous</Link>
                ) : null}
                <span className="flex min-h-12 items-center px-3 text-sm text-muted">
                  Page {data.page} of {data.pageCount}
                </span>
                {data.page < data.pageCount ? (
                  <Link className="store-cta-secondary" href={pageHref(action, filters, data.page + 1)}>Next</Link>
                ) : null}
              </nav>
            ) : null}
          </section>
        </div>
      </Container>
    </main>
  );
}
