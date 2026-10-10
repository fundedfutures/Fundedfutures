// Run with AUDIT_PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/audit.mjs.
// All submissions are intercepted; this test never sends real registrations/payments.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
const { chromium } = await import(process.env.AUDIT_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const origin = process.env.AUDIT_ORIGIN || 'http://localhost:3000';
const source = readFileSync('src/App.tsx', 'utf8');
const routes = [...source.matchAll(/<Route path="([^"]+)"/g)].map(m => m[1]);
const results = { pages: [], interactions: [], forms: [], errors: [] };
const context = await browser.newContext();
await context.addInitScript(() => { localStorage.setItem('analyticsConsent', 'rejected'); });
await context.route('https://script.google.com/**', route => route.fulfill({ status: 200, body: 'ok', headers: { 'access-control-allow-origin': '*' } }));
// Third-party images/fonts are not needed for functional assertions and can be slow.
await context.route(/https:\/\/(i\.imgur\.com|images\.unsplash\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|www\.transparenttextures\.com)\//, route => route.abort());
await context.route('**/*.mp4', route => route.abort());
const page = await context.newPage();
page.on('pageerror', error => results.errors.push(error.message));
page.on('dialog', dialog => dialog.dismiss());
async function go(path) { await page.goto(origin + path, { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(150); }
async function click(text, path) {
  if (path) await go(path);
  await page.getByRole('button', { name: text, exact: true }).click();
  await page.waitForTimeout(180);
  results.interactions.push(String(text));
}
try {
  for (const width of (process.env.AUDIT_SKIP_LAYOUT ? [] : [1440, 390, 320])) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await go(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false, `Horizontal overflow: ${route} at ${width}`);
      for (const href of await page.locator('a').evaluateAll(elements => elements.map(e => e.getAttribute('href')))) {
        if (!href || href === '#') continue;
        if (href.startsWith('/')) assert(routes.includes(href.split('#')[0]), `Unknown route ${href}`);
      }
      results.pages.push(`${width}:${route}`);
      console.log(`Layout passed ${width}:${route}`);
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  // Exercise every homepage CTA button that navigates, and confirm its destination.
  for (const [label, destination] of [['Donate','/donate'],['Learn Our Story','/learn-story'],['Help Change a Life','/donate'],['Discover Impact','/impact-stories'],['Stay Connected','/subscribe']]) {
    await go('/');
    const button = page.getByRole('button', { name: label, exact: true }).first();
    if (await button.count()) { await button.click(); await page.waitForURL(origin + destination); results.interactions.push(label + ' → ' + destination); }
  }
  await click('Contact Us','/'); assert(await page.getByText('Get in Touch').count());
  assert((await page.locator('a[href*="mail.google.com"]').getAttribute('href')).includes('fundedfuturesorg')); await go('/');
  await page.getByRole('button',{name:'Impact',exact:true}).click();
  await page.getByRole('link',{name:'Impact Stories',exact:true}).first().click(); await page.waitForURL(origin+'/impact-stories');
  await go('/'); await page.getByRole('link',{name:'Management',exact:true}).click(); await page.waitForTimeout(350);
  assert((await page.locator('#management').boundingBox()).y < 200, 'Management anchor did not scroll');
  await go('/'); await page.locator('#footer-email').fill('audit@example.com'); await page.locator('footer form button').click();
  await page.waitForURL(origin+'/subscribe'); await page.waitForFunction(() => document.querySelector('input[placeholder="jane.doe@example.com"]')?.value === 'audit@example.com');
  // Details and their close buttons.
  for (const [path, selector] of [['/impact-areas','h3'],['/events','h2'],['/learn-story','#management h3']]) {
    await go(path);
    const labels = await page.locator(selector).allTextContents();
    for (const label of labels) {
      await go(path); const item = page.locator(selector).filter({hasText:label}).first();
      await item.click(); await page.waitForTimeout(120);
      const close = page.getByRole('button',{name:/Close Details|Close|Got it/i});
      if (await close.count()) await close.first().click();
      else { const x = page.locator('button').filter({has:page.locator('svg.lucide-x')}); if(await x.count()) await x.first().click(); }
      results.interactions.push(path+': '+label);
    }
  }
  await go('/faq'); const faqCount = await page.locator('[id^="faq-item-"]').count();
  for(let i=0;i<faqCount;i++){ await page.locator('#faq-item-'+i).click(); await page.waitForTimeout(100); results.interactions.push('FAQ '+i); }
  // Newsletter validation, selection, mocked success, reset and network failure.
  await go('/subscribe'); await page.locator('button[type="submit"]').click(); assert(await page.getByText('First name is required').count());
  async function fillNewsletter(){ await page.getByPlaceholder('Jane',{exact:true}).fill('Audit'); await page.getByPlaceholder('Doe',{exact:true}).fill('Test'); await page.getByPlaceholder('jane.doe@example.com').fill('audit@example.com'); await page.getByRole('button',{name:'Select All',exact:true}).click(); await page.locator('select').nth(1).selectOption({index:1}); await page.locator('input[type="checkbox"]').last().check(); }
  await fillNewsletter(); await page.locator('button[type="submit"]').click(); await page.getByRole('heading',{name:'Thank you for signing up!'}).waitFor(); await page.getByRole('button',{name:'Dismiss',exact:true}).click(); assert.equal(await page.getByPlaceholder('Jane',{exact:true}).inputValue(),''); results.forms.push('newsletter validation and mocked success');
  await go('/subscribe'); await fillNewsletter(); await page.route('https://script.google.com/**',r=>r.abort()); await page.locator('button[type="submit"]').click(); await page.waitForTimeout(200); assert(await page.getByText(/Something went wrong/).count()); await page.unroute('https://script.google.com/**'); results.forms.push('newsletter network failure');
  // Volunteer calendar, committees, interview selection and mocked submission.
  await go('/join-volunteer'); await page.locator('button[type="submit"]').click(); assert(await page.getByText('This field is invalid').count());
  await page.locator('input[name="name"]').fill('Audit Test'); await page.locator('input[name="email"]').fill('audit@example.com'); await page.locator('input[name="phone"]').fill('+254700000000');
  await page.locator('#birthdate-picker-trigger').click(); await page.locator('#year-selector').selectOption('2000'); await page.locator('#month-selector').selectOption('0'); await page.locator('#day-1').click();
  await page.locator('button').filter({hasText:/Wed|Thu|Fri|Sat/}).first().click(); await page.locator('button[type="submit"]').click(); await page.waitForTimeout(300); assert(await page.getByText('Thank you for registering!').count()); results.forms.push('volunteer validation, calendar, interview and mocked success');
  // Donation validation and disabled state during intercepted submission.
  await go('/donate'); await click('Submit Donation'); assert(await page.getByText(/valid confirmation code/).count());
  await page.getByPlaceholder('Enter M-Pesa Transaction Code').fill('AUDIT12345');
  let release; await page.route('https://script.google.com/**',async r=>{await new Promise(resolve=>release=resolve);await r.fulfill({status:200,body:'ok'});});
  await click('Submit Donation'); assert.equal(await page.locator('button[disabled]').count(),1); release(); await page.waitForURL(origin+'/thank-you'); await page.unroute('https://script.google.com/**'); results.forms.push('donation validation, duplicate prevention and mocked confirmation');
  await click('Share Our Mission'); await page.waitForURL(origin+'/share-work');
  const downloads = page.getByRole('button').filter({hasText:/Download/});
  for(let i=0;i<await downloads.count();i++){const promise=page.waitForEvent('download');await downloads.nth(i).click();const file=await promise; assert(file.suggestedFilename().endsWith('.svg'));results.interactions.push('Poster download '+i);}
  await page.getByRole('button',{name:/Copy Website Link|Copy Link/}).click();
  // Mobile menu and dropdown links.
  await page.setViewportSize({width:390,height:844}); await go('/'); await page.locator('nav > div > button').click();
  for(const label of ['Home','Our Mission','Management','Impact Stories','Direct Impact Areas','Events','We Identify','We Fund','We Follow Through']) assert(await page.locator('nav').getByRole('link',{name:label,exact:true}).isVisible(),label+' missing from mobile menu');
  await page.locator('nav').getByRole('link',{name:'Events',exact:true}).click();await page.waitForURL(origin+'/events'); results.interactions.push('Mobile menu navigation');
  for(const asset of ['/sitemap.xml','/robots.txt','/favicon-32x32.png','/site.webmanifest']) assert.equal((await context.request.get(origin+asset)).status(),200);
  assert.equal(results.errors.length,0,JSON.stringify(results.errors));
} finally {
  writeFileSync('/tmp/funded-audit/results.json',JSON.stringify(results,null,2));
  await browser.close();
}
console.log(JSON.stringify({pages:results.pages.length, interactions:results.interactions.length,forms:results.forms,errors:results.errors},null,2));
