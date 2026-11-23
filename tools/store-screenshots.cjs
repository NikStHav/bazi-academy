// Generates the store screenshots: serve www/ on localhost:8097, then run:
//   node tools/store-screenshots.cjs store-screenshots [langs, e.g. en,de,es]
const { chromium } = require('playwright');
const fs = require('fs');
const out = process.argv[2];
const SETS = [['ios-6.9in', 440, 956], ['ios-6.5in', 414, 896], ['android-phone', 360, 640]];
const SHOTS = [
  ['1-day-card', '#/today', (d) => d.querySelector('#daycard')],
  ['2-chart', '#/chart/a', null],
  ['3-day-pillar', '#/chart/a', (d) => [...d.querySelectorAll('h3')].find((h) => h.textContent.includes('日柱'))],
  ['4-reading', '#/chart/a', (d) => d.querySelector('.reading')],
  ['5-lesson', '#/lesson/elements', (d) => d.querySelector('[data-widget="elements"]')],
  ['6-today-clock', '#/today', (d) => d.querySelector('.clock')?.closest('.card')],
  ['7-lunar-calendar', '#/calendar/2027-02', null],
  ['8-compatibility', '#/match/a', (d) => d.querySelector('.ring')?.closest('.card')],
  ['9-life-timeline', '#/timeline/a', (d) => d.querySelector('.tl-now')],
];
(async () => {
  const b = await chromium.launch();
  const LANG_LIST = (process.argv[3] || 'en,de,es').split(',');
  for (const lang of LANG_LIST) for (const [dir, w, h] of SETS) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, colorScheme: 'light', timezoneId: 'Europe/Berlin' });
    await ctx.addInitScript((l) => { localStorage.setItem('bazi.lang', l); localStorage.setItem('bazi.onboarded', 'true');
      const n = new Date(); localStorage.setItem('bazi.settings', JSON.stringify({ ziHourNextDay: true, dayCard: `${n.getFullYear()}-${n.getMonth() + 1}-${n.getDate()}` }));
      localStorage.setItem('bazi.done', JSON.stringify({ intro: true, yinyang: true, elements: true }));
      localStorage.setItem('bazi.charts', JSON.stringify([
        { id: 'a', name: l === 'es' ? 'Lucía' : 'Mei', mine: true, group: 'family', input: { year: 1992, month: 3, day: 18, hour: 9, minute: 40, tzOffset: 1, gender: 'f', longitude: l === 'es' ? -3.7 : 8.68, place: l === 'es' ? { name: 'Madrid', cc: 'ES', lat: 40.42, lon: -3.70, tz: 'Europe/Madrid' } : { name: 'Frankfurt am Main', cc: 'DE', lat: 50.12, lon: 8.68, tz: 'Europe/Berlin' } } },
        { id: 'b', name: l === 'es' ? 'Mateo' : 'Jonas', mine: false, group: 'partner', input: { year: 1989, month: 11, day: 2, hour: 22, minute: 15, tzOffset: 1, gender: 'm' } }])); }, lang);
    const p = await ctx.newPage();
    const dirPath = `${out}/${lang}/${dir}`; fs.mkdirSync(dirPath, { recursive: true });
    for (const [n, r, sel] of SHOTS) {
      await p.goto('http://localhost:8097/index.html' + r); await p.waitForTimeout(400);
      if (sel) await p.evaluate(`(${sel.toString()})(document)?.scrollIntoView({ block: 'start' })`);
      if (n === '1-day-card') await p.evaluate(() => { // keep the wheel and the start of the result in view
        const r = document.querySelector('.dc-title').getBoundingClientRect(), need = r.bottom + 90 - innerHeight;
        if (need > 0) scrollBy(0, need);
      });
      await p.waitForTimeout(150);
      await p.screenshot({ path: `${dirPath}/${n}.png` });
    }
    await ctx.close();
  }
  await b.close();
})();
