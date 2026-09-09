"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackSiteEvent } from "@/lib/analytics";

type Suggestion = { id: string; name: string; sku: string; slug: string; imageUrl: string; category: { name: string } };

export function SearchCombobox() {
  const router = useRouter();
  const listId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  useEffect(() => { if (query.trim().length < 2) return; const controller = new AbortController(); const timer = window.setTimeout(async () => { try { const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`, { signal: controller.signal }); const body = response.ok ? await response.json() as { results: Suggestion[] } : { results: [] }; setItems(body.results); } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setItems([]); } finally { if (!controller.signal.aborted) setLoading(false); } }, 250); return () => { window.clearTimeout(timer); controller.abort(); }; }, [query]);
  function choose(item: Suggestion) { trackSiteEvent("PRODUCT_CLICK", item.id); router.push(`/product/${item.slug}`); }
  const expanded = query.trim().length >= 2;
  return <form action="/shop" className="relative" role="search"><label className="sr-only" htmlFor="site-search">Search products</label><input ref={input} autoFocus id="site-search" name="q" role="combobox" aria-autocomplete="list" aria-controls={listId} aria-expanded={expanded} aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined} aria-busy={loading} autoComplete="off" className="min-h-12 w-full border border-line bg-canvas px-4 pr-24 text-base text-ivory placeholder:text-subtle" placeholder="Name, article, category…" value={query} onChange={(event) => { const value = event.target.value; setQuery(value); setActive(-1); setItems([]); setLoading(value.trim().length >= 2); }} onKeyDown={(event) => { if (!items.length) return; if (event.key === "ArrowDown") { event.preventDefault(); setActive((value) => Math.min(value + 1, items.length - 1)); } else if (event.key === "ArrowUp") { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); } else if (event.key === "Enter" && active >= 0) { event.preventDefault(); choose(items[active]); } else if (event.key === "Escape") { setItems([]); setActive(-1); } }} /><button className="absolute right-0 top-0 min-h-12 bg-gold px-4 text-xs font-bold uppercase tracking-[0.12em] text-gold-ink">Search</button>{expanded ? <div id={listId} role="listbox" className="absolute inset-x-0 top-[calc(100%+0.5rem)] max-h-80 overflow-y-auto border border-line bg-surface shadow-2xl">{loading ? <p className="p-4 text-sm text-muted" role="status">Searching…</p> : items.length ? items.map((item, index) => <button id={`${listId}-${index}`} key={item.id} role="option" aria-selected={active === index} type="button" className="grid min-h-16 w-full grid-cols-[3rem_1fr] items-center gap-3 border-b border-line p-2 text-left hover:bg-surface-raised aria-selected:bg-surface-raised" onMouseEnter={() => setActive(index)} onClick={() => choose(item)}><span className="relative aspect-square overflow-hidden bg-canvas"><Image src={item.imageUrl} alt="" fill sizes="48px" className="object-cover" /></span><span><span className="block text-sm font-bold text-ivory">{item.name}</span><span className="text-xs text-muted">{item.category.name} · {item.sku}</span></span></button>) : <p className="p-4 text-sm text-muted" role="status">No published products found.</p>}</div> : null}</form>;
}
