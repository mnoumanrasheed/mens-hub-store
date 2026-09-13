import { chromium } from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage();
 await page.goto('http://localhost:3000/',{waitUntil:'networkidle',timeout:120000});
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:1000});
  const footer=page.locator('.signature-footer');
  await footer.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await footer.screenshot({path:'artifacts/footer-'+(width===1440?'desktop':'mobile')+'.png',style:'.atelier-header, .atelier-store > a, nextjs-portal { visibility: hidden !important; }'});
 }
} finally {await browser.close();}

