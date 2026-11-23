import test from 'node:test';
import assert from 'node:assert/strict';
import { searchPlaces, utcOffsetFor, normalize } from '../www/js/places.js';

test('normalize spelling variants', () => {
  assert.equal(normalize('München'), normalize('Muenchen'));
  assert.equal(normalize('Genève'), 'geneve');
  assert.equal(normalize('Straße'), normalize('Strasse'));
});

test('search finds German towns, aliases and words inside names', async () => {
  const name = async (q) => (await searchPlaces(q))[0]?.name;
  assert.equal(await name('Bad Homb'), 'Bad Homburg vor der Höhe');
  assert.equal(await name('homburg'), 'Homburg'); // Saarland town comes first by name start
  assert.ok((await searchPlaces('homburg')).some((c) => c.name === 'Bad Homburg vor der Höhe'));
  assert.equal(await name('München'), 'Munich');
  assert.equal(await name('Muenchen'), 'Munich');
  assert.equal(await name('Aachen'), 'Aachen');
  assert.equal(await name('Zurich'), 'Zürich');
  assert.equal(await name('Wien'), 'Vienna');
  const bh = (await searchPlaces('Bad Homburg'))[0];
  assert.equal(bh.tz, 'Europe/Berlin');
  assert.ok(Math.abs(bh.lon - 8.62) < 0.01);
});

test('historical UTC offsets incl. daylight saving', () => {
  assert.equal(utcOffsetFor('Europe/Berlin', 1975, 7, 1), 1);   // no DST in Germany 1975
  assert.equal(utcOffsetFor('Europe/Berlin', 1985, 7, 1), 2);   // DST since 1980
  assert.equal(utcOffsetFor('Europe/Berlin', 1985, 1, 15), 1);
  assert.equal(utcOffsetFor('America/New_York', 1990, 7, 1), -4);
  assert.equal(utcOffsetFor('Australia/Sydney', 2000, 1, 1), 11);
  assert.equal(utcOffsetFor('Asia/Kolkata', 2000, 1, 1), 5.5);
  assert.equal(utcOffsetFor('Asia/Shanghai', 1988, 7, 1), 9);   // China used DST 1986–1991
});

test('postcode search finds places with time zone in Europe and the Americas', async () => {
  const { searchPlaces, isPostcodeQuery } = await import('../www/js/places.js');
  assert.ok(isPostcodeQuery('61348') && isPostcodeQuery('SW1A') && !isPostcodeQuery('Madrid'));
  const cases = [['61348', 'DE', 'Bad Homburg', 'Europe/Berlin'], ['28013', 'ES', 'Madrid', 'Europe/Madrid'], ['06700', 'MX', 'Roma Norte', 'America/Mexico_City'],
    ['90210', 'US', 'Beverly Hills', 'America/Los_Angeles'], ['75001', 'FR', 'Paris', 'Europe/Paris'], ['00184', 'IT', 'Roma', 'Europe/Rome']];
  for (const [q, cc, name, tz] of cases) {
    const hit = (await searchPlaces(q, 8)).find((c) => c.cc === cc);
    assert.ok(hit, `${q} ${cc}`);
    assert.ok(hit.name.includes(name), `${q}: ${hit.name}`);
    assert.equal(hit.tz, tz, q);
    assert.equal(hit.postcode.replace(/\D/g, ''), q.replace(/\D/g, ''));
  }
});

test('places are found by English, German, Spanish and historic names', async () => {
  const { searchPlaces } = await import('../www/js/places.js');
  for (const [q, name, cc] of [['Seville', 'Sevilla', 'ES'], ['Colonia', 'Köln', 'DE'], ['Múnich', 'Munich', 'DE'], ['Breslau', 'Wrocław', 'PL'],
    ['Nueva York', 'New York City', 'US'], ['Lissabon', 'Lisbon', 'PT'], ['Neustadt', 'Neustadt an der Weinstraße', 'DE']]) {
    const [first] = await searchPlaces(q, 4);
    assert.equal(`${first.name}|${first.cc}`, `${name}|${cc}`, q);
  }
  const [neu] = await searchPlaces('Neustadt an der W', 2);
  assert.ok(neu.region, 'places carry their region');
});

test('births before 1970 outside well-documented regions get a time zone hint', async () => {
  const { tzUncertain } = await import('../www/js/places.js');
  assert.equal(tzUncertain('MX', 1965), true);
  assert.equal(tzUncertain('DE', 1965), false);
  assert.equal(tzUncertain('MX', 1990), false);
});
