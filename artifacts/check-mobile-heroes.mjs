import { chromium } from "@playwright/test";

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const paths = ["/shop", "/about", "/contact"];
const report = [];

for (const path of paths) {
  await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
  const loader = page.locator(".initial-storefront-loader");
  if (await loader.count()) await loader.waitFor({ state: "detached", timeout: 5000 });
  const hero = page.locator(path === "/about" ? "section[class*='hero']" : path === "/contact" ? ".contact-concierge-hero" : ".animated-collection-hero").first();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  const logoOpacity = await hero.locator(".store-hero-brand-mark").evaluate((el) => getComputedStyle(el).opacity);
  if (overflow > 1) throw new Error(path + ": horizontal overflow " + overflow);
  if (Number(logoOpacity) < 0.03 || Number(logoOpacity) > 0.08) throw new Error(path + ": logo opacity outside 3-8%");
  report.push({ path, overflow, logoOpacity });
}

console.log(JSON.stringify(report, null, 2));
await browser.close();
