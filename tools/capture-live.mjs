// capture-live.mjs — polite browser capture of the live thehigherco420.com pages (the BASELINE side).
//
// One headless browser, one page at a time, GAP_MS between pages, and the whole run stops on the
// first 401/403/429/451/503 document response. No retries, no UA spoofing, no parallelism.
// The live site's own 21+ gate is answered with its "I'm at least 21" button before measuring.
//
//   node tools/capture-live.mjs
//
// Writes audit/capture/<slug>.<w>.json (sr-capture payloads), audit/capture/index.1440.scroll.json,
// audit/sweeps-raw/baseline/<slug>.<w>.json (sr-sweep payloads), audit/pages/<slug>/{text.txt,links.json},
// audit/screens/baseline/<slug>.<w>.png and audit/live-capture-log.json.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_CORE || '/Users/carlcelino/OSOFT/.claude/skills/client-site-build/scripts/node_modules/playwright-core');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = path.join(process.env.HOME, '.claude/skills/site-reforge/scripts');
const ORIGIN = 'https://www.thehigherco420.com';
const GAP_MS = Number(process.env.GAP_MS || 4000);
const STOP_CODES = new Set([401, 403, 429, 451, 503]);
const PAGES = ['/', '/about/', '/shop/', '/faqs/', '/contact/', '/connect/', '/subscribe/'];
const WIDTHS = [[1440, 900], [1024, 768], [768, 1024], [390, 844]];

const slugOf = (p) => (p === '/' ? 'index' : p.replace(/^\/|\/$/g, '').replace(/[^a-z0-9]+/gi, '-'));
const mk = (...p) => { const d = path.join(ROOT, ...p); fs.mkdirSync(d, { recursive: true }); return d; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const logFile = path.join(ROOT, 'audit', 'live-capture-log.json');
const runLog = { at: new Date().toISOString(), gapMs: GAP_MS, visits: [] };

const capIIFE = execFileSync('node', [path.join(SKILL, 'sr-capture.mjs'), '--emit'], { encoding: 'utf8' });
const scrollIIFE = execFileSync('node', [path.join(SKILL, 'sr-capture.mjs'), '--emit-scroll'], { encoding: 'utf8' });
const sweepIIFE = execFileSync('node', [path.join(SKILL, 'sr-sweep.mjs'), '--emit'], { encoding: 'utf8' });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

async function passGate() {
  const btn = page.getByText("I'm at least 21", { exact: false }).first();
  try { if (await btn.isVisible({ timeout: 2500 })) { await btn.click(); await page.waitForTimeout(800); return true; } } catch { /* no gate */ }
  return false;
}
async function settle() {
  await page.waitForTimeout(2500);
  await page.evaluate(async () => {
    const step = Math.max(300, Math.floor(innerHeight * 0.8));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);
}

let first = true;
for (const p of PAGES) {
  if (!first) await sleep(GAP_MS);
  first = false;
  const slug = slugOf(p);
  await page.setViewportSize({ width: 1440, height: 900 });
  const resp = await page.goto(ORIGIN + p, { waitUntil: 'load', timeout: 60000 });
  const status = resp ? resp.status() : 0;
  runLog.visits.push({ url: ORIGIN + p, status, finalUrl: page.url(), at: new Date().toISOString() });
  if (STOP_CODES.has(status)) { console.log('STOP: ' + p + ' answered HTTP ' + status + ' — no retry.'); break; }
  const gated = await passGate();
  await settle();
  const dir = mk('audit', 'pages', slug);
  fs.writeFileSync(path.join(dir, 'text.txt'), await page.evaluate(() => document.body.innerText));
  fs.writeFileSync(path.join(dir, 'links.json'), JSON.stringify(await page.$$eval('a[href]', (as) => as.map((a) => ({ text: (a.innerText || a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80), href: a.href }))), null, 2));
  for (const [w, h] of WIDTHS) {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(1200);
    const cap = await page.evaluate((src) => (0, eval)(src), capIIFE);
    if (!cap || !cap.viewport || cap.viewport.w !== w) throw new Error('capture not at ' + w + ': ' + (cap && cap.viewport && cap.viewport.w));
    fs.writeFileSync(path.join(mk('audit', 'capture'), `${slug}.${w}.json`), JSON.stringify(cap));
    const sw = await page.evaluate((src) => (0, eval)(src), sweepIIFE);
    if (!sw || !sw.viewport || sw.viewport.w !== w) throw new Error('sweep not at ' + w);
    fs.writeFileSync(path.join(mk('audit', 'sweeps-raw', 'baseline'), `${slug}.${w}.json`), JSON.stringify(sw));
    await page.screenshot({ path: path.join(mk('audit', 'screens', 'baseline'), `${slug}.${w}.png`), fullPage: true });
  }
  if (p === '/') {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(800);
    const sc = await page.evaluate((src) => (0, eval)(src), scrollIIFE);
    fs.writeFileSync(path.join(mk('audit', 'capture'), 'index.1440.scroll.json'), JSON.stringify(sc));
  }
  console.log(p, status, gated ? '(gate answered)' : '', '→', page.url());
}
fs.writeFileSync(logFile, JSON.stringify(runLog, null, 2));
await browser.close();
console.log('done');
