// iCalendar (RFC 5545) export of lunar events: moons, solar terms, festivals. Pure functions.
import { moonEvents, solarTermsBetween, dayEvents } from './lunar.js';

const DAY = 86400000;
export const KINDS = {
  full: { name: 'Full moons', icon: '🌕' },
  new: { name: 'New moons', icon: '🌑' },
  major: { name: 'Equinoxes & solstices', icon: '☀️' },
  terms: { name: 'All 24 solar terms', icon: '🌱' },
  fest: { name: 'Traditional festivals', icon: '🏮' },
};

/** Lunar events between two dates: [{ kind, uid, title, desc, ms, allDay?, date? }] */
export function collectEvents(fromMs, toMs, kinds) {
  const out = [];
  for (const m of moonEvents(fromMs, toMs)) {
    if (!kinds[m.type]) continue;
    const d = new Date(m.ms).toISOString().slice(0, 10).replace(/-/g, '');
    out.push({ kind: m.type, uid: `${m.type}moon-${d}@bazi-academy`, ms: m.ms,
      title: m.type === 'full' ? '🌕 Full moon' : '🌑 New moon',
      desc: m.type === 'full' ? 'Full moon (望). In the Chinese calendar it falls around the 15th day of the lunar month.' : 'New moon (朔) – the first day of a lunar month in China.' });
  }
  if (kinds.major || kinds.terms) {
    for (const t of solarTermsBetween(fromMs, toMs)) {
      if (!kinds.terms && !t.major) continue;
      const y = new Date(t.ms).getUTCFullYear();
      out.push({ kind: t.major ? 'major' : 'terms', uid: `term-${t.lon}-${y}@bazi-academy`, ms: t.ms,
        title: `${t.major ? '☀️' : '🌱'} ${t.name} ${t.zh}`,
        desc: `Solar term ${t.zh}: the sun reaches ${t.lon}° ecliptic longitude.${t.lon % 30 === 15 ? ' A new BaZi month begins.' : ''}` });
    }
  }
  if (kinds.fest) {
    for (let t = fromMs; t < toMs; t += DAY) {
      const dt = new Date(t);
      const y = dt.getUTCFullYear(), m = dt.getUTCMonth() + 1, d = dt.getUTCDate();
      for (const f of dayEvents(y, m, d).festivals) {
        if (f.zh === '冬至' && kinds.major) continue; // already listed as the solstice
        const date = `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`;
        out.push({ kind: 'fest', uid: `fest-${date}@bazi-academy`, allDay: true, date, ms: Date.UTC(y, m - 1, d),
          title: `🏮 ${f.name} ${f.zh}`, desc: f.desc });
      }
    }
  }
  return out.sort((a, b) => a.ms - b.ms);
}

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
const stamp = (ms) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
// Fold lines longer than 75 octets (UTF-8) as required by RFC 5545.
function fold(line) {
  const out = []; let cur = '', bytes = 0;
  for (const ch of line) {
    const b = new TextEncoder().encode(ch).length;
    if (bytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch; bytes += b;
  }
  out.push(cur);
  return out.join('\r\n ');
}

export function buildIcs(events, calName = 'BaZi Academy – Lunar calendar', nowMs = Date.now()) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BaZi Academy//Lunar Calendar//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(calName)}`, 'X-PUBLISHED-TTL:P7D', 'REFRESH-INTERVAL;VALUE=DURATION:P7D'];
  for (const e of events) {
    lines.push('BEGIN:VEVENT', `UID:${e.uid}`, `DTSTAMP:${stamp(nowMs)}`);
    if (e.allDay) {
      const next = new Date(Date.UTC(+e.date.slice(0, 4), +e.date.slice(4, 6) - 1, +e.date.slice(6) + 1)).toISOString().slice(0, 10).replace(/-/g, '');
      lines.push(`DTSTART;VALUE=DATE:${e.date}`, `DTEND;VALUE=DATE:${next}`);
    } else {
      lines.push(`DTSTART:${stamp(e.ms)}`, `DTEND:${stamp(e.ms + 30 * 60000)}`);
    }
    lines.push(`SUMMARY:${esc(e.title)}`, `DESCRIPTION:${esc(e.desc)}`, 'TRANSP:TRANSPARENT', 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}
