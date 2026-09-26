import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { getProductForEdit, getProductFormOptions } from "@/data/products";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ duplicate?: string }> }) {
  await requireAdmin();
  const { duplicate } = await searchParams;
  const categories = await getProductFormOptions();
  const source = duplicate ? await getProductForEdit(duplicate) : null;
  const duplicateProduct = source ? { ...source, isPublished: false, isFeatured: false } : undefined;
  return <div className="admin-page"><Link className="admin-action" href="/admin/products">← Products</Link><header className="my-6"><h1 className="text-3xl font-bold text-admin-ink">{source ? `Duplicate ${source.name}` : "Add product"}</h1><p className="mt-1 text-sm text-admin-muted">{source ? "Upload a new primary image. The duplicate starts unpublished." : "Create one real catalogue product with its stock and options."}</p></header>{categories.length ? <ProductForm categories={categories} product={duplicateProduct} duplicate={Boolean(source)} /> : <div className="admin-panel text-admin-ink">Create a category before adding a product.</div>}</div>;
}
