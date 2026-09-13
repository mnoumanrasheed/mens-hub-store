import { chromium, expect } from '@playwright/test';
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
 const page = await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[]; page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://localhost:3000/',{waitUntil:'networkidle',timeout:120000});
 const footer = page.getByRole('contentinfo',{name:'Store footer'});
 await footer.scrollIntoViewIfNeeded();
 await expect(footer.getByRole('heading',{name:'Good style starts with a conversation.'})).toBeVisible();
 const originalLinks=await footer.locator('a').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
 for (const width of [1440,768,390,360]) {
  await page.setViewportSize({width,height:1000});
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(850);
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) throw new Error('Horizontal overflow at '+width);
  await expect(footer.getByRole('link',{name:'Speak with our team'})).toHaveAttribute('href',/^https:\/\/wa.me\//);
  await expect(footer.getByRole('navigation',{name:'Footer collections'}).getByRole('link')).toHaveCount(14);
  if(width===1440||width===390) await footer.screenshot({path:'artifacts/footer-'+(width===1440?'desktop':'mobile')+'.png'});
  console.log('Footer layout and links passed at '+width+'px.');
 }
 const required=['/shop','/new-arrivals','/sale','/about','/contact','/how-to-order','/size-guide','/shipping-policy','/return-exchange-policy','/faq','/wishlist','/privacy-policy','/terms-and-conditions'];
 for(const href of required) if(!originalLinks.includes(href)) throw new Error('Missing link '+href);
 console.log('All shopping, customer care, and legal links retained.');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.reload({waitUntil:'networkidle'});
 await footer.scrollIntoViewIfNeeded();
 await expect(footer.getByRole('heading',{name:'Good style starts with a conversation.'})).toBeVisible();
 if(errors.length) throw new Error(errors.join('\n'));
 console.log('Reduced-motion layout passed. No browser errors.');
} finally { await browser.close(); }

