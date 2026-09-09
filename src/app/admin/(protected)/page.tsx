import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { getDashboardMetrics } from "@/data/dashboard";

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();
  const cards = [["Total products", metrics.totalProducts], ["Available products", metrics.availableProducts], ["Out of stock", metrics.outOfStockProducts], ["Low stock", metrics.lowStockProducts], ["Active sale products", metrics.saleProducts], ["New arrivals", metrics.newArrivals], ["Categories", metrics.categories], ["Subcategories", metrics.subcategories], ["WhatsApp clicks", metrics.whatsappClicks]];
  return <div className="admin-page"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-admin-accent">Store overview</p><h1 className="mt-2 text-3xl font-bold text-admin-ink">Dashboard</h1><p className="mt-2 text-sm text-admin-muted">WhatsApp clicks are engagement signals, not completed sales.</p></div><Link href="/admin/analytics" className="admin-button"><BarChart3 size={16} /> View analytics</Link></div><dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map(([label, value]) => <div key={label} className="admin-panel"><dt className="text-sm font-semibold text-admin-muted">{label}</dt><dd className="mt-2 text-3xl font-bold text-admin-ink">{value}</dd></div>)}</dl></div>;
}
