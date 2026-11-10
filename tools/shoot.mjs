// shoot.mjs — serve a build locally and screenshot pages (review + pixel-diff rebuild side).
//   node tools/shoot.mjs --dir dist --paths /,/about/ --widths 1440,390 [--full] [--gate] [--rm] [--out private/shots]
//   [--scroll] scroll through the page first so reveals/lazy media settle   [--name suffix]
//   [--pixeldiff] write audit/screens/rebuild/<slug>.<w>.png (full page, reduced motion, gate answered)
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_CORE || '/Users/carlcelino/OSOFT/.claude/skills/client-site-build/scripts/node_modules/playwright-core');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const val = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const has = (n) => args.includes(n);
const DIR = path.join(ROOT, val('--dir', 'dist'));
const PATHS = val('--paths', '/').split(',');
const WIDTHS = val('--widths', '1440,390').split(',').map(Number);
const OUT = path.join(ROOT, has('--pixeldiff') ? 'audit/screens/rebuild' : val('--out', 'private/shots'));
const FULL = has('--full') || has('--pixeldiff');
const RM = has('--rm') || has('--pixeldiff');
const GATE = has('--gate');
fs.mkdirSync(OUT, { recursive: true });
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(DIR, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404, { 'content-type': 'text/html' }); res.end(fs.readFileSync(path.join(DIR, '404.html'))); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const browser = await chromium.launch();
const slug = (p) => (p === '/' ? 'index' : p.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-'));
const report = [];
for (const w of WIDTHS) {
  const h = w <= 400 ? 844 : w <= 800 ? 1024 : w <= 1100 ? 768 : 900;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w <= 400 ? 2 : 1, reducedMotion: RM ? 'reduce' : 'no-preference', hasTouch: w <= 800, isMobile: w <= 400 });
  if (!GATE) await ctx.addInitScript(() => { try { localStorage.setItem('thc-age', '1'); localStorage.setItem('thc-mode', 'pickup'); } catch (e) {} });
  // block third-party network in review shots (menu embed, video hosts) so a slow host never stalls the capture
  await ctx.route(/^(?!http:\/\/127\.0\.0\.1).*/, (r) => r.abort());
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error' && !/net::ERR_FAILED|ERR_BLOCKED|Failed to load resource/.test(m.text())) errors.push(m.text()); });
  for (const p of PATHS) {
    await page.goto(`http://127.0.0.1:${port}${p}`, { waitUntil: 'load' });
    await page.waitForTimeout(700);
    if (has('--scroll') || FULL) {
      await page.evaluate(async () => { const s = Math.floor(innerHeight * 0.7); for (let y = 0; y < document.documentElement.scrollHeight; y += s) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 90)); } scrollTo(0, 0); });
      await page.waitForTimeout(900);
    }
    const metrics = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: innerWidth, sh: document.documentElement.scrollHeight }));
    const file = has('--pixeldiff') ? `${slug(p)}.${w}.png` : `${slug(p)}${val('--name', '')}-${w}.png`;
    await page.screenshot({ path: path.join(OUT, file), fullPage: FULL });
    report.push({ path: p, w, overflowX: metrics.sw > metrics.vw ? metrics.sw - metrics.vw : 0, height: metrics.sh, file, errors: errors.splice(0) });
  }
  await ctx.close();
}
await browser.close();
server.close();
for (const r of report) console.log(`${r.path} @${r.w}: h=${r.height} overflowX=${r.overflowX} errors=${r.errors.length}${r.errors.length ? ' ' + r.errors.slice(0, 2).join(' | ').slice(0, 300) : ''} -> ${r.file}`);
