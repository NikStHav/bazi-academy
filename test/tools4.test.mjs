import test from 'node:test';
import assert from 'node:assert/strict';
import { computeChart, pillarFromIndex, pillarName } from '../www/js/bazi.js';
import { hoursOfDay, hourBranchOf, hourRange } from '../www/js/hours.js';
import { influencesFor } from '../www/js/influences.js';
import { lifeTimeline } from '../www/js/timeline.js';

const me = computeChart({ year: 1976, month: 3, day: 26, hour: 8, minute: 30, tzOffset: 1, gender: 'm' });

test('double hours and ranges', () => {
  assert.equal(hourBranchOf(23), 0); assert.equal(hourBranchOf(0), 0); assert.equal(hourBranchOf(1), 1); assert.equal(hourBranchOf(12), 6);
  assert.equal(hourRange(0), '23–01'); assert.equal(hourRange(6), '11–13');
});

test('Yellow/Black Path hours follow the classical rule', () => {
  // 甲子 day: Green Dragon in the 申 hour; 子 hour = Golden Casket, 午 hour = Life Governor (but clashes the 子 day)
  const h = hoursOfDay({ stem: 0, branch: 0 });
  assert.equal(h[8].deity.zh, '青龙');
  assert.equal(h[0].deity.zh, '金匮');
  assert.equal(h[6].deity.zh, '司命');
  assert.equal(h[6].dayClash, true);
  assert.equal(h[6].lucky, false);
  assert.deepEqual(h.filter((x) => x.deity.good).map((x) => x.branch), [0, 1, 3, 6, 8, 9]);
  assert.equal(pillarName({ stem: h[0].stem, branch: 0 }), '甲子'); // five-rats rule
  // 寅 day: Green Dragon in the 子 hour
  assert.equal(hoursOfDay({ stem: 2, branch: 2 })[0].deity.zh, '青龙');
});

test('personal clashes mark hours as not lucky', () => {
  const h = hoursOfDay(pillarFromIndex(10), me);
  for (const x of h) if (x.personal.length) assert.equal(x.lucky, false);
  assert.ok(h.every((x) => x.god));
});

test('influences for a date', () => {
  const inf = influencesFor(me, new Date(2026, 10, 22, 10, 0));
  assert.equal(inf.layers.length, 4);
  assert.equal(pillarName(inf.layers[0].pillar), '丙午');
  for (const l of inf.layers) { assert.ok(l.god && l.rating.label); for (const r of l.relations) assert.ok(r.rel.label); }
  assert.ok(['favourable', 'mixed', 'challenging'].includes(inf.overall));
  assert.ok(inf.luck);
});

test('life timeline covers childhood and luck pillars without gaps', () => {
  const tl = lifeTimeline(me);
  assert.equal(tl[0].kind, 'childhood');
  for (let i = 1; i < tl.length; i++) assert.equal(tl[i].from, tl[i - 1].to + 1);
  for (const ph of tl) assert.equal(ph.years.length, ph.to - ph.from + 1);
  const all = tl.flatMap((p) => p.years);
  assert.ok(all.some((y) => y.benming) && all.some((y) => y.taiSuiClash));
  assert.equal(all.filter((y) => y.benming).every((y) => (y.year - 1976) % 12 === 0), true);
});
