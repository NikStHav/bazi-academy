import test from 'node:test';
import assert from 'node:assert/strict';
import { computeChart, pillarName } from '../www/js/bazi.js';
import { dayInfo, findDays, OFFICERS } from '../www/js/almanac.js';
import { compare, branchRelation } from '../www/js/compat.js';

test('day officer: 建 when day branch equals month branch', () => {
  // 2024-02-10 is 甲辰 day in the 丙寅 month -> 辰 - 寅 = 2 -> 满 Full
  const i = dayInfo(2024, 2, 10);
  assert.equal(pillarName(i.pillars.day), '甲辰');
  assert.equal(i.officer.zh, '满');
  // 2024-02-08 is 壬寅 day in 寅 month -> 建
  assert.equal(dayInfo(2024, 2, 8).officer.zh, '建');
});

test('officers cycle through all 12 within a month', () => {
  const seen = new Set();
  for (let d = 6; d < 30; d++) seen.add(dayInfo(2025, 3, d).officerIdx);
  assert.equal(seen.size, 12);
  assert.equal(OFFICERS.length, 12);
});

test('findDays returns only matching officers without personal clash', () => {
  const mine = computeChart({ year: 1990, month: 6, day: 15, hour: 12, minute: 0, tzOffset: 2 });
  const days = findDays('wedding', new Date(2026, 0, 1), 60, mine);
  assert.ok(days.length > 5);
  for (const d of days) { assert.ok([4, 8, 10].includes(d.officerIdx)); assert.equal(d.personalClash.length, 0); }
});

test('branch relations', () => {
  assert.equal(branchRelation(0, 1).key, 'harmony');
  assert.equal(branchRelation(0, 6).key, 'clash');
  assert.equal(branchRelation(8, 4).key, 'trine');
  assert.equal(branchRelation(0, 7).key, 'harm');
  assert.equal(branchRelation(2, 5).key, 'harm'); // 寅巳 is both harm and punishment; harm wins
  assert.equal(branchRelation(3, 3).key, 'same');
});

test('compatibility score is bounded and complete for random pairs', () => {
  for (let i = 0; i < 300; i++) {
    const r = () => computeChart({ year: 1950 + Math.floor(Math.random() * 60), month: 1 + Math.floor(Math.random() * 12), day: 1 + Math.floor(Math.random() * 28), hour: Math.floor(Math.random() * 24), minute: 0, tzOffset: 1 });
    const c = compare(r(), r());
    assert.ok(c.total >= 0 && c.total <= 100, String(c.total));
    assert.equal(c.parts.length, 4);
    for (const p of c.parts) assert.ok(p.score <= p.max && !/undefined|NaN/.test(p.note), p.note);
    for (const x of c.roles) assert.ok(!/undefined/.test(x.text));
  }
});

import { idealMatch } from '../www/js/compat.js';
test('ideal match: combining stem first, harmonious animals, clash to avoid', () => {
  const c = computeChart({ year: 1992, month: 3, day: 18, hour: 9, minute: 40, tzOffset: 8 }); // 癸 Day Master, 申 Monkey year
  const im = idealMatch(c);
  assert.equal(im.stems[0], (c.dayMaster + 5) % 10);
  const best = im.bestAnimals.map((x) => x.branch).sort((a, b) => a - b);
  assert.deepEqual(best, [0, 4, 5]); // 申: Six Harmony 巳, Three Harmony 子 辰
  assert.ok(im.avoidAnimals.some((x) => x.branch === 2)); // 寅 clashes 申
  for (const a of im.bestAnimals) for (const y of a.years) assert.equal(((y - 4) % 12 + 12) % 12, a.branch);
});

import { readFileSync } from 'node:fs';
test('vendored Capacitor core matches the installed @capacitor/core', () => {
  const vendored = readFileSync(new URL('../www/js/vendor/capacitor.js', import.meta.url), 'utf8');
  const installed = readFileSync(new URL('../node_modules/@capacitor/core/dist/capacitor.js', import.meta.url), 'utf8');
  assert.equal(vendored, installed, 'run: npm run vendor');
});

test('store builds never ship with the test unlock', () => {
  const src = readFileSync(new URL('../www/js/build-flags.js', import.meta.url), 'utf8');
  assert.match(src, /export const TEST_BUILD = false;/);
});
