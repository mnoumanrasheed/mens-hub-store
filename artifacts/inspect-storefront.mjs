import { chromium } from '@playwright/test';
(async () => {
 const browser = await chromium.launch({channel:'chrome', headless:true});
 const page = await browser.newPage({viewport:{width:1440,height:1000}, deviceScaleFactor:1});
 const errors=[]; page.on('pageerror', e=>errors.push(e.message));
 const response = await page.goto('http://localhost:3000/',{waitUntil:'networkidle',timeout:120000});
 await page.screenshot({path:'artifacts/storefront-desktop.png',fullPage:false});
 console.log(JSON.stringify({status:response.status(),title:await page.title(),headings:await page.locator('h1,h2').allTextContents(),canvas:await page.locator('.atelier-scene canvas').count(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors}));
 await page.setViewportSize({width:390,height:844}); await page.reload({waitUntil:'networkidle'});
 await page.screenshot({path:'artifacts/storefront-mobile.png',fullPage:false});
 console.log(JSON.stringify({mobileOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

