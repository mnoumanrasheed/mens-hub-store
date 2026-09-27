import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/storefront/container";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductDetailReveal, ProductGallery } from "@/components/storefront/product-gallery";
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel";
import { RecentlyViewed } from "@/components/storefront/recently-viewed";
import { getStorefrontProduct } from "@/data/storefront";
import { createProductMetadata } from "@/domain/seo/product";
import { getSiteUrl } from "@/lib/site-url";

const currency = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getStorefrontProduct(id);

  return product
    ? createProductMetadata(product)
    : { title: "Product not found", robots: { index: false, follow: false } };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getStorefrontProduct(id);
  if (!product) notFound();

  const productUrl = new URL(`/product/${product.id}`, getSiteUrl()).toString();
  const deliveryMessage = formatDeliveryMessage(product.ordering.deliveryMessage);
  const whatsappHref = product.ordering.whatsapp
    ? `https://wa.me/${product.ordering.whatsapp.replace(/\D/g, "")}`
    : "/contact";
  const stockLabel =
    product.stock === 0
      ? "Out of stock"
      : product.stock <= product.lowStockThreshold
        ? `Only ${product.stock} left`
        : "In stock";

  return (
    <main className="mh-pdp">
      <Container size="wide">
        <nav aria-label="Breadcrumb" className="mh-pdp-breadcrumb">
          <Link href="/shop">Shop</Link>
          <span>/</span>
          <Link href={`/shop/${product.category.slug}`}>{product.category.name}</Link>
          {product.subcategory ? (
            <>
              <span>/</span>
              <Link href={`/shop/${product.category.slug}/${product.subcategory.slug}`}>
                {product.subcategory.name}
              </Link>
            </>
          ) : null}
        </nav>

        <div className="mh-pdp-layout">
          <ProductGallery imageUrl={product.imageUrl} name={product.name} />

          <ProductDetailReveal>
            <section className="mh-pdp-information" aria-labelledby="product-name">
              <header className="mh-pdp-header">
                <p>{product.subcategory?.name || product.category.name}</p>
                <h1 id="product-name">{product.name}</h1>
                <div className="mh-pdp-price-row">
                  <strong>{currency.format(Number(product.effectivePrice))}</strong>
                  {product.isSale ? (
                    <>
                      <s>{currency.format(Number(product.originalPrice))}</s>
                      <span>Save {product.discountPercent}%</span>
                    </>
                  ) : null}
                </div>
                <p className={`mh-pdp-stock ${product.stock === 0 ? "is-sold-out" : ""}`} role="status">
                  <i aria-hidden="true" />
                  {stockLabel}
                </p>
              </header>

              <ProductPurchasePanel
                key={product.id}
                product={product}
                ordering={{ ...product.ordering, deliveryMessage }}
                productUrl={productUrl}
              />

              <div className="mh-pdp-information-accordions">
                <details className="mh-pdp-information-accordion">
                  <summary>Product details</summary>
                  <dl>
                    <div>
                      <dt>Collection</dt>
                      <dd>
                        <Link href={`/shop/${product.category.slug}`}>{product.category.name}</Link>
                      </dd>
                    </div>
                    {product.subcategory ? (
                      <div>
                        <dt>Category</dt>
                        <dd>{product.subcategory.name}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt>Availability</dt>
                      <dd>{stockLabel}</dd>
                    </div>
                  </dl>
                </details>
                <details className="mh-pdp-information-accordion">
                  <summary>Delivery &amp; ordering</summary>
                  <p>{deliveryMessage}</p>
                </details>
                <details className="mh-pdp-information-accordion">
                  <summary>Need help?</summary>
                  <p>
                    Questions about sizing, availability, or ordering?{" "}
                    <a href={whatsappHref} target={product.ordering.whatsapp ? "_blank" : undefined} rel={product.ordering.whatsapp ? "noopener noreferrer" : undefined}>
                      Contact Men&apos;s Hub.
                    </a>
                  </p>
                </details>
              </div>
            </section>
          </ProductDetailReveal>
        </div>

        {product.relatedProducts.length ? (
          <section className="mh-pdp-related" aria-labelledby="related-products-heading">
            <div>
              <p>Continue the edit</p>
              <h2 id="related-products-heading">You may also like</h2>
            </div>
            <div className="mh-pdp-related-grid">
              {product.relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}

        <RecentlyViewed
          current={{
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.effectivePrice,
          }}
        />
      </Container>
    </main>
  );
}

function formatDeliveryMessage(value: string) {
  if (!value || /calculated\s*\/?\s*confirmed\s*on\s*whatsapp/i.test(value)) {
    return "Delivery charges are not included and will be confirmed separately on WhatsApp.";
  }

  return value;
}
