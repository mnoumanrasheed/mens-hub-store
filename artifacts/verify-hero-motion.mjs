import { chromium } from "@playwright/test";

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

await page.goto("http://localhost:3000/shop", { waitUntil: "networkidle" });
const initialLoader = page.locator(".initial-storefront-loader");
if (await initialLoader.count()) await initialLoader.waitFor({ state: "detached", timeout: 5000 });
const categoryHref = await page.locator(".collection-category-nav a").nth(1).getAttribute("href");
if (!categoryHref) throw new Error("No category route found");
await page.goto("http://localhost:3000" + categoryHref, { waitUntil: "networkidle" });
const categoryLoader = page.locator(".initial-storefront-loader");
if (await categoryLoader.count()) await categoryLoader.waitFor({ state: "detached", timeout: 5000 });
const categoryHero = page.locator(".animated-collection-hero");
if (await categoryHero.locator(".store-hero-atmosphere").count() !== 1) throw new Error("Category hero is missing the shared atmosphere");

const ambient = categoryHero.locator(".store-hero-ambient");
const logo = categoryHero.locator(".store-hero-brand-mark");
await page.screenshot({ path: "artifacts/live-category-hero.png", fullPage: false });

const before = await Promise.all([ambient.evaluate((el) => getComputedStyle(el).transform), logo.evaluate((el) => getComputedStyle(el).transform)]);
await page.waitForTimeout(1400);
const after = await Promise.all([ambient.evaluate((el) => getComputedStyle(el).transform), logo.evaluate((el) => getComputedStyle(el).transform)]);
if (before[0] === after[0] || before[1] === after[1]) throw new Error("Live hero transforms did not continue after entry");

const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
await reduced.goto("http://localhost:3000/shop", { waitUntil: "networkidle" });
const reducedLoader = reduced.locator(".initial-storefront-loader");
if (await reducedLoader.count()) await reducedLoader.waitFor({ state: "detached", timeout: 5000 });
const reducedAnimations = await reduced.locator(".store-hero-ambient").evaluate((el) => el.getAnimations().length);
if (reducedAnimations !== 0) throw new Error("Reduced-motion hero still has active animations");

console.log(JSON.stringify({ categoryHref, continuousMotion: true, reducedMotionAnimations: reducedAnimations }, null, 2));
await reduced.close();
await browser.close();
