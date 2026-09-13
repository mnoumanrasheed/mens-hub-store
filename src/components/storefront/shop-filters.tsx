"use client";

import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";
import type { StorefrontFilters } from "@/validation/storefront";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
  subcategories: { id: string; name: string; slug: string }[];
};

type FilterProps = {
  action: string;
  filters: StorefrontFilters;
  categories: CategoryOption[];
  sizes: string[];
  colors: string[];
  routeCategory?: string;
};

function Fields({ filters, categories, sizes, colors, routeCategory }: Omit<FilterProps, "action">) {
  const category = categories.find((item) => item.slug === (routeCategory || filters.category));
  const labelClass = "grid gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted";

  return (
    <div className="grid gap-5">
      <label className={labelClass}>Search<input className="store-filter-input" name="q" defaultValue={filters.q} placeholder="Name or article" /></label>
      {!routeCategory ? <label className={labelClass}>Category<select className="store-filter-input" name="category" defaultValue={filters.category}><option value="">All categories</option>{categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label> : null}
      {category ? <label className={labelClass}>Subcategory<select className="store-filter-input" name="subcategory" defaultValue={filters.subcategory}><option value="">All subcategories</option>{category.subcategories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label> : null}
      <fieldset>
        <legend className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Price (PKR)</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input className="store-filter-input" inputMode="decimal" name="minPrice" defaultValue={filters.minPrice} placeholder="Min" aria-label="Minimum price" />
          <input className="store-filter-input" inputMode="decimal" name="maxPrice" defaultValue={filters.maxPrice} placeholder="Max" aria-label="Maximum price" />
        </div>
      </fieldset>
      {sizes.length ? <label className={labelClass}>Size<select className="store-filter-input" name="size" defaultValue={filters.size}><option value="">All sizes</option>{sizes.map((size) => <option key={size}>{size}</option>)}</select></label> : null}
      {colors.length ? <label className={labelClass}>Color<select className="store-filter-input" name="color" defaultValue={filters.color}><option value="">All colors</option>{colors.map((color) => <option key={color}>{color}</option>)}</select></label> : null}
      <label className={labelClass}>Availability<select className="store-filter-input" name="availability" defaultValue={filters.availability}><option value="">Any availability</option><option value="in-stock">In stock</option><option value="low-stock">Low stock</option><option value="out-of-stock">Out of stock</option></select></label>
      <div className="grid gap-1">
        <label className="flex min-h-12 items-center gap-3 text-sm text-ivory"><input className="size-4 accent-gold" type="checkbox" name="sale" value="1" defaultChecked={filters.sale === "1"} /> On sale</label>
        <label className="flex min-h-12 items-center gap-3 text-sm text-ivory"><input className="size-4 accent-gold" type="checkbox" name="newArrival" value="1" defaultChecked={filters.newArrival === "1"} /> New arrivals</label>
      </div>
      <button className="store-cta-primary w-full" type="submit">Apply filters</button>
    </div>
  );
}

export function ShopFilters(props: FilterProps) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLElement>(null);

  function close(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => trigger.current?.focus());
  }

  useEffect(() => {
    if (!open) return;
    const focusFrame = requestAnimationFrame(() => dialog.current?.querySelector<HTMLButtonElement>("button")?.focus());
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close(true);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button ref={trigger} className="store-cta-secondary mb-6 w-full lg:hidden" type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-product-filters">
        <SlidersHorizontal size={17} /> Filters
      </button>

      <aside className="hidden lg:block">
        <form action={props.action} className="atelier-filter-form sticky top-24 border border-line bg-surface p-5"><p className="store-eyebrow">Refine your selection</p><Fields {...props} /></form>
      </aside>

      <div
        className={cn("fixed inset-0 z-50 overflow-hidden bg-black/70 transition-[opacity,visibility] duration-300 lg:hidden", open ? "visible opacity-100" : "invisible opacity-0")}
        aria-hidden={!open}
        inert={!open}
        onMouseDown={(event) => { if (event.target === event.currentTarget) close(true); }}
      >
        <section
          ref={dialog}
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]');
            const first = controls[0]; const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
          }}
          id="mobile-product-filters"
          className={cn("ml-auto h-full w-full max-w-sm overflow-y-auto border-l border-line bg-canvas px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5 shadow-[0_0_70px_rgb(0_0_0/0.55)] transition-transform duration-500 ease-[var(--mh-ease-out)]", open ? "translate-x-0" : "translate-x-full")}
          role="dialog"
          aria-modal="true"
          aria-label="Product filters"
        >
          <div className="mb-7 flex items-center justify-between border-b border-line pb-5">
            <div><p className="store-eyebrow">Refine</p><h2 className="font-display text-4xl text-ivory">Filters</h2></div>
            <button className="store-icon-button" type="button" aria-label="Close filters" onClick={() => close(true)}><X size={20} /></button>
          </div>
          <form action={props.action}>
            <Fields {...props} />
            <Link className="mt-4 flex min-h-12 items-center justify-center text-xs font-bold uppercase tracking-[0.12em] text-muted" href={props.action}>Clear all filters</Link>
          </form>
        </section>
      </div>
    </>
  );
}
