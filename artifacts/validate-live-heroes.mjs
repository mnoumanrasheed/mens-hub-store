import { chromium } from "@playwright/test";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });

async function visit(path, expectedTitle) {
  await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
  const loader = page.locator(".initial-storefront-loader");
  if (await loader.count()) await loader.waitFor({ state: "detached", timeout: 5000 });

  const hero = page.locator(path === "/about" ? "section[class*='hero']" : path === "/contact" ? ".contact-concierge-hero" : ".animated-collection-hero").first();
  const title = await hero.locator("h1").textContent();
  const result = await hero.evaluate((element) => ({
    atmosphere: element.querySelectorAll(".store-hero-atmosphere").length,
    logo: Boolean(element.querySelector(".store-hero-atmosphere img")),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    motionNodes: element.querySelectorAll(".store-hero-ambient, .store-hero-brand-mark, .store-hero-light-sweep").length,
  }));

  if (!title?.includes(expectedTitle)) throw new Error(path + ": expected hero title " + expectedTitle);
  if (result.atmosphere !== 1 || !result.logo || result.motionNodes !== 3) throw new Error(path + ": shared live hero branding is missing");
  if (result.overflow > 1) throw new Error(path + ": horizontal overflow " + result.overflow);

  return { path, title: title.trim(), ...result };
}

const results = [];
results.push(await visit("/shop", "Shop"));
const categoryPath = await page.locator(".collection-category-nav a").nth(1).getAttribute("href");
if (!categoryPath) throw new Error("No category path found");
results.push(await visit(categoryPath, ""));
results.push(await visit("/new-arrivals", "New Arrivals"));
results.push(await visit("/sale", "Sale"));
results.push(await visit("/about", "Style Made"));
results.push(await visit("/contact", "Let's"));

await page.goto("http://localhost:3000/contact", { waitUntil: "networkidle" });
const contactLoader = page.locator(".initial-storefront-loader");
if (await contactLoader.count()) await contactLoader.waitFor({ state: "detached", timeout: 5000 });
await page.screenshot({ path: "artifacts/live-contact-hero.png", fullPage: false });
await page.goto("http://localhost:3000/shop", { waitUntil: "networkidle" });
const shopLoader = page.locator(".initial-storefront-loader");
if (await shopLoader.count()) await shopLoader.waitFor({ state: "detached", timeout: 5000 });
await page.screenshot({ path: "artifacts/live-shop-hero.png", fullPage: false });
await page.goto("http://localhost:3000/about", { waitUntil: "networkidle" });
const aboutLoader = page.locator(".initial-storefront-loader");
if (await aboutLoader.count()) await aboutLoader.waitFor({ state: "detached", timeout: 5000 });
await page.screenshot({ path: "artifacts/live-about-hero.png", fullPage: false });

console.log(JSON.stringify(results, null, 2));
await browser.close();
