import { chromium } from '@playwright/test';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const routes=['/shop','/new-arrivals','/sale','/cart','/wishlist','/about','/contact','/faq','/size-guide','/how-to-order','/shipping-policy','/return-exchange-policy','/privacy-policy','/terms-and-conditions','/shop/shirts','/admin/login'];
 for(const route of routes){
  const response=await page.goto('http://localhost:3000'+route,{waitUntil:'networkidle',timeout:120000});
  console.log(JSON.stringify({route,status:response.status(),h1:await page.locator('h1').allTextContents(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),productLinks:await page.locator('a[href^="/product/"]').count(),storefrontStyles:await page.locator('.atelier-store').count()}));
  if(['/shop','/contact','/cart','/about'].includes(route)) await page.screenshot({path:'artifacts/'+route.slice(1)+'-desktop.png',fullPage:false});
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Open menu',exact:true}).click();
 console.log('Mobile menu open:',await page.getByRole('navigation',{name:'Mobile navigation',exact:true}).isVisible());
 await page.getByRole('navigation',{name:'Mobile navigation',exact:true}).getByRole('link',{name:'Sale',exact:false}).click();
 await page.waitForURL('**/sale'); console.log('Mobile Sale navigation:',page.url());
 await page.getByRole('button',{name:'Search',exact:true}).click();
 await page.getByRole('combobox').fill('shirt');
 await page.getByRole('combobox').press('Enter');
 await page.waitForURL('**/shop?q=shirt');
 console.log('Search submitted:',page.url());
 await page.getByRole('button',{name:'Filters',exact:true}).click();
 console.log('Mobile filter visible:',await page.locator('#mobile-product-filters').isVisible());
 await page.keyboard.press('Escape');
 await page.screenshot({path:'artifacts/shop-mobile.png',fullPage:false});
 console.log('Mobile collection overflow:',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
 console.log('Reduced motion canvas:',await page.locator('.atelier-scene canvas').count());
 await page.screenshot({path:'artifacts/storefront-reduced-motion.png',fullPage:false});
 console.log('Browser errors:',errors);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

