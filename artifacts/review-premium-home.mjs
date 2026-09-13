import { chromium, expect } from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:3000/',{waitUntil:'networkidle',timeout:120000});
 await expect(page.getByRole('heading',{name:/Why Men/})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Confidence in every order.'})).toBeVisible();
 await page.screenshot({path:'artifacts/premium-home-sections.png'});
 const categoryButton=page.getByRole('button',{name:'Categories',exact:true});
 await categoryButton.click(); await expect(categoryButton).toHaveAttribute('aria-expanded','true');
 await page.keyboard.press('Escape'); await expect(categoryButton).toHaveAttribute('aria-expanded','false');
 for(const width of [1440,1024,768,390,360]){
  await page.setViewportSize({width,height:900}); await page.reload({waitUntil:'networkidle'});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) throw new Error('Horizontal overflow at '+width);
  await expect(page.locator('header a[aria-label$=" home"] img')).toBeVisible();
  await expect(page.getByRole('heading',{name:/Why Men/})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Confidence in every order.'})).toBeVisible();
  console.log('Responsive premium layout passed:',width);
 }
 if(errors.length)throw Error(errors.join('\n'));
 console.log('Navbar category menu, premium sections, responsive layout, and browser errors passed.');
}finally{await browser.close();}

