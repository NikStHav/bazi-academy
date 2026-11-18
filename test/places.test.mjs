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
