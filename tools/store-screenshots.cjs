// Generates the store screenshots: serve www/ on localhost:8097, then run: node tools/store-screenshots.cjs store-screenshots
const { chromium } = require('playwright');
const fs = require('fs');
const out = process.argv[2];
const SETS = [['ios-6.9in', 440, 956], ['ios-6.5in', 414, 896], ['android-phone', 360, 640]];
const SHOTS = [
  ['1-chart', '#/chart/a', null],
  ['2-day-pillar', '#/chart/a', (d) => [...d.querySelectorAll('h3')].find((h) => h.textContent.includes('日柱'))],
  ['3-reading', '#/chart/a', (d) => d.querySelector('.reading')],
  ['4-today-clock', '#/today', (d) => d.querySelector('.clock')?.closest('.card')],
  ['5-lunar-calendar', '#/calendar/2027-02', null],
  ['6-compatibility', '#/match/a', (d) => d.querySelector('.ring')?.closest('.card')],
  ['7-life-timeline', '#/timeline/a', (d) => d.querySelector('.tl-now')],
  ['8-lesson', '#/lesson/elements', (d) => d.querySelector('[data-widget="elements"]')],
];
(async () => {
  const b = await chromium.launch();
  for (const lang of ['en', 'de']) for (const [dir, w, h] of SETS) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: 'light', timezoneId: 'Europe/Berlin' });
    await ctx.addInitScript((l) => { localStorage.setItem('bazi.lang', l); localStorage.setItem('bazi.onboarded', 'true');
      localStorage.setItem('bazi.done', JSON.stringify({ intro: true, yinyang: true, elements: true }));
      localStorage.setItem('bazi.charts', JSON.stringify([
        { id: 'a', name: 'Mei', mine: true, group: 'family', input: { year: 1992, month: 3, day: 18, hour: 9, minute: 40, tzOffset: 1, gender: 'f', longitude: 8.68, place: { name: 'Frankfurt am Main', cc: 'DE', lat: 50.12, lon: 8.68, tz: 'Europe/Berlin' } } },
        { id: 'b', name: 'Jonas', mine: false, group: 'partner', input: { year: 1989, month: 11, day: 2, hour: 22, minute: 15, tzOffset: 1, gender: 'm' } }])); }, lang);
    const p = await ctx.newPage();
    const dirPath = `${out}/${lang}/${dir}`; fs.mkdirSync(dirPath, { recursive: true });
    for (const [n, r, sel] of SHOTS) {
      await p.goto('http://localhost:8097/index.html' + r); await p.waitForTimeout(400);
      if (sel) await p.evaluate(`(${sel.toString()})(document)?.scrollIntoView({ block: 'start' })`);
      await p.waitForTimeout(150);
      await p.screenshot({ path: `${dirPath}/${n}.png` });
    }
    await ctx.close();
  }
  await b.close();
})();
