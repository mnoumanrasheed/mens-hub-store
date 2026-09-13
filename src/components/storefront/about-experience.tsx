"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { AtelierScene } from "@/components/storefront/atelier-scene";
import { Container } from "@/components/storefront/container";
import { StoreImage } from "@/components/storefront/store-image";
import { StoreHeroAtmosphere } from "@/components/storefront/store-hero-atmosphere";
import { HeroDepth, useHeroEntrance } from "./hero-motion";
import styles from "./about-experience.module.css";

type AboutExperienceProps = { imageUrl?: string | null };

const philosophy = [
  ["01", "Curated Style", "Collections selected with a clear focus on modern masculine fashion."],
  ["02", "Complete Wardrobe", "From clothing and footwear to fragrances, watches and finishing accessories."],
  ["03", "Modern Meets Timeless", "Contemporary trends balanced with pieces that remain relevant beyond a season."],
  ["04", "Confidence in Every Detail", "Because great style is often defined by the smallest details."],
  ["05", "Personal Shopping Experience", "A straightforward and approachable way to discover products and connect directly with Men’s Hub."],
] as const;

const story = [
  "Men’s Hub is a modern men’s fashion destination created for men who believe that style is more than what they wear — it is how they present themselves.",
  "We bring together a carefully selected range of menswear, footwear, fragrances, watches and accessories, combining contemporary fashion with timeless masculine style.",
  "From refined everyday essentials and traditional wear to the finishing details that complete a look, Men’s Hub is designed to make building a complete wardrobe simple and effortless.",
  "Our approach is centered on style, versatility and confidence. Every collection is selected to help the modern man move seamlessly between work, everyday life, celebrations and special occasions while maintaining his own identity.",
  "At Men’s Hub, we do not simply want to offer products. We want to create a destination where men can discover pieces that complement their personality, elevate their appearance and make getting dressed feel effortless.",
];

const ease = [0.22, 1, 0.36, 1] as const;

export function AboutExperience({ imageUrl }: AboutExperienceProps) {
  const reduceMotion = useReducedMotion();
  const heroReveal = useHeroEntrance();
  const reveal: Variants = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.85, ease } },
  };
  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.11 } } };

  return (
    <main className={styles.page}>
      <section data-store-hero className={styles.hero} aria-labelledby="about-title">
        <Container size="wide" className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <motion.p className={styles.eyebrow} {...heroReveal(.04)}>Our story</motion.p>
            <h1 id="about-title" className={styles.heroTitle}>
              <motion.span {...heroReveal(.14, "heading")}>Style Made</motion.span>
              <motion.span className={styles.goldLine} {...heroReveal(.25, "heading")}>for Men</motion.span>
            </h1>
            <motion.p className={styles.heroStatement} {...heroReveal(.38)}>Modern menswear curated for confidence, individuality and effortless style.</motion.p>
            <motion.div className={styles.heroActions} {...heroReveal(.5)}><Link href="/shop" className="store-cta-primary">Discover the collection <ArrowUpRight size={16} /></Link><a href="#our-story" className="store-cta-secondary">Our story <ArrowDown size={15} /></a></motion.div>
          </div>

          <motion.div className={styles.heroVisual} {...heroReveal(.1, "heading")}>
            <HeroDepth className={styles.heroImageDepth}>
              <StoreImage src={imageUrl || "/images/atelier-campaign.webp"} alt="Men’s Hub modern menswear" fill sizes="(max-width: 1023px) 100vw, 36vw" className={styles.heroImage} />
            </HeroDepth>
            <div className={styles.visualShade} aria-hidden="true" />
            <span className={styles.visualIndex}>The art of dressing well</span>
          </motion.div>

          <StoreHeroAtmosphere className={styles.heroAtmosphere} />
          <motion.a href="#our-story" className={styles.scrollCue} {...heroReveal(.62)}>
            <span>Discover our point of view</span><ArrowDown size={15} aria-hidden="true" />
          </motion.a>
        </Container>
      </section>

      <section id="our-story" className={styles.storySection} aria-labelledby="story-title">
        <div className={styles.storyCinema} aria-hidden="true"><AtelierScene fabric /></div>
        <span className={styles.storyChapter} aria-hidden="true">01 / The house</span>
        <Container size="wide">
          <motion.div className={styles.storyGrid} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
            <motion.header className={styles.storyHeading} variants={reveal}>
              <p className={styles.eyebrow}>About Men’s Hub</p>
              <h2 id="story-title"><span>A wardrobe shaped</span><em>around the man wearing it.</em></h2>
              <span className={styles.verticalRule} aria-hidden="true" />
              <span className={styles.storySeal} aria-hidden="true">MH<span>Style with substance</span></span>
            </motion.header>
            <div className={styles.storyBody}>
              {story.map((paragraph, index) => <motion.p key={paragraph} className={index === 0 ? styles.lead : undefined} variants={reveal}>{paragraph}</motion.p>)}
              <motion.p className={styles.signature} variants={reveal}>Men’s Hub <span>— Style Made for Men.</span></motion.p>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className={styles.purposeSection} aria-label="Our mission and vision">
        <div className={styles.purposeGrid}>
          <PurposePanel eyebrow="01 / Our mission" heading="Making refined men’s style effortless." tone="ivory" reduceMotion={reduceMotion}>
            Our mission is to curate clothing, footwear and accessories that combine contemporary design with timeless appeal, giving every man the freedom to build his wardrobe with confidence.
            <br /><br />We aim to provide a simple, personal and convenient shopping experience while continuously introducing collections that reflect the evolving lifestyle of the modern man.
          </PurposePanel>
          <PurposePanel eyebrow="02 / Our vision" heading="Building a destination for modern men’s style." tone="dark" reduceMotion={reduceMotion}>
            We envision Men’s Hub as more than a fashion store — a complete men’s lifestyle destination where modern fashion, timeless style and personal expression come together.
            <br /><br />Our goal is to build a brand recognized for thoughtful curation, distinctive style and a customer experience that makes every man feel confident in what he wears.
          </PurposePanel>
        </div>
      </section>

      <section className={styles.philosophySection} aria-labelledby="philosophy-title">
        <Container size="wide">
          <motion.header className={styles.sectionHeading} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={stagger}>
            <motion.p className={styles.eyebrow} variants={reveal}>What defines us</motion.p>
            <motion.h2 id="philosophy-title" variants={reveal}>The Men’s Hub<br /><em>Philosophy</em></motion.h2>
            <motion.div className={styles.headingRule} variants={{ hidden: { scaleX: reduceMotion ? 1 : 0 }, visible: { scaleX: 1, transition: { duration: reduceMotion ? 0 : 1, ease } } }} aria-hidden="true" />
          </motion.header>
          <div className={styles.principles}>
            {philosophy.map(([number, title, copy], index) => (
              <motion.article key={number} className={styles.principle} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={stagger}>
                <motion.span className={styles.principleNumber} variants={reveal}>{number}</motion.span>
                <motion.h3 variants={reveal}>{title}</motion.h3>
                <motion.p variants={reveal}>{copy}</motion.p>
                <span className={styles.rowArrow} aria-hidden="true">↗</span>
                <motion.span className={styles.rowLine} initial={{ scaleX: reduceMotion ? 1 : 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : index * 0.04, ease }} aria-hidden="true" />
              </motion.article>
            ))}
          </div>
        </Container>
      </section>

    </main>
  );
}

function PurposePanel({ eyebrow, heading, children, tone, reduceMotion }: { eyebrow: string; heading: string; children: React.ReactNode; tone: "ivory" | "dark"; reduceMotion: boolean | null }) {
  const panelReveal: Variants = { hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.75, ease } } };
  return (
    <motion.article className={`${styles.purposePanel} ${tone === "ivory" ? styles.purposeIvory : styles.purposeDark}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.13 } } }}>
      <motion.p className={styles.purposeEyebrow} variants={panelReveal}>{eyebrow}</motion.p>
      <motion.span className={styles.purposeRule} variants={{ hidden: { scaleX: reduceMotion ? 1 : 0 }, visible: { scaleX: 1, transition: { duration: reduceMotion ? 0 : 0.9, ease } } }} aria-hidden="true" />
      <motion.h2 variants={panelReveal}>{heading}</motion.h2>
      <motion.p className={styles.purposeCopy} variants={panelReveal}>{children}</motion.p>
    </motion.article>
  );
}
