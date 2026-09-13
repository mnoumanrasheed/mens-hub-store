import { chromium, expect } from '@playwright/test';
const browser = await chromium.launch({channel:'chrome',headless:true});
try {
 const page = await browser.newPage();
 const errors=[]; page.on('pageerror',error=>errors.push(error.message));
 for (const width of [360,768,1024,1440]) {
  await page.setViewportSize({width,height:900});
  for (const path of ['/','/shop']) {
   await page.goto('http://localhost:3000'+path,{waitUntil:'networkidle',timeout:120000});
   await expect(page.locator('main h1')).toBeVisible();
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   if(overflow) throw new Error('Overflow '+path+' at '+width);
   console.log('Responsive layout:',path,width,'passed');
  }
 }
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Filters',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Product filters'})).toBeVisible();
 await page.getByRole('button',{name:'Close filters',exact:true}).focus();
 await page.keyboard.press('Shift+Tab');
 await expect(page.getByRole('link',{name:'Clear all filters',exact:true})).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog',{name:'Product filters'})).not.toBeVisible();
 console.log('Filter drawer keyboard focus and dismissal passed.');
 await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
 await page.screenshot({path:'artifacts/storefront-mobile.png'});
 await page.setViewportSize({width:1440,height:1000});
 await page.screenshot({path:'artifacts/storefront-desktop.png'});
 if(errors.length) throw new Error(errors.join('\n'));
 console.log('No browser errors.');
} finally { await browser.close(); }
