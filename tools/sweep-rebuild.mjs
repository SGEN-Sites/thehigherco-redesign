// sweep-rebuild.mjs — run site-reforge's own sweep IIFE (sr-sweep.mjs --emit) on every built page at every configured
// breakpoint, assert the real viewport width, and save each result for sr-sweep.mjs --merge.
//   node tools/sweep-rebuild.mjs [--dir dist]
// Writes audit/sweeps-raw/rebuild/<slug>.<w>.json. Third-party hosts are blocked (the live menu cannot load in a
// headless browser; it is verified separately in a real browser). The 21+ gate is pre-answered so the sweep
// measures the page, not the overlay.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_CORE || '/Users/carlcelino/OSOFT/.claude/skills/client-site-build/scripts/node_modules/playwright-core');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const i = process.argv.indexOf('--dir'); const DIR = path.join(ROOT, i > 0 ? process.argv[i + 1] : 'dist');
const OUT = path.join(ROOT, 'audit/sweeps-raw/rebuild'); fs.mkdirSync(OUT, { recursive: true });
const project = JSON.parse(fs.readFileSync(path.join(ROOT, 'project.json'), 'utf8'));
const WIDTHS = project.config.breakpoints;
const IIFE = execFileSync('node', [path.join(process.env.HOME, '.claude/skills/site-reforge/scripts/sr-sweep.mjs'), '--emit'], { encoding: 'utf8' });
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const pages = walk(DIR).filter((f) => f.endsWith('.html')).map((f) => '/' + path.relative(DIR, f).replace(/\\/g, '/').replace(/index\.html$/, ''));
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const srv = http.createServer((q, s) => { let f = path.join(DIR, decodeURIComponent(new URL(q.url, 'http://x').pathname)); if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html'); if (!fs.existsSync(f)) { s.writeHead(404); s.end(); return; } s.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s); });
await new Promise((r) => srv.listen(0, '127.0.0.1', r));
const port = srv.address().port;
const b = await chromium.launch();
const slugOf = (p) => (p === '/' ? 'index' : p.replace(/^\/|\/$/g, '').replace(/\.html$/, '').replace(/[^a-z0-9]+/gi, '-'));
let n = 0;
for (const w of WIDTHS) {
  const h = w <= 400 ? 844 : w <= 800 ? 1024 : w <= 1100 ? 768 : 900;
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: w <= 800, isMobile: w <= 400 });
  await ctx.addInitScript(() => { try { localStorage.setItem('thc-age', '1'); localStorage.setItem('thc-mode', 'pickup'); } catch (e) {} });
  await ctx.route(/^(?!http:\/\/127\.0\.0\.1).*/, (r) => r.abort());
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(`http://127.0.0.1:${port}${p}`, { waitUntil: 'load' });
    await page.waitForTimeout(/\/(services|author|category|gallery|media|delivery|retail-space|sample-page-2|alpha|arcana|music|outhere)/.test(p) ? 900 : 400);
    // the sweep must measure the page the visitor ends on; redirect pages are swept as themselves
    const res = await page.evaluate((src) => (0, eval)(src), IIFE).catch((e) => ({ error: String(e) }));
    if (!res || !res.viewport || res.viewport.w !== w) { console.log('SKIP', p, w, JSON.stringify(res).slice(0, 120)); continue; }
    res.url = 'https://www.thehigherco420.com' + p;
    fs.writeFileSync(path.join(OUT, `${slugOf(p)}.${w}.json`), JSON.stringify(res));
    n++;
  }
  await ctx.close();
}
await b.close(); srv.close();
console.log('sweeps written:', n, 'pages', pages.length, 'widths', WIDTHS.join('/'));
