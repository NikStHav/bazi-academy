// Lists every translation key used in www/js (literal t('…') calls plus known dynamic keys).
// Usage: node tools/i18n-keys.cjs            -> prints keys as JSON
//        node tools/i18n-keys.cjs --missing de -> prints keys missing in the German dictionary
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'www', 'js');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => path.join(dir, f));
const keys = new Set();
const re = /\bt\(\s*(['"])((?:\\.|(?!\1).)*)\1/g;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  for (const m of src.matchAll(re)) keys.add(m[2].replace(/\\(['"\\])/g, '$1'));
  // t(condition ? 'a' : 'b')
  for (const m of src.matchAll(/\bt\(\s*[^'"()]+\?\s*(['"])((?:\\.|(?!\1).)*)\1\s*:\s*(['"])((?:\\.|(?!\3).)*)\3/g)) { keys.add(m[2]); keys.add(m[4]); }
}
// keys that are passed to t() as variables
const DYNAMIC = ['Family', 'Partner', 'Friends', 'Clients', 'Work', 'Other', 'with your year branch {b}', 'with your month branch {b}', 'with your day branch {b}', 'with your hour branch {b}', 'Learn', 'Strong', 'Balanced to strong', 'Balanced to weak', 'Weak', 'Basics', 'Calendar', 'Core', 'Analysis',
  'Same element', 'I produce', 'I control', 'Controls me', 'Produces me', 'favourable', 'mixed', 'challenging',
  'Excellent', 'Good', 'Mixed', 'Challenging', 'Stem combination', 'Clash', 'Six Harmony', 'Harm', 'Self-punishment', 'Punishment',
  'Three Harmony (full)', 'Half Three Harmony', 'Punishment (full)', 'Punishment (partial)', 'Year', 'Month', 'Day', 'Hour', 'Chart',
  'Apple', 'Google Play', 'app store', 'Prosperous', 'Resting', 'Trapped', 'Weak (Dead)',
  'The Day Master’s element is in season – at its peak.', 'The season produces the Day Master – well supported.',
  'The Day Master produces the season’s element – it is spending energy.', 'The Day Master must control the season’s element – tiring.',
  'The season controls the Day Master – least seasonal support.',
  'A day to take it slow', 'Mixed – go carefully', 'A balanced day', 'A good day', 'An excellent day'];
DYNAMIC.forEach((k) => keys.add(k));
const list = [...keys].sort();
if (process.argv[2] === '--missing') {
  const lang = process.argv[3] || 'de';
  import(path.join(dir, 'i18n', `${lang}-ui.js`)).then((m) => {
    const dict = m.DE_UI;
    const miss = list.filter((k) => !(k in dict));
    const unused = Object.keys(dict).filter((k) => !keys.has(k));
    console.log(JSON.stringify({ total: list.length, missing: miss, unused }, null, 1));
    process.exit(miss.length ? 1 : 0);
  });
} else console.log(JSON.stringify(list, null, 1));
