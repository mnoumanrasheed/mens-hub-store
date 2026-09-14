import { chromium, expect } from '@playwright/test';

const base = process.env.COLLECTION_REVIEW_URL || 'http://localhost:3000';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
const expected = ['Shirts', 'Pants', 'Shalwar Qameez', 'Trousers', 'Shoes', 'Watches', 'Perfumes', 'Glasses', 'Belts', 'Accessories', 'Tracksuits'];
// Seed slugs are checked here; the UI continues using the live category records.
const slugs = ['shirts', 'pants', 'shalwar-qameez', 'trousers', 'shoes', 'watches', 'perfumes', 'glasses', 'belts', 'accessories', 'tracksuits'];
const screenshotStyle = '.atelier-header, a[href="#main-content"], a[href="#main"], a[aria-label*=WhatsApp], nextjs-portal { visibility: hidden !important; }';
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base, { waitUntil: 'networkidle', timeout: 120000 });
  const section = page.locator('#categories');
  const links = section.locator('a');
  await expect(links).toHaveCount(11);
  await expect(section.locator('h3')).toHaveText(expected);
  const hrefs = await links.evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  expect(hrefs).toEqual(slugs.map(slug => '/shop/' + slug));

  for (const width of [1440, 1024, 768, 390, 360, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.mouse.move(0, 0);
    for (const link of await links.all()) {
      await link.scrollIntoViewIfNeeded();
      await expect(link.locator('img')).toHaveJSProperty('complete', true);
      await link.locator('img').evaluate(image => image.decode());
    }
    await page.waitForTimeout(1200);
    const geometry = await links.evaluateAll(nodes => nodes.map(node => {
      const rect = node.getBoundingClientRect();
      const image = node.querySelector('img');
      const photo = image.getBoundingClientRect();
      const title = node.querySelector('h3').getBoundingClientRect();
      const arrow = node.querySelector('svg').getBoundingClientRect();
      return { x: rect.x, y: rect.y, w: rect.width, h: rect.height,
        loaded: image.naturalWidth > 0, fit: getComputedStyle(image).objectFit,
        covered: photo.left <= rect.left + 1 && photo.top <= rect.top + 1 && photo.right >= rect.right - 1 && photo.bottom >= rect.bottom - 1,
        copyFits: title.right <= rect.right && title.left >= rect.left && arrow.right <= rect.right };
    }));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(geometry.every(card => card.loaded && card.fit === 'cover' && card.covered && card.copyFits)).toBe(true);
    if (width >= 1024) {
      expect(geometry[0].w).toBeGreaterThan(geometry[1].w);
      expect(Math.abs(geometry[0].h - (geometry[1].h + geometry[2].h + 20))).toBeLessThan(2);
      expect(Math.abs(geometry[3].y - geometry[6].y)).toBeLessThan(2);
      expect(geometry[7].y).toBeGreaterThan(geometry[3].y);
    } else if (width >= 640) {
      expect(Math.abs(geometry[1].y - geometry[2].y)).toBeLessThan(2);
      expect(Math.abs(geometry[3].y - geometry[4].y)).toBeLessThan(2);
    } else {
      expect(geometry.every(card => card.w > width * 0.85 && card.h >= 384)).toBe(true);
      expect(geometry.every((card, index) => index === 0 || card.y > geometry[index - 1].y)).toBe(true);
    }
    if ([1440, 768, 390].includes(width)) {
      // Stabilize scroll before capturing a section taller than the viewport.
      await section.evaluate(el => window.scrollTo({ top: el.offsetTop, behavior: 'instant' }));
      await page.waitForTimeout(300);
      await section.screenshot({ path: 'artifacts/collections-' + width + '.png', style: screenshotStyle });
    }
    console.log('PASS layout, image coverage, copy, overflow:', width);
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  const first = links.first();
  await first.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1200);
  const imageLayer = first.locator(':scope > div').first();
  await expect(imageLayer).toHaveCSS('transform', 'none');
  await first.hover();
  await page.waitForTimeout(1250);
  const hoverMatrix = await imageLayer.evaluate(el => getComputedStyle(el).transform);
  expect(hoverMatrix).toContain('1.04');
  await expect(first.locator('h3')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -5)');
  await page.mouse.move(0, 0);
  await first.focus();
  await page.keyboard.press('Tab');
  await expect(links.nth(1)).toBeFocused();
  await expect(links.nth(1)).toHaveCSS('outline-style', 'solid');
  console.log('PASS hover transforms and keyboard focus');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await first.hover();
  await expect(imageLayer).toHaveCSS('transform', 'none');
  await expect(first.locator('h3')).toHaveCSS('transform', 'none');
  for (const link of await links.all()) {
    await link.scrollIntoViewIfNeeded();
    await expect(link.locator('p')).toHaveCSS('opacity', '1');
    await expect(link.locator('..')).toHaveCSS('transform', 'none');
  }
  console.log('PASS reduced motion');

  const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  touch.on('pageerror', error => errors.push(error.message));
  await touch.goto(base, { waitUntil: 'networkidle', timeout: 120000 });
  for (const link of await touch.locator('#categories a').all()) {
    await link.scrollIntoViewIfNeeded();
    await expect(link.locator('p')).toHaveCSS('opacity', '1');
    await expect(link.locator('svg')).toBeVisible();
  }
  await touch.close();
  console.log('PASS touch content without hover');

  // Activate each actual gallery link, including a keyboard navigation.
  for (let index = 0; index < expected.length; index++) {
    await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 120000 });
    const link = page.getByRole('link', { name: 'Explore ' + expected[index] + ' collection', exact: true });
    if (index === 0) { await link.focus(); await page.keyboard.press('Enter'); }
    else { await link.click(); }
    await expect(page).toHaveURL(base + hrefs[index], { timeout: 60000 });
    await expect(page.locator('h1')).toContainText(expected[index], { timeout: 60000 });
    console.log('PASS category navigation:', hrefs[index]);
  }
  expect(errors).toEqual([]);
  console.log('PASS no browser runtime or hydration errors');
} finally {
  await browser.close();
}
