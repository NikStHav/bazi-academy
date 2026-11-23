import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { LESSONS_1 as LESSONS_DE_1 } from '../www/js/i18n/lessons-de-1.js';
import { LESSONS_2 as LESSONS_DE_2 } from '../www/js/i18n/lessons-de-2.js';
import { LESSONS } from '../www/js/lessons.js';

test('every German lesson matches its English original', () => {
  const de = Object.fromEntries([...LESSONS_DE_1, ...LESSONS_DE_2].map((l) => [l.id, l]));
  for (const en of LESSONS) {
    const d = de[en.id];
    assert.ok(d, `missing German lesson ${en.id}`);
    assert.equal(d.level, en.level, en.id);
    assert.equal(d.quiz.length, en.quiz.length, en.id);
    d.quiz.forEach((q, i) => {
      assert.equal(q.answer, en.quiz[i].answer, `${en.id} q${i}`);
      assert.equal(q.options.length, en.quiz[i].options.length, `${en.id} q${i}`);
    });
    const widgets = (s) => (s.match(/data-widget="[^"]+"/g) || []).join();
    assert.equal(widgets(d.body), widgets(en.body), `${en.id} widgets`);
  }
});

test('every UI text has a German translation', () => {
  const out = execFileSync('node', ['tools/i18n-keys.cjs', '--missing', 'de'], { encoding: 'utf8' });
  const r = JSON.parse(out);
  assert.deepEqual(r.missing, []);
});

test('German content modules load and render', () => {
  const out = execFileSync('node', ['--input-type=module', '-e', `
    import { computeChart } from './www/js/bazi.js';
    import { buildReading } from './www/js/reading.js';
    import { compare, idealMatch } from './www/js/compat.js';
    import { yearForecast } from './www/js/forecast.js';
    import { makeRound } from './www/js/quiz.js';
    import { missing } from './www/js/i18n.js';
    for (let i = 0; i < 150; i++) {
      const c = computeChart({ year: 1950 + i % 70, month: 1 + i % 12, day: 1 + i % 28, hour: i % 24, minute: 0, tzOffset: 1, gender: i % 2 ? 'm' : 'f' });
      const d = computeChart({ year: 1960 + i % 50, month: 1 + (i * 7) % 12, day: 1 + (i * 3) % 28, hour: (i * 5) % 24, minute: 0, tzOffset: 1 });
      const html = buildReading(c).sections.map((s) => s.title + s.html).join('') + JSON.stringify(compare(c, d)) + JSON.stringify(yearForecast(c, 2026)) + JSON.stringify(idealMatch(c));
      if (/undefined|NaN|\{[a-z]+\}/.test(html)) throw new Error('bad output ' + html.match(/.{60}(undefined|NaN|\{[a-z]+\}).{20}/)?.[0]);
    }
    for (const cat of ['elements', 'stems', 'branches', 'hidden', 'tengods']) makeRound(cat, 10);
    console.log(JSON.stringify([...missing]));
  `], { encoding: 'utf8', env: { ...process.env, BAZI_LANG: 'de' } });
  assert.deepEqual(JSON.parse(out.trim()), []);
});
