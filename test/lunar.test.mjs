import test from 'node:test';
import assert from 'node:assert/strict';
import { moonEvents, solarTermsBetween, lunarDate, dayEvents, moonAge } from '../www/js/lunar.js';

const near = (ms, iso, minutes = 5) => assert.ok(Math.abs(ms - Date.parse(iso)) < minutes * 60000, `${new Date(ms).toISOString()} vs ${iso}`);

test('new and full moons match published times', () => {
  const ev = (y, m, type) => moonEvents(Date.UTC(y, m - 1, 1), Date.UTC(y, m, 1)).filter((e) => e.type === type);
  near(ev(2024, 4, 'new')[0].ms, '2024-04-08T18:21Z');   // total solar eclipse
  near(ev(2024, 9, 'full')[0].ms, '2024-09-18T02:34Z');
  near(ev(2025, 3, 'full')[0].ms, '2025-03-14T06:55Z');  // total lunar eclipse
  near(ev(2000, 1, 'new')[0].ms, '2000-01-06T18:14Z');
});

test('equinoxes and solstices', () => {
  const t = solarTermsBetween(Date.UTC(2025, 0, 1), Date.UTC(2026, 0, 1));
  assert.equal(t.length, 24);
  near(t.find((x) => x.zh === '春分').ms, '2025-03-20T09:01Z', 2);
  near(t.find((x) => x.zh === '夏至').ms, '2025-06-21T02:42Z', 2);
  near(t.find((x) => x.zh === '秋分').ms, '2025-09-22T18:19Z', 2);
  near(t.find((x) => x.zh === '冬至').ms, '2025-12-21T15:03Z', 2);
});

test('Chinese New Year dates', () => {
  for (const [y, m, d] of [[2020, 1, 25], [2023, 1, 22], [2024, 2, 10], [2025, 1, 29], [2026, 2, 17], [2027, 2, 6], [2030, 2, 3]]) {
    const l = lunarDate(y, m, d);
    assert.deepEqual([l.month, l.day, l.leap, l.year], [1, 1, false, y], `${y}-${m}-${d}: ${JSON.stringify(l)}`);
    const eve = lunarDate(...new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10).split('-').map(Number));
    assert.equal(eve.month, 12, `eve of ${y}`);
    assert.equal(eve.year, y - 1);
  }
});

test('leap months', () => {
  const a = lunarDate(2023, 3, 22); assert.deepEqual([a.month, a.leap, a.day], [2, true, 1]);   // 闰二月 2023
  const b = lunarDate(2025, 7, 25); assert.deepEqual([b.month, b.leap, b.day], [6, true, 1]);   // 闰六月 2025
  const c = lunarDate(2020, 5, 23); assert.deepEqual([c.month, c.leap, c.day], [4, true, 1]);   // 闰四月 2020
  assert.equal(lunarDate(2023, 3, 21).leap, false);
});

test('festivals', () => {
  assert.equal(dayEvents(2024, 9, 17).festivals[0].name, 'Mid-Autumn Festival');
  assert.equal(dayEvents(2026, 9, 25).festivals[0].name, 'Mid-Autumn Festival');
  assert.equal(dayEvents(2025, 5, 31).festivals[0].name, 'Dragon Boat Festival');
  assert.ok(dayEvents(2026, 2, 16).festivals.some((f) => f.zh === '除夕'));
  assert.equal(lunarDate(2026, 2, 17).label, '正月初一');
});

test('moon age', () => {
  const m = moonAge(Date.parse('2024-09-18T03:00Z'));
  assert.equal(m.icon, '🌕');
  assert.ok(m.illumination > 98);
});

test('no solar term is ever skipped (2000-2040)', () => {
  const t = solarTermsBetween(Date.UTC(2000, 0, 1), Date.UTC(2041, 0, 1));
  assert.equal(t.length, 41 * 24);
  for (let i = 1; i < t.length; i++) assert.equal((t[i - 1].lon + 15) % 360, t[i].lon, new Date(t[i].ms).toISOString());
});
