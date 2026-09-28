import { ArrowUpRight, Check } from "lucide-react";
import Image from "next/image";

import { createWhatsAppUrl } from "@/domain/whatsapp/product-inquiry";

import styles from "./shipping-returns-content.module.css";

const highlights = [
  { metric: "PKR 250", label: "Nationwide Delivery" },
  { metric: "PKR 10,000+", label: "Free Delivery" },
  { metric: "7 DAYS", label: "Return Request" },
  { metric: "WHATSAPP", label: "Customer Assistance" },
] as const;

const policyNavigation = [
  { number: "01", label: "Delivery", href: "#delivery" },
  { number: "02", label: "Returns & Exchanges", href: "#returns" },
  { number: "03", label: "Refunds", href: "#refunds" },
  { number: "04", label: "Damaged / Incorrect Orders", href: "#issues" },
  { number: "05", label: "Return Process", href: "#process" },
] as const;

const deliveryDetails = [
  ["Delivery Charge", "PKR 250"],
  ["Free Delivery", "Orders PKR 10,000+"],
  ["Payment", "Delivery charges paid in advance"],
  ["Coverage", "All over Pakistan"],
] as const;

const eligibility = [
  "Return request within 7 days of receiving the order",
  "Item unused and unworn",
  "Item unwashed",
  "All original tags attached",
  "Item in its original condition",
  "No alteration, damage, stains, perfume or odour",
] as const;

const returnSteps = [
  ["01", "Contact us", "Send your return request through WhatsApp."],
  ["02", "Share order details", "Provide the order and product details with your request."],
  ["03", "Eligibility confirmation", "Wait for return eligibility and instructions to be confirmed."],
  ["04", "Return the product", "Send the item back unused, unworn and with all tags attached."],
  ["05", "Resolution", "An exchange or another solution will be confirmed by Men's Hub."],
] as const;

export function ShippingReturnsContent({ whatsapp }: { whatsapp: string }) {
  const whatsappHref = createWhatsAppUrl(whatsapp, "Hello Men's Hub! I have a question about shipping or returning an order.");

  return (
    <main className={styles.page}>
      <header className={styles.hero} aria-labelledby="shipping-returns-title">
        <div className={styles.heroShell}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Customer Care / Shipping &amp; Returns</p>
            <h1 id="shipping-returns-title">Delivery, without the guesswork.</h1>
            <p className={styles.heroDescription}>Simple nationwide delivery, clear returns and straightforward support.</p>
            <a className={styles.heroCta} href="#delivery">View delivery details <span aria-hidden="true">&darr;</span></a>
          </div>

          <figure className={styles.heroVisual}>
            <Image src="/seed-media/01-Shirts/shirt-01.jpg" alt="A folded blue shirt prepared for delivery" fill priority sizes="(max-width: 700px) 100vw, 56vw" className={styles.heroImage} />
            <div className={styles.heroVisualShade} aria-hidden="true" />
            <figcaption>MEN&apos;S HUB / CUSTOMER CARE</figcaption>
          </figure>
        </div>

        <div className={styles.heroStats} role="list" aria-label="Shipping and support highlights">
          {highlights.map(({ metric, label }) => (
            <div className={styles.heroStat} key={label} role="listitem">
              <p className={styles.highlightMetric}>{metric}</p>
              <p className={styles.highlightLabel}>{label}</p>
            </div>
          ))}
        </div>
      </header>

      <div className={styles.policyLayout}>
        <aside className={styles.policyAside} aria-label="On this page">
          <p className={styles.asideEyebrow}>On this page</p>
          <nav>
            <ol className={styles.policyNav}>
              {policyNavigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>
                    <span>{item.number}</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className={styles.policyContent}>
          <section className={styles.policySection} id="delivery" aria-labelledby="delivery-heading">
            <SectionIntro number="01" eyebrow="Delivery" title="Nationwide delivery" id="delivery-heading" />
            <div className={styles.sectionBody}>
              <p>Men&apos;s Hub delivers across Pakistan. Delivery eligibility and order details may be confirmed through WhatsApp before dispatch.</p>
              <DetailRows rows={deliveryDetails} />
              <p>Orders with a merchandise value of PKR 10,000 or above qualify for free delivery. Delivery charges are payable in advance before dispatch.</p>
            </div>
          </section>

          <section className={styles.policySection} id="returns" aria-labelledby="returns-heading">
            <SectionIntro number="02" eyebrow="Eligibility" title="Returns & exchanges" id="returns-heading" />
            <div className={styles.sectionBody}>
              <p>Return or exchange requests must be submitted within 7 days of receiving the order. Customers should contact Men&apos;s Hub on WhatsApp before sending a return.</p>
              <div className={styles.eligibilityBlock}>
                <p className={styles.subEyebrow}>A return is eligible when</p>
                <ul className={styles.checklist}>
                  {eligibility.map((condition) => (
                    <li key={condition}><Check size={16} strokeWidth={1.5} aria-hidden="true" />{condition}</li>
                  ))}
                </ul>
              </div>
              <p>Items that do not meet these conditions may not be accepted. Returns sent without prior confirmation may not be accepted.</p>
            </div>
          </section>

          <section className={styles.policySection} id="refunds" aria-labelledby="refunds-heading">
            <SectionIntro number="03" eyebrow="Resolution" title="Refunds" id="refunds-heading" />
            <div className={styles.sectionBody}>
              <p>Payments are non-refundable. Approved return requests may be resolved through an exchange or another solution confirmed by Men&apos;s Hub.</p>
              <DetailRows rows={[
                ["Product payment", "Non-refundable"],
                ["Delivery charges", "Non-refundable"],
                ["Approved request", "Exchange or another confirmed solution"],
              ]} />
            </div>
          </section>

          <section className={styles.policySection} id="issues" aria-labelledby="issues-heading">
            <SectionIntro number="04" eyebrow="Order support" title="Damaged / incorrect orders" id="issues-heading" />
            <div className={styles.sectionBody}>
              <p>If an incorrect or damaged item is received, contact Men&apos;s Hub as soon as possible so the team can review the case and confirm the appropriate next step.</p>
              <div className={styles.requestDetails}>
                <p className={styles.subEyebrow}>Please share</p>
                <ul>
                  <li>Order details</li>
                  <li>Product name</li>
                  <li>Clear photos showing the issue</li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.policySection + " " + styles.processSection} id="process" aria-labelledby="process-heading">
            <SectionIntro number="05" eyebrow="A considered process" title="Return process" id="process-heading" />
            <ol className={styles.processList}>
              {returnSteps.map(([number, title, description]) => (
                <li className={styles.processStep} key={number}>
                  <span className={styles.processNumber}>{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <aside className={styles.note} aria-label="Important return note">
            <p><strong>Please note.</strong> Products that have been worn, washed, altered, damaged after delivery, or returned without original tags are not eligible for return or exchange.</p>
          </aside>

          <section className={styles.whatsappCta} aria-labelledby="policy-help-heading">
            <div>
              <p className={styles.eyebrow}>Personal assistance</p>
              <h2 id="policy-help-heading">Need help with your order?</h2>
              <p>Our team is available to assist with delivery, return and exchange queries.</p>
            </div>
            <a className={styles.whatsappLink} href={whatsappHref} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}

function SectionIntro({ number, eyebrow, title, id }: { number: string; eyebrow: string; title: string; id: string }) {
  return (
    <div className={styles.sectionIntro}>
      <span className={styles.sectionNumber}>{number}</span>
      <div>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
    </div>
  );
}

function DetailRows({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return (
    <dl className={styles.detailRows}>
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
