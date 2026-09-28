"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";

import { createWhatsAppUrl } from "@/domain/whatsapp/product-inquiry";

import styles from "./contact-experience.module.css";

type ContactSettings = {
  whatsapp: string;
  phone: string;
  email: string;
};

const faqs = [
  ["How can I check product availability?", "Send us the product name or link on WhatsApp and our team will check the current availability for you."],
  ["How do I choose the right size?", "Share the piece you are considering and the fit you usually wear. We will help you choose with confidence."],
  ["What are your delivery charges?", "Delivery is PKR 250 for orders below PKR 10,000 and FREE for orders of PKR 10,000 or above."],
  ["How do returns work?", "Return or exchange requests must be made within 7 days. Items must be unused, unworn, unwashed, undamaged and have their original tags attached. See our shipping and returns policy for details."],
] as const;

const enquiryTypes = ["Product Availability", "Size Guidance", "Existing Order", "Shipping & Returns", "Other"] as const;
const conciergeServices = ["Product availability", "Size guidance", "Order updates", "Shipping & returns"] as const;

export function ContactExperience({ settings }: { settings: ContactSettings }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const whatsappHref = createWhatsAppUrl(settings.whatsapp, "Hello Men's Hub! I would like help with a product or order.");
  const phoneHref = "tel:" + settings.phone.replace(/[^+\d]/g, "");
  const emailHref = "mailto:" + settings.email;

  function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fields = [
      "Hello Men's Hub, I would like assistance.",
      "",
      "Name: " + String(form.get("name") || ""),
      "Email: " + String(form.get("email") || ""),
      "Phone / WhatsApp: " + String(form.get("phone") || ""),
      "Enquiry Type: " + String(form.get("enquiryType") || ""),
      "Message: " + String(form.get("message") || ""),
    ];
    const message = fields.join("\n");

    if (settings.whatsapp) {
      window.open(createWhatsAppUrl(settings.whatsapp, message), "_blank", "noopener,noreferrer");
      return;
    }

    window.location.href = emailHref + "?subject=" + encodeURIComponent("Men's Hub enquiry") + "&body=" + encodeURIComponent(message);
  }

  return (
    <main className={styles.page}>
      <header className={styles.hero} aria-labelledby="contact-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Client Services</p>
          <h1 id="contact-title">We&apos;re here when you need us.</h1>
          <p className={styles.heroDescription}>From product guidance and sizing to orders, delivery and returns, our team is ready to assist.</p>
          <p className={styles.heroFooter}>Men&apos;s Hub / Client Services / Pakistan</p>
        </div>
        <div className={styles.heroMedia}>
          <Image
            src="/images/atelier-campaign.webp"
            alt="Man wearing a tailored jacket and shirt"
            fill
            priority
            sizes="(max-width: 700px) 100vw, 54vw"
            className={styles.coverImage}
          />
          <div className={styles.heroMediaShade} aria-hidden="true" />
        </div>
      </header>

      <section className={styles.channelsSection} aria-labelledby="channels-heading">
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <h2 id="channels-heading">Direct contact</h2>
          </div>
          <div className={styles.channelsGrid}>
            <Channel number="01" label="WhatsApp" description="Fastest assistance" href={whatsappHref} icon={<MessageCircle size={18} strokeWidth={1.4} />} action="Open WhatsApp" external />
            <Channel number="02" label="Call" description="Speak directly with our team." detail={settings.phone} href={phoneHref} icon={<Phone size={18} strokeWidth={1.4} />} action="Call now" />
            <Channel number="03" label="Email" description="For detailed enquiries." detail={settings.email} href={emailHref} icon={<Mail size={18} strokeWidth={1.4} />} action="Send email" />
          </div>
        </div>
      </section>

      <section className={styles.conciergeSection} aria-labelledby="concierge-heading">
        <div className={styles.shell}>
          <div className={styles.conciergeGrid}>
            <div className={styles.conciergeIntro}>
              <p className={styles.eyebrow}>Client concierge / 01</p>
              <h2 id="concierge-heading">Need personal assistance?</h2>
            </div>
            <div className={styles.conciergeDetails}>
              <p>Our team can assist with product availability, sizing, existing orders, shipping and returns.</p>
              <ul className={styles.serviceList}>
                {conciergeServices.map((service) => <li key={service}>{service}<ArrowUpRight size={15} strokeWidth={1.4} aria-hidden="true" /></li>)}
              </ul>
              <a className={styles.conciergeLink} href={whatsappHref} target="_blank" rel="noopener noreferrer">Chat on WhatsApp <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.enquirySection} aria-labelledby="enquiry-heading">
        <div className={styles.shell}>
          <div className={styles.enquiryGrid}>
            <div className={styles.enquiryIntro}>
              <p className={styles.eyebrow}>Send an enquiry</p>
              <h2 id="enquiry-heading">Tell us what you need.</h2>
              <p>For detailed questions, send us a message and our team will assist you.</p>
            </div>
            <form className={styles.enquiryForm} onSubmit={submitEnquiry}>
              <div className={styles.fieldGrid}>
                <label className={styles.field}><span>Full Name</span><input name="name" type="text" autoComplete="name" required /></label>
                <label className={styles.field}><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
                <label className={styles.field}><span>Phone / WhatsApp</span><input name="phone" type="tel" autoComplete="tel" /></label>
                <label className={styles.field}><span>Enquiry Type</span><select name="enquiryType" defaultValue="" required><option value="" disabled>Select one</option>{enquiryTypes.map((type) => <option value={type} key={type}>{type}</option>)}</select></label>
              </div>
              <label className={styles.field}><span>Message</span><textarea name="message" rows={5} required /></label>
              <button className={styles.submitButton} type="submit">Send enquiry <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" /></button>
            </form>
          </div>
        </div>
      </section>

      <section className={styles.faqSection} aria-labelledby="faq-heading">
        <div className={styles.shell}>
          <div className={styles.faqGrid}>
            <div className={styles.faqIntro}>
              <p className={styles.eyebrow}>Quick answers</p>
              <h2 id="faq-heading">A few things, made clear.</h2>
              <p>Still have a question?</p>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">Ask us on WhatsApp <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
            <div className={styles.faqList}>
              {faqs.map(([question, answer], index) => {
                const isOpen = openFaq === index;
                const answerId = "faq-answer-" + index;
                return (
                  <div className={styles.faqItem} key={question}>
                    <button className={styles.faqQuestion} type="button" aria-expanded={isOpen} aria-controls={answerId} onClick={() => setOpenFaq(isOpen ? null : index)}>
                      <span><b>{String(index + 1).padStart(2, "0")}</b>{question}</span>
                      <ChevronDown size={19} strokeWidth={1.4} aria-hidden="true" />
                    </button>
                    {isOpen ? <div className={styles.faqAnswer} id={answerId}><p>{answer}{index === 3 ? <> <Link href="/shipping-returns">Read shipping &amp; returns.</Link></> : null}</p></div> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.collectionSection} aria-labelledby="collection-heading">
        <div className={styles.collectionMedia}>
          <Image src="/seed-media/01-Shirts/shirt-01.jpg" alt="Tailored blue shirt detail" fill sizes="(max-width: 700px) 100vw, 50vw" className={styles.coverImage} />
          <div className={styles.collectionShade} aria-hidden="true" />
        </div>
        <div className={styles.collectionCopy}>
          <p className={styles.eyebrow}>Continue shopping</p>
          <h2 id="collection-heading">Discover what&apos;s new.</h2>
          <Link className={styles.collectionLink} href="/new-arrivals">Explore collection <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}

function Channel({ number, label, description, detail, href, icon, action, external }: { number: string; label: string; description: string; detail?: string; href: string; icon: React.ReactNode; action: string; external?: boolean }) {
  const content = <><span className={styles.channelNumber}>{number}</span><span className={styles.channelIcon}>{icon}</span><h3>{label}</h3><p>{description}</p>{detail ? <strong>{detail}</strong> : null}<span className={styles.channelAction}>{action} <ArrowUpRight size={15} aria-hidden="true" /></span></>;
  return external ? <a className={styles.channel} href={href} target="_blank" rel="noopener noreferrer">{content}</a> : <a className={styles.channel} href={href}>{content}</a>;
}
