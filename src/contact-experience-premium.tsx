"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  User,
  AtSign,
  FileText,
} from "lucide-react";
import { createWhatsAppUrl } from "@/domain/whatsapp/product-inquiry";
import styles from "./contact-experience-premium.module.css";

type Settings = { whatsapp: string; phone: string; email: string };

const TOPICS = [
  "General Inquiry",
  "Order & Shipping Status",
  "Sizing & Fit Advice",
  "Returns & Exchange",
  "Wholesale & Press",
];

const FAQS = [
  {
    q: "How fast will Men's Hub respond to my message?",
    a: "WhatsApp is our fastest channel (replies within 15–30 minutes during business hours). Form inquiries and emails are answered within 1 business day.",
  },
  {
    q: "Can I place an order directly via WhatsApp?",
    a: "Yes! Simply share the screenshot or product name with our concierge team on WhatsApp, and we will process your order and dispatch confirmation immediately.",
  },
  {
    q: "How do I determine the perfect fit before ordering?",
    a: "Our sizing specialists are ready on WhatsApp. Share your height, weight, or chest measurement, and we will recommend the exact size for your fit preference.",
  },
  {
    q: "What is your return & exchange policy?",
    a: "We offer a 7-day hassle-free exchange policy across Pakistan for unworn items with original tags intact. Visit our Shipping & Returns page for full details.",
  },
  {
    q: "Do you ship nationwide across Pakistan?",
    a: "Yes, we ship to all major cities and towns across Pakistan with flat PKR 250 shipping, and FREE shipping on all orders PKR 10,000 or above.",
  },
];

export function ContactExperiencePremium({ settings }: { settings: Settings }) {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [lastWaUrl, setLastWaUrl] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const whatsappHref = createWhatsAppUrl(
    settings.whatsapp,
    "Hello Men's Hub Concierge! I would like assistance with an inquiry."
  );
  const phoneHref = "tel:" + settings.phone.replace(/[^+\d]/g, "");
  const emailHref = "mailto:" + settings.email;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedMessage = [
      "📌 *MEN'S HUB — CUSTOMER INQUIRY*",
      "━━━━━━━━━━━━━━━━━━━━",
      `*Full Name:* ${name.trim()}`,
      `*Email:* ${email.trim()}`,
      phone.trim() ? `*Phone:* ${phone.trim()}` : null,
      `*Subject Topic:* ${selectedTopic}`,
      "━━━━━━━━━━━━━━━━━━━━",
      "*MESSAGE:*",
      message.trim(),
      "━━━━━━━━━━━━━━━━━━━━",
      "_Sent via Men's Hub website contact form._",
    ]
      .filter(Boolean)
      .join("\n");

    const url = createWhatsAppUrl(settings.whatsapp, formattedMessage);
    setLastWaUrl(url);
    window.open(url, "_blank");
    setSubmitted(true);
  };

  return (
    <main className={styles.root}>
      {/* AMBIENT BACKGROUND GLOW */}
      <div className={styles.ambientLight} aria-hidden="true" />

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            {/* Left Content */}
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.heroBadge}>
                <Sparkles size={14} className={styles.goldIcon} />
                <span>AT YOUR SERVICE 24/7</span>
              </div>

              <h1 className={styles.heroTitle}>
                Connect With <br />
                <span className={styles.goldGradientText}>Men&apos;s Hub Concierge</span>
              </h1>

              <p className={styles.heroDesc}>
                Whether you need advice on bespoke sizing, assistance tracking an active shipment, or styling consultation, our dedicated team is here to assist you.
              </p>

              <div className={styles.heroCtaGroup}>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryBtn}
                >
                  <MessageCircle size={18} />
                  <span>Instant WhatsApp Assistance</span>
                  <ArrowUpRight size={16} />
                </a>

                <a href="#inquiry-form" className={styles.secondaryBtn}>
                  <span>Send Message Below</span>
                  <ArrowRight size={16} />
                </a>
              </div>

              {/* Status Indicator */}
              <div className={styles.statusBox}>
                <span className={styles.statusDot} />
                <span className={styles.statusText}>
                  Concierge Live · Average reply time under 15 minutes
                </span>
              </div>
            </motion.div>

            {/* Right Editorial Card */}
            <motion.div
              className={styles.heroVisualCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className={styles.visualImageWrapper}>
                <Image
                  src="/seed-media/01-Shirts/shirt-01.jpg"
                  alt="Men's Hub Customer Care Experience"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className={styles.visualImage}
                />
                <div className={styles.visualOverlay} />
              </div>

              <div className={styles.visualBadgeCard}>
                <ShieldCheck size={24} className={styles.goldIcon} />
                <div>
                  <h4 className={styles.badgeTitle}>Guaranteed Response</h4>
                  <p className={styles.badgeDesc}>
                    Personal 1-on-1 support for every customer
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DIRECT CONTACT CHANNELS */}
      <section className={styles.channelsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>PREFERRED CHANNELS</span>
            <h2 className={styles.sectionTitle}>Direct Touchpoints</h2>
          </div>

          <div className={styles.channelsGrid}>
            {/* WhatsApp Card */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.channelCard} ${styles.channelFeatured}`}
            >
              <div className={styles.channelHeader}>
                <div className={styles.channelIconBox}>
                  <MessageCircle size={22} />
                </div>
                <span className={styles.channelBadge}>Fastest Response</span>
              </div>
              <h3 className={styles.channelName}>WhatsApp Support</h3>
              <p className={styles.channelValue}>{settings.whatsapp}</p>
              <p className={styles.channelMeta}>Available 7 days a week · Instant replies</p>
              <div className={styles.channelAction}>
                <span>Open WhatsApp</span>
                <ArrowUpRight size={16} />
              </div>
            </a>

            {/* Phone Card */}
            <a href={phoneHref} className={styles.channelCard}>
              <div className={styles.channelHeader}>
                <div className={styles.channelIconBox}>
                  <Phone size={22} />
                </div>
              </div>
              <h3 className={styles.channelName}>Phone Assistance</h3>
              <p className={styles.channelValue}>{settings.phone}</p>
              <p className={styles.channelMeta}>Monday – Saturday · 10 AM to 8 PM</p>
              <div className={styles.channelAction}>
                <span>Call Concierge</span>
                <ArrowUpRight size={16} />
              </div>
            </a>

            {/* Email Card */}
            <a href={emailHref} className={styles.channelCard}>
              <div className={styles.channelHeader}>
                <div className={styles.channelIconBox}>
                  <Mail size={22} />
                </div>
              </div>
              <h3 className={styles.channelName}>Email Inquiry</h3>
              <p className={styles.channelValue}>{settings.email}</p>
              <p className={styles.channelMeta}>24-hour turnaround for detailed inquiries</p>
              <div className={styles.channelAction}>
                <span>Write Email</span>
                <ArrowUpRight size={16} />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* INQUIRY FORM SECTION */}
      <section id="inquiry-form" className={styles.formSection}>
        <div className={styles.container}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <span className={styles.eyebrow}>INSTANT WHATSAPP FORM</span>
              <h2 className={styles.formTitle}>Send Inquiry Via WhatsApp</h2>
              <p className={styles.formSub}>
                Fill in your details below. Clicking send will compile your full message and redirect directly to WhatsApp for immediate assistance.
              </p>
            </div>

            {/* Topic Selection Pills */}
            <div className={styles.topicSelector}>
              <span className={styles.topicLabel}>Select Topic:</span>
              <div className={styles.pillGrid}>
                {TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className={`${styles.topicPill} ${
                      selectedTopic === topic ? styles.topicPillActive : ""
                    }`}
                    onClick={() => setSelectedTopic(topic)}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={styles.successState}
                >
                  <CheckCircle2 size={48} className={styles.successIcon} />
                  <h3 className={styles.successTitle}>Redirecting to WhatsApp</h3>
                  <p className={styles.successText}>
                    Your inquiry message has been formatted. If WhatsApp did not open automatically, click the button below to send your message.
                  </p>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.5rem" }}>
                    {lastWaUrl && (
                      <a
                        href={lastWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.submitBtn}
                      >
                        <MessageCircle size={18} />
                        <span>Open WhatsApp Chat</span>
                        <ArrowUpRight size={16} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setMessage("");
                      }}
                      className={styles.resetFormBtn}
                    >
                      Send Another Message
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className={styles.actualForm}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className={styles.formGrid}>
                    {/* Full Name */}
                    <div className={styles.inputGroup}>
                      <label htmlFor="name" className={styles.inputLabel}>
                        <User size={14} /> Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className={styles.textInput}
                      />
                    </div>

                    {/* Email */}
                    <div className={styles.inputGroup}>
                      <label htmlFor="email" className={styles.inputLabel}>
                        <AtSign size={14} /> Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={styles.textInput}
                      />
                    </div>

                    {/* Phone */}
                    <div className={styles.inputGroup}>
                      <label htmlFor="phone" className={styles.inputLabel}>
                        <Phone size={14} /> Phone Number (Optional)
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="03XX XXXXXXX"
                        className={styles.textInput}
                      />
                    </div>

                    {/* Subject */}
                    <div className={styles.inputGroup}>
                      <label htmlFor="subject" className={styles.inputLabel}>
                        <FileText size={14} /> Subject Category
                      </label>
                      <input
                        id="subject"
                        type="text"
                        readOnly
                        value={selectedTopic}
                        className={`${styles.textInput} ${styles.readOnlyInput}`}
                      />
                    </div>

                    {/* Message */}
                    <div className={`${styles.inputGroup} ${styles.fullWidthInput}`}>
                      <label htmlFor="message" className={styles.inputLabel}>
                        <MessageCircle size={14} /> Your Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="How can our concierge team assist you today?"
                        className={styles.textareaInput}
                      />
                    </div>
                  </div>

                  <div className={styles.formFooter}>
                    <button type="submit" className={styles.submitBtn}>
                      <MessageCircle size={18} />
                      <span>Send Message On WhatsApp</span>
                      <ArrowUpRight size={16} />
                    </button>
                    <p className={styles.formPrivacyNotice}>
                      📲 Opens directly in WhatsApp with your pre-filled inquiry.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ATELIER HEADQUARTERS & HOURS STRIP */}
      <section className={styles.locationSection}>
        <div className={styles.container}>
          <div className={styles.locationGrid}>
            <div className={styles.locationCard}>
              <MapPin size={28} className={styles.goldIcon} />
              <h3 className={styles.locationTitle}>Store Location &amp; Address</h3>
              <p className={styles.locationAddress}>
                <strong>Men&apos;s Hub Store</strong> <br />
                Liaqat Shaheed Rd, Chak No. 8 NB, <br />
                Bhalwal, Punjab, Pakistan
              </p>
              <a
                href="https://maps.app.goo.gl/4TY7B5eArRLybFUZA"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapBtn}
              >
                <MapPin size={16} />
                <span>Open in Google Maps</span>
                <ArrowUpRight size={14} />
              </a>
            </div>

            <div className={styles.locationCard}>
              <Clock size={28} className={styles.goldIcon} />
              <h3 className={styles.locationTitle}>Concierge Operating Hours</h3>
              <p className={styles.locationAddress}>
                Monday – Saturday: 10:00 AM – 9:00 PM <br />
                Sunday: 12:00 PM – 8:00 PM <br />
                WhatsApp Assistance: 24/7 Available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.eyebrow}>HELP CENTER</span>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>

          <div className={styles.faqList}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`${styles.faqCard} ${isOpen ? styles.faqCardOpen : ""}`}
                >
                  <button
                    type="button"
                    className={styles.faqTrigger}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span className={styles.faqQuestion}>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`${styles.faqChevron} ${isOpen ? styles.faqChevronRotate : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className={styles.faqAnswerWrapper}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className={styles.faqAnswerText}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM WHATSAPP CALLOUT */}
      <section className={styles.bottomCtaSection}>
        <div className={styles.container}>
          <div className={styles.bottomCtaCard}>
            <div className={styles.bottomCtaContent}>
              <span className={styles.eyebrow}>INSTANT ACCESS</span>
              <h2 className={styles.bottomCtaTitle}>Still Need Assistance?</h2>
              <p className={styles.bottomCtaSub}>
                Connect directly with a dedicated client relations manager on WhatsApp.
              </p>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.bottomCtaBtn}
            >
              <MessageCircle size={20} />
              <span>Message Us On WhatsApp</span>
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
