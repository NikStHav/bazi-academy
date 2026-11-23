// Smoke test: load the app in Chromium the way the Android/iOS WebView sees it (a native Capacitor
// bridge without registerPlugin) and fail if any screen is blank or throws. Run: npm run smoke
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');

const root = path.join(__dirname, '..', 'www');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webmanifest': 'application/json', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0]).replace(/^\/$/, '/index.html'));
  if (!file.startsWith(root) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://localhost:${server.address().port}/index.html`;
  const browser = await chromium.launch();
  let failed = false;
  for (const [platform, uiLang] of [['android', 'en'], ['ios', 'en'], ['android', 'de'], ['ios', 'es']]) {
    const ctx = await browser.newContext({ ...devices[platform === 'ios' ? 'iPhone 15' : 'Pixel 7'] });
    await ctx.addInitScript(([pf, ul]) => {
      localStorage.setItem('bazi.lang', ul);
      window.Capacitor = { isNativePlatform: () => true, getPlatform: () => pf, PluginHeaders: [],
        nativePromise: () => Promise.reject(new Error('no native layer in smoke test')), nativeCallback: () => '1', toNative: () => {} };
      localStorage.setItem('bazi.charts', JSON.stringify([
        { id: 'a', name: 'A', mine: true, input: { year: 1992, month: 3, day: 18, hour: 9, minute: 40, tzOffset: 8, gender: 'f' } },
        { id: 'b', name: 'B', mine: false, input: { year: 1989, month: 11, day: 2, hour: 22, minute: 15, tzOffset: 1, gender: 'm' } }]));
    }, [platform, uiLang]);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    for (const route of ['#/learn', '#/lesson/intro', '#/lesson/hidden', '#/chart', '#/chart/a', '#/quiz', '#/quiz/mixed', '#/today', '#/premium', '#/match', '#/almanac', '#/about', '#/lesson/stars', '#/forecast', '#/forecast/a', '#/welcome', '#/welcome/form', '#/welcome/a', '#/calendar', '#/calendar/2026-02', '#/calendar/2023-03', '#/influences/a', '#/timeline/a', '#/influences', '#/timeline', '#/guide', '#/lesson/daymaster']) {
      await page.goto(base + route); await page.waitForTimeout(150);
      const text = (await page.locator('#view').innerText()).trim();
      if (text.length < 40) { failed = true; console.error(`✗ ${platform} ${route}: screen is blank`); }
    }
    const miss = await page.evaluate(() => [...(globalThis.__i18nMissing || [])]);
    if (uiLang !== 'en' && miss.length) { failed = true; console.error(`✗ ${platform}/${uiLang}: untranslated: ${miss.slice(0, 10).join(' | ')}`); }
    if (errors.length) { failed = true; console.error(`✗ ${platform}/${uiLang}: ${[...new Set(errors)].join('; ')}`); }
    else console.log(`✓ ${platform}/${uiLang}: all screens render without errors`);
    await ctx.close();
  }
  await browser.close(); server.close();
  process.exit(failed ? 1 : 0);
})();
