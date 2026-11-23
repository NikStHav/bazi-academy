// Birthplace search (offline place and postcode lists from GeoNames, loaded on first use) and historical UTC offsets per IANA time zone.
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
  const { TZ, REGIONS, DATA } = await import('./cities-data.js');
  cities = DATA.split('\n').map((r) => {
    const [name, alts, cc, region, lat, lon, tz, pop] = r.split('|');
    const altList = alts ? alts.split(';') : [];
    return { name, alts: altList, cc, region: REGIONS[+region], lat: +lat / 100, lon: +lon / 100, tz: TZ[+tz], pop: +pop,
      key: normalize(name), altKeys: altList.map(normalize) };
  });
  return cities;
}

/** True when the query looks like a postcode (e.g. 61348, 28013, SW1A, A0A, C1425). */
export const isPostcodeQuery = (q) => /^[A-Za-z]{0,3}\s?\d/.test(String(q).trim());

let postal = null; // [{ cc, def, rows: [line] }]
async function loadPostal() {
  if (postal) return postal;
  const [{ TZ, REGIONS }, { NAMES, DATA }] = await Promise.all([import('./cities-data.js'), import('./postal-data.js')]);
  postal = { TZ, REGIONS, NAMES, blocks: [] };
  let block = null;
  for (const line of DATA.split('\n')) {
    if (line[0] === '#') { const [cc, def] = line.slice(1).split('|'); block = { cc, def: +def, rows: [] }; postal.blocks.push(block); }
    else block.rows.push(line);
  }
  return postal;
}
const compactCode = (s) => String(s).toUpperCase().replace(/[\s-]+/g, '');

/** The country the user most likely means: phone region first, then the app language. */
function preferredCountries() {
  const out = [];
  for (const l of globalThis.navigator?.languages || [globalThis.navigator?.language || '']) {
    const m = /-([A-Za-z]{2})$/.exec(l || ''); if (m) out.push(m[1].toUpperCase());
  }
  out.push({ de: 'DE', es: 'ES', en: 'US' }[lang] || 'US');
  return out;
}

async function searchPostcodes(query, limit) {
  const q = compactCode(query);
  if (q.length < 3) return [];
  const p = await loadPostal();
  const pref = preferredCountries();
  const hits = [];
  for (const b of p.blocks) {
    for (const row of b.rows) {
      const bar = row.indexOf('|');
      const code = row.slice(0, bar);
      const cc2 = compactCode(code);
      // Argentina: GeoNames has the 4-digit codes; the newer CPA form puts a province letter in front (C1425 → 1425).
      if (!cc2.startsWith(q) && !(b.cc === 'AR' && /^[A-Z]\d{4}/.test(q) && cc2.startsWith(q.slice(1, 5)))) continue;
      const [, name, region, lat, lon, tz] = row.split('|');
      hits.push({ name: p.NAMES[+name], cc: b.cc, region: p.REGIONS[+region], postcode: code, lat: +lat / 100, lon: +lon / 100,
        tz: p.TZ[tz === undefined ? b.def : +tz], pop: 0, exact: cc2 === q, rank: pref.indexOf(b.cc) === -1 ? 99 : pref.indexOf(b.cc) });
      if (hits.length > 400) break;
    }
  }
  hits.sort((a, b) => (b.exact - a.exact) || (a.rank - b.rank) || (a.postcode < b.postcode ? -1 : 1));
  return hits.slice(0, limit);
}

/** Up to `limit` places matching the query (start of the name, an alternative name or any word), biggest first.
 *  A query that starts with a digit (or letters + digit) also searches postcodes. */
export async function searchPlaces(query, limit = 8) {
  if (isPostcodeQuery(query)) {
    const byCode = await searchPostcodes(query, limit);
    if (byCode.length) return byCode;
  }
  const q = normalize(query);
  if (q.length < 2) return [];
  const list = await load();
  const alias = ALIASES.filter(([a]) => normalize(a).startsWith(q)).map(([, name, cc]) => list.find((c) => c.name === name && c.cc === cc)).filter(Boolean);
  // The list is sorted by population. A match on the place's own name counts fully, a match on an
  // alternative (other-language or historic) name a third – so "Seville" finds Sevilla, but "Neustadt" stays German.
  const starts = [], words = [];
  for (const c of list) {
    if (c.key.startsWith(q)) starts.push({ c, w: c.pop });
    else if (c.altKeys.some((k) => k.startsWith(q))) starts.push({ c, w: c.pop / 3 });
    else if (words.length < limit && c.key.includes(' ' + q)) words.push(c);
    if (starts.length >= limit * 4) break;
  }
  starts.sort((a, b) => b.w - a.w);
  const seen = new Set();
  return [...alias, ...starts.map((s) => s.c), ...words].filter((c) => (seen.has(c) ? false : seen.add(c))).slice(0, limit);
}

/** Places whose time-zone history before 1970 is well documented in the IANA database. */
const WELL_DOCUMENTED = new Set(['DE', 'AT', 'CH', 'LI', 'LU', 'NL', 'BE', 'FR', 'GB', 'IE', 'DK', 'NO', 'SE', 'FI', 'IS', 'ES', 'PT', 'IT', 'MT', 'MC', 'AD', 'SM', 'VA',
  'CZ', 'SK', 'PL', 'HU', 'SI', 'HR', 'EE', 'LV', 'LT', 'AU', 'NZ', 'JP', 'KR', 'TW', 'HK', 'SG', 'IL', 'CA']);
/** True when the historical UTC offset for a birth before 1970 at this place deserves a manual check. */
export const tzUncertain = (cc, year) => year < 1970 && !WELL_DOCUMENTED.has(cc);

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
