import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
const {chromium}=await import(process.env.AUDIT_PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({args:['--no-sandbox']});
const context=await browser.newContext();
await context.addInitScript(()=>localStorage.setItem('analyticsConsent','rejected'));
await context.route('https://script.google.com/**',r=>r.fulfill({status:200,body:'ok'}));
await context.route('https://**',r=>r.abort());
await context.route('**/*.mp4',r=>r.abort());
let page=await context.newPage();page.setDefaultTimeout(3500);
const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.dismiss());
page.on('popup',p=>p.close());
const routes=[...readFileSync('src/App.tsx','utf8').matchAll(/<Route path="([^"]+)"/g)].map(m=>m[1]);
const checks=process.env.AUDIT_RESUME && existsSync('/tmp/funded-audit/interactions.json') ? JSON.parse(readFileSync('/tmp/funded-audit/interactions.json','utf8')).checks : [];
async function targets(){return page.evaluate(()=>{
  return [...document.querySelectorAll('a,button,div,p')].filter(el=>{
    const propsKey=Object.keys(el).find(k=>k.startsWith('__reactProps'));
    const clickable=el.matches('a,button') || (propsKey && typeof el[propsKey]?.onClick==='function');
    return clickable && el.getBoundingClientRect().width && el.getBoundingClientRect().height && getComputedStyle(el).visibility!=='hidden' && !el.disabled;
  }).map((el,i)=>{el.setAttribute('data-audit',String(i));return {id:i,tag:el.tagName,label:(el.getAttribute('aria-label')||el.textContent||'icon').trim().replace(/\s+/g,' ').slice(0,90),href:el.getAttribute('href')};});
});}
try{
 for(const width of (process.env.AUDIT_WIDTH ? [Number(process.env.AUDIT_WIDTH)] : [1440,390])){
  await page.setViewportSize({width,height:900});
  for(const path of (process.env.AUDIT_PATH_START ? routes.slice(routes.indexOf(process.env.AUDIT_PATH_START)) : routes)){
   await page.goto('http://localhost:3000'+path,{waitUntil:'domcontentloaded'}).catch(() => page.goto('http://localhost:3000'+path,{waitUntil:'domcontentloaded'}));await page.waitForTimeout(100);const items=await targets();
   for(const item of items){
    await page.goto('http://localhost:3000'+path,{waitUntil:'domcontentloaded'}).catch(() => page.goto('http://localhost:3000'+path,{waitUntil:'domcontentloaded'}));await page.waitForTimeout(100);await targets();
    const locator=page.locator(`[data-audit="${item.id}"]`);
    try{
     await locator.click();await page.waitForTimeout(100);
     if(item.href?.startsWith('/') && !item.href.includes('#')) assert.equal(new URL(page.url()).pathname,item.href);
     checks.push({width,path,...item,result:'clicked',destination:new URL(page.url()).pathname});
    }catch(error){checks.push({width,path,...item,result:'failed',reason:error.message.slice(0,300)});}
   }
   writeFileSync('/tmp/funded-audit/interactions.json',JSON.stringify({checks,errors},null,2));
   console.log(`${width} ${path}: ${items.length} controls checked`);
   await page.close(); page=await context.newPage(); page.setDefaultTimeout(3500); page.on('pageerror',e=>errors.push(e.message)); page.on('dialog',d=>d.dismiss()); page.on('popup',p=>p.close());
  }
 }
 writeFileSync('/tmp/funded-audit/interactions.json',JSON.stringify({checks,errors},null,2));
 const failures=checks.filter(c=>c.result==='failed');assert.equal(failures.length,0,JSON.stringify(failures));assert.equal(errors.length,0,JSON.stringify(errors));
 console.log(`PASS: ${checks.length} interactions, no runtime errors.`);
}finally{await browser.close();}
