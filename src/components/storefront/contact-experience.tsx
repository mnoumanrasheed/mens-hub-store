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
        eyebrow="Customer support"
        title="How can we help?"
        description="Contact Men's Hub for sizing, availability and order assistance."
        visual="brand-space"
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        cta={{ label: "Contact us on WhatsApp", href: whatsappHref, external: true }}
      />

      <section className={styles.contactSection} aria-labelledby="contact-options-title">
        <div className={styles.shell}>
          <motion.header className={styles.sectionHeading} initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: reduceMotion ? 0 : .7, ease }}>
            <p className={styles.eyebrow}>Client service</p>
            <h2 id="contact-options-title">Here when you need us.</h2>
            <p className={styles.sectionIntro}>For product availability, sizing and order support, choose the contact method that suits you.</p>
          </motion.header>

          <div className={styles.contactGrid}>
            {settings.whatsapp ? <ContactMethod featured reduceMotion={Boolean(reduceMotion)} href={whatsappHref} icon={<MessageCircle size={20} strokeWidth={1.5} />} eyebrow="Recommended" title="WhatsApp" detail="The quickest way to ask about a product or your order." action="Start a conversation" external /> : null}
            {settings.phone ? <ContactMethod reduceMotion={Boolean(reduceMotion)} href={phoneHref} icon={<Phone size={20} strokeWidth={1.5} />} eyebrow="Call us" title="Phone" detail={settings.phone} action="Call Men's Hub" /> : null}
            {settings.email ? <ContactMethod reduceMotion={Boolean(reduceMotion)} href={emailHref} icon={<Mail size={20} strokeWidth={1.5} />} eyebrow="Email us" title="Email" detail={settings.email} action="Send an enquiry" /> : null}
          </div>
        </div>
      </section>

      <section className={styles.supportNote} aria-labelledby="help-topics-title">
        <div className={styles.shell}>
          <div>
            <p className={styles.eyebrow}>Before you get in touch</p>
            <h2 id="help-topics-title">What can we help with?</h2>
          </div>
          <ul aria-label="Support topics"><li>Product availability</li><li>Size guidance</li><li>Order assistance</li><li>General enquiries</li></ul>
          <Link href="/new-arrivals">View new arrivals <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}

function ContactMethod({ href, icon, eyebrow, title, detail, action, external = false, featured = false, reduceMotion }: { href: string; icon: ReactNode; eyebrow: string; title: string; detail: string; action: string; external?: boolean; featured?: boolean; reduceMotion: boolean }) {
  return (
    <motion.a className={`${styles.contactMethod}${featured ? ` ${styles.contactMethodFeatured}` : ""}`} href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} whileHover={reduceMotion ? undefined : { y: -3 }} transition={{ duration: reduceMotion ? 0 : .25, ease }}>
      <div className={styles.methodIcon}>{icon}</div>
      <div className={styles.methodCopy}><span>{eyebrow}</span><h3>{title}</h3><p>{detail}</p></div>
      <span className={styles.methodAction}>{action}<ArrowUpRight size={16} aria-hidden="true" /></span>
    </motion.a>
  );
}
