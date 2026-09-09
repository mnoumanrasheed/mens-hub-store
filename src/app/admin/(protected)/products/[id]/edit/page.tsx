import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getProductForEdit, getProductFormOptions } from "@/data/products";
import { requireAdmin } from "@/lib/auth/require-admin";
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) { await requireAdmin(); const { id } = await params; const [product, categories] = await Promise.all([getProductForEdit(id), getProductFormOptions()]); if (!product) notFound(); return <div className="admin-page"><Link className="admin-action" href="/admin/products">← Products</Link><header className="my-6"><h1 className="text-3xl font-bold text-admin-ink">Edit {product.name}</h1><p className="mt-1 text-sm text-admin-muted">Changes are validated and applied to the catalogue.</p></header><ProductForm categories={categories} product={product} /></div>; }
