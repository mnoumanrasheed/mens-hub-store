"use client";

import { Check, Copy, Minus, Plus, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { addCartLine } from "@/components/storefront/commerce-store";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import type { CommerceProduct } from "@/domain/commerce/storage";
import { prepareWhatsAppInquiry } from "@/lib/whatsapp-inquiry";
import { ProductViewEvent } from "@/components/storefront/analytics-events";
import { createProductStructuredData } from "@/domain/seo/product";

type Props = { product: { id: string; name: string; sku: string; slug: string; imageUrl: string; description: string; effectivePrice: string; availableArticles: number; sizes: { label: string }[]; colors: { name: string; hexCode: string | null }[] }; ordering: { brandName: string; greeting: string | null; statement: string | null }; productUrl: string };

export function ProductPurchasePanel({ product, ordering, productUrl }: Props) {
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const [inquiryPending, setInquiryPending] = useState(false);
  const soldOut = product.availableArticles === 0;
  const selectionReady = (!product.sizes.length || size) && (!product.colors.length || color);
  const disabled = soldOut || !selectionReady;
  const commerceProduct: CommerceProduct = { id: product.id, slug: product.slug, name: product.name, sku: product.sku, imageUrl: product.imageUrl, price: product.effectivePrice, availableStock: product.availableArticles, sizes: product.sizes.map((item) => item.label), colors: product.colors.map((item) => item.name), productUrl };
  const structuredData = createProductStructuredData(product, ordering.brandName, productUrl);

  function requireSelection() { if (!disabled) return true; setNotice(soldOut ? "This product is out of stock." : "Select the available options first."); return false; }
  function addToCart() { if (!requireSelection()) return; addCartLine(commerceProduct, size, color, quantity); setNotice("Added to cart."); }
  async function inquiry() { if (!requireSelection()) return; setInquiryPending(true); setNotice(""); try { const result = await prepareWhatsAppInquiry([{ id: product.id, selectedSize: size, selectedColor: color, quantity }]); window.open(result.url, "_blank", "noopener,noreferrer"); } catch (cause) { setNotice(cause instanceof Error ? cause.message : "The inquiry could not be prepared."); } finally { setInquiryPending(false); } }
  async function copyLink() { try { await navigator.clipboard.writeText(productUrl); setNotice("Product link copied."); } catch { setNotice("Copy failed. Please copy the address from your browser."); } }
  async function share() { try { if (navigator.share) await navigator.share({ title: product.name, url: productUrl }); else await copyLink(); } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setNotice("Sharing is unavailable right now."); } }

  return <div className="mt-8 grid gap-7"><ProductViewEvent productId={product.id} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    {product.colors.length ? <fieldset><legend className="text-xs font-bold uppercase tracking-[0.15em] text-muted">Color <span className="normal-case tracking-normal text-subtle">{color || "— select"}</span></legend><div className="mt-3 flex flex-wrap gap-2">{product.colors.map((item) => <label key={item.name} className="cursor-pointer"><input className="peer sr-only" type="radio" name="color" value={item.name} checked={color === item.name} onChange={() => setColor(item.name)} /><span className="flex min-h-11 items-center gap-2 border border-line px-3 text-sm text-muted peer-checked:border-gold peer-checked:text-ivory"><span className="size-4 rounded-full border border-white/25" style={{ backgroundColor: item.hexCode ?? "#777" }} />{item.name}</span></label>)}</div></fieldset> : null}
    {product.sizes.length ? <fieldset><div className="flex items-center justify-between"><legend className="text-xs font-bold uppercase tracking-[0.15em] text-muted">Size <span className="normal-case tracking-normal text-subtle">{size || "— select"}</span></legend><Link className="text-xs font-bold text-gold underline-offset-4 hover:underline" href="/size-guide">Size guide</Link></div><div className="mt-3 flex flex-wrap gap-2">{product.sizes.map((item) => <label key={item.label} className="cursor-pointer"><input className="peer sr-only" type="radio" name="size" value={item.label} checked={size === item.label} onChange={() => setSize(item.label)} /><span className="grid min-h-11 min-w-12 place-items-center border border-line px-3 text-sm text-ivory peer-checked:border-gold peer-checked:bg-gold peer-checked:text-gold-ink">{item.label}</span></label>)}</div></fieldset> : null}
    <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-muted">Quantity</p><div className="mt-3 inline-grid grid-cols-3 border border-line"><button className="grid min-h-11 min-w-11 place-items-center disabled:text-subtle" type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={16} /></button><output className="grid min-w-12 place-items-center border-x border-line text-sm" aria-live="polite">{quantity}</output><button className="grid min-h-11 min-w-11 place-items-center disabled:text-subtle" type="button" aria-label="Increase quantity" disabled={quantity >= product.availableArticles} onClick={() => setQuantity((value) => Math.min(product.availableArticles, value + 1))}><Plus size={16} /></button></div></div>
    <div className="grid gap-3 sm:grid-cols-2"><button className="store-cta-primary disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled={disabled} onClick={addToCart}>Add to cart</button><button className="store-cta-secondary disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled={disabled || inquiryPending} onClick={inquiry}>{inquiryPending ? "Preparing…" : "Order on WhatsApp"}</button></div>
    {notice ? <p className="flex items-center gap-2 text-sm text-gold" role="status"><Check size={16} />{notice}</p> : null}
    <div className="flex flex-wrap items-center gap-2"><WishlistButton product={commerceProduct} className="static" /><button className="store-icon-button border border-line" type="button" onClick={share} aria-label="Share product"><Share2 size={17} /></button><a className="flex min-h-11 items-center border border-line px-3 text-xs font-bold uppercase tracking-[0.1em] text-ivory hover:text-gold" href={`https://wa.me/?text=${encodeURIComponent(`${product.name} ${productUrl}`)}`} target="_blank" rel="noreferrer">WhatsApp</a><a className="flex min-h-11 items-center border border-line px-3 text-xs font-bold uppercase tracking-[0.1em] text-ivory hover:text-gold" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`} target="_blank" rel="noreferrer">Facebook</a><button className="store-icon-button border border-line" type="button" onClick={copyLink} aria-label="Copy product link"><Copy size={17} /></button></div>
  </div>;
}
