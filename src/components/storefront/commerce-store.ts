"use client";

import { useSyncExternalStore } from "react";
import { CART_STORAGE_KEY, WISHLIST_STORAGE_KEY, cartLineId, readCart, readWishlist, writeCart, writeWishlist, type CartLine, type CommerceProduct } from "@/domain/commerce/storage";

const CART_EVENT = "mens-hub-cart-change";
const WISHLIST_EVENT = "mens-hub-wishlist-change";
const EMPTY_CART: CartLine[] = [];
const EMPTY_WISHLIST: CommerceProduct[] = [];
let cartCache: CartLine[] | undefined;
let wishlistCache: CommerceProduct[] | undefined;

function subscribe(key: string, eventName: string, invalidate: () => void, callback: () => void) {
  const onCustom = () => callback();
  const onStorage = (event: StorageEvent) => { if (event.key === key) { invalidate(); callback(); } };
  window.addEventListener(eventName, onCustom);
  window.addEventListener("storage", onStorage);
  return () => { window.removeEventListener(eventName, onCustom); window.removeEventListener("storage", onStorage); };
}

function cartSnapshot() { return cartCache ??= readCart(localStorage); }
function wishlistSnapshot() { return wishlistCache ??= readWishlist(localStorage); }
function commitCart(lines: CartLine[]) { cartCache = lines; try { writeCart(localStorage, lines); } catch { /* The in-memory cart still works when storage is unavailable. */ } window.dispatchEvent(new Event(CART_EVENT)); }
function commitWishlist(products: CommerceProduct[]) { wishlistCache = products; try { writeWishlist(localStorage, products); } catch { /* The in-memory wishlist still works when storage is unavailable. */ } window.dispatchEvent(new Event(WISHLIST_EVENT)); }

export function useCart(): CartLine[] {
  return useSyncExternalStore((callback) => subscribe(CART_STORAGE_KEY, CART_EVENT, () => { cartCache = undefined; }, callback), cartSnapshot, () => EMPTY_CART);
}

export function useWishlist(): CommerceProduct[] {
  return useSyncExternalStore((callback) => subscribe(WISHLIST_STORAGE_KEY, WISHLIST_EVENT, () => { wishlistCache = undefined; }, callback), wishlistSnapshot, () => EMPTY_WISHLIST);
}

export function addCartLine(product: CommerceProduct, selectedSize = "", selectedColor = "", quantity = 1): CartLine {
  const lineId = cartLineId(product.id, selectedSize, selectedColor);
  const lines = cartSnapshot();
  const existing = lines.find((line) => line.lineId === lineId);
  const nextQuantity = Math.min(product.availableStock, Math.max(1, (existing?.quantity ?? 0) + quantity));
  const line = { ...product, lineId, selectedSize, selectedColor, quantity: nextQuantity };
  commitCart(existing ? lines.map((item) => item.lineId === lineId ? line : item) : [...lines, line].slice(0, 100));
  return line;
}

export function setCartQuantity(lineId: string, quantity: number) {
  commitCart(cartSnapshot().map((line) => line.lineId === lineId ? { ...line, quantity: Math.max(1, Math.min(line.availableStock, Math.floor(quantity) || 1)) } : line));
}

export function removeCartLine(lineId: string) { commitCart(cartSnapshot().filter((line) => line.lineId !== lineId)); }
export function replaceCartLines(lines: CartLine[]) { commitCart(lines); }
export function toggleWishlist(product: CommerceProduct) { const products = wishlistSnapshot(); commitWishlist(products.some((item) => item.id === product.id) ? products.filter((item) => item.id !== product.id) : [product, ...products.filter((item) => item.id !== product.id)].slice(0, 100)); }
export function removeWishlistProduct(productId: string) { commitWishlist(wishlistSnapshot().filter((item) => item.id !== productId)); }
