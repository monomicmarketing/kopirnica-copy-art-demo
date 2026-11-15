const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const base = process.env.BASE_URL || 'http://127.0.0.1:3116/';
const label = process.env.QA_LABEL || 'printer-local';
const output = `qa-shots/${label}`;
const checkpoints = [100, 1500, 2600, 3900, 5400];

async function sample(page) {
  return page.evaluate(() => {
    const paper = document.querySelector('.poster-output');
    const ink = document.querySelector('.poster-ink');
    const mask = document.querySelector('.poster-mask');
    const slot = document.querySelector('.printer-slot');
    const paperBox = paper.getBoundingClientRect();
    const maskBox = mask.getBoundingClientRect();
    return {
      paperRatio: paperBox.height / maskBox.height,
      inkClip: getComputedStyle(ink).clipPath,
      paperTop: paperBox.top,
      paperBottom: paperBox.bottom,
      slotBottom: slot.getBoundingClientRect().bottom,
      scrollWidth: document.documentElement.scrollWidth,
      viewport: innerWidth,
    };
  });
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe' });
  const report = [];
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    const response = await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    const replay = page.getByRole('button', { name: 'Ponovi ispis' });
    await replay.click();
    const frames = [];
    let elapsed = 0;
    for (const ms of checkpoints) {
      await page.waitForTimeout(ms - elapsed);
      elapsed = ms;
      const frame = await sample(page);
      frames.push({ ms, ...frame });
      await page.screenshot({ path: `${output}/${width}-${ms}.png` });
    }
    assert.ok(frames[0].paperRatio < .03, 'paper starts inside printer');
    assert.ok(frames[1].paperRatio > .08 && frames[1].paperRatio < .4, 'blank paper begins to emerge');
    console.log('phase samples', width, frames.map(({ ms, paperRatio, inkClip }) => ({ ms, paperRatio, inkClip })));
    assert.ok(getClipEnd(frames[1].inkClip) > 85, 'first visible sheet is blank');
    assert.ok(frames[2].paperRatio > frames[1].paperRatio && frames[2].paperRatio < .8, 'sheet continues moving');
    assert.ok(getClipEnd(frames[2].inkClip) > 15 && getClipEnd(frames[2].inkClip) < 95, 'ink is partly revealed at midpoint');
    assert.ok(frames[3].paperRatio > frames[2].paperRatio, 'sheet moves farther before completion');
    assert.ok(Math.abs(frames[4].paperRatio - 1) < .02, 'paper ends fully extended');
    assert.equal(getClipEnd(frames[4].inkClip), 0, 'poster ends fully printed');
    assert.ok(frames.every(frame => frame.scrollWidth === frame.viewport), 'no horizontal overflow');
    await replay.click();
    await page.waitForTimeout(1500);
    const secondStart = await sample(page);
    assert.ok(getClipEnd(secondStart.inkClip) > 85, 'replay starts with blank paper');
    await page.waitForTimeout(4000);
    const secondEnd = await sample(page);
    assert.equal(getClipEnd(secondEnd.inkClip), 0, 'replay reaches finished poster');
    assert.deepEqual(errors, []);
    report.push({ width, frames, secondStart, secondEnd, errors });
    await page.close();
  }
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await page.goto(base, { waitUntil: 'networkidle' });
    const first = await sample(page);
    assert.ok(Math.abs(first.paperRatio - 1) < .02);
    assert.equal(getClipEnd(first.inkClip), 0);
    await page.getByRole('button', { name: 'Ponovi ispis' }).click();
    const afterReplay = await sample(page);
    assert.ok(Math.abs(afterReplay.paperRatio - 1) < .02);
    assert.equal(getClipEnd(afterReplay.inkClip), 0);
    report.push({ width, reducedMotion: { first, afterReplay } });
    await page.close();
  }
  fs.writeFileSync(`${output}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.map(item => item.frames ? { width: item.width, frames: item.frames.map(({ ms, paperRatio, inkClip }) => ({ ms, paperRatio, inkClip })), replay: item.secondEnd.inkClip, errors: item.errors } : { width: item.width, reducedMotion: item.reducedMotion.first.inkClip }), null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });

function getClipEnd(value) {
  if (value === 'none' || value === 'inset(0px)' || value === 'inset(0%)') return 0;
  const percentages = [...value.matchAll(/([\d.]+)%/g)];
  return percentages.length ? Number(percentages.at(-1)[1]) : NaN;
}
