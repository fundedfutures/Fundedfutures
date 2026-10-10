import assert from 'node:assert/strict';
const { chromium } = await import(process.env.AUDIT_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({args:['--no-sandbox']});
const context = await browser.newContext();
const page = await context.newPage();
let scripts = 0;
await page.route('**/src/components/Analytics.tsx*', async route => {
  const response = await route.fetch();
  let body = await response.text();
  body = body.replace(/const measurementId = [^;]+;/, 'const measurementId = "G-AUDIT12345";');
  await route.fulfill({response,body});
});
await page.route('https://www.googletagmanager.com/**', async route => {scripts++;await route.fulfill({status:200,body:''});});
await page.route(/https:\/\/(i\.imgur\.com|images\.unsplash\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|www\.transparenttextures\.com)\//,route=>route.abort());
try {
  await page.goto('http://localhost:3000/subscribe?email=private@example.com');
  await page.waitForTimeout(1700);assert.equal(scripts,0);
  await page.getByRole('button',{name:'Reject',exact:true}).click();assert.equal(scripts,0);
  await page.goto('http://localhost:3000/privacy-policy');
  await page.getByRole('button',{name:'Cookie Preferences',exact:true}).click();
  const tagRequest = page.waitForRequest('https://www.googletagmanager.com/**');
  await page.getByRole('button',{name:'Accept Cookies',exact:true}).click();
  await tagRequest; assert.equal(scripts,1);
  let events = await page.evaluate(()=>window.dataLayer);
  assert.equal(events.filter(event=>event[1]==='page_view').length,1);
  await page.getByRole('link',{name:'Back to Home'}).click();await page.waitForTimeout(200);
  await page.getByRole('button',{name:'Donate',exact:true}).first().click();await page.waitForTimeout(200);
  events = await page.evaluate(()=>window.dataLayer);
  assert.equal(events.filter(event=>event[1]==='page_view').length,3);
  assert(events.some(event=>event[1]==='button_click'));assert(events.some(event=>event[1]==='link_click'));
  assert(!JSON.stringify(events).includes('private@example.com'));
  await page.goto('http://localhost:3000/privacy-policy');
  await page.getByRole('button',{name:'Cookie Preferences',exact:true}).click();await page.getByRole('button',{name:'Reject',exact:true}).click();
  const count = await page.evaluate(()=>window.dataLayer.length);
  await page.getByRole('link',{name:'Back to Home'}).click();await page.waitForTimeout(150);
  assert.equal(await page.evaluate(()=>window.dataLayer.length),count);
  console.log('PASS: tag withheld before consent and after rejection; one pageview per route; click events; no query email; revocation suppresses events. Test ID and tag response mocked; no real GA data sent.');
} finally {await browser.close();}
