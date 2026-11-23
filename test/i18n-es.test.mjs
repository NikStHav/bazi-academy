// Spanish: every content pack must match the English structure exactly.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { LESSONS_1 } from '../www/js/i18n/lessons-es-1.js';
import { LESSONS_2 } from '../www/js/i18n/lessons-es-2.js';
import { LESSONS } from '../www/js/lessons.js';
import * as DATA from '../www/js/i18n/es-data.js';
import * as MISC from '../www/js/i18n/es-misc.js';
import * as DEMISC from '../www/js/i18n/de-misc.js';
import * as READ from '../www/js/i18n/es-reading.js';
import * as EXTRA from '../www/js/i18n/es-extra.js';
import { DAY_PILLARS } from '../www/js/i18n/daypillars-es.js';

const ph = (s) => (String(s).match(/\{\w+\}/g) || []).sort().join();

test('every Spanish lesson matches its English original', () => {
  const es = Object.fromEntries([...LESSONS_1, ...LESSONS_2].map((l) => [l.id, l]));
  assert.equal(Object.keys(es).length, LESSONS.length);
  for (const en of LESSONS) {
    const d = es[en.id];
    assert.ok(d, `missing Spanish lesson ${en.id}`);
    assert.equal(d.level, en.level, en.id);
    assert.equal(d.zh, en.zh, en.id);
    assert.equal(d.quiz.length, en.quiz.length, en.id);
    d.quiz.forEach((q, i) => {
      assert.equal(q.answer, en.quiz[i].answer, `${en.id} q${i}`);
      assert.equal(q.options.length, en.quiz[i].options.length, `${en.id} q${i}`);
    });
    const widgets = (s) => (s.match(/data-widget="[^"]+"/g) || []).join();
    assert.equal(widgets(d.body), widgets(en.body), `${en.id} widgets`);
  }
});

test('Spanish content packs have the English shape', () => {
  assert.equal(DATA.ELEMENTS.length, 5); assert.equal(DATA.STEMS.length, 10); assert.equal(DATA.BRANCHES.length, 12);
  assert.equal(Object.keys(DATA.TEN_GODS).length, 10); assert.equal(DATA.JIE_NAMES.length, 12);
  assert.equal(MISC.OFFICERS.length, 12); assert.equal(MISC.ACTIVITIES.length, 6);
  for (const k of ['STARS', 'MONTH_TEXT', 'ROLE', 'SOLAR_TERM_NAMES', 'FESTIVALS', 'RATING_LABEL']) {
    assert.deepEqual(Object.keys(MISC[k]).sort(), Object.keys(DEMISC[k]).sort(), k);
  }
  for (const s of Object.values(MISC.STARS)) assert.deepEqual(Object.keys(s.pillar).sort(), ['day', 'hour', 'month', 'year']);
  assert.equal(READ.ELEMENT_ADVICE.length, 5); assert.equal(READ.GROUPS.length, 5); assert.equal(READ.LACK.length, 5);
  assert.equal(READ.EXCESS.length, 5); assert.equal(Object.keys(READ.PILLAR_AREA).length, 4);
  for (const g of Object.values(READ.GOD_TEXT)) assert.deepEqual(Object.keys(g).sort(), ['career', 'luck', 'spouse', 'trait']);
  assert.equal(Object.keys(READ.GOD_TEXT).length, 10);
  assert.equal(DAY_PILLARS.length, 60); DAY_PILLARS.forEach((p) => assert.equal(p.length, 2));
  assert.equal(EXTRA.STAGES.length, 12); assert.equal(EXTRA.DEITY_NAMES.length, 12); assert.equal(EXTRA.GUIDE.length, 8);
  for (const th of Object.values(EXTRA.DAILY_THEMES)) { assert.equal(th.do.length, 3); assert.equal(th.avoid.length, 2); }
  assert.equal(Object.keys(EXTRA.DAILY_THEMES).length, 10);
});

test('every UI text has a Spanish translation with the same placeholders', async () => {
  const out = execFileSync('node', ['tools/i18n-keys.cjs', '--missing', 'es'], { encoding: 'utf8' });
  assert.deepEqual(JSON.parse(out).missing, []);
  const { UI } = await import('../www/js/i18n/es-ui.js');
  for (const [k, v] of Object.entries(UI)) assert.equal(ph(v), ph(k), k);
});

test('Spanish content modules load and render', () => {
  const out = execFileSync('node', ['--input-type=module', '-e', `
    import { computeChart } from './www/js/bazi.js';
    import { buildReading } from './www/js/reading.js';
    import { compare, idealMatch } from './www/js/compat.js';
    import { yearForecast } from './www/js/forecast.js';
    import { dailyReading } from './www/js/daily.js';
    import { makeRound } from './www/js/quiz.js';
    import { missing } from './www/js/i18n.js';
    for (let i = 0; i < 150; i++) {
      const c = computeChart({ year: 1950 + i % 70, month: 1 + i % 12, day: 1 + i % 28, hour: i % 24, minute: 0, tzOffset: 1, gender: i % 2 ? 'm' : 'f' });
      const d = computeChart({ year: 1960 + i % 50, month: 1 + (i * 7) % 12, day: 1 + (i * 3) % 28, hour: (i * 5) % 24, minute: 0, tzOffset: 1 });
      const html = buildReading(c).sections.map((s) => s.title + s.html).join('') + JSON.stringify(compare(c, d)) + JSON.stringify(yearForecast(c, 2026)) + JSON.stringify(idealMatch(c)) + JSON.stringify(dailyReading(c, new Date(2027, 0, 1 + i)));
      if (/undefined|NaN|\\{[a-z]+\\}/.test(html)) throw new Error('bad output ' + html.match(/.{60}(undefined|NaN|\\{[a-z]+\\}).{20}/)?.[0]);
      if (/Day Master|Wealth|Resource|Officer/.test(html)) throw new Error('English left ' + html.match(/.{40}(Day Master|Wealth|Resource|Officer).{20}/)?.[0]);
    }
    for (const cat of ['elements', 'stems', 'branches', 'hidden', 'tengods']) makeRound(cat, 10);
    console.log(JSON.stringify([...missing]));
  `], { encoding: 'utf8', env: { ...process.env, BAZI_LANG: 'es' } });
  assert.deepEqual(JSON.parse(out.trim()), []);
});
