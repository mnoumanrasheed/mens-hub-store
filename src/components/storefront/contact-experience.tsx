"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { StoreHeroAtmosphere } from "./store-hero-atmosphere";
import { useHeroEntrance } from "./hero-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone, Plus } from "lucide-react";
import { createWhatsAppUrl } from "@/domain/whatsapp/product-inquiry";
import { trackWhatsAppClick } from "@/lib/analytics";
import styles from "./contact-experience.module.css";

type ContactSettings = {
  whatsapp: string;
  phone: string;
  email: string;
  address?: string | null;
  googleMapsUrl?: string | null;
  storeTiming?: string | null;
};
const topics = ["Product & fit", "Place an order", "Order support", "Something else"];
const defaultMapsUrl = "https://maps.app.goo.gl/4TY7B5eArRLybFUZA";

export function ContactExperience({ settings }: { settings: ContactSettings }) {
  const reveal = useHeroEntrance();
  const [topic, setTopic] = useState(topics[0]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const whatsappHref = createWhatsAppUrl(settings.whatsapp, "Hello Men's Hub! I would like help with a product or order.");
  const mapsHref = settings.googleMapsUrl || defaultMapsUrl;
  const inquiry = ["Hello Men's Hub!", name.trim() ? `My name is ${name.trim()}.` : null, `I'd like help with: ${topic}.`, "", message.trim()].filter((line) => line !== null).join("\n");

  return (
    <main className={styles.page}>
      <section data-store-hero className={styles.hero} aria-labelledby="contact-title">
        <StoreHeroAtmosphere className={styles.heroAtmosphere} />
        <div className={styles.shell}>
          <div className={styles.topline}>
            <nav aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Contact</span></nav>
            <span className={styles.edition}>MEN&apos;S HUB / CLIENT CARE</span>
          </div>
          <div className={styles.heroGrid}>
            <div className={styles.intro}>
              <motion.p className={styles.eyebrow} {...reveal(.04)}><span /> At your service</motion.p>
              <motion.h1 id="contact-title" {...reveal(.14, "heading")}>Good style.<br />Great<br /><em>conversation.</em></motion.h1>
              <motion.p className={styles.introCopy} {...reveal(.3)}>The right fit. A new favourite. A little advice.<br />Whatever brings you here, let&apos;s talk.</motion.p>
              <motion.a className={styles.textLink} href="#contact-details" {...reveal(.4)}>Find your way to us <ArrowDown size={16} aria-hidden="true" /></motion.a>
              <motion.div className={styles.signature} {...reveal(.5)}><span aria-hidden="true"><Image src="/logo.png" alt="" width={48} height={36} /></span><p>A personal touch.<br /><b>Always Men&apos;s Hub.</b></p></motion.div>
            </div>
            <motion.div className={styles.inquiryPanel} {...reveal(.24)}>
              <div className={styles.panelTop}><span className={styles.eyebrow}>Start a conversation</span><MessageCircle size={23} strokeWidth={1.3} aria-hidden="true" /></div>
              <h2>How can we <em>help?</em></h2>
              <p className={styles.panelCopy}>A question, an idea, or just looking for the right piece. We&apos;re here for you.</p>
              <form onSubmit={(event) => { event.preventDefault(); window.open(createWhatsAppUrl(settings.whatsapp, inquiry), "_blank", "noopener,noreferrer"); trackWhatsAppClick(); }}>
                <fieldset className={styles.topics}>
                  <legend>I&apos;d like help with</legend>
                  <div className={styles.topicOptions}>{topics.map((item) => <label key={item} className={styles.topic}><input type="radio" name="contact-topic" value={item} checked={topic === item} onChange={() => setTopic(item)} /><span>{item}</span></label>)}</div>
                </fieldset>
                <label className={styles.field} htmlFor="contact-name">Your name <span>(optional)</span><input id="contact-name" autoComplete="name" maxLength={100} placeholder="What should we call you?" value={name} onChange={(event) => setName(event.target.value)} /></label>
                <label className={styles.field} htmlFor="contact-message">Your message<textarea id="contact-message" required maxLength={1200} rows={3} placeholder="Tell us a little about what you need…" value={message} onChange={(event) => setMessage(event.target.value)} /></label>
                <input type="hidden" name="text" value={inquiry} />
                <button className={styles.submit} type="submit"><MessageCircle size={17} aria-hidden="true" />Continue on WhatsApp<ArrowUpRight size={18} aria-hidden="true" /></button>
                <p className={styles.formNote}>Opens WhatsApp with your message ready to send.</p>
              </form>
            </motion.div>
          </div>
          <div className={styles.heroFoot}><span>Thoughtful style. Personal service.</span><span>Online & in store <ArrowDown size={13} aria-hidden="true" /></span></div>
        </div>
      </section>
      <section id="contact-details" className={`${styles.shell} ${styles.contacts}`} aria-label="Contact options">
        <a className={styles.contact} href={whatsappHref} target="_blank" rel="noopener noreferrer"><div className={styles.contactTop}><MessageCircle size={20} strokeWidth={1.4} aria-hidden="true" /><span>01 / LET&apos;S CHAT</span><ArrowUpRight size={18} aria-hidden="true" /></div><h2>A message away.</h2><p>Product advice, availability & ordering.</p><span className={styles.contactValue}>Chat on WhatsApp <ArrowRight size={15} aria-hidden="true" /></span></a>
        <a className={styles.contact} href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}><div className={styles.contactTop}><Phone size={20} strokeWidth={1.4} aria-hidden="true" /><span>02 / GIVE US A CALL</span><ArrowUpRight size={18} aria-hidden="true" /></div><h2>A familiar voice.</h2><p>Prefer a conversation? Speak to our team.</p><span className={styles.contactValue}>{settings.phone} <ArrowRight size={15} aria-hidden="true" /></span></a>
        <a className={styles.contact} href={`mailto:${settings.email}`}><div className={styles.contactTop}><Mail size={20} strokeWidth={1.4} aria-hidden="true" /><span>03 / DROP US A NOTE</span><ArrowUpRight size={18} aria-hidden="true" /></div><h2>A little more detail.</h2><p>For questions that need a little more room.</p><span className={styles.contactValue}>{settings.email} <ArrowRight size={15} aria-hidden="true" /></span></a>
      </section>
      <section className={styles.visit} aria-labelledby="visit-title">
        <div className={`${styles.shell} ${styles.visitGrid}`}>
          <div className={styles.editorial}>
            <Image src="/images/atelier-campaign.webp" alt="Men’s Hub style editorial featuring a tailored black blazer and white shirt" fill sizes="(max-width: 760px) 100vw, 50vw" />
            <div className={styles.photoCaption}><span>THE MEN&apos;S HUB EXPERIENCE</span><p>Style is personal.<br /><em>So are we.</em></p></div>
          </div>
          <div className={styles.visitCopy}>
            <p className={styles.eyebrow}>Beyond the screen</p>
            <h2 id="visit-title">Come for the style.<br /><em>Stay for the details.</em></h2>
            <p>Get a closer look. Feel the fabrics. Find your fit. Visit Men&apos;s Hub and let us help you put it all together.</p>
            <div className={styles.visitDetails}>
              <div><MapPin size={19} strokeWidth={1.4} aria-hidden="true" /><div><h3>Find Men&apos;s Hub</h3><p>{settings.address || "Your next favourite piece is closer than you think. Open the map for our store location."}</p></div></div>
              <div><Clock3 size={19} strokeWidth={1.4} aria-hidden="true" /><div><h3>{settings.storeTiming ? "Store hours" : "Plan your visit"}</h3><p>{settings.storeTiming || "Give us a call or message us to confirm opening hours before you stop by."}</p></div></div>
            </div>
            <a className={styles.outlineButton} href={mapsHref} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </section>
      <section className={`${styles.shell} ${styles.faq}`} aria-labelledby="contact-faq-title">
        <div><p className={styles.eyebrow}>A little clarity</p><h2 id="contact-faq-title">Before you<br /><em>say hello.</em></h2><Link className={styles.textLink} href="/faq">Explore all FAQs <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
        <div className={styles.questions}>
          <details><summary>How do I place an order?<Plus size={18} aria-hidden="true" /></summary><p>Choose your pieces and add them to your cart, then continue on WhatsApp to confirm availability and order details with our team. See our <Link href="/how-to-order">ordering guide</Link> for the full process.</p></details>
          <details><summary>Can you help me find my size?<Plus size={18} aria-hidden="true" /></summary><p>Of course. Share the product you&apos;re interested in and your usual size on <a href={whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>. You can also explore our <Link href="/size-guide">size guide</Link> before choosing.</p></details>
          <details><summary>Who can I contact about an existing order?<Plus size={18} aria-hidden="true" /></summary><p>Message our team with your order details and the name used when ordering. We can help with delivery questions and next steps. For policy details, see <Link href="/shipping-policy">shipping</Link> or <Link href="/return-exchange-policy">returns & exchanges</Link>.</p></details>
        </div>
      </section>
      <div className={styles.closing}><div className={styles.shell}><p>Your style. <em>Our attention.</em></p><a href={whatsappHref} target="_blank" rel="noopener noreferrer">Let&apos;s talk <ArrowUpRight size={22} aria-hidden="true" /></a></div></div>
    </main>
  );
}
