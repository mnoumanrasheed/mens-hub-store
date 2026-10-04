"use client";

import { Check, Copy, Minus, Plus, Share2 } from "lucide-react";
import { useState } from "react";

import { addCartLine } from "@/components/storefront/commerce-store";
import { WishlistButton } from "@/components/storefront/wishlist-button";
import { normalizeProductSizeOptions } from "@/domain/product/size-options";
import type { CommerceProduct } from "@/domain/commerce/storage";
import { createProductStructuredData } from "@/domain/seo/product";
import { prepareWhatsAppInquiry } from "@/lib/whatsapp-inquiry";

type Props = {
  product: {
    id: string;
    name: string;
    sku: string | null;
    imageUrl: string;
    effectivePrice: string;
    stock: number;
    sizes: { label: string; stock: number }[];
    colors: { name: string; hexCode: string | null }[];
  };
  ordering: {
    brandName: string;
    greeting: string | null;
    statement: string | null;
    deliveryMessage: string;
  };
  productUrl: string;
};

const individualColourNames = new Set([
  "black",
  "white",
  "grey",
  "gray",
  "brown",
  "beige",
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "pink",
  "purple",
]);

function formatColourName(value: string) {
  const trimmed = value.trim();
  const parts = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
  const displayParts = parts.length > 1 && parts.every((part) => individualColourNames.has(part))
    ? parts
    : [trimmed.toLowerCase()];

  return displayParts
    .map((part) => part.replace(/\b\w/g, (character) => character.toUpperCase()))
    .join(" / ");
}

export function ProductPurchasePanel({ product, ordering, productUrl }: Props) {
  const sizeOptions = product.sizes.map((item) => ({ label: normalizeProductSizeOptions(item.label)[0] ?? item.label, stock: item.stock }));
  const availableSizeOptions = sizeOptions.filter((item) => item.stock > 0).map((item) => item.label);
  const defaultSize = availableSizeOptions[0] ?? "";
  const defaultColor = product.colors[0]?.name ?? "";
  const [size, setSize] = useState(defaultSize);
  const [color, setColor] = useState(defaultColor);
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const [inquiryPending, setInquiryPending] = useState(false);

  const selectedSizeStock = sizeOptions.find((item) => item.label === size)?.stock ?? 0;
  const soldOut = product.stock === 0 || (sizeOptions.length > 0 && selectedSizeStock === 0);
  const selectionReady = (!sizeOptions.length || size) && (!product.colors.length || color);
  const disabled = soldOut || !selectionReady;
  const commerceProduct: CommerceProduct = {
    id: product.id,
    name: product.name,
    sku: product.sku ?? undefined,
    imageUrl: product.imageUrl,
    price: product.effectivePrice,
    availableStock: product.stock,
    sizes: sizeOptions.map((item) => item.label),
    colors: product.colors.map((item) => item.name),
    productUrl,
  };
  const structuredData = createProductStructuredData(
    {
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      effectivePrice: product.effectivePrice,
      stock: product.stock,
    },
    ordering.brandName,
    productUrl,
  );

  function requireSelection() {
    if (!disabled) return true;
    setNotice(soldOut ? "This product is out of stock." : "Select the available options first.");
    return false;
  }

  function addToCart() {
    if (!requireSelection()) return;
    addCartLine(commerceProduct, size, color, quantity);
    setNotice("Added to bag.");
  }

  async function inquiry() {
    if (!requireSelection()) return;
    const inquiryWindow = window.open("about:blank", "_blank");
    if (inquiryWindow) inquiryWindow.opener = null;
    setInquiryPending(true);
    setNotice("");

    try {
      const result = await prepareWhatsAppInquiry([
        { id: product.id, selectedSize: size, selectedColor: color, quantity },
      ]);
      if (inquiryWindow && !inquiryWindow.closed) {
        inquiryWindow.location.replace(result.url);
      } else {
        window.location.assign(result.url);
      }
    } catch (cause) {
      inquiryWindow?.close();
      setNotice(cause instanceof Error ? cause.message : "The inquiry could not be prepared.");
    } finally {
      setInquiryPending(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(productUrl);
      setNotice("Product link copied.");
    } catch {
      setNotice("Copy failed. Please copy the address from your browser.");
    }
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url: productUrl });
      } else {
        await copyLink();
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setNotice("Sharing is unavailable right now.");
      }
    }
  }

  return (
    <section className="mh-pdp-purchase" aria-label="Product options">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      {sizeOptions.length ? (
        <fieldset className="mh-pdp-option-group">
          <legend>
            Select size <span>{size ? `Selected: ${size}` : "Required"}</span>
          </legend>
          <div className="mh-pdp-size-options">
            {sizeOptions.map((option) => (
              <label key={option.label} className={option.stock === 0 ? "opacity-50" : undefined}>
                <input
                  type="radio"
                  name="size"
                  value={option.label}
                  checked={size === option.label}
                  disabled={option.stock === 0}
                  onChange={() => setSize(option.label)}
                />
                <span>{option.label}{option.stock === 0 ? " (Out of stock)" : ""}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      {product.colors.length ? (
        <fieldset className="mh-pdp-option-group">
          <legend>
            Colour <span>{color ? `Selected: ${formatColourName(color)}` : "Required"}</span>
          </legend>
          <div className="mh-pdp-colour-options">
            {product.colors.map((option) => (
              <label key={option.name}>
                <input
                  type="radio"
                  name="color"
                  value={option.name}
                  checked={color === option.name}
                  onChange={() => setColor(option.name)}
                />
                <span>
                  <i style={{ backgroundColor: option.hexCode ?? "#777" }} aria-hidden="true" />
                  {formatColourName(option.name)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="mh-pdp-quantity">
        <span>Quantity</span>
        <div>
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            <Minus size={16} />
          </button>
          <output aria-live="polite">{quantity}</output>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= (sizeOptions.length ? selectedSizeStock : product.stock)}
            onClick={() => setQuantity((value) => Math.min(sizeOptions.length ? selectedSizeStock : product.stock, value + 1))}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="mh-pdp-actions">
        <button type="button" className="mh-pdp-add" disabled={disabled} onClick={addToCart}>
          Add to bag
        </button>
        <button
          type="button"
          className="mh-pdp-whatsapp"
          disabled={disabled || inquiryPending}
          onClick={inquiry}
        >
          {inquiryPending ? "Preparing…" : "Order on WhatsApp"}
        </button>
      </div>

      {notice ? (
        <p className="mh-pdp-notice" role="status">
          <Check size={15} />
          {notice}
        </p>
      ) : null}

      <p className="mh-pdp-delivery-note">{ordering.deliveryMessage}</p>

      <div className="mh-pdp-utility-actions">
        <WishlistButton product={commerceProduct} className="mh-pdp-wishlist" />
        <button type="button" onClick={share} aria-label="Share product">
          <Share2 size={17} />
          Share
        </button>
        <button type="button" onClick={copyLink} aria-label="Copy product link">
          <Copy size={17} />
          Copy link
        </button>
      </div>
    </section>
  );
}
