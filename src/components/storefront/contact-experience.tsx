"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { createWhatsAppUrl } from "@/domain/whatsapp/product-inquiry";
import styles from "./contact-experience.module.css";

type ContactSettings = {
  whatsapp: string;
  phone: string;
  email: string;
};

export function ContactExperience({ settings }: { settings: ContactSettings }) {
  const reduceMotion = useReducedMotion();
  const whatsappHref = createWhatsAppUrl(settings.whatsapp, "Hello Men's Hub! I would like help with a product or order.");
  const phoneHref = "tel:" + settings.phone.replace(/[^+\d]/g, "");
  const emailHref = "mailto:" + settings.email;

  return (
    <main className={styles.page}>
      
      {/* 2. REDESIGN CONTACT HERO */}
      <section className={styles.hero} aria-labelledby="contact-title">
        <div className={styles.heroLeft}>
          <motion.div 
            initial={reduceMotion ? undefined : { opacity: 0, y: 30 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className={styles.heroCopy}
          >
            <p className={styles.eyebrow}>Men&apos;s Hub / Customer Care</p>
            <h1 id="contact-title">LET&apos;S TALK.</h1>
            <p className={styles.heroDescription}>
              Questions about your order, sizing or our collection? Get in touch with Men&apos;s Hub.
            </p>
            <div className={styles.heroActions}>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
                Contact on WhatsApp <ArrowUpRight size={16} strokeWidth={1.5} />
              </a>
              <a href={emailHref} className={styles.btnSecondary}>
                Email Us <ArrowRight size={16} strokeWidth={1.5} />
              </a>
            </div>
          </motion.div>
        </div>
        <div className={styles.heroRight}>
          <Image
            src="/images/atelier-campaign.webp"
            alt="Men's Hub premium menswear"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 45vw"
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay} />
        </div>
      </section>

      {/* 3. REDESIGN CONTACT INFORMATION SECTION */}
      <section className={styles.contactSection} aria-labelledby="contact-heading">
        <div className={styles.contactShell}>
          <div className={styles.contactIntro}>
            <p className={styles.eyebrow}>Get in touch</p>
            <h2 id="contact-heading">Here to help.</h2>
            <p>Select your preferred method of communication and our team will assist you promptly.</p>
          </div>
          <div className={styles.contactRows}>
            <ContactRow number="01" label="WhatsApp" detail={settings.whatsapp} href={whatsappHref} external />
            <ContactRow number="02" label="Call Us" detail={settings.phone} href={phoneHref} />
            <ContactRow number="03" label="Email" detail={settings.email} href={emailHref} />
          </div>
        </div>
      </section>

      {/* 4. PREMIUM CUSTOMER ASSISTANCE SECTION */}
      <section className={styles.assistanceSection} aria-labelledby="assistance-heading">
        <div className={styles.assistanceShell}>
          <h2 id="assistance-heading" className={styles.assistanceHeading}>How can we help?</h2>
          <div className={styles.assistanceGrid}>
            <div className={styles.assistanceCategory}>
              <h3>Product &amp; Sizing</h3>
              <p>Need advice on fit or fabric? We can help you choose with confidence.</p>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.linkLine}>Ask about sizing <ArrowUpRight size={14} /></a>
            </div>
            <div className={styles.assistanceCategory}>
              <h3>Orders &amp; Delivery</h3>
              <p>Track your existing order or find out more about our delivery process.</p>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={styles.linkLine}>Track my order <ArrowUpRight size={14} /></a>
            </div>
            <div className={styles.assistanceCategory}>
              <h3>Returns &amp; Exchanges</h3>
              <p>Learn about our 7-day return policy and how to exchange an item.</p>
              <Link href="/shipping-returns" className={styles.linkLine}>Read return policy <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  );
}

function ContactRow({ number, label, detail, href, external }: { number: string; label: string; detail: string; href: string; external?: boolean }) {
  const content = (
    <>
      <div className={styles.rowLeft}>
        <span className={styles.rowNumber}>{number}</span>
        <span className={styles.rowLabel}>{label}</span>
      </div>
      <div className={styles.rowRight}>
        <span className={styles.rowDetail}>{detail}</span>
        <ArrowRight className={styles.rowArrow} size={18} strokeWidth={1} aria-hidden="true" />
      </div>
    </>
  );
  
  return external ? (
    <a className={styles.row} href={href} target="_blank" rel="noopener noreferrer">{content}</a>
  ) : (
    <a className={styles.row} href={href}>{content}</a>
  );
}
