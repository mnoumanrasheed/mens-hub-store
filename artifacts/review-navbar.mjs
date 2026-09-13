import { chromium, expect } from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:3000/',{waitUntil:'networkidle',timeout:120000});
 await page.screenshot({path:'artifacts/navbar-desktop.png'});
 const categories=page.getByRole('button',{name:'Categories',exact:true});
 await categories.click();
 await expect(categories).toHaveAttribute('aria-expanded','true');
 await expect(page.getByRole('navigation',{name:'Shop by category'}).getByRole('link')).toHaveCount(11);
 await page.screenshot({path:'artifacts/navbar-categories.png'});
 await page.keyboard.press('Escape');
 await expect(categories).toHaveAttribute('aria-expanded','false');
 await expect(categories).toBeFocused();
 await categories.click();
 await page.locator('#desktop-category-menu').getByRole('link',{name:'Shirts',exact:false}).click();
 await page.waitForURL('**/shop/shirts');
 await page.getByRole('button',{name:'Search',exact:true}).click();
 await page.getByRole('combobox').fill('shirt');
 await page.getByRole('combobox').press('Enter');
 await page.waitForURL('**/shop?q=shirt');
 for(const width of [1024,768,390,360]){
  await page.setViewportSize({width,height:844});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow at '+width);
  await expect(page.locator('header a[aria-label$=" home"] img')).toBeVisible();
  console.log('Layout passed at '+width+'px');
 }
 await page.getByRole('button',{name:'Open menu',exact:true}).click();
 await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toBeVisible();
 await expect(page.locator('header a[href="/#lookbook"]')).toHaveCount(0);
 await page.screenshot({path:'artifacts/navbar-mobile-menu.png'});
 await page.keyboard.press('Escape');
 await page.locator('header a[aria-label$=" home"]').click();
 await page.waitForURL('http://localhost:3000/');
 await page.screenshot({path:'artifacts/navbar-mobile.png'});
 if(errors.length)throw Error(errors.join('\n'));
 console.log('Category toggle, Escape/focus, category navigation, search, mobile menu, and Home passed; no browser errors.');
}finally{await browser.close();}

