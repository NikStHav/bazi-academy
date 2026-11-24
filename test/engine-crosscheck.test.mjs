// The chart engine checked against reference charts and against an independent engine:
// 6tail lunar-javascript (MIT, widely used by Chinese calendar apps and BaZi calculators). It is a dev dependency
// only – the app ships its own engine (VSOP87 solar terms) and works offline.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { computeChart, jieTermsOfYear } from '../www/js/bazi.js';
import { STEMS, BRANCHES } from '../www/js/data.js';

const name = (p) => STEMS[p.stem].zh + BRANCHES[p.branch].zh;
const pillars = (c) => [c.pillars.year, c.pillars.month, c.pillars.day, c.pillars.hour].map(name).join(' ');

// Edge cases: Li Chun, a Jie boundary, midnight, both Zi-hour conventions and daylight saving time
// (Germany 1947 double summer time and 1985, Korea 1955 and 1988, Sydney in January). Expected pillars from
// lunar-javascript, fed with the same instant (year, month) and the same standard local time (day, hour).
const REFERENCE = [
  ["Li Chun 1984, 10 min before (Beijing)", {"year": 1984, "month": 2, "day": 4, "hour": 23, "minute": 9, "tzOffset": 8, "stdOffset": 8, "ziHourNextDay": true}, "癸亥 乙丑 己巳 甲子"],
  ["Li Chun 1984, 10 min after, Zi hour (Beijing)", {"year": 1984, "month": 2, "day": 4, "hour": 23, "minute": 30, "tzOffset": 8, "stdOffset": 8, "ziHourNextDay": true}, "甲子 丙寅 己巳 甲子"],
  ["Li Chun 2024, before (Beijing)", {"year": 2024, "month": 2, "day": 4, "hour": 16, "minute": 20, "tzOffset": 8, "stdOffset": 8, "ziHourNextDay": true}, "癸卯 乙丑 戊戌 庚申"],
  ["Li Chun 2024, after (Beijing)", {"year": 2024, "month": 2, "day": 4, "hour": 16, "minute": 35, "tzOffset": 8, "stdOffset": 8, "ziHourNextDay": true}, "甲辰 丙寅 戊戌 庚申"],
  ["Jing Zhe 2023, before (Beijing)", {"year": 2023, "month": 3, "day": 6, "hour": 4, "minute": 30, "tzOffset": 8, "stdOffset": 8, "ziHourNextDay": true}, "癸卯 甲寅 癸亥 甲寅"],
  ["Jing Zhe 2023, after (Beijing)", {"year": 2023, "month": 3, "day": 6, "hour": 4, "minute": 45, "tzOffset": 8, "stdOffset": 8, "ziHourNextDay": true}, "癸卯 乙卯 癸亥 甲寅"],
  ["Millennium midnight (Beijing)", {"year": 2000, "month": 1, "day": 1, "hour": 0, "minute": 0, "tzOffset": 8, "stdOffset": 8, "ziHourNextDay": true}, "己卯 丙子 戊午 壬子"],
  ["23:30, early Zi – day changes (Beijing)", {"year": 1990, "month": 6, "day": 15, "hour": 23, "minute": 30, "tzOffset": 8, "stdOffset": 8, "ziHourNextDay": true}, "庚午 壬午 壬子 庚子"],
  ["23:30, late Zi – day stays (Beijing)", {"year": 1990, "month": 6, "day": 15, "hour": 23, "minute": 30, "tzOffset": 8, "stdOffset": 8, "ziHourNextDay": false}, "庚午 壬午 辛亥 庚子"],
  ["00:30 (Beijing)", {"year": 1990, "month": 6, "day": 16, "hour": 0, "minute": 30, "tzOffset": 8, "stdOffset": 8, "ziHourNextDay": true}, "庚午 壬午 壬子 庚子"],
  ["Berlin 1947 double summer time, 14:00 clock", {"year": 1947, "month": 6, "day": 1, "hour": 14, "minute": 0, "tzOffset": 3, "stdOffset": 1, "ziHourNextDay": true}, "丁亥 乙巳 辛亥 甲午"],
  ["Berlin 1985 summer time, 09:30 clock", {"year": 1985, "month": 7, "day": 10, "hour": 9, "minute": 30, "tzOffset": 2, "stdOffset": 1, "ziHourNextDay": true}, "乙丑 癸未 庚戌 庚辰"],
  ["Seoul 1988 summer time, 09:30 clock", {"year": 1988, "month": 7, "day": 1, "hour": 9, "minute": 30, "tzOffset": 10, "stdOffset": 9, "ziHourNextDay": true}, "戊辰 戊午 丁巳 甲辰"],
  ["Seoul 1955 summer time (UTC+9:30), 11:15 clock", {"year": 1955, "month": 7, "day": 1, "hour": 11, "minute": 15, "tzOffset": 9.5, "stdOffset": 8.5, "ziHourNextDay": true}, "乙未 壬午 癸亥 丁巳"],
  ["Sydney 1995 summer time (January), 13:30 clock", {"year": 1995, "month": 1, "day": 10, "hour": 13, "minute": 30, "tzOffset": 11, "stdOffset": 10, "ziHourNextDay": true}, "甲戌 丁丑 辛丑 甲午"],
];

test('reference charts: Li Chun, Jie boundaries, Zi hour and daylight saving time', () => {
  assert.ok(REFERENCE.length >= 10);
  for (const [label, input, expect] of REFERENCE) assert.equal(pillars(computeChart({ ...input, gender: 'm' })), expect, label);
});

test('daylight saving is removed for the hour pillar when the standard offset is known', () => {
  const clock = computeChart({ year: 1947, month: 6, day: 1, hour: 14, minute: 0, tzOffset: 3, gender: 'm' });
  const std = computeChart({ year: 1947, month: 6, day: 1, hour: 14, minute: 0, tzOffset: 3, stdOffset: 1, gender: 'm' });
  assert.equal(BRANCHES[clock.pillars.hour.branch].zh, '未'); // 14:00 clock time
  assert.equal(BRANCHES[std.pillars.hour.branch].zh, '午');   // 12:00 standard time
});

let Solar = null;
try { ({ Solar } = createRequire(import.meta.url)('lunar-javascript')); } catch { /* dev dependency not installed */ }

test('agrees with lunar-javascript on thousands of charts and luck pillars', { skip: !Solar && 'lunar-javascript not installed' }, () => {
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const ours = (y, m, d, h, mi, zi) => pillars(computeChart({ year: y, month: m, day: d, hour: h, minute: mi, tzOffset: 8, gender: 'm', ziHourNextDay: zi }));
  const theirs = (y, m, d, h, mi, zi) => { const e = Solar.fromYmdHms(y, m, d, h, mi, 0).getLunar().getEightChar(); e.setSect(zi ? 1 : 2);
    return [e.getYear(), e.getMonth(), e.getDay(), e.getTime()].join(' '); };
  const terms = [];
  for (let y = 1899; y <= 2101; y++) for (const t of jieTermsOfYear(y)) terms.push(t.ms);
  const nearTerm = (ms) => terms.some((t) => Math.abs(t - ms) < 2 * 60e3); // within 2 min of a solar term
  const dates = [];
  for (let i = 0; i < 6000; i++) dates.push([Date.UTC(1900, 0, 1) + rnd() * (Date.UTC(2100, 0, 1) - Date.UTC(1900, 0, 1)), rnd() < 0.5]);
  for (const t of terms.filter((x, i) => i % 3 === 0)) for (const off of [-3, 3]) dates.push([t + 8 * 3600e3 + off * 60e3, true]);
  for (let i = 0; i < 200; i++) for (const [h, mi] of [[22, 59], [23, 0], [23, 30], [0, 0], [0, 59]]) for (const zi of [true, false])
    dates.push([Date.UTC(1960, 0, 1 + i * 53, h, mi), zi]);
  let differ = 0;
  for (const [t, zi] of dates) {
    const dt = new Date(t);
    const args = [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate(), dt.getUTCHours(), dt.getUTCMinutes(), zi];
    const a = ours(...args), b = theirs(...args);
    if (a === b) continue;
    differ++;
    // The only accepted differences: births within two minutes of a solar term, where the two
    // astronomical models (full VSOP87 here, a shorter series there) can disagree by about a minute.
    assert.ok(nearTerm(t - 8 * 3600e3) && a.split(' ').slice(2).join() === b.split(' ').slice(2).join(), `${args.join('-')}: ${a} vs ${b}`);
  }
  assert.ok(differ <= 3, `${differ} differences near solar terms`);
  for (let i = 0; i < 600; i++) {
    const dt = new Date(Date.UTC(1920, 0, 1) + rnd() * (Date.UTC(2060, 0, 1) - Date.UTC(1920, 0, 1)));
    const [y, m, d, h, mi] = [dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate(), dt.getUTCHours(), dt.getUTCMinutes()];
    for (const g of ['m', 'f']) {
      const c = computeChart({ year: y, month: m, day: d, hour: h, minute: mi, tzOffset: 8, gender: g });
      const yun = Solar.fromYmdHms(y, m, d, h, mi, 0).getLunar().getEightChar().getYun(g === 'm' ? 1 : 0);
      assert.equal(name(c.luck.pillars[0]), yun.getDaYun()[1].getGanZhi(), `luck ${y}-${m}-${d} ${g}`);
      assert.ok(Math.abs(c.luck.startYears * 12 + c.luck.startMonths - (yun.getStartYear() * 12 + yun.getStartMonth())) <= 1, `start age ${y}-${m}-${d} ${g}`);
    }
  }
});
