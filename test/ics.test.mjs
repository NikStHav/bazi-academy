import test from 'node:test';
import assert from 'node:assert/strict';
import { collectEvents, buildIcs } from '../www/js/ics.js';

const Y2025 = [Date.UTC(2025, 0, 1), Date.UTC(2026, 0, 1)];

test('event selection per kind', () => {
  const all = collectEvents(...Y2025, { full: true, new: true, major: true, terms: true, fest: true });
  const count = (k) => all.filter((e) => e.kind === k).length;
  assert.ok(count('full') >= 12 && count('full') <= 13);
  assert.ok(count('new') >= 12 && count('new') <= 13);
  assert.equal(count('major') + count('terms'), 24);
  assert.equal(count('major'), 4);
  assert.ok(count('fest') >= 10);
  const onlyMajor = collectEvents(...Y2025, { major: true });
  assert.equal(onlyMajor.length, 4);
  assert.equal(new Set(all.map((e) => e.uid)).size, all.length, 'UIDs are unique');
});

test('valid iCalendar output', () => {
  const ics = buildIcs(collectEvents(...Y2025, { full: true, major: true, fest: true }), 'Test, calendar', Date.UTC(2025, 0, 1));
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n'));
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, (ics.match(/END:VEVENT/g) || []).length);
  assert.match(ics, /X-WR-CALNAME:Test\\, calendar/);
  assert.match(ics, /DTSTART;VALUE=DATE:20251006\r\nDTEND;VALUE=DATE:20251007/); // Mid-Autumn 2025
  assert.match(ics, /SUMMARY:☀️ Spring Equinox 春分/);
  for (const line of ics.split('\r\n')) assert.ok(new TextEncoder().encode(line).length <= 75, `line too long: ${line}`);
  assert.ok(!/\n(?<!\r\n)/.test(ics.replace(/\r\n/g, '')), 'only CRLF line endings');
});

import { reminderTime, reminderText } from '../www/js/notify.js';
test('reminder times: evening before, morning of, exact', () => {
  const timed = { ms: Date.UTC(2025, 2, 20, 9, 1), title: '☀️ Spring Equinox 春分', desc: 'x' };
  const ev = reminderTime(timed, 'evening'), mo = reminderTime(timed, 'morning'), ex = reminderTime(timed, 'exact');
  const local = new Date(timed.ms);
  assert.equal(ev.getDate(), new Date(local.getFullYear(), local.getMonth(), local.getDate() - 1).getDate());
  assert.deepEqual([ev.getHours(), mo.getHours(), mo.getDate()], [19, 8, local.getDate()]);
  assert.equal(ex.getTime(), timed.ms);
  const fest = { allDay: true, date: '20251006', ms: Date.UTC(2025, 9, 6), title: '🏮 Mid-Autumn Festival 中秋节', desc: 'Mooncakes.' };
  assert.deepEqual([reminderTime(fest, 'exact').getDate(), reminderTime(fest, 'exact').getHours()], [6, 8]); // all-day: morning
  assert.match(reminderText(fest, 'evening').body, /^Tomorrow\. Mooncakes/);
  assert.match(reminderText(timed, 'exact').title, /now$/);
});
