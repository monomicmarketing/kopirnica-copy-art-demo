const { chromium } = require('playwright');
const fs = require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'});
 const report=[];fs.mkdirSync('qa-shots',{recursive:true});
 for(const width of [320,360,375,390,430,768,1024,1440,1920]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  const errors=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});await page.waitForTimeout(5800);
  const data=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,poster:getComputedStyle(document.querySelector('.poster-output')).transform,paperBox:document.querySelector('.poster-output').getBoundingClientRect().toJSON(),sceneBox:document.querySelector('.printer-scene').getBoundingClientRect().toJSON(),buttons:[...document.querySelectorAll('a')].filter(x=>x.href).length,robots:document.querySelector('meta[name="robots"]')?.content}));
  if([375,768,1440].includes(width))await page.screenshot({path:`qa-shots/${width}.png`,fullPage:true});
  if(width===375){await page.getByRole('button',{name:'Otvori meni'}).click();data.menuVisible=await page.getByRole('link',{name:'Kako do ispisa'}).isVisible();await page.getByRole('link',{name:'Kako do ispisa'}).click();data.menuClosed=(await page.getByRole('button',{name:'Otvori meni'}).getAttribute('aria-expanded'))==='false';await page.getByRole('button',{name:'Ponovi ispis'}).click();await page.waitForTimeout(400);data.replayEarly=await page.locator('.poster-output').evaluate(el=>getComputedStyle(el).transform);await page.waitForTimeout(5200);data.replayFinal=await page.locator('.poster-output').evaluate(el=>getComputedStyle(el).transform);await page.getByRole('button',{name:'Ponovi ispis'}).click();data.replayTwice=true;}
  report.push({width,...data,errors});await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:375,height:812},reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:3000/',{waitUntil:'networkidle'});report.push({reducedMotion:await reduced.locator('.poster-output').evaluate(el=>({transform:getComputedStyle(el).transform,duration:getComputedStyle(el).animationDuration})),ink:await reduced.locator('.poster-ink strong').evaluate(el=>getComputedStyle(el).opacity)});await reduced.close();
 console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
