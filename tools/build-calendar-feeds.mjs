// Generates subscribable iCalendar feeds in docs/calendar/ (served by GitHub Pages).
// Usage: node tools/build-calendar-feeds.mjs [fromYear] [toYear]
import { writeFileSync, mkdirSync } from 'node:fs';
import { collectEvents, buildIcs } from '../www/js/ics.js';

const from = +(process.argv[2] || 2025), to = +(process.argv[3] || 2035);
const range = [Date.UTC(from, 0, 1), Date.UTC(to + 1, 0, 1)];
const FEEDS = {
  'lunar.ics': ['BaZi Academy – Moons, equinoxes, solstices & festivals', { full: true, new: true, major: true, fest: true }],
  'moons.ics': ['BaZi Academy – Full & new moons', { full: true, new: true }],
  'full-moons.ics': ['BaZi Academy – Full moons', { full: true }],
  'seasons.ics': ['BaZi Academy – Equinoxes & solstices', { major: true }],
  'solar-terms.ics': ['BaZi Academy – 24 solar terms', { major: true, terms: true }],
  'festivals.ics': ['BaZi Academy – Chinese festivals', { fest: true }],
};
const dir = new URL('../docs/calendar/', import.meta.url);
mkdirSync(dir, { recursive: true });
for (const [file, [name, kinds]] of Object.entries(FEEDS)) {
  const ev = collectEvents(...range, kinds);
  writeFileSync(new URL(file, dir), buildIcs(ev, name, Date.UTC(from, 0, 1)));
  console.log(file, ev.length, 'events');
}
