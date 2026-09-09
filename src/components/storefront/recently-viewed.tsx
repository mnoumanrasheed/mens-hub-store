"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ProductTrackedLink } from "@/components/storefront/analytics-events";

type Item = { id: string; slug: string; name: string; sku: string; imageUrl: string; price: string };
const key = "mens-hub:recent:v1";
function read(): Item[] { try { const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]"); return Array.isArray(value) ? value.filter((item): item is Item => Boolean(item) && typeof item === "object" && typeof (item as Item).id === "string").slice(0, 8) : []; } catch { return []; } }

export function RecentlyViewed({ current }: { current: Item }) {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => { const previous = read(); const next = [current, ...previous.filter((item) => item.id !== current.id)].slice(0, 8); try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* Optional history must not affect shopping. */ } queueMicrotask(() => setItems(previous.filter((item) => item.id !== current.id).slice(0, 4))); }, [current]);
  if (!items.length) return null;
  return <section className="mt-20 border-t border-line pt-14"><p className="store-eyebrow">Your edit</p><h2 className="font-display text-4xl text-ivory">Recently viewed</h2><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">{items.map((item) => <ProductTrackedLink productId={item.id} key={item.id} href={`/product/${item.slug}`} className="group"><span className="relative block aspect-[4/5] overflow-hidden bg-surface"><Image src={item.imageUrl} alt={item.name} fill sizes="(max-width: 639px) 50vw, 25vw" className="object-cover transition group-hover:scale-[1.02]" /></span><span className="mt-3 block truncate font-display text-lg text-ivory">{item.name}</span><span className="text-xs text-muted">Article {item.sku} · PKR {item.price}</span></ProductTrackedLink>)}</div></section>;
}
