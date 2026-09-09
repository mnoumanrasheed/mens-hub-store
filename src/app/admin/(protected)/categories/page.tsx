import { CategoryManager } from "@/components/admin/category-manager";
import { getCategoriesForAdmin } from "@/data/categories";

export default async function CategoriesPage() {
  const categories = await getCategoriesForAdmin();
  return <div className="admin-page"><header className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-admin-accent">Catalogue structure</p><h1 className="mt-2 text-3xl font-bold text-admin-ink">Categories</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-admin-muted">Manage database-driven categories, subcategories, ordering, visibility, and collection media.</p></header><CategoryManager categories={categories} /></div>;
}
