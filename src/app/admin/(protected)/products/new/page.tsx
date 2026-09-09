import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { getProductForEdit, getProductFormOptions, getUniqueProductSlug } from "@/data/products";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ duplicate?: string }> }) {
  await requireAdmin(); const { duplicate } = await searchParams; const categories = await getProductFormOptions(); let source = duplicate ? await getProductForEdit(duplicate) : null;
  if (source) source = { ...source, sku: "", slug: await getUniqueProductSlug(`${source.slug}-copy`), isPublished: false, isFeatured: false };
  return <div className="admin-page"><Link className="admin-action" href="/admin/products">← Products</Link><header className="my-6"><h1 className="text-3xl font-bold text-admin-ink">{source ? `Duplicate ${source.name}` : "Add product"}</h1><p className="mt-1 text-sm text-admin-muted">{source ? "Assign a new SKU and upload its primary image. The duplicate starts unpublished." : "Create one real catalogue product with its inventory and options."}</p></header>{categories.length ? <ProductForm categories={categories} product={source ?? undefined} duplicate={Boolean(source)} /> : <div className="admin-panel text-admin-ink">Create a category before adding a product.</div>}</div>;
}
