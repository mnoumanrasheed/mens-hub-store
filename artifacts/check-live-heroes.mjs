import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const report = [];
const paths = ["/shop", "/shop", "/new-arrivals", "/sale", "/about", "/contact"];

for (const path of paths) {
  try {
    await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle" });
    const loader = page.locator(".initial-storefront-loader");
    if (await loader.count()) await loader.waitFor({ state: "detached", timeout: 5000 });
    const hero = page.locator(path === "/about" ? "section[class*='hero']" : path === "/contact" ? ".contact-concierge-hero" : ".animated-collection-hero").first();
    report.push({
      path,
      heroCount: await hero.count(),
      title: await hero.locator("h1").textContent(),
      atmosphere: await hero.locator(".store-hero-atmosphere").count(),
      logo: await hero.locator(".store-hero-atmosphere img").count(),
      motionNodes: await hero.locator(".store-hero-ambient, .store-hero-brand-mark, .store-hero-light-sweep").count(),
      overflow: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    });
  } catch (error) {
    report.push({ path, error: String(error) });
  }
}
await writeFile("artifacts/live-heroes-report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
