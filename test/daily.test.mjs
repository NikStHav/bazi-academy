import test from 'node:test';
import assert from 'node:assert/strict';
import { computeChart, pillarsForNow, cycleIndex } from '../www/js/bazi.js';
import { dailyReading, starsOf, sectorElement } from '../www/js/daily.js';
import { STEMS } from '../www/js/data.js';

const chart = computeChart({ year: 1992, month: 3, day: 18, hour: 9, minute: 40, tzOffset: 1, gender: 'f' });

test('the wheel lands on the real day pillar and the reading is deterministic', () => {
  for (let i = 0; i < 120; i++) {
    const d = new Date(2027, 0, 1 + i, 12);
    const p = pillarsForNow(d).day;
    const a = dailyReading(chart, d), b = dailyReading(chart, d);
    assert.equal(a.index, cycleIndex(p.stem, p.branch));
    assert.deepEqual(a, b);
    assert.ok(a.stars >= 1 && a.stars <= 5);
    assert.equal(a.theme.do.length, 3); assert.equal(a.theme.avoid.length, 2);
    assert.ok(a.theme.do.every(Boolean) && a.theme.avoid.every(Boolean));
    assert.ok(a.favourable.includes(a.lucky.el));
    assert.ok(a.hours.every((h) => h.lucky));
  }
});

test('all ten themes are reached and stars cover the range', () => {
  const gods = new Set(), stars = new Set();
  for (let i = 0; i < 60; i++) { const r = dailyReading(chart, new Date(2027, 2, 1 + i, 12)); gods.add(r.god); stars.add(r.stars); }
  assert.equal(gods.size, 10);
  assert.ok(stars.size >= 3);
  assert.deepEqual([3, 2, 1, 0, -1, -2].map(starsOf), [5, 5, 4, 3, 2, 1]);
});

test('reading without a chart uses the almanac only', () => {
  const r = dailyReading(null, new Date(2027, 5, 1, 12));
  assert.equal(r.personal, false);
  assert.ok(r.theme.do.length >= 1 && r.stars >= 2 && r.stars <= 5);
  assert.equal(sectorElement(0), STEMS[0].el);
});
