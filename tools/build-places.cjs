// Builds the offline birthplace data from GeoNames (geonames.org, CC BY 4.0):
//   www/js/cities-data.js  – all places with ≥ 1,000 inhabitants (cities1000), with region and alternative names
//   www/js/postal-data.js  – postcodes of Europe, Africa, North and South America (export/zip/allCountries)
// Usage: node tools/build-places.cjs <folder with cities1000.txt, allCountries.txt, admin1CodesASCII.txt, countryInfo.txt,
//        altnames-en-de-es.txt>
// altnames-en-de-es.txt: English, German and Spanish names (incl. historic ones) from alternateNamesV2.txt for places with
//   ≥ 15,000 inhabitants (ids.txt = their geonameids), as "geonameid<TAB>lang<TAB>name<TAB>isPreferred":
//   unzip -p alternateNamesV2.zip alternateNamesV2.txt | awk -F'\t' 'NR==FNR{ids[$1]=1;next} ($2 in ids) &&
//     ($3=="en"||$3=="de"||$3=="es") && $9=="" && $10=="" {print $2"\t"$3"\t"$4"\t"$8}' ids.txt - > altnames-en-de-es.txt
// Download: https://download.geonames.org/export/dump/{cities1000.zip,admin1CodesASCII.txt,countryInfo.txt}
//           https://download.geonames.org/export/zip/allCountries.zip
const fs = require('fs');
const path = require('path');

const dir = process.argv[2];
if (!dir) { console.error('usage: node tools/build-places.cjs <geonames folder>'); process.exit(1); }
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean);
const POSTAL_CONTINENTS = new Set(['EU', 'AF', 'NA', 'SA']);
const ALT_MIN_POP = 15000;   // alternative names only for larger places (exonyms such as Munich / München / Múnich)
const MAX_ALTS = 6;
const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

// ----- reference tables -----
const continent = {};
for (const l of read('countryInfo.txt')) { if (l.startsWith('#')) continue; const f = l.split('\t'); if (f.length > 8) continent[f[0]] = f[8]; }
const admin1 = {};
for (const l of read('admin1CodesASCII.txt')) { const f = l.split('\t'); admin1[f[0]] = f[1]; }

const tzs = [], tzIdx = new Map();
const tzOf = (tz) => { if (!tzIdx.has(tz)) { tzIdx.set(tz, tzs.length); tzs.push(tz); } return tzIdx.get(tz); };
const regions = [], regIdx = new Map();
const regOf = (r) => { r = r || ''; if (!regIdx.has(r)) { regIdx.set(r, regions.length); regions.push(r); } return regIdx.get(r); };
regOf('');

// ----- places -----
const altById = new Map();
for (const l of read('altnames-en-de-es.txt')) {
  const [id, , name] = l.split('\t');
  if (!name || name.length > 40 || /\d/.test(name)) continue;
  if (!altById.has(id)) altById.set(id, []);
  altById.get(id).push(name);
}
const cities = [];
for (const l of read('cities1000.txt')) {
  const f = l.split('\t');
  const [id, name, ascii, , lat, lon, , fcode, cc, , a1, , , , pop, , , tz] = f;
  if (!tz || fcode === 'PPLX' || fcode === 'PPLQ' || /\(Kreis/.test(name)) continue;
  let alts = [];
  if (+pop >= ALT_MIN_POP) {
    const seen = new Set([norm(name)]);
    for (const a of [ascii, ...(altById.get(id) || [])]) {
      if (!a) continue;
      const k = norm(a); if (!k || seen.has(k)) continue;
      seen.add(k); alts.push(a.replace(/[|;]/g, ' '));
      if (alts.length >= MAX_ALTS) break;
    }
  }
  cities.push({ name: name.replace(/[|;\n]/g, ' '), alts, cc, region: admin1[`${cc}.${a1}`] || '', lat: +lat, lon: +lon, tz, pop: +pop });
}
cities.sort((a, b) => b.pop - a.pop);
const cityRows = cities.map((c) => [c.name, c.alts.join(';'), c.cc, regOf(c.region), Math.round(c.lat * 100), Math.round(c.lon * 100),
  tzOf(c.tz), Math.max(1, Math.round(c.pop / 1000))].join('|'));

// Nearest place (same country) for the postcode time zones: 1° grid.
const grid = new Map();
for (const c of cities) { const k = `${c.cc}|${Math.floor(c.lat)}|${Math.floor(c.lon)}`; if (!grid.has(k)) grid.set(k, []); grid.get(k).push(c); }
const byCountry = new Map();
for (const c of cities) { if (!byCountry.has(c.cc)) byCountry.set(c.cc, new Set()); byCountry.get(c.cc).add(c.tz); }
function nearestTz(cc, lat, lon) {
  const set = byCountry.get(cc);
  if (set && set.size === 1) return [...set][0];
  for (let r = 0; r <= 6; r++) {
    let best = null, bd = Infinity;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dy), Math.abs(dx)) !== r) continue;
      for (const c of grid.get(`${cc}|${Math.floor(lat) + dy}|${Math.floor(lon) + dx}`) || []) {
        const d = (c.lat - lat) ** 2 + ((c.lon - lon) * Math.cos(lat * Math.PI / 180)) ** 2;
        if (d < bd) { bd = d; best = c; }
      }
    }
    if (best) return best.tz;
  }
  return set ? [...set][0] : null;
}

// ----- postcodes -----
const postal = new Map(); // cc|code -> { names: Map, lat[], lon[], region }
for (const l of fs.readFileSync(path.join(dir, 'allCountries.txt'), 'utf8').split('\n')) {
  if (!l) continue;
  const f = l.split('\t');
  const cc = f[0];
  if (!POSTAL_CONTINENTS.has(continent[cc])) continue;
  const lat = parseFloat(f[9]), lon = parseFloat(f[10]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
  let code = f[1].trim();
  if (cc === 'PT') code = code.split('-')[0];   // 4-digit area is precise enough (a few km)
  const key = `${cc}|${code}`;
  let e = postal.get(key);
  if (!e) postal.set(key, (e = { cc, code, names: new Map(), a2: new Map(), lat: [], lon: [], region: f[3] }));
  e.names.set(f[2], (e.names.get(f[2]) || 0) + 1);
  e.a2.set(f[5], (e.a2.get(f[5]) || 0) + 1);
  e.lat.push(lat); e.lon.push(lon);
}
const pnames = [], pnameIdx = new Map();
const pnameOf = (n) => { if (!pnameIdx.has(n)) { pnameIdx.set(n, pnames.length); pnames.push(n); } return pnameIdx.get(n); };
const postalByCc = new Map();
let noTz = 0;
for (const e of postal.values()) {
  const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
  const lat = mean(e.lat), lon = mean(e.lon);
  // One name per postcode: the place itself, or its municipality when a code covers several localities.
  let name;
  if (e.names.size === 1) name = [...e.names.keys()][0];
  else if (e.a2.size === 1 && [...e.a2.keys()][0]) name = [...e.a2.keys()][0];
  else name = [...e.names.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const tz = nearestTz(e.cc, lat, lon);
  if (!tz) { noTz++; continue; }
  if (!postalByCc.has(e.cc)) postalByCc.set(e.cc, []);
  postalByCc.get(e.cc).push({ code: e.code.replace(/[|\n#]/g, ''), name: pnameOf(name.replace(/[|\n]/g, ' ')), region: regOf(e.region), lat, lon, tz: tzOf(tz) });
}
// Per country: a header line "#CC|defaultTz", then "code|nameIndex|regionIndex|lat×100|lon×100[|tz]" (tz only if not the default).
const postalRows = [];
let postalCount = 0;
for (const [cc, rows] of postalByCc) {
  const freq = new Map(); for (const r of rows) freq.set(r.tz, (freq.get(r.tz) || 0) + 1);
  const def = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
  postalRows.push(`#${cc}|${def}`);
  for (const r of rows.sort((a, b) => (a.code < b.code ? -1 : 1))) {
    postalRows.push([r.code, r.name, r.region, Math.round(r.lat * 100), Math.round(r.lon * 100)].join('|') + (r.tz === def ? '' : `|${r.tz}`));
    postalCount++;
  }
}

const head = '// Generated by tools/build-places.cjs – do not edit.\n// Place and postcode data © GeoNames (geonames.org), CC BY 4.0.\n';
fs.writeFileSync(path.join(__dirname, '..', 'www/js/cities-data.js'), `${head}// Row: name|alternative names (;)|country|regionIndex|lat×100|lon×100|timeZoneIndex|population in thousands, sorted by population.
export const TZ = ${JSON.stringify(tzs)};
export const REGIONS = ${JSON.stringify(regions)};
export const DATA = ${JSON.stringify(cityRows.join('\n'))};
`);
fs.writeFileSync(path.join(__dirname, '..', 'www/js/postal-data.js'), `${head}// Per country a line "#CC|defaultTimeZoneIndex", then rows postcode|nameIndex|regionIndex|lat×100|lon×100[|timeZoneIndex]
// (TZ and REGIONS are in cities-data.js).
export const NAMES = ${JSON.stringify(pnames)};
export const DATA = ${JSON.stringify(postalRows.join('\n'))};
`);
const kb = (f) => (fs.statSync(path.join(__dirname, '..', 'www/js', f)).size / 1024 / 1024).toFixed(1) + ' MB';
console.log(`${cityRows.length} places, ${postalCount} postcodes in ${postalByCc.size} countries (${noTz} without time zone), ${tzs.length} time zones`);
console.log('cities-data.js', kb('cities-data.js'), '· postal-data.js', kb('postal-data.js'));
