import test from 'node:test';
import assert from 'node:assert/strict';
import { computeChart } from '../www/js/bazi.js';
import { buildReading } from '../www/js/reading.js';

test('reading builds for many random charts without errors', () => {
  for (let i = 0; i < 500; i++) {
    const year = 1930 + Math.floor(Math.random() * 90);
    const c = computeChart({ year, month: 1 + Math.floor(Math.random() * 12), day: 1 + Math.floor(Math.random() * 28),
      hour: Math.floor(Math.random() * 24), minute: 0, tzOffset: 1, gender: Math.random() < 0.5 ? 'm' : 'f', timeUnknown: Math.random() < 0.2 });
    const r = buildReading(c);
    assert.ok(r.sections.length >= 6);
    for (const s of r.sections) assert.ok(!/undefined|NaN/.test(s.html), `${s.title}: ${s.html}`);
  }
});
