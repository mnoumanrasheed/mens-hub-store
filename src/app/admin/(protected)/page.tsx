import { getDashboardMetrics } from "@/data/dashboard";

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();
  const cards = [["Total products", metrics.totalProducts], ["Published products", metrics.publishedProducts], ["Draft products", metrics.draftProducts], ["Out of stock", metrics.outOfStockProducts], ["Categories", metrics.categories]];
  return <div className="admin-page"><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-admin-accent">Store overview</p><h1 className="mt-2 text-3xl font-bold text-admin-ink">Dashboard</h1><p className="mt-2 text-sm text-admin-muted">Operational catalogue status at a glance.</p></div><dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map(([label, value]) => <div key={label} className="admin-panel"><dt className="text-sm font-semibold text-admin-muted">{label}</dt><dd className="mt-2 text-3xl font-bold text-admin-ink">{value}</dd></div>)}</dl></div>;
}
