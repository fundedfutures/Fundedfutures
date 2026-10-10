import assert from 'node:assert/strict';
const {chromium}=await import(process.env.AUDIT_PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({args:['--no-sandbox']});
const context=await browser.newContext();
await context.addInitScript(()=>localStorage.setItem('analyticsConsent','rejected'));
await context.route('https://**',r=>r.abort()); await context.route('https://script.google.com/**',r=>r.abort());await context.route('**/*.mp4',r=>r.abort());
const page=await context.newPage(); page.on('dialog',d=>d.dismiss());
const origin='http://localhost:3000';
async function go(path){await page.goto(origin+path,{waitUntil:'domcontentloaded'});await page.waitForTimeout(150);}
try{
 await go('/donate');await page.getByPlaceholder('e.g. john@email.com').fill('invalid');await page.getByPlaceholder('Enter M-Pesa Transaction Code').fill('AUDIT123');await page.getByRole('button',{name:'Submit Donation'}).click();assert(await page.getByText(/valid email address/).count());
 await page.getByPlaceholder('e.g. john@email.com').fill('');await page.getByRole('button',{name:'Submit Donation'}).click();await page.getByText(/could not submit your payment confirmation/).waitFor();assert.equal(new URL(page.url()).pathname,'/donate');
 await go('/donate');await page.locator('button').filter({hasText:/Kenyan Shilling/}).click();await page.locator('button').filter({hasText:/US Dollar/}).click();await page.getByRole('button',{name:/M-PESA Paybill/}).click();assert(await page.getByText(/Select KES before making/).count());await page.getByRole('button',{name:'Submit Donation'}).click();assert(await page.getByText(/Select KES before submitting/).count());
 await go('/donate');await page.getByRole('button',{name:/M-PESA Paybill/}).click();assert(await page.getByText('I have made the payment').count());
 await page.locator('button').filter({has:page.locator('svg.lucide-copy')}).first().click();
 await page.getByRole('button',{name:'I have made the payment'}).click();await page.getByRole('button',{name:'I have made the payment'}).waitFor({state:'detached'});
 for(const width of [390,320]){
  await page.setViewportSize({width,height:568});await go('/');await page.getByRole('button',{name:'Toggle navigation'}).click();await page.waitForTimeout(350);
  const menu=page.locator('nav > div').last();assert(await menu.evaluate(e=>e.scrollHeight>e.clientHeight));
  await page.locator('nav').getByRole('button',{name:'Contact Us'}).click();await page.waitForTimeout(300);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const email=page.locator('a[href*="mail.google.com"]');const rect=await email.boundingBox();assert(rect.x>=0&&rect.x+rect.width<=width);
  await page.getByRole('button',{name:'Close contact'}).click();
  await page.getByRole('button',{name:'Toggle navigation'}).click();await page.waitForTimeout(400);await page.locator('nav').getByRole('button',{name:'Donate Now',exact:true}).click();await page.waitForURL(origin+'/donate');
 }
 console.log('PASS: donation email validation, network failure, foreign-currency guard, payment instructions, mobile menu scrolling/Donate, and contact popup at 390/320px.');
}finally{await browser.close();}
