// Birthplace search (offline city list, loaded on first use) and historical UTC offsets per IANA time zone.
import { lang } from './i18n.js';

let cities = null; // [{ name, cc, lat, lon, tz, pop, key }]

// Common alternative spellings → name as stored in the data (and country).
const ALIASES = [
  ['München', 'Munich', 'DE'], ['Cologne', 'Köln', 'DE'], ['Nuremberg', 'Nürnberg', 'DE'], ['Hanover', 'Hannover', 'DE'],
  ['Brunswick', 'Braunschweig', 'DE'], ['Zurich', 'Zürich', 'CH'], ['Geneva', 'Genève', 'CH'], ['Genf', 'Genève', 'CH'],
  ['Lucerne', 'Luzern', 'CH'], ['Wien', 'Vienna', 'AT'], ['Den Haag', 'The Hague', 'NL'], ['Mailand', 'Milan', 'IT'],
  ['Rom', 'Rome', 'IT'], ['Roma', 'Rome', 'IT'], ['Firenze', 'Florence', 'IT'], ['Florenz', 'Florence', 'IT'],
  ['Venezia', 'Venice', 'IT'], ['Venedig', 'Venice', 'IT'], ['Neapel', 'Naples', 'IT'], ['Kiev', 'Kyiv', 'UA'],
  ['Kiew', 'Kyiv', 'UA'], ['Peking', 'Beijing', 'CN'], ['Calcutta', 'Kolkata', 'IN'], ['Bombay', 'Mumbai', 'IN'],
  ['Saigon', 'Ho Chi Minh City', 'VN'], ['Prag', 'Prague', 'CZ'], ['Warschau', 'Warsaw', 'PL'], ['Moskau', 'Moscow', 'RU'],
  ['Lissabon', 'Lisbon', 'PT'], ['Brüssel', 'Brussels', 'BE'], ['Kopenhagen', 'Copenhagen', 'DK'], ['Athen', 'Athens', 'GR'],
  ['Danzig', 'Gdańsk', 'PL'], ['Breslau', 'Wrocław', 'PL'], ['Pressburg', 'Bratislava', 'SK'],
];

export const normalize = (s) => String(s).toLowerCase().replace(/ß/g, 'ss')
  .replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

async function load() {
  if (cities) return cities;
  const { TZ, DATA } = await import('./cities-data.js');
  cities = DATA.split('\n').map((r) => {
    const [name, cc, lat, lon, tz, pop] = r.split('|');
    return { name, cc, lat: +lat, lon: +lon, tz: TZ[+tz], pop: +pop, key: normalize(name) };
  });
  return cities;
}

/** Up to `limit` places matching the query (start of the name or of any word), biggest first. */
export async function searchPlaces(query, limit = 8) {
  const q = normalize(query);
  if (q.length < 2) return [];
  const list = await load();
  const alias = ALIASES.filter(([a]) => normalize(a).startsWith(q)).map(([, name, cc]) => list.find((c) => c.name === name && c.cc === cc)).filter(Boolean);
  const starts = [], words = [];
  for (const c of list) {
    if (c.key.startsWith(q)) starts.push(c);
    else if (c.key.includes(' ' + q)) words.push(c);
    if (starts.length >= limit) break;
  }
  const seen = new Set();
  return [...alias, ...starts, ...words].filter((c) => (seen.has(c) ? false : seen.add(c))).slice(0, limit);
}

let countryNames = null;
export function countryName(cc) {
  try { countryNames ??= new Intl.DisplayNames([lang], { type: 'region' }); return countryNames.of(cc) || cc; } catch { return cc; }
}

/** UTC offset in hours of `tz` at the instant `utcMs`. */
function offsetAt(tz, utcMs) {
  const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
  const p = Object.fromEntries(f.formatToParts(new Date(utcMs)).map((x) => [x.type, x.value]));
  return (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second) - Math.floor(utcMs / 1000) * 1000) / 3600000;
}

/** UTC offset (hours) that applied at a local wall-clock time in `tz` – including historical daylight saving. */
export function utcOffsetFor(tz, year, month, day, hour = 12, minute = 0) {
  try {
    const wall = Date.UTC(year, month - 1, day, hour, minute);
    let off = offsetAt(tz, wall);
    off = offsetAt(tz, wall - off * 3600000);
    return Math.round(off * 60) / 60;
  } catch { return null; }
}
