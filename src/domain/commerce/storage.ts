export const CART_STORAGE_KEY = "mens-hub:cart:v1";
export const WISHLIST_STORAGE_KEY = "mens-hub:wishlist:v2";

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

export type CommerceProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  imageUrl: string;
  price: string;
  availableStock: number;
  sizes: string[];
  colors: string[];
  productUrl: string;
};

export type CartLine = CommerceProduct & {
  lineId: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown, limit = 500): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function productFrom(value: unknown): CommerceProduct | null {
  if (!isRecord(value)) return null;
  const id = text(value.id ?? value.productId, 150);
  const slug = text(value.slug, 200);
  const name = text(value.name, 250);
  const sku = text(value.sku, 150);
  const imageUrl = text(value.imageUrl, 2_000);
  const price = text(value.price ?? value.effectivePrice, 30);
  if (!id || !slug || !name || !sku || !imageUrl || !/^\d{1,12}(?:\.\d{1,2})?$/.test(price)) return null;
  const availableStock = Math.max(0, Math.min(100_000, Math.floor(Number(value.availableStock ?? value.availableArticles ?? 0)) || 0));
  const strings = (candidate: unknown) => Array.isArray(candidate) ? candidate.map((item) => typeof item === "string" ? item : isRecord(item) ? text(item.label ?? item.name, 100) : "").filter(Boolean).slice(0, 100) : [];
  return { id, slug, name, sku, imageUrl, price, availableStock, sizes: strings(value.sizes), colors: strings(value.colors), productUrl: text(value.productUrl, 2_000) || `/product/${slug}` };
}

export function cartLineId(productId: string, size = "", color = ""): string {
  return JSON.stringify([productId, size, color]);
}

export function parseCart(value: string | null): CartLine[] {
  try {
    const raw: unknown = JSON.parse(value ?? "[]");
    if (!Array.isArray(raw)) return [];
    return raw.flatMap((candidate) => {
      const product = productFrom(candidate);
      if (!product || !isRecord(candidate) || product.availableStock < 1) return [];
      const selectedSize = text(candidate.selectedSize ?? candidate.size, 100);
      const selectedColor = text(candidate.selectedColor ?? candidate.color, 100);
      const quantity = Math.max(1, Math.min(product.availableStock, Math.floor(Number(candidate.quantity)) || 1));
      return [{ ...product, lineId: cartLineId(product.id, selectedSize, selectedColor), selectedSize, selectedColor, quantity }];
    }).slice(0, 100);
  } catch {
    return [];
  }
}

export function parseWishlist(value: string | null): CommerceProduct[] {
  try {
    const raw: unknown = JSON.parse(value ?? "[]");
    if (!Array.isArray(raw)) return [];
    const products = raw.flatMap((candidate) => {
      const product = productFrom(candidate);
      return product ? [product] : [];
    });
    return [...new Map(products.map((product) => [product.id, product])).values()].slice(0, 100);
  } catch {
    return [];
  }
}

export function readCart(storage: StorageLike): CartLine[] {
  return parseCart(storage.getItem(CART_STORAGE_KEY));
}

export function writeCart(storage: StorageLike, lines: CartLine[]): void {
  storage.setItem(CART_STORAGE_KEY, JSON.stringify(lines.slice(0, 100)));
}

export function readWishlist(storage: StorageLike): CommerceProduct[] {
  return parseWishlist(storage.getItem(WISHLIST_STORAGE_KEY));
}

export function writeWishlist(storage: StorageLike, products: CommerceProduct[]): void {
  storage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(products.slice(0, 100)));
}
