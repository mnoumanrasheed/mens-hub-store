"use client";

import Image from "next/image";
import { useActionState, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { createProductAction, updateProductAction } from "@/actions/products";
import type { ProductEditorDto, ProductFormOption } from "@/data/products";
import { initialMutationState } from "@/types/mutation-state";

type Props = { categories: ProductFormOption[]; product?: ProductEditorDto; duplicate?: boolean };
type Size = { label: string };
type Color = { name: string; hexCode: string | null };

const inputClass = "min-h-11 w-full rounded-md border border-admin-line bg-white px-3 text-sm text-admin-ink outline-none focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/20";
const labelClass = "grid gap-1.5 text-sm font-semibold text-admin-ink";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function localDateTime(value: string | null | undefined) {
  return value ? new Date(value).toISOString().slice(0, 16) : "";
}

function ReorderableOptions({ kind, items, onChange }: { kind: "size" | "color"; items: (Size | Color)[]; onChange: (items: (Size | Color)[]) => void }) {
  const [label, setLabel] = useState("");
  const [hex, setHex] = useState("#1a1a1a");
  function move(index: number, delta: number) {
    const next = [...items];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  return <div className="rounded-lg border border-admin-line bg-admin-soft p-4">
    <p className="mb-3 text-sm font-bold text-admin-ink">{kind === "size" ? "Sizes" : "Colors"}</p>
    <div className="mb-3 flex flex-wrap gap-2">
      <input className={`${inputClass} min-w-40 flex-1`} value={label} onChange={(event) => setLabel(event.target.value)} placeholder={kind === "size" ? "Add a size" : "Add a color"} />
      {kind === "color" ? <input aria-label="Color value" className="h-11 w-14 rounded border border-admin-line bg-white p-1" type="color" value={hex} onChange={(event) => setHex(event.target.value)} /> : null}
      <button className="admin-button" type="button" onClick={() => { const clean = label.trim(); if (!clean) return; onChange([...items, kind === "size" ? { label: clean } : { name: clean, hexCode: hex }]); setLabel(""); }}><Plus size={16} /> Add</button>
    </div>
    {items.length ? <ul className="grid gap-2">{items.map((item, index) => {
      const name = "label" in item ? item.label : item.name;
      return <li key={`${name}-${index}`} className="flex items-center gap-2 rounded border border-admin-line bg-white px-3 py-2 text-sm text-admin-ink">
        {"hexCode" in item && item.hexCode ? <span className="h-4 w-4 rounded-full border" style={{ backgroundColor: item.hexCode }} /> : null}
        <span className="flex-1">{name}</span>
        <button className="grid min-h-11 min-w-11 place-items-center" type="button" aria-label={`Move ${name} up`} onClick={() => move(index, -1)} disabled={index === 0}><ArrowUp size={15} /></button>
        <button className="grid min-h-11 min-w-11 place-items-center" type="button" aria-label={`Move ${name} down`} onClick={() => move(index, 1)} disabled={index === items.length - 1}><ArrowDown size={15} /></button>
        <button type="button" aria-label={`Remove ${name}`} className="grid min-h-11 min-w-11 place-items-center text-red-700" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={15} /></button>
      </li>;
    })}</ul> : <p className="text-sm text-admin-muted">No {kind === "size" ? "sizes" : "colors"} added. Options are product-specific and never hardcoded.</p>}
  </div>;
}

export function ProductForm({ categories, product, duplicate = false }: Props) {
  const action = product && !duplicate ? updateProductAction : createProductAction;
  const [state, formAction, pending] = useActionState(action, initialMutationState);
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [subcategoryId, setSubcategoryId] = useState(product?.subcategoryId ?? "");
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugManual, setSlugManual] = useState(Boolean(product));
  const [sizes, setSizes] = useState<Size[]>(product?.sizes ?? []);
  const [colors, setColors] = useState<Color[]>(product?.colors ?? []);
  const [preview, setPreview] = useState(product && !duplicate ? product.imageUrl : "");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice ?? "");
  const [salePrice, setSalePrice] = useState(product?.salePrice ?? "");
  const subcategories = useMemo(() => categories.find((category) => category.id === categoryId)?.subcategories ?? [], [categories, categoryId]);
  const discount = Number(originalPrice) > 0 && Number(salePrice) > 0 && Number(salePrice) < Number(originalPrice) ? Math.round((1 - Number(salePrice) / Number(originalPrice)) * 100) : null;
  const errors = state.fieldErrors ?? {};

  return <form action={formAction} className="grid gap-6" encType="multipart/form-data">
    {product && !duplicate ? <input type="hidden" name="id" value={product.id} /> : null}
    <input type="hidden" name="slugMode" value={slugManual ? "manual" : "auto"} />
    <input type="hidden" name="sizes" value={JSON.stringify(sizes)} />
    <input type="hidden" name="colors" value={JSON.stringify(colors)} />
    {state.message ? <div role="status" className={`rounded-md border px-4 py-3 text-sm ${state.status === "success" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-red-300 bg-red-50 text-red-800"}`}>{state.message}</div> : null}

    <section className="admin-panel grid gap-5">
      <div><h2 className="admin-section-title">Core details</h2><p className="admin-help">The SKU and slug must be unique.</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>Product name<input className={inputClass} name="name" required maxLength={150} value={name} onChange={(event) => { setName(event.target.value); if (!slugManual) setSlug(slugify(event.target.value)); }} /><FieldError value={errors.name} /></label>
        <label className={labelClass}>SKU / article number<input className={inputClass} name="sku" required maxLength={80} defaultValue={duplicate ? "" : product?.sku} /><FieldError value={errors.sku} /></label>
        <label className={labelClass}>Slug<input className={inputClass} name="slug" required value={slug} onChange={(event) => { setSlug(slugify(event.target.value)); setSlugManual(true); }} /><FieldError value={errors.slug} /></label>
        <label className={labelClass}>Product type <span className="font-normal text-admin-muted">Optional</span><input className={inputClass} name="productType" maxLength={80} defaultValue={product?.productType ?? ""} /></label>
        <label className={labelClass}>Category<select className={inputClass} name="categoryId" required value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setSubcategoryId(""); }}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className={labelClass}>Subcategory <span className="font-normal text-admin-muted">Optional</span><select className={inputClass} name="subcategoryId" value={subcategoryId} onChange={(event) => setSubcategoryId(event.target.value)}><option value="">None</option>{subcategories.map((subcategory) => <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>)}</select><FieldError value={errors.subcategoryId} /></label>
      </div>
    </section>

    <section className="admin-panel grid gap-5">
      <div><h2 className="admin-section-title">Primary image</h2><p className="admin-help">Exactly one JPG, PNG, or WebP image, up to 5 MB.</p></div>
      <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-admin-line bg-admin-soft">{preview ? <Image src={preview} alt="Product preview" fill sizes="160px" unoptimized={preview.startsWith("blob:")} className="object-cover" /> : <span className="grid h-full place-items-center p-4 text-center text-xs text-admin-muted">No image selected</span>}</div>
        <label className={labelClass}>{product && !duplicate ? "Replace image (optional)" : "Product image"}<input className={inputClass} name="image" type="file" accept="image/jpeg,image/png,image/webp" required={!product || duplicate} onChange={(event) => { const file = event.target.files?.[0]; if (file) setPreview(URL.createObjectURL(file)); }} /><FieldError value={errors.image} />{duplicate ? <span className="font-normal text-admin-muted">A fresh upload prevents the duplicate from sharing the original product’s managed asset.</span> : null}</label>
      </div>
    </section>

    <section className="admin-panel grid gap-5"><h2 className="admin-section-title">Pricing and inventory</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <label className={labelClass}>Original price (PKR)<input className={inputClass} name="originalPrice" inputMode="decimal" required value={originalPrice} onChange={(event) => setOriginalPrice(event.target.value)} /></label>
        <label className={labelClass}>Sale price (PKR)<input className={inputClass} name="salePrice" inputMode="decimal" value={salePrice ?? ""} onChange={(event) => setSalePrice(event.target.value)} />{discount ? <span className="font-normal text-emerald-700">Calculated discount: {discount}%</span> : null}</label>
        <label className={labelClass}>Total articles<input className={inputClass} name="totalArticles" type="number" min="0" required defaultValue={product?.totalArticles ?? 0} /></label>
        <label className={labelClass}>Available articles<input className={inputClass} name="availableArticles" type="number" min="0" required defaultValue={product?.availableArticles ?? 0} /></label>
        <label className={labelClass}>Sold articles<input className={inputClass} name="soldArticles" type="number" min="0" required defaultValue={product?.soldArticles ?? 0} /><span className="font-normal text-admin-muted">Admin-managed; WhatsApp clicks never alter stock.</span></label>
      </div>
    </section>

    <section className="admin-panel grid gap-5"><h2 className="admin-section-title">Options</h2><div className="grid gap-4 lg:grid-cols-2"><ReorderableOptions kind="size" items={sizes} onChange={(items) => setSizes(items as Size[])} /><ReorderableOptions kind="color" items={colors} onChange={(items) => setColors(items as Color[])} /></div></section>

    <section className="admin-panel grid gap-5"><h2 className="admin-section-title">Description</h2>
      <label className={labelClass}>Description<textarea className={`${inputClass} min-h-36 py-3`} name="description" required maxLength={10000} defaultValue={product?.description} /></label>
      <label className={labelClass}>Fabric / material <span className="font-normal text-admin-muted">Optional</span><textarea className={`${inputClass} min-h-24 py-3`} name="material" maxLength={500} defaultValue={product?.material ?? ""} /></label>
    </section>

    <section className="admin-panel grid gap-5"><h2 className="admin-section-title">Publishing and sale</h2>
      <div className="flex flex-wrap gap-5"><Check name="isPublished" label="Published" checked={duplicate ? false : product?.isPublished} /><Check name="isFeatured" label="Featured" checked={duplicate ? false : product?.isFeatured} /><Check name="isNewArrival" label="New arrival" checked={product?.isNewArrival} /><Check name="saleEnabled" label="Sale enabled" checked={product?.saleEnabled} /></div>
      <div className="grid gap-4 md:grid-cols-2"><label className={labelClass}>Sale starts (UTC) <span className="font-normal text-admin-muted">Optional</span><input className={inputClass} name="saleStartAt" type="datetime-local" defaultValue={localDateTime(product?.saleStartAt)} /></label><label className={labelClass}>Sale ends (UTC) <span className="font-normal text-admin-muted">Optional</span><input className={inputClass} name="saleEndAt" type="datetime-local" defaultValue={localDateTime(product?.saleEndAt)} /></label></div>
    </section>

    <section className="admin-panel grid gap-5"><h2 className="admin-section-title">Search presentation</h2><label className={labelClass}>SEO title <span className="font-normal text-admin-muted">Optional</span><input className={inputClass} name="seoTitle" maxLength={70} defaultValue={product?.seoTitle ?? ""} /></label><label className={labelClass}>SEO description <span className="font-normal text-admin-muted">Optional</span><textarea className={`${inputClass} min-h-24 py-3`} name="seoDescription" maxLength={170} defaultValue={product?.seoDescription ?? ""} /></label></section>
    <div className="sticky bottom-3 flex justify-end rounded-lg border border-admin-line bg-white/95 p-3 shadow-lg backdrop-blur"><button className="admin-button min-w-36" type="submit" disabled={pending}>{pending ? "Saving…" : product && !duplicate ? "Save product" : "Create product"}</button></div>
  </form>;
}

function FieldError({ value }: { value?: string[] }) { return value?.[0] ? <span className="font-normal text-red-700">{value[0]}</span> : null; }
function Check({ name, label, checked }: { name: string; label: string; checked?: boolean }) { return <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-admin-ink"><input className="h-4 w-4 accent-admin-accent" type="checkbox" name={name} defaultChecked={checked} />{label}</label>; }
