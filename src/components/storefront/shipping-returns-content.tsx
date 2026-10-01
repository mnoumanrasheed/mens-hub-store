"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  PackageCheck,
  CreditCard,
  AlertTriangle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { createWhatsAppUrl } from "@/domain/whatsapp/product-inquiry";
import styles from "./shipping-returns-content.module.css";

// Key highlights metrics
const HIGHLIGHTS = [
  {
    icon: Truck,
    metric: "PKR 250",
    label: "Flat Shipping Rate",
    subtext: "Nationwide across Pakistan",
  },
  {
    icon: Sparkles,
    metric: "FREE",
    label: "Delivery on PKR 10,000+",
    subtext: "Applied automatically",
  },
  {
    icon: Clock,
    metric: "24 – 48 hrs",
    label: "Dispatch Window",
    subtext: "Fast order preparation",
  },
  {
    icon: RotateCcw,
    metric: "7 DAYS",
    label: "Hassle-Free Returns",
    subtext: "Easy exchange policy",
  },
];

// Tabs configuration
const TABS = [
  { id: "delivery", label: "01. Shipping & Logistics", icon: Truck },
  { id: "returns", label: "02. Returns & Exchanges", icon: RotateCcw },
  { id: "refunds", label: "03. Refunds & Store Credit", icon: CreditCard },
  { id: "issues", label: "04. Damaged / Incorrect", icon: AlertTriangle },
  { id: "process", label: "05. 5-Step Return Journey", icon: PackageCheck },
];

// FAQ list
const FAQS = [
  {
    question: "How long does shipping take within Pakistan?",
    answer:
      "Orders are processed and dispatched within 24 to 48 business hours. Delivery typically takes 2 to 4 working days depending on your city location (Major hubs like Karachi, Lahore, and Islamabad receive orders within 2-3 working days).",
  },
  {
    question: "How do I qualify for Free Nationwide Shipping?",
    answer:
      "Free shipping is automatically applied at checkout for all domestic orders with a total merchandise value of PKR 10,000 or above.",
  },
  {
    question: "What is your return & exchange timeframe?",
    answer:
      "You have 7 full calendar days from the date of package delivery to request a return or size exchange through our WhatsApp support concierge.",
  },
  {
    question: "Are delivery fees refundable when making a return?",
    answer:
      "Delivery charges paid for initial shipment are non-refundable. For exchanges, standard return shipping logistics apply unless the item delivered was damaged or incorrect.",
  },
  {
    question: "How do I exchange an item for a different size or color?",
    answer:
      "Simply message our WhatsApp support with your Order ID, current item, and desired size. Our concierge team will reserve the replacement item and guide you through the return pickup process.",
  },
];

export function ShippingReturnsContent({ whatsapp }: { whatsapp: string }) {
  const [activeTab, setActiveTab] = useState("delivery");
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  // Return Eligibility Checker state
  const [withinDays, setWithinDays] = useState<boolean | null>(null);
  const [tagsIntact, setTagsIntact] = useState<boolean | null>(null);
  const [itemCondition, setItemCondition] = useState<boolean | null>(null);

  const whatsappHref = createWhatsAppUrl(
    whatsapp,
    "Hello Men's Hub Concierge! I have a question regarding delivery, returns, or order exchange."
  );

  const toggleFaq = (idx: number) => {
    setFaqOpen(faqOpen === idx ? null : idx);
  };

  // Calculate eligibility status
  const isEligible =
    withinDays === true && tagsIntact === true && itemCondition === true;
  const isEvaluated =
    withinDays !== null && tagsIntact !== null && itemCondition !== null;

  return (
    <main className={styles.page}>
      {/* Dynamic Background Noise / Gradient overlay */}
      <div className={styles.ambientLight} aria-hidden="true" />

      {/* HERO SECTION */}
      <header className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <motion.div
            className={styles.heroBadge}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShieldCheck size={14} className={styles.goldIcon} />
            <span>ASSURED LOGISTICS & SUPPORT</span>
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Excellence In Every <br />
            <span className={styles.goldGradientText}>Delivery & Return</span>
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Seamless nationwide shipping across Pakistan, straightforward 7-day
            exchanges, and transparent luxury concierge assistance.
          </motion.p>

          {/* KPI HIGHLIGHT CARDS */}
          <motion.div
            className={styles.kpiGrid}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {HIGHLIGHTS.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <IconComp size={20} className={styles.kpiIcon} />
                    <span className={styles.kpiMetric}>{item.metric}</span>
                  </div>
                  <div className={styles.kpiLabel}>{item.label}</div>
                  <div className={styles.kpiSub}>{item.subtext}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </header>

      {/* INTERACTIVE POLICY EXPLORER TABS */}
      <section className={styles.policyExplorerSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>POLICY DIRECTORY</p>
            <h2 className={styles.sectionTitle}>Detailed Operational Standards</h2>
          </div>

          {/* Navigation Bar */}
          <div className={styles.tabBar} role="tablist">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tab-panel-${tab.id}`}
                  className={`${styles.tabBtn} ${isActive ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <TabIcon size={16} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className={styles.tabIndicator}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Display */}
          <div className={styles.tabContentArea}>
            <AnimatePresence mode="wait">
              {activeTab === "delivery" && (
                <motion.div
                  key="delivery"
                  id="tab-panel-delivery"
                  role="tabpanel"
                  aria-labelledby="tab-btn-delivery"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className={styles.tabPanel}
                >
                  <div className={styles.panelGrid}>
                    <div className={styles.panelMain}>
                      <span className={styles.panelTag}>LOGISTICS & DISPATCH</span>
                      <h3 className={styles.panelTitle}>Nationwide Express Shipping</h3>
                      <p className={styles.panelDesc}>
                        Every garment crafted by Men&apos;s Hub is inspected, custom packed, and dispatched using premier courier services across all major cities and regions in Pakistan.
                      </p>

                      <div className={styles.specsTable}>
                        <div className={styles.specRow}>
                          <span className={styles.specKey}>Standard Flat Rate</span>
                          <span className={styles.specVal}>PKR 250 per order</span>
                        </div>
                        <div className={styles.specRow}>
                          <span className={styles.specKey}>Free Shipping Threshold</span>
                          <span className={styles.specVal}>Complimentary on orders PKR 10,000+</span>
                        </div>
                        <div className={styles.specRow}>
                          <span className={styles.specKey}>Processing &amp; Dispatch</span>
                          <span className={styles.specVal}>Within 24 to 48 business hours</span>
                        </div>
                        <div className={styles.specRow}>
                          <span className={styles.specKey}>Transit Time</span>
                          <span className={styles.specVal}>2 – 4 working days across Pakistan</span>
                        </div>
                        <div className={styles.specRow}>
                          <span className={styles.specKey}>Courier Partners</span>
                          <span className={styles.specVal}>TCS, M&amp;P, CallCourier, Leopard</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.panelCardVisual}>
                      <div className={styles.visualCardInner}>
                        <Truck size={36} className={styles.visualIcon} />
                        <h4 className={styles.cardHeading}>Advance Logistics Policy</h4>
                        <p className={styles.cardText}>
                          For custom or express dispatches, shipping fees may be collected prior to courier hand-off. You will receive real-time SMS &amp; WhatsApp tracking updates upon dispatch.
                        </p>
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.cardActionLink}
                        >
                          Track an Existing Order <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "returns" && (
                <motion.div
                  key="returns"
                  id="tab-panel-returns"
                  role="tabpanel"
                  aria-labelledby="tab-btn-returns"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className={styles.tabPanel}
                >
                  <div className={styles.panelGrid}>
                    <div className={styles.panelMain}>
                      <span className={styles.panelTag}>EXCHANGE GUARANTEE</span>
                      <h3 className={styles.panelTitle}>7-Day Bespoke Return Window</h3>
                      <p className={styles.panelDesc}>
                        We understand fit and silhouette matter. If your purchase requires a size adjustment or style swap, submit your request within 7 calendar days of receipt.
                      </p>

                      <div className={styles.conditionsBlock}>
                        <h4 className={styles.subTitle}>Eligibility Checklist</h4>
                        <ul className={styles.checklistGrid}>
                          <li>
                            <CheckCircle2 size={16} className={styles.checkIcon} />
                            <span>Return submitted within 7 days of package delivery</span>
                          </li>
                          <li>
                            <CheckCircle2 size={16} className={styles.checkIcon} />
                            <span>Garment is completely unworn and unwashed</span>
                          </li>
                          <li>
                            <CheckCircle2 size={16} className={styles.checkIcon} />
                            <span>All original brand tags, labels &amp; seals remain attached</span>
                          </li>
                          <li>
                            <CheckCircle2 size={16} className={styles.checkIcon} />
                            <span>Free of stains, fragrance, perfume, or alterations</span>
                          </li>
                          <li>
                            <CheckCircle2 size={16} className={styles.checkIcon} />
                            <span>Item packed safely in original brand box / polybag</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className={styles.panelCardVisual}>
                      <div className={styles.visualCardInner}>
                        <RotateCcw size={36} className={styles.visualIcon} />
                        <h4 className={styles.cardHeading}>Size Exchange Assistance</h4>
                        <p className={styles.cardText}>
                          Not sure about your size replacement? Connect with our styling concierge on WhatsApp for precise measurements before confirming your exchange.
                        </p>
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.cardActionLink}
                        >
                          Request Exchange via WhatsApp <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "refunds" && (
                <motion.div
                  key="refunds"
                  id="tab-panel-refunds"
                  role="tabpanel"
                  aria-labelledby="tab-btn-refunds"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className={styles.tabPanel}
                >
                  <div className={styles.panelGrid}>
                    <div className={styles.panelMain}>
                      <span className={styles.panelTag}>RESOLUTION STANDARD</span>
                      <h3 className={styles.panelTitle}>Store Credit &amp; Exchanges</h3>
                      <p className={styles.panelDesc}>
                        Orders processed through Men&apos;s Hub are resolved via immediate product exchange or store credit voucher valid for 6 months across our entire collection.
                      </p>

                      <div className={styles.policyHighlightBoxes}>
                        <div className={styles.policyBox}>
                          <CreditCard size={20} className={styles.boxIcon} />
                          <div>
                            <h4 className={styles.boxTitle}>Monetary Refunds</h4>
                            <p className={styles.boxText}>
                              Payments are non-refundable in cash/bank transfer. Returned items qualify for size exchange or credit voucher.
                            </p>
                          </div>
                        </div>

                        <div className={styles.policyBox}>
                          <Truck size={20} className={styles.boxIcon} />
                          <div>
                            <h4 className={styles.boxTitle}>Logistics Charges</h4>
                            <p className={styles.boxText}>
                              Original shipping fees are non-refundable. Exchange delivery costs PKR 250 unless the return is due to our error.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.panelCardVisual}>
                      <div className={styles.visualCardInner}>
                        <ShieldCheck size={36} className={styles.visualIcon} />
                        <h4 className={styles.cardHeading}>Instant Credit Issuance</h4>
                        <p className={styles.cardText}>
                          Once returned garments arrive at our distribution center and pass quality check, your exchange credit code is generated within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "issues" && (
                <motion.div
                  key="issues"
                  id="tab-panel-issues"
                  role="tabpanel"
                  aria-labelledby="tab-btn-issues"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className={styles.tabPanel}
                >
                  <div className={styles.panelGrid}>
                    <div className={styles.panelMain}>
                      <span className={styles.panelTag}>PRIORITY CONCIERGE</span>
                      <h3 className={styles.panelTitle}>Damaged or Incorrect Dispatches</h3>
                      <p className={styles.panelDesc}>
                        If you receive a damaged garment or an incorrect size/style, our support concierge resolves the issue immediately at zero additional expense to you.
                      </p>

                      <div className={styles.issueSteps}>
                        <h4 className={styles.subTitle}>What to do immediately:</h4>
                        <div className={styles.issueStepGrid}>
                          <div className={styles.issueStepCard}>
                            <span className={styles.stepNum}>01</span>
                            <div>
                              <h5>Take Clear Photos</h5>
                              <p>Capture photos showing the issue, barcode tag, and outer shipping box label.</p>
                            </div>
                          </div>
                          <div className={styles.issueStepCard}>
                            <span className={styles.stepNum}>02</span>
                            <div>
                              <h5>Message Support</h5>
                              <p>Contact us on WhatsApp within 48 hours of parcel arrival with your Order ID.</p>
                            </div>
                          </div>
                          <div className={styles.issueStepCard}>
                            <span className={styles.stepNum}>03</span>
                            <div>
                              <h5>Complimentary Replacement</h5>
                              <p>We dispatch a fresh replacement item with doorstep reverse collection.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.panelCardVisual}>
                      <div className={styles.visualCardInner}>
                        <AlertTriangle size={36} className={styles.visualIcon} />
                        <h4 className={styles.cardHeading}>VIP Fast-Track</h4>
                        <p className={styles.cardText}>
                          Defective or incorrect items bypass our standard return queue for 1-on-1 priority resolution.
                        </p>
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.cardActionLink}
                        >
                          Report Defect on WhatsApp <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "process" && (
                <motion.div
                  key="process"
                  id="tab-panel-process"
                  role="tabpanel"
                  aria-labelledby="tab-btn-process"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3 }}
                  className={styles.tabPanel}
                >
                  <div className={styles.panelMainFull}>
                    <span className={styles.panelTag}>TRANSPARENT WORKFLOW</span>
                    <h3 className={styles.panelTitle}>5-Step Return &amp; Exchange Journey</h3>
                    <p className={styles.panelDesc}>
                      Our streamlined 5-step return process ensures zero friction from request to final exchange delivery.
                    </p>

                    <div className={styles.timelineGrid}>
                      {[
                        {
                          step: "01",
                          title: "Initiate Request",
                          desc: "Reach out to our WhatsApp support concierge with your Order ID & request details.",
                        },
                        {
                          step: "02",
                          title: "Verification",
                          desc: "Our team verifies order eligibility and confirms shipping details within hours.",
                        },
                        {
                          step: "03",
                          title: "Package Return",
                          desc: "Send the parcel via local courier or utilize our doorstep collection service.",
                        },
                        {
                          step: "04",
                          title: "Quality Check",
                          desc: "Garment is inspected at our central facility to ensure tags & condition remain pristine.",
                        },
                        {
                          step: "05",
                          title: "Exchange Dispatched",
                          desc: "Replacement size/style or store credit voucher is issued immediately.",
                        },
                      ].map((item, idx) => (
                        <div key={idx} className={styles.timelineCard}>
                          <div className={styles.timelineHeader}>
                            <span className={styles.timelineStep}>{item.step}</span>
                            <h4 className={styles.timelineTitle}>{item.title}</h4>
                          </div>
                          <p className={styles.timelineDesc}>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ELIGIBILITY CHECKER WIDGET */}
      <section className={styles.widgetSection}>
        <div className={styles.container}>
          <div className={styles.widgetCard}>
            <div className={styles.widgetHeader}>
              <div className={styles.widgetBadge}>
                <RefreshCw size={14} className={styles.goldIcon} />
                <span>INTERACTIVE ASSISTANT</span>
              </div>
              <h2 className={styles.widgetTitle}>Check Return Eligibility</h2>
              <p className={styles.widgetSub}>
                Select your order details below for instant verification of your return or exchange status.
              </p>
            </div>

            <div className={styles.questionsGrid}>
              {/* Q1 */}
              <div className={styles.questionBox}>
                <span className={styles.qLabel}>1. Delivered within the last 7 days?</span>
                <div className={styles.btnGroup}>
                  <button
                    className={`${styles.qBtn} ${withinDays === true ? styles.qBtnActive : ""}`}
                    onClick={() => setWithinDays(true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`${styles.qBtn} ${withinDays === false ? styles.qBtnActive : ""}`}
                    onClick={() => setWithinDays(false)}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Q2 */}
              <div className={styles.questionBox}>
                <span className={styles.qLabel}>2. All original tags attached?</span>
                <div className={styles.btnGroup}>
                  <button
                    className={`${styles.qBtn} ${tagsIntact === true ? styles.qBtnActive : ""}`}
                    onClick={() => setTagsIntact(true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`${styles.qBtn} ${tagsIntact === false ? styles.qBtnActive : ""}`}
                    onClick={() => setTagsIntact(false)}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Q3 */}
              <div className={styles.questionBox}>
                <span className={styles.qLabel}>3. Item unworn, unwashed &amp; unstained?</span>
                <div className={styles.btnGroup}>
                  <button
                    className={`${styles.qBtn} ${itemCondition === true ? styles.qBtnActive : ""}`}
                    onClick={() => setItemCondition(true)}
                  >
                    Yes
                  </button>
                  <button
                    className={`${styles.qBtn} ${itemCondition === false ? styles.qBtnActive : ""}`}
                    onClick={() => setItemCondition(false)}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Result Output */}
            {isEvaluated && (
              <motion.div
                className={`${styles.resultBanner} ${
                  isEligible ? styles.resultEligible : styles.resultIneligible
                }`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {isEligible ? (
                  <div className={styles.resultContent}>
                    <CheckCircle2 size={24} className={styles.eligibleIcon} />
                    <div>
                      <h4 className={styles.resultHeading}>
                        Eligible for 7-Day Exchange!
                      </h4>
                      <p className={styles.resultText}>
                        Your order meets all return standards. You can initiate your size exchange now via WhatsApp.
                      </p>
                    </div>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.resultCta}
                    >
                      Start Exchange <ArrowRight size={14} />
                    </a>
                  </div>
                ) : (
                  <div className={styles.resultContent}>
                    <XCircle size={24} className={styles.ineligibleIcon} />
                    <div>
                      <h4 className={styles.resultHeading}>
                        Requires Concierge Review
                      </h4>
                      <p className={styles.resultText}>
                        Items outside the 7-day window or missing original tags require direct evaluation by customer support.
                      </p>
                    </div>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.resultCtaSecondary}
                    >
                      Contact Support <MessageCircle size={14} />
                    </a>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>KNOWLEDGE BASE</p>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>

          <div className={styles.faqList}>
            {FAQS.map((faq, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ""}`}
                >
                  <button
                    id={`faq-btn-${idx}`}
                    className={styles.faqTrigger}
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                  >
                    <span className={styles.faqQuestion}>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`${styles.faqChevron} ${isOpen ? styles.faqChevronRotate : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${idx}`}
                        role="region"
                        aria-labelledby={`faq-btn-${idx}`}
                        className={styles.faqAnswerContainer}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className={styles.faqAnswer}>{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONCIERGE BOTTOM CALLOUT */}
      <section className={styles.conciergeSection}>
        <div className={styles.container}>
          <div className={styles.conciergeCard}>
            <div className={styles.conciergeCopy}>
              <span className={styles.conciergeEyebrow}>VIP SUPPORT</span>
              <h2 className={styles.conciergeTitle}>Need Personal Assistance?</h2>
              <p className={styles.conciergeDesc}>
                Our dedicated client relations team is available 7 days a week on WhatsApp to assist with order tracking, sizing recommendations, or return requests.
              </p>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.conciergeBtn}
            >
              <MessageCircle size={18} />
              <span>Chat on WhatsApp</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
