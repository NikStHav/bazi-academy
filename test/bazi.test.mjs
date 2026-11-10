import test from 'node:test';
import assert from 'node:assert/strict';
import { computeChart, pillarName, tenGod, jieTermsOfYear, cycleIndex } from '../www/js/bazi.js';

const names = (c) => ['year', 'month', 'day', 'hour'].map((k) => (c.pillars[k] ? pillarName(c.pillars[k]) : '-')).join(' ');

test('cycle index', () => {
  assert.equal(cycleIndex(0, 0), 0);   // 甲子
  assert.equal(cycleIndex(9, 11), 59); // 癸亥
  assert.equal(cycleIndex(4, 6), 54);  // 戊午
});

test('2000-01-01 12:00 Beijing', () => {
  const c = computeChart({ year: 2000, month: 1, day: 1, hour: 12, minute: 0, tzOffset: 8 });
  assert.equal(names(c), '己卯 丙子 戊午 戊午');
});

test('Chinese New Year 2024 day pillar', () => {
  const c = computeChart({ year: 2024, month: 2, day: 10, hour: 10, minute: 0, tzOffset: 8 });
  assert.equal(names(c), '甲辰 丙寅 甲辰 己巳');
});

test('Li Chun 2024 boundary (Feb 4, 16:27 Beijing)', () => {
  const before = computeChart({ year: 2024, month: 2, day: 4, hour: 16, minute: 0, tzOffset: 8 });
  const after = computeChart({ year: 2024, month: 2, day: 4, hour: 17, minute: 0, tzOffset: 8 });
  assert.equal(names(before).split(' ').slice(0, 2).join(' '), '癸卯 乙丑');
  assert.equal(names(after).split(' ').slice(0, 2).join(' '), '甲辰 丙寅');
});

test('Jie term dates 2024 within expected days', () => {
  const terms = jieTermsOfYear(2024).map((t) => new Date(t.ms + 8 * 3600000).toISOString().slice(0, 10));
  assert.deepEqual(terms, ['2024-01-06', '2024-02-04', '2024-03-05', '2024-04-04', '2024-05-05', '2024-06-05',
    '2024-07-06', '2024-08-07', '2024-09-07', '2024-10-08', '2024-11-07', '2024-12-06']);
});

test('ten gods', () => {
  assert.equal(tenGod(0, 0), 'F');
  assert.equal(tenGod(0, 1), 'RW');
  assert.equal(tenGod(0, 2), 'EG');
  assert.equal(tenGod(0, 3), 'HO');
  assert.equal(tenGod(0, 4), 'IW');
  assert.equal(tenGod(0, 5), 'DW');
  assert.equal(tenGod(0, 6), '7K');
  assert.equal(tenGod(0, 7), 'DO');
  assert.equal(tenGod(0, 8), 'IR');
  assert.equal(tenGod(0, 9), 'DR');
  assert.equal(tenGod(5, 0), 'DO'); // 己 sees 甲 as Direct Officer
});

test('late Zi hour advances the day', () => {
  const c = computeChart({ year: 2000, month: 1, day: 1, hour: 23, minute: 30, tzOffset: 8 });
  assert.equal(pillarName(c.pillars.day), '己未');
  assert.equal(pillarName(c.pillars.hour), '甲子');
  const c2 = computeChart({ year: 2000, month: 1, day: 1, hour: 23, minute: 30, tzOffset: 8, ziHourNextDay: false });
  assert.equal(pillarName(c2.pillars.day), '戊午');
});

test('luck pillars direction and start', () => {
  // 2000-01-01 is a Yin (己) year: male -> backward, female -> forward
  const m = computeChart({ year: 2000, month: 1, day: 1, hour: 12, minute: 0, tzOffset: 8, gender: 'm' });
  const f = computeChart({ year: 2000, month: 1, day: 1, hour: 12, minute: 0, tzOffset: 8, gender: 'f' });
  assert.equal(m.luck.forward, false);
  assert.equal(pillarName(m.luck.pillars[0]), '乙亥');
  assert.equal(f.luck.forward, true);
  assert.equal(pillarName(f.luck.pillars[0]), '丁丑');
  // Da Xue 1999-12-07 ~ 25 days earlier -> ~8 yrs; Xiao Han 2000-01-06 ~5 days -> ~1.7 yrs
  assert.ok(m.luck.startAge > 7.5 && m.luck.startAge < 8.6, `m start ${m.luck.startAge}`);
  assert.ok(f.luck.startAge > 1.3 && f.luck.startAge < 2.1, `f start ${f.luck.startAge}`);
});

test('time unknown gives three pillars', () => {
  const c = computeChart({ year: 1990, month: 6, day: 15, timeUnknown: true, tzOffset: 2 });
  assert.equal(c.pillars.hour, null);
  assert.equal(pillarName(c.pillars.year), '庚午');
  assert.equal(pillarName(c.pillars.month), '壬午');
});
