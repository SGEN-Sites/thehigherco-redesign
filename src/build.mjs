// build.mjs — renders src/ into a static, platform-free site. Node builtins only.
//
//   node src/build.mjs                         production build -> dist/        (indexable, canonical = live domain)
//   node src/build.mjs --preview --out dist-preview --base /thehigherco-redesign/
//                                              preview build: noindex on every page, robots Disallow, preview note
//
// Every internal URL is written page-relative (lib/html.mjs u() + the rebase pass below), so one build serves at
// the domain root or under any sub-path. Canonical, Open Graph and JSON-LD URLs stay absolute on the live domain.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, setPage, rel } from './lib/html.mjs';
import { setBuildOptions, page } from './lib/layout.mjs';

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const val = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const PREVIEW = flag('--preview');
const OUT = path.join(ROOT, val('--out', PREVIEW ? 'dist-preview' : 'dist'));
const BASE = val('--base', '/');
setBuildOptions({ preview: PREVIEW, base: BASE });

// page modules are imported after the options are set (they read the image manifest at import time)
const { home } = await import('./pages/home.mjs');
const { shopPages } = await import('./pages/shop.mjs');
const { about, crew, flowerBar, lifestyle } = await import('./pages/story.mjs');
const { journalPages } = await import('./pages/journal.mjs');
const { faqs, contact, connect, subscribe, visit } = await import('./pages/info.mjs');
const { legalHub, compliance, privacy, terms, accessibility, notFound, REDIRECTS } = await import('./pages/legal.mjs');

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// Rewrite any root-relative URL still present (content strings written as "/shop/") relative to the page.
function rebase(html) {
  const fix = (v) => (v.startsWith('/') && !v.startsWith('//') ? rel(v) : v);
  html = html.replace(/\b(href|src|poster|data-src|action)="([^"]*)"/g, (m, a, v) => `${a}="${fix(v)}"`);
  html = html.replace(/\bsrcset="([^"]*)"/g, (m, v) => `srcset="${v.split(',').map((c) => { const [p, ...r] = c.trim().split(/\s+/); return [fix(p), ...r].join(' '); }).join(', ')}"`);
  html = html.replace(/url\('(\/[^']*)'\)/g, (m, v) => `url('${fix(v)}')`);
  return html;
}

const written = [];
function writePage(def) {
  setPage(def.path);
  // the 404 page is served at any depth, so it carries a <base>; inserted AFTER the rebase pass so it stays absolute
  const html = rebase(page(def)).replace('<!--SR-BASE-->', `<base href="${BASE}">`);
  const file = def.path.endsWith('.html') ? path.join(OUT, def.path) : path.join(OUT, def.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written.push(path.relative(OUT, file));
}

const pages = [
  home(), ...shopPages(), lifestyle(), flowerBar(), about(), crew(), ...journalPages(),
  visit(), faqs(), contact(), connect(), subscribe(),
  legalHub(), compliance(), privacy(), terms(), accessibility(), notFound(),
];
for (const p of pages) writePage(p);

// Redirect pages for retired live URLs (no client content lived there)
for (const [from, to, title, text] of REDIRECTS) {
  setPage(from);
  const target = rel(to);
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} – The Higher Company</title>
<meta name="robots" content="noindex, follow">
<meta name="description" content="${text.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, ' ').replace(/"/g, '')} The Higher Company is a licensed adult-use cannabis dispensary at 123 E Willow St, Syracuse, NY.">
<link rel="canonical" href="https://www.thehigherco420.com${to.split('#')[0]}">
<meta http-equiv="refresh" content="0; url=${target}">
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0E0E0E;color:#F6F4EF;font:17px/1.6 Poppins,Arial,sans-serif;text-align:center;padding:24px}a{color:#3FBFA0;display:inline-block;padding:12px 10px}</style>
</head>
<body>
<main>
<h1>${title}</h1>
<p>${text}</p>
<p><a href="${target}">Continue to The Higher Company</a></p>
</main>
</body>
</html>
`;
  const file = path.join(OUT, from, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written.push(path.relative(OUT, file));
}

// assets
const copyDir = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from, { withFileTypes: true })) {
    if (f.name.startsWith('.')) continue;
    if (f.isDirectory()) copyDir(path.join(from, f.name), path.join(to, f.name));
    else if (!/\.json$/.test(f.name)) fs.copyFileSync(path.join(from, f.name), path.join(to, f.name));
  }
};
copyDir(path.join(ROOT, 'src/assets/img'), path.join(OUT, 'assets/img'));
copyDir(path.join(ROOT, 'src/assets/fonts'), path.join(OUT, 'assets/fonts'));
copyDir(path.join(ROOT, 'src/assets/video'), path.join(OUT, 'assets/video'));

// CSS: fonts + tokens + the authored sheets, in cascade order. (src/styles/motion.css is the measured motion
// inventory of the OLD site, kept as the record; the redesign's motion lives in signature.css.)
const SHEETS = ['fonts.css', 'tokens.css', 'base.css', 'chrome.css', 'components.css', 'signature.css', 'pages.css'];
const css = SHEETS.map((s) => `/* ${s} */\n` + fs.readFileSync(path.join(ROOT, 'src/styles', s), 'utf8')).join('\n');
const min = css.replace(/\/\*(?![\s\S]*?sourceMappingURL)[\s\S]*?\*\//g, '').replace(/\n\s*\n+/g, '\n').replace(/[ \t]+/g, ' ');
fs.mkdirSync(path.join(OUT, 'assets/css'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'assets/css/site.css'), min);
fs.mkdirSync(path.join(OUT, 'assets/js'), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'src/scripts/site.js'), path.join(OUT, 'assets/js/site.js'));

// crawl files (sr-seo.mjs --apply writes sitemap.xml / llms.txt into dist for production)
fs.writeFileSync(path.join(OUT, 'robots.txt'), PREVIEW ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n\nSitemap: https://www.thehigherco420.com/sitemap.xml\n');
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

console.log(`built ${written.length} html files -> ${path.relative(ROOT, OUT)}${PREVIEW ? ' (preview, noindex, base ' + BASE + ')' : ''}`);
