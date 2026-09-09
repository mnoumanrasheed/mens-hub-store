"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { StorefrontFilters } from "@/validation/storefront";

type CategoryOption = { id: string; name: string; slug: string; subcategories: { id: string; name: string; slug: string }[] };

function Fields({ filters, categories, sizes, colors, routeCategory }: { filters: StorefrontFilters; categories: CategoryOption[]; sizes: string[]; colors: string[]; routeCategory?: string }) {
  const category = categories.find((item) => item.slug === (routeCategory || filters.category));
  return <div className="grid gap-5">
    <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.13em] text-muted">Search<input className="store-filter-input" name="q" defaultValue={filters.q} placeholder="Name or article" /></label>
    {!routeCategory ? <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.13em] text-muted">Category<select className="store-filter-input" name="category" defaultValue={filters.category}><option value="">All categories</option>{categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label> : null}
    {category ? <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.13em] text-muted">Subcategory<select className="store-filter-input" name="subcategory" defaultValue={filters.subcategory}><option value="">All subcategories</option>{category.subcategories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label> : null}
    <fieldset><legend className="text-xs font-bold uppercase tracking-[0.13em] text-muted">Price (PKR)</legend><div className="mt-2 grid grid-cols-2 gap-2"><input className="store-filter-input" inputMode="decimal" name="minPrice" defaultValue={filters.minPrice} placeholder="Min" aria-label="Minimum price" /><input className="store-filter-input" inputMode="decimal" name="maxPrice" defaultValue={filters.maxPrice} placeholder="Max" aria-label="Maximum price" /></div></fieldset>
    {sizes.length ? <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.13em] text-muted">Size<select className="store-filter-input" name="size" defaultValue={filters.size}><option value="">All sizes</option>{sizes.map((size) => <option key={size}>{size}</option>)}</select></label> : null}
    {colors.length ? <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.13em] text-muted">Color<select className="store-filter-input" name="color" defaultValue={filters.color}><option value="">All colors</option>{colors.map((color) => <option key={color}>{color}</option>)}</select></label> : null}
    <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.13em] text-muted">Availability<select className="store-filter-input" name="availability" defaultValue={filters.availability}><option value="">Any availability</option><option value="in-stock">In stock</option><option value="low-stock">Low stock</option><option value="out-of-stock">Out of stock</option></select></label>
    <div className="grid gap-3"><label className="flex min-h-11 items-center gap-3 text-sm text-ivory"><input type="checkbox" name="sale" value="1" defaultChecked={filters.sale === "1"} /> On sale</label><label className="flex min-h-11 items-center gap-3 text-sm text-ivory"><input type="checkbox" name="newArrival" value="1" defaultChecked={filters.newArrival === "1"} /> New arrivals</label></div>
    <button className="store-cta-primary w-full" type="submit">Apply filters</button>
  </div>;
}

export function ShopFilters(props: { action: string; filters: StorefrontFilters; categories: CategoryOption[]; sizes: string[]; colors: string[]; routeCategory?: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (!open) return; const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, [open]);
  return <>
    <button className="store-cta-secondary mb-6 w-full lg:hidden" type="button" onClick={() => setOpen(true)} aria-expanded={open}><SlidersHorizontal size={16} /> Filters</button>
    <aside className="hidden lg:block"><form action={props.action} className="sticky top-24 border border-line bg-surface p-5"><Fields {...props} /></form></aside>
    {open ? <div className="fixed inset-0 z-50 bg-black/70 lg:hidden" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><section className="ml-auto h-full w-[min(90vw,24rem)] overflow-y-auto border-l border-line bg-canvas p-5" role="dialog" aria-modal="true" aria-label="Product filters"><div className="mb-6 flex items-center justify-between"><h2 className="font-display text-3xl text-ivory">Filters</h2><button className="store-icon-button" type="button" autoFocus aria-label="Close filters" onClick={() => setOpen(false)}><X size={20} /></button></div><form action={props.action}><Fields {...props} /></form></section></div> : null}
  </>;
}
