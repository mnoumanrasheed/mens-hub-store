import Image from "next/image";
import Link from "next/link";

import { ProductDelete, ProductToggle } from "@/components/admin/product-actions";
import { getProductsForAdmin } from "@/data/products";
import { requireAdmin } from "@/lib/auth/require-admin";

type SearchParams = { page?: string | string[] };

function getPage(value: SearchParams["page"]) {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();
  const result = await getProductsForAdmin(getPage((await searchParams).page));
  const pageHref = (page: number) => `/admin/products?page=${page}`;

  return (
    <div className="admin-page">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-admin-ink">Products</h1>
          <p className="mt-1 text-sm text-admin-muted">
            {result.total} product{result.total === 1 ? "" : "s"} in this view.
          </p>
        </div>
        <Link className="admin-button" href="/admin/products/new">
          Add product
        </Link>
      </header>

      {result.products.length === 0 ? (
        <div className="admin-panel py-14 text-center">
          <h2 className="admin-section-title">No products found</h2>
          <p className="mt-2 text-sm text-admin-muted">Add the first real product to begin.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {result.products.map((product) => {
            const stock =
              product.stock === 0
                ? "OUT OF STOCK"
                : product.stock <= result.threshold
                  ? `ONLY ${product.stock} LEFT`
                  : "IN STOCK";

            return (
              <article
                key={product.id}
                className="admin-panel grid gap-4 md:grid-cols-[88px_minmax(0,1fr)_auto]"
              >
                <div className="relative aspect-square overflow-hidden rounded-md bg-admin-soft">
                  <Image src={product.imageUrl} alt="" fill sizes="88px" className="object-cover" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-admin-ink">{product.name}</h2>
                    {!product.isPublished ? <Tag>Draft</Tag> : null}
                    {product.isActiveSale ? <Tag>Sale</Tag> : null}
                    {product.isFeatured ? <Tag>Featured</Tag> : null}
                    {product.isNewArrival ? <Tag>New</Tag> : null}
                  </div>
                  <p className="mt-1 text-sm text-admin-muted">
                    {product.category.name}
                    {product.subcategory ? ` / ${product.subcategory.name}` : ""}
                  </p>
                  {product.sku ? <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-admin-muted">Tag: {product.sku}</p> : null}
                  <p className="mt-2 text-sm font-semibold text-admin-ink">
                    PKR {product.isActiveSale ? product.salePrice : product.originalPrice} · {stock}
                  </p>
                </div>
                <div className="flex flex-wrap items-start gap-2 md:max-w-80 md:justify-end">
                  <Link className="admin-action" href={`/admin/products/${product.id}/edit`}>
                    Edit
                  </Link>
                  <Link className="admin-action" href={`/admin/products/new?duplicate=${product.id}`}>
                    Duplicate
                  </Link>
                  <ProductToggle
                    id={product.id}
                    field="isPublished"
                    value={!product.isPublished}
                    label={product.isPublished ? "Unpublish" : "Publish"}
                  />
                  <ProductToggle
                    id={product.id}
                    field="isFeatured"
                    value={!product.isFeatured}
                    label={product.isFeatured ? "Unfeature" : "Feature"}
                  />
                  <ProductToggle
                    id={product.id}
                    field="isNewArrival"
                    value={!product.isNewArrival}
                    label={product.isNewArrival ? "Remove new" : "Mark new"}
                  />
                  <ProductDelete id={product.id} name={product.name} />
                </div>
              </article>
            );
          })}
        </div>
      )}

      {result.pageCount > 1 ? (
        <nav aria-label="Product pages" className="mt-6 flex items-center justify-between">
          <Link className="admin-button-secondary" href={pageHref(Math.max(1, result.page - 1))}>
            Previous
          </Link>
          <span className="text-sm text-admin-muted">
            Page {result.page} of {result.pageCount}
          </span>
          <Link className="admin-button-secondary" href={pageHref(Math.min(result.pageCount, result.page + 1))}>
            Next
          </Link>
        </nav>
      ) : null}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-admin-soft px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-admin-muted">
      {children}
    </span>
  );
}
