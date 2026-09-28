import {
  Check,
  CircleAlert,
  MessageCircle,
  PackageCheck,
  RefreshCcw,
  Tag,
  Truck,
} from "lucide-react";

import { createWhatsAppUrl } from "@/domain/whatsapp/product-inquiry";
import { InternalCinematicHero } from "@/components/storefront/internal-cinematic-hero";

import styles from "./shipping-returns-content.module.css";

const highlights = [
  { icon: Truck, metric: "PKR 250", title: "Nationwide Delivery", detail: "Flat delivery charge on orders below PKR 10,000." },
  { icon: PackageCheck, metric: "FREE DELIVERY", title: "Orders PKR 10,000+", detail: "Complimentary nationwide delivery on qualifying orders." },
  { icon: RefreshCcw, metric: "7 DAYS", title: "Return / Exchange Request", detail: "Contact Men’s Hub within seven days of receiving the order." },
  { icon: Tag, metric: "ORIGINAL CONDITION", title: "Unused + Tags Attached", detail: "Returned products must remain unworn, unused and in original condition." },
] as const;

export function ShippingReturnsContent({ whatsapp }: { whatsapp: string }) {
  const whatsappHref = createWhatsAppUrl(whatsapp, "Hello Men's Hub! I have a question about shipping or returning an order.");

  return (
    <main className={styles.page}>
      <InternalCinematicHero
        eyebrow="CUSTOMER INFORMATION"
        title="Shipping & Returns"
        description="Everything you need to know about delivery, returns and order eligibility at Men’s Hub."
        visual="brand-space"
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Shipping & Returns" }]}
      />

      <section className={styles.highlights} aria-label="Policy highlights">
        <div className={styles.shell}>
          <div className={styles.highlightGrid}>
            {highlights.map(({ icon: Icon, metric, title, detail }) => (
              <article className={styles.highlightCard} key={title}>
                <Icon className={styles.highlightIcon} size={22} strokeWidth={1.5} aria-hidden="true" />
                <p className={styles.highlightMetric}>{metric}</p>
                <h2>{title}</h2>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.policyBody}>
        <section className={styles.policySection} aria-labelledby="delivery-heading">
          <div className={styles.sectionMarker}>01</div>
          <div className={styles.policyCopy}>
            <p className={styles.eyebrow}>Delivery</p>
            <h2 id="delivery-heading">Nationwide Delivery</h2>
            <div className={styles.prose}>
              <p>Men’s Hub delivers across Pakistan.</p>
              <p>A flat delivery charge of PKR 250 applies to orders below PKR 10,000.</p>
              <p>Delivery charges are payable in advance before dispatch.</p>
              <p>Orders with a merchandise value of PKR 10,000 or above qualify for free delivery.</p>
              <p>Delivery eligibility and order details may be confirmed through WhatsApp before dispatch.</p>
            </div>
          </div>
        </section>

        <section className={styles.policySection} aria-labelledby="returns-heading">
          <div className={styles.sectionMarker}>02</div>
          <div className={styles.policyCopy}>
            <p className={styles.eyebrow}>Eligibility</p>
            <h2 id="returns-heading">Returns &amp; Exchanges</h2>
            <div className={styles.prose}>
              <p>Return or exchange requests must be submitted within 7 days of receiving the order.</p>
              <p>To be eligible, the product must:</p>
              <ul>
                <li>be unused and unworn</li>
                <li>be unwashed</li>
                <li>have all original tags attached</li>
                <li>remain in its original condition</li>
                <li>show no signs of alteration or damage</li>
                <li>be free from stains, perfume, odour or other signs of use</li>
              </ul>
              <p>Items that do not meet these conditions may not be accepted.</p>
              <p>Customers should contact Men’s Hub on WhatsApp before sending a return.</p>
              <p>Returns sent without prior confirmation may not be accepted.</p>
            </div>
          </div>
        </section>

        <div className={styles.policyColumns}>
          <section className={styles.compactSection} aria-labelledby="refunds-heading">
            <p className={styles.eyebrow}>Resolution</p>
            <h2 id="refunds-heading">Refunds</h2>
            <div className={styles.prose}>
              <p>Payments are non-refundable.</p>
              <p>Approved return requests may be resolved through an exchange or another solution confirmed by Men’s Hub.</p>
              <p>Previously paid delivery charges are non-refundable.</p>
            </div>
          </section>

          <section className={styles.compactSection} aria-labelledby="issue-heading">
            <p className={styles.eyebrow}>Order support</p>
            <h2 id="issue-heading">Received the Wrong or Damaged Item?</h2>
            <div className={styles.prose}>
              <p>If an incorrect or damaged item is received, contact Men’s Hub as soon as possible.</p>
              <p>Ask the customer to provide:</p>
              <ul>
                <li>order details</li>
                <li>product name</li>
                <li>clear photos showing the issue</li>
              </ul>
              <p>The Men’s Hub team will review the case and confirm the appropriate next step.</p>
            </div>
          </section>
        </div>

        <section className={styles.processSection} aria-labelledby="process-heading">
          <div className={styles.processHeading}>
            <p className={styles.eyebrow}>A considered process</p>
            <h2 id="process-heading">Return process</h2>
          </div>
          <div className={styles.processGrid}>
            <ProcessStep number="01" title="Contact Men’s Hub">Send the order details and return request through WhatsApp.</ProcessStep>
            <ProcessStep number="02" title="Receive Confirmation">Wait for return/exchange eligibility and instructions to be confirmed.</ProcessStep>
            <ProcessStep number="03" title="Send the Product">Return the item in its original, unused condition with all tags attached.</ProcessStep>
          </div>
        </section>

        <aside className={styles.note} aria-label="Important return note">
          <CircleAlert size={21} strokeWidth={1.5} aria-hidden="true" />
          <p>Please inspect your order after delivery and contact Men’s Hub promptly if there is an issue. Products that have been worn, washed, altered, damaged after delivery, or returned without original tags are not eligible for return or exchange.</p>
        </aside>

        <section className={styles.whatsappCta} aria-labelledby="policy-help-heading">
          <MessageCircle size={24} strokeWidth={1.5} aria-hidden="true" />
          <p className={styles.eyebrow}>Need help with an order?</p>
          <h2 id="policy-help-heading">We’re here to help.</h2>
          <p>Our team can assist with delivery, availability and return questions.</p>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">CONTACT ON WHATSAPP <MessageCircle size={16} aria-hidden="true" /></a>
        </section>
      </div>
    </main>
  );
}

function ProcessStep({ number, title, children }: { number: string; title: string; children: string }) {
  return (
    <article className={styles.processStep}>
      <span className={styles.processNumber}>{number}</span>
      <Check className={styles.processIcon} size={19} strokeWidth={1.5} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}
