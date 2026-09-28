"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, MessageCircle, Phone, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

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
        eyebrow="MEN’S HUB CONCIERGE"
        title="A better way to find your fit."
        description="From the first question to the final choice, our team is here for considered guidance on sizing, availability and orders."
        visual="brand-space"
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        cta={settings.whatsapp ? { label: "WhatsApp concierge", href: whatsappHref, external: true } : undefined}
        secondaryCta={settings.phone ? { label: "Call the store", href: phoneHref } : undefined}
      />

      <section className={styles.conciergeSection} aria-labelledby="concierge-heading">
        <div className={styles.shell}>
          <SectionIntro eyebrow="Direct line" title="Talk to someone who knows the collection." description="Choose the channel that suits you. For the quickest response on products and orders, WhatsApp is the best place to begin." headingId="concierge-heading" />

          <div className={styles.channelLayout}>
            {settings.whatsapp ? <motion.a className={styles.primaryChannel} href={whatsappHref} target="_blank" rel="noopener noreferrer" whileHover={reduceMotion ? undefined : { y: -4 }} transition={{ duration: reduceMotion ? 0 : .3, ease }}>
              <div className={styles.channelTopline}><span className={styles.channelEyebrow}>Recommended</span><MessageCircle size={22} strokeWidth={1.4} aria-hidden="true" /></div>
              <div className={styles.channelBody}><h3>WhatsApp concierge</h3><p>The quickest way to ask about a product, size, availability or an existing order.</p></div>
              <span className={styles.channelAction}>Start a conversation <ArrowUpRight size={17} aria-hidden="true" /></span>
            </motion.a> : null}

            <div className={styles.secondaryChannels}>
              {settings.phone ? <ContactChannel href={phoneHref} icon={<Phone size={18} strokeWidth={1.4} />} label="Call the store" value={settings.phone} action="Call us" /> : null}
              {settings.email ? <ContactChannel href={emailHref} icon={<Mail size={18} strokeWidth={1.4} />} label="Email us" value={settings.email} action="Send an enquiry" /> : null}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.topicsSection} aria-labelledby="topics-heading">
        <div className={styles.shell}>
          <div className={styles.topicsHeader}>
            <div><p className={styles.eyebrow}>Client service</p><h2 id="topics-heading">Make the next step easy.</h2></div>
            <p>Whether you are building an outfit or checking on an order, bring us the question and we will help you move forward.</p>
          </div>
          <div className={styles.topicGrid}>
            <Topic number="01" title="Product availability">Check whether a favourite piece is available before you visit or order.</Topic>
            <Topic number="02" title="Size guidance">Share what you usually wear and let us help you find the right fit.</Topic>
            <Topic number="03" title="Order assistance">Get help with placing an order, delivery details or an existing purchase.</Topic>
            <Topic number="04" title="A considered edit">Tell us what you are looking for and we can point you towards the collection.</Topic>
          </div>
        </div>
      </section>

      <section className={styles.expectSection} aria-labelledby="expect-heading">
        <div className={styles.shell}>
          <div className={styles.expectIntro}><Sparkles size={21} strokeWidth={1.4} aria-hidden="true" /><p className={styles.eyebrow}>A simple beginning</p><h2 id="expect-heading">Good style starts with a good conversation.</h2></div>
          <div className={styles.expectSteps}>
            <ExpectStep number="01" title="Tell us what you need">Send a message with the product, size or order you have in mind.</ExpectStep>
            <ExpectStep number="02" title="We look into it">Our team checks the details and shares the most useful next step.</ExpectStep>
            <ExpectStep number="03" title="Choose with confidence">Take your time, ask another question and decide when it feels right.</ExpectStep>
          </div>
          <Link className={styles.collectionLink} href="/new-arrivals">Explore new arrivals <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}

function SectionIntro({ eyebrow, title, description, headingId }: { eyebrow: string; title: string; description: string; headingId: string }) {
  return <header className={styles.sectionIntro}><p className={styles.eyebrow}>{eyebrow}</p><h2 id={headingId}>{title}</h2><p>{description}</p></header>;
}

function ContactChannel({ href, icon, label, value, action }: { href: string; icon: ReactNode; label: string; value: string; action: string }) {
  return <a className={styles.secondaryChannel} href={href}><span className={styles.secondaryIcon}>{icon}</span><span className={styles.secondaryCopy}><span>{label}</span><strong>{value}</strong></span><span className={styles.secondaryAction}>{action}<ArrowUpRight size={15} aria-hidden="true" /></span></a>;
}

function Topic({ number, title, children }: { number: string; title: string; children: string }) {
  return <article className={styles.topic}><span>{number}</span><h3>{title}</h3><p>{children}</p></article>;
}

function ExpectStep({ number, title, children }: { number: string; title: string; children: string }) {
  return <article className={styles.expectStep}><span>{number}</span><h3>{title}</h3><p>{children}</p></article>;
}
