const fs = require('fs');
const css = fs.readFileSync('public/assets/main.css', 'utf8') + fs.readFileSync('public/public/cards.min.css', 'utf8');
const html = fs.readFileSync('index page/home page.html', 'utf8');
const body = html.slice(html.indexOf('<body'), html.indexOf('</body>'));

const used = new Set();
for (const m of body.matchAll(/\bclass="([^"]*)"/g))
  for (const t of m[1].split(/\s+/)) if (t) used.add(t);
// unquoted class= tokens
for (const m of body.matchAll(/\bclass=([A-Za-z0-9_\-]+)(?!["(])/g)) used.add(m[1]);

// Tailwind v3 compiled CSS: every special char in a class name is backslash-escaped
const probe = c => '.' + c.replace(/([\[\](){}.,#:!])/g, '\\$1');

const missing = [];
for (const t of used) {
  const p = probe(t);
  if (css.includes(p)) continue;
  // also allow unescaped form (plain custom classes)
  if (css.includes('.' + t)) continue;
  missing.push(t);
}
console.log('MISSING (' + missing.length + '):');
console.log(missing.join('\n'));
