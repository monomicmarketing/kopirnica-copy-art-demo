const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const base = process.env.BASE_URL || 'http://localhost:3116/';
const label = process.env.QA_LABEL || 'after-interactions';
const out = `qa-shots/${label}`;
const pause = ms => new Promise(resolve => setTimeout(resolve,ms));

(async () => {
  fs.mkdirSync(out,{recursive:true});
  const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'});
  const page = await browser.newPage({viewport:{width:375,height:812}});
  const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('requestfailed',r=>failed.push(`${r.url()}: ${r.failure()?.errorText}`));
  const response=await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(response.status(),200);
  const clip=()=>page.locator('.poster-output').evaluate(e=>getComputedStyle(e).clipPath);
  const replay=page.getByRole('button',{name:'Ponovi ispis'});
  const report={};
  await page.evaluate(()=>document.fonts.ready);
  report.fonts=await page.evaluate(()=>({archivo:document.fonts.check('20px "Archivo Black"'),outfit:document.fonts.check('20px Outfit'),viewport:document.querySelector('meta[name="viewport"]')?.content}));
  await page.waitForTimeout(5200);
  report.initialFinal=await clip();assert.match(report.initialFinal,/0%\)/);
  report.replays=[];
  for(let i=0;i<3;i++){
    await replay.click();
    await page.waitForTimeout(70);
    const start=await clip();
    if(i===0)await page.screenshot({path:`${out}/replay-start-375.png`});
    await page.waitForTimeout(2300);
    const mid=await clip();
    if(i===0)await page.screenshot({path:`${out}/replay-mid-375.png`});
    await page.waitForTimeout(3000);
    const end=await clip();
    if(i===0)await page.screenshot({path:`${out}/replay-final-375.png`});
    assert.match(start,/100%\)/);assert.notEqual(mid,start);assert.match(end,/0%\)/);
    report.replays.push({start,mid,end});
  }
  for(let i=0;i<6;i++){await replay.click();await page.waitForTimeout(35)}
  report.rapidStart=await clip();await page.waitForTimeout(5300);report.rapidFinal=await clip();assert.match(report.rapidFinal,/0%\)/);
  await replay.click();await page.waitForTimeout(900);
  const other=await browser.newPage();await other.goto('about:blank');await other.bringToFront();await pause(700);await page.bringToFront();await page.waitForTimeout(4400);
  report.tabReturn=await clip();assert.match(report.tabReturn,/0%\)/);await other.close();
  await replay.click();await page.waitForTimeout(900);await page.setViewportSize({width:430,height:812});await page.waitForTimeout(4500);
  report.resizeFinal=await clip();assert.match(report.resizeFinal,/0%\)/);
  await page.setViewportSize({width:375,height:812});
  const menu=page.getByRole('button',{name:'Otvori meni'});
  await menu.focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
  report.menuFocus=await page.locator('.menu-toggle').evaluate(e=>getComputedStyle(e).outlineStyle);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
  report.escapeFocus=await page.evaluate(()=>document.activeElement?.getAttribute('aria-label'));
  assert.equal(report.escapeFocus,'Otvori meni');
  await menu.click();await page.getByRole('link',{name:'Kako do ispisa'}).click();
  report.anchor={hash:new URL(page.url()).hash,expanded:await page.locator('.menu-toggle').getAttribute('aria-expanded')};
  assert.equal(report.anchor.hash,'#kako-do-ispisa');assert.equal(report.anchor.expanded,'false');
  await menu.click();await page.setViewportSize({width:1024,height:812});await page.setViewportSize({width:375,height:812});
  report.resizeMenu=await page.locator('.menu-toggle').getAttribute('aria-expanded');assert.equal(report.resizeMenu,'false');
  report.dock=[];
  for(const y of [0,700,1800,99999]){
    await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(120);
    report.dock.push(await page.evaluate(()=>{const d=document.querySelector('.mobile-dock').getBoundingClientRect();const f=document.querySelector('.footer-bottom').getBoundingClientRect();return {top:d.top,bottom:d.bottom,viewport:innerHeight,position:getComputedStyle(document.querySelector('.mobile-dock')).position,footerBottom:f.bottom,scrollY};}));
  }
  assert.ok(report.dock.every(x=>x.position==='fixed'&&Math.abs(x.bottom-x.viewport)<1));
  assert.ok(report.dock.at(-1).footerBottom<=report.dock.at(-1).top);
  report.links=await page.evaluate(()=>({phones:[...document.querySelectorAll('a[href^="tel:"]')].map(x=>x.getAttribute('href')),maps:[...document.querySelectorAll('a[href*="google.com/maps"]')].map(x=>x.getAttribute('href')),anchors:[...document.querySelectorAll('a[href^="#"]')].map(x=>({href:x.getAttribute('href'),exists:!!document.querySelector(x.getAttribute('href'))}))}));
  assert.ok(report.links.phones.every(x=>x==='tel:+38761207687'));
  assert.ok(report.links.maps.every(x=>x.includes('COPY%20Art')&&x.includes('Terezija')));
  assert.ok(report.links.anchors.every(x=>x.exists));
  report.errors=errors;report.failed=failed;assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  const reduced=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});
  await reduced.goto(base,{waitUntil:'networkidle'});
  report.reduced=await reduced.locator('.poster-output').evaluate(e=>({clip:getComputedStyle(e).clipPath,duration:getComputedStyle(e).animationDuration}));
  assert.match(report.reduced.clip,/0%\)/);
  await reduced.getByRole('button',{name:'Ponovi ispis'}).click();await reduced.waitForTimeout(100);
  report.reducedReplay=await reduced.locator('.poster-output').evaluate(e=>getComputedStyle(e).clipPath);assert.match(report.reducedReplay,/0%\)/);
  await reduced.screenshot({path:`${out}/reduced-375.png`});await reduced.close();
  const zoom=await browser.newPage({viewport:{width:188,height:812}});await zoom.goto(base,{waitUntil:'networkidle'});await zoom.waitForTimeout(5200);
  report.zoom=await zoom.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,title:document.querySelector('.hero h1').getBoundingClientRect().toJSON(),phone:document.querySelector('.phone-link').getBoundingClientRect().toJSON(),heroNote:document.querySelector('.hero-bottom span').getBoundingClientRect().toJSON(),heroLink:document.querySelector('.hero-bottom a').getBoundingClientRect().toJSON()}));
  assert.equal(report.zoom.scrollWidth,report.zoom.viewport);
  assert.ok(report.zoom.heroNote.bottom < report.zoom.heroLink.top);
  await zoom.screenshot({path:`${out}/narrow-188.png`,fullPage:true});await zoom.close();
  fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
