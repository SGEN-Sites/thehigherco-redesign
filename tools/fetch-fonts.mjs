// fetch-fonts.mjs — self-host the three OFL families from Google Fonts (latin subset, woff2).
//   node tools/fetch-fonts.mjs
// Writes src/assets/fonts/*.woff2 and src/assets/fonts/fonts.json (family, style, weight/width range, file, source URL).
// Google Fonts picks the format from the User-Agent; a current Chrome UA string is how any self-hosting tool
// asks for woff2 (this is format negotiation, not access to anything restricted).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/assets/fonts');
fs.mkdirSync(OUT, { recursive: true });
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const families = [
  'family=Archivo:wdth,wght@62..125,100..900',
  'family=Instrument+Serif:ital@0;1',
  'family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400',
];
const css = await (await fetch('https://fonts.googleapis.com/css2?' + families.join('&') + '&display=swap', { headers: { 'User-Agent': UA } })).text();
const blocks = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)];
const out = [];
for (const [, subset, body] of blocks) {
  if (subset !== 'latin') continue;
  const fam = /font-family:\s*'([^']+)'/.exec(body)[1];
  const style = /font-style:\s*(\w+)/.exec(body)[1];
  const weight = /font-weight:\s*([\d ]+)/.exec(body)[1].trim();
  const stretch = (/font-stretch:\s*([\d% ]+)/.exec(body) || [])[1];
  const url = /src:\s*url\(([^)]+)\)/.exec(body)[1];
  const range = /unicode-range:\s*([^;]+)/.exec(body)[1].trim();
  const file = `${fam.toLowerCase().replace(/\s+/g, '-')}-${style}-${weight.replace(' ', '-')}.woff2`;
  if (!out.find((o) => o.file === file)) {
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    fs.writeFileSync(path.join(OUT, file), buf);
    out.push({ family: fam, style, weight, stretch: stretch ? stretch.trim() : null, file, bytes: buf.length, unicodeRange: range, source: url });
    console.log(file, buf.length);
  }
}
fs.writeFileSync(path.join(OUT, 'fonts.json'), JSON.stringify({ fetched: new Date().toISOString(), licence: 'SIL Open Font License 1.1 (all three families)', fonts: out }, null, 2));
