import test from 'node:test';
import assert from 'node:assert/strict';
import { computeChart, pillarName } from '../www/js/bazi.js';
import { findStars, starBranches, voidBranches } from '../www/js/shensha.js';
import { yearForecast, baziYearOf } from '../www/js/forecast.js';
import { makeBackup, validateBackup, mergeBackup } from '../www/js/backup.js';

const mei = computeChart({ year: 1992, month: 3, day: 18, hour: 9, minute: 40, tzOffset: 8, gender: 'f' });

test('symbolic star lookups follow the classical tables', () => {
  // 1992-03-18 09:40 -> 壬申 癸卯 癸巳 丁巳; Day Master 癸
  assert.equal(['year', 'month', 'day', 'hour'].map((k) => pillarName(mei.pillars[k])).join(' '), '壬申 癸卯 癸巳 丁巳');
  const sb = starBranches(mei);
  assert.deepEqual(sb.noble, [3, 5]);         // 壬癸兔蛇藏: 卯 巳
  assert.deepEqual(sb.academic, [3]);         // 癸 -> 卯
  assert.ok(sb.peach.includes(9) && sb.peach.includes(6)); // day 巳 (巳酉丑) -> 午, year 申 (申子辰) -> 酉
  assert.deepEqual(sb.prosperity, [0]);       // 癸禄在子
  assert.deepEqual(sb.blade, []);             // Yin Day Master
  const keys = findStars(mei).map((s) => s.key);
  assert.ok(keys.includes('noble') && keys.includes('academic'));
  assert.deepEqual(findStars(mei).find((s) => s.key === 'noble').pillars, ['month', 'day', 'hour']);
});

test('void branches of the 甲子 decade are 戌亥', () => {
  assert.deepEqual(voidBranches(0), [10, 11]);
  assert.deepEqual(voidBranches(10), [8, 9]); // 甲戌旬 -> 申酉
});

test('year forecast 2026: 丙午 year, months from 庚寅', () => {
  const f = yearForecast(mei, 2026);
  assert.equal(pillarName(f.pillar), '丙午');
  assert.equal(f.months.length, 12);
  assert.equal(pillarName({ stem: f.months[0].stem, branch: f.months[0].branch }), '庚寅');
  assert.equal(pillarName({ stem: f.months[11].stem, branch: f.months[11].branch }), '辛丑');
  assert.equal(new Date(f.from + 8 * 3600000).toISOString().slice(0, 10), '2026-02-04');
  for (const m of f.months) assert.ok(m.text && m.end > m.start);
  assert.equal(f.bestMonths.length, 3);
});

test('BaZi year changes at Li Chun', () => {
  assert.equal(baziYearOf(new Date(Date.UTC(2026, 0, 20))), 2025);
  assert.equal(baziYearOf(new Date(Date.UTC(2026, 1, 10))), 2026);
});

test('backup round trip and merge', () => {
  const a = { charts: [{ id: 'x', name: 'Me', mine: true, input: { year: 1990, month: 1, day: 1 } }], done: { intro: true }, best: { stems: 5 }, settings: {} };
  const file = JSON.parse(JSON.stringify(makeBackup({ ...a, best: { stems: 8 }, charts: [...a.charts, { id: 'y', name: 'Partner', mine: true, input: { year: 1991, month: 2, day: 3 } }] })));
  validateBackup(file);
  const { state, added } = mergeBackup(a, file);
  assert.equal(added, 1);
  assert.equal(state.charts.length, 2);
  assert.equal(state.charts.filter((c) => c.mine).length, 1);
  assert.equal(state.best.stems, 8);
  assert.throws(() => validateBackup({ hello: 1 }), /not a BaZi Academy backup/);
  assert.throws(() => validateBackup({ format: 'bazi-academy-backup', charts: [{ id: 1 }] }), /damaged/);
  assert.equal(file.premium, undefined);
});

test('backup keeps the day journal and merges it without overwriting', () => {
  const st = { charts: [], done: {}, best: {}, journal: { '2026-11-01': { r: 4, s: 3, p: '丙午', n: 'mine' } } };
  const b = makeBackup(st);
  assert.deepEqual(b.journal, st.journal);
  const { state: m } = mergeBackup(st, { ...b, journal: { '2026-11-01': { r: 1 }, '2026-11-02': { r: 5, s: 2, n: 'x' }, bad: { r: 9 }, '2026-11-03': { r: 7 } } });
  assert.equal(m.journal['2026-11-01'].n, 'mine');
  assert.equal(m.journal['2026-11-02'].r, 5);
  assert.equal(Object.keys(m.journal).length, 2);
});
