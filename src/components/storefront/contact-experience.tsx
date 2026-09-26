"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";

import { createWhatsAppUrl } from "@/domain/whatsapp/product-inquiry";
import { InternalCinematicHero } from "./internal-cinematic-hero";
import styles from "./contact-experience.module.css";

type ContactSettings = {
  whatsapp: string;
  phone: string;
  email: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function ContactExperience({ settings }: { settings: ContactSettings }) {
  const reduceMotion = useReducedMotion();
  const whatsappHref = createWhatsAppUrl(settings.whatsapp, "Hello Men's Hub! I would like help with a product or order.");
  const phoneHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const emailHref = `mailto:${settings.email}`;

  return (
    <main className={styles.page}>
      <InternalCinematicHero
        eyebrow="Client services"
        title="Let's Connect"
        description="For product guidance, availability, and order assistance, our team is ready to help."
        visual="brand-space"
        image="/images/atelier-campaign.webp"
        secondaryImage="/seed-media/01-Shirts/shirt-02.jpg"
        imageAlt="Men's Hub client service editorial"
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        cta={{ label: "Contact us on WhatsApp", href: whatsappHref, external: true }}
      />

      <section className={styles.contactSection} aria-labelledby="contact-options-title">
        <div className={styles.shell}>
          <motion.header className={styles.sectionHeading} initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: reduceMotion ? 0 : .7, ease }}>
            <p className={styles.eyebrow}>Contact the team</p>
            <h2 id="contact-options-title">The right channel<br /><em>for your enquiry.</em></h2>
          </motion.header>

          <div className={styles.contactGrid}>
            <ContactMethod reduceMotion={Boolean(reduceMotion)} href={whatsappHref} icon={<MessageCircle size={20} strokeWidth={1.5} />} eyebrow="Quick assistance" title="WhatsApp" detail="Product guidance, availability, and order support." action="Open WhatsApp" external />
            <ContactMethod reduceMotion={Boolean(reduceMotion)} href={phoneHref} icon={<Phone size={20} strokeWidth={1.5} />} eyebrow="Direct contact" title="Phone" detail={settings.phone} action="Call our team" />
            <ContactMethod reduceMotion={Boolean(reduceMotion)} href={emailHref} icon={<Mail size={20} strokeWidth={1.5} />} eyebrow="Detailed enquiries" title="Email" detail={settings.email} action="Send enquiry" />
          </div>
        </div>
      </section>

      <section className={styles.closing} aria-label="Continue shopping">
        <div className={styles.shell}>
          <p>Continue exploring <em>the Men&apos;s Hub collection.</em></p>
          <Link href="/new-arrivals">Browse the collection <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}

function ContactMethod({ href, icon, eyebrow, title, detail, action, external = false, reduceMotion }: { href: string; icon: ReactNode; eyebrow: string; title: string; detail: string; action: string; external?: boolean; reduceMotion: boolean }) {
  return (
    <motion.a className={styles.contactMethod} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} whileHover={reduceMotion ? undefined : { y: -4 }} transition={{ duration: reduceMotion ? 0 : .25, ease }}>
      <div className={styles.methodIcon}>{icon}</div>
      <div className={styles.methodCopy}><span>{eyebrow}</span><h3>{title}</h3><p>{detail}</p></div>
      <span className={styles.methodAction}>{action}<ArrowUpRight size={16} aria-hidden="true" /></span>
    </motion.a>
  );
}
