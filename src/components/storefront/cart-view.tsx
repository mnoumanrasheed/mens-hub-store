"use client";

import { Check, MessageCircle, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { removeCartLine, replaceCartLines, setCartQuantity, useCart } from "@/components/storefront/commerce-store";
import { StoreImage } from "@/components/storefront/store-image";
import { prepareWhatsAppInquiry } from "@/lib/whatsapp-inquiry";

const currency = new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function CartView({ brandName, greeting, statement }: { brandName: string; greeting: string | null; statement: string | null }) {
  void brandName;
  void greeting;
  void statement;
  const lines = useCart();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const total = lines.reduce((sum, line) => sum + Number(line.price) * line.quantity, 0);

  async function continueOnWhatsApp() {
    setPending(true);
    setError("");
    try {
      const result = await prepareWhatsAppInquiry(lines);
      replaceCartLines(result.lines);
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The inquiry could not be prepared.");
    } finally {
      setPending(false);
    }
  }

  if (!lines.length) {
    return (
      <div className="border border-line bg-surface px-5 py-14 text-center sm:px-6 sm:py-16">
        <ShoppingBag className="mx-auto text-gold" />
        <h1 className="mt-5 font-display text-4xl text-ivory">Your Cart</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">Your cart is currently empty.</p>
        <Link href="/shop" className="store-cta-primary mt-7 w-full min-[390px]:w-auto">Shop collection</Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 sm:mb-9">
        <p className="store-eyebrow">Your selection</p>
        <h1 className="font-display text-4xl text-ivory sm:text-5xl">Shopping Cart</h1>
        <p className="mt-2 text-sm leading-6 text-muted">Saved on this device. No account is required.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="grid gap-4">
          {lines.map((line) => (
            <article key={line.lineId} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border border-line bg-surface p-3 min-[390px]:grid-cols-[6.5rem_minmax(0,1fr)] min-[390px]:gap-4 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:p-4">
              <Link href={`/product/${line.slug}`} className="relative aspect-[4/5] overflow-hidden bg-surface-raised">
                <StoreImage src={line.imageUrl} alt={line.name} fill sizes="128px" className="object-cover" />
              </Link>

              <div className="min-w-0 py-0.5 sm:py-1">
                <Link href={`/product/${line.slug}`} className="line-clamp-2 font-display text-xl leading-tight text-ivory hover:text-gold sm:text-2xl">{line.name}</Link>
                <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.11em] text-subtle">Article {line.sku}</p>
                <dl className="mt-3 grid gap-1 text-sm leading-5 text-muted">
                  <div className="flex flex-wrap gap-x-2"><dt>Size:</dt><dd className="text-ivory">{line.selectedSize || "N/A"}</dd></div>
                  <div className="flex flex-wrap gap-x-2"><dt>Color:</dt><dd className="text-ivory">{line.selectedColor || "N/A"}</dd></div>
                  <div className="flex flex-wrap gap-x-2"><dt>Price:</dt><dd className="text-ivory">{currency.format(Number(line.price))}</dd></div>
                </dl>
              </div>

              <div className="col-span-2 mt-1 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3 sm:col-span-1 sm:row-span-2 sm:mt-0 sm:grid sm:content-between sm:justify-items-end sm:border-0 sm:pt-1">
                <div className="inline-grid grid-cols-3 border border-line">
                  <button className="grid min-h-11 min-w-11 place-items-center disabled:text-subtle" type="button" aria-label={`Decrease ${line.name} quantity`} disabled={line.quantity <= 1} onClick={() => setCartQuantity(line.lineId, line.quantity - 1)}><Minus size={15} /></button>
                  <output className="grid min-w-11 place-items-center border-x border-line text-sm" aria-label="Quantity">{line.quantity}</output>
                  <button className="grid min-h-11 min-w-11 place-items-center disabled:text-subtle" type="button" aria-label={`Increase ${line.name} quantity`} disabled={line.quantity >= line.availableStock} onClick={() => setCartQuantity(line.lineId, line.quantity + 1)}><Plus size={15} /></button>
                </div>
                <div className="text-right">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.11em] text-subtle">Subtotal</p>
                  <p className="mt-1 font-bold text-ivory">{currency.format(Number(line.price) * line.quantity)}</p>
                </div>
                <button type="button" className="inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-muted hover:text-critical sm:col-span-2" onClick={() => removeCartLine(line.lineId)}><Trash2 size={15} /> Remove</button>
              </div>

              {line.quantity >= line.availableStock ? <p className="col-span-2 text-xs leading-5 text-gold sm:col-span-3">Maximum available stock selected.</p> : null}
            </article>
          ))}
        </div>

        <aside className="border border-line bg-surface p-5 sm:p-6 lg:sticky lg:top-24">
          <p className="store-eyebrow">Order summary</p>
          <dl className="grid gap-4 text-sm">
            <div className="flex items-center justify-between gap-4"><dt className="text-muted">Products Total</dt><dd className="font-bold text-ivory">{currency.format(total)}</dd></div>
            <div className="border-t border-line pt-4"><dt className="text-muted">Delivery Charges</dt><dd className="mt-1 text-sm font-semibold leading-6 text-gold">Calculated / Confirmed on WhatsApp</dd></div>
            <div className="flex items-center justify-between gap-4 border-t border-line pt-4"><dt className="font-bold text-ivory">Grand Subtotal</dt><dd className="text-lg font-bold text-ivory">{currency.format(total)}</dd></div>
          </dl>
          <p className="mt-3 text-xs leading-5 text-subtle">Only products are included. Delivery is discussed separately on WhatsApp.</p>
          {error ? <p className="mt-4 text-sm leading-6 text-critical" role="alert">{error}</p> : null}
          <button type="button" className="store-cta-primary mt-6 w-full" onClick={continueOnWhatsApp} disabled={pending}>{pending ? "Preparing…" : "Continue order on WhatsApp"}<MessageCircle size={17} /></button>
          <div className="mt-6 grid gap-3 border-t border-line pt-5 text-xs leading-5 text-muted">
            <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 shrink-0 text-gold" size={15} /> Your selections are rechecked before the order is confirmed.</p>
            <p className="flex items-start gap-2"><Check className="mt-0.5 shrink-0 text-gold" size={15} /> No payment is collected on this website.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
