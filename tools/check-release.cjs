// Release check: fails while the Impressum still has placeholders (address or contact email).
// Runs before the website is published; run it yourself before submitting to the stores:
//   node tools/check-release.cjs
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const pub = fs.readFileSync(path.join(root, 'www/js/publisher.js'), 'utf8');
const imp = fs.readFileSync(path.join(root, 'docs/impressum.html'), 'utf8');
const problems = [];
if (/ADDRESS PENDING/.test(pub + imp)) problems.push('business address is still "ADDRESS PENDING" (www/js/publisher.js, docs/impressum.html)');
if (/email:\s*''/.test(pub)) problems.push('contact email is empty in www/js/publisher.js');
for (const f of ['docs/impressum.html', 'docs/index.html', 'docs/privacy.html', 'docs/datenschutz.html', 'docs/privacidad.html']) {
  if (fs.readFileSync(path.join(root, f), 'utf8').includes('YOUR-EMAIL@example.com')) problems.push(`placeholder email in ${f}`);
}
if (problems.length) { console.error('Not ready for release:\n- ' + problems.join('\n- ')); process.exit(1); }
console.log('Release check passed: Impressum address and contact email are set.');
