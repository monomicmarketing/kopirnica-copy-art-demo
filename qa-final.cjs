const { chromium } = require('playwright');
const fs = require('node:fs');

const base = process.env.BASE_URL || 'https://kopirnica-copy-art-demo.vercel.app/';
const label = process.env.QA_LABEL || 'before-final';
const out = `qa-shots/${label}`;
const widths = process.env.QA_WIDTHS ? process.env.QA_WIDTHS.split(',').map(Number) : [320,360,375,390,430,600,768,1024,1440,1920];

(async () => {
  fs.mkdirSync(out,{recursive:true});
  const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'});
  const report=[];
  for(const width of widths){
    const page=await browser.newPage({viewport:{width,height:812},deviceScaleFactor:1});
    const errors=[];
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    page.on('pageerror',e=>errors.push(e.message));
    const response=await page.goto(base,{waitUntil:'networkidle'});
    if(width===375){
      await page.screenshot({path:`${out}/start-375.png`});
      await page.waitForTimeout(2300);
      await page.screenshot({path:`${out}/mid-375.png`});
    }
    await page.waitForTimeout(width===375?3500:5500);
    const data=await page.evaluate(() => {
      const b=s=>document.querySelector(s)?.getBoundingClientRect().toJSON();
      const paper=document.querySelector('.poster-output');
      return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
        title:b('.hero h1'),buttons:b('.hero-buttons'),art:b('.hero-art'),printer:b('.printer-body'),slot:b('.printer-slot'),mask:b('.poster-mask'),paper:b('.poster-output'),posterText:b('.poster-ink strong'),posterClip:getComputedStyle(paper).clipPath,
        cardTitles:[...document.querySelectorAll('.paper-content h3')].map(e=>({text:e.innerText,box:e.getBoundingClientRect().toJSON()})),dock:b('.mobile-dock'),dockPosition:getComputedStyle(document.querySelector('.mobile-dock')).position,footer:b('.footer'),robots:document.querySelector('meta[name="robots"]')?.content};
    });
    data.http=response.status();data.errors=errors;report.push(data);
    if([320,375,600,768,1024,1440,1920].includes(width))await page.screenshot({path:`${out}/full-${width}.png`,fullPage:true});
    await page.close();
  }
  fs.writeFileSync(`${out}/report.json`,JSON.stringify(report,null,2));
  console.log(JSON.stringify(report.map(x=>({width:x.width,http:x.http,overflow:x.scrollWidth-x.width,printerTop:x.printer.top,paperTop:x.paper.top,paperBottom:x.paper.bottom,slotBottom:x.slot.bottom,posterClip:x.posterClip,dockPosition:x.dockPosition,errors:x.errors})),null,2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
