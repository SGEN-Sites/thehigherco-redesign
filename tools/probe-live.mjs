// probe-live.mjs — check the PUBLISHED preview on a phone profile: the 21+ gate, the sticky quick-action bar,
// the live status, console errors, and every internal link on the pages visited.
//   node tools/probe-live.mjs https://sgen-sites.github.io/thehigherco-redesign/
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_CORE || '/Users/carlcelino/OSOFT/.claude/skills/client-site-build/scripts/node_modules/playwright-core');
const BASE = process.argv[2] || 'https://sgen-sites.github.io/thehigherco-redesign/';
const b = await chromium.launch();
const out = {};
for (const [name, vp] of [['phone-390', { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }], ['phone-360', { width: 360, height: 740, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
  const c = await b.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor });
  await c.route(/dutchie\.com/, (r) => r.abort()); // the menu is checked in a real browser; headless gets a bot wall
  const p = await c.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(String(e)));
  const r = {};
  const resp = await p.goto(BASE, { waitUntil: 'load' });
  r.status = resp.status();
  await p.waitForTimeout(900);
  r.robots = await p.getAttribute('meta[name="robots"]', 'content');
  r.gateVisible = await p.isVisible('[data-gate] .gate__panel');
  r.gateButtons = await p.$$eval('[data-gate] button', (bs) => bs.map((x) => { const b = x.getBoundingClientRect(); return x.textContent.trim().replace(/\s+/g, ' ') + ' ' + Math.round(b.width) + 'x' + Math.round(b.height); }));
  await p.tap('[data-gate-yes="pickup"]');
  await p.waitForTimeout(500);
  r.gateClosed = !(await p.isVisible('[data-gate] .gate__panel'));
  r.status_label = await p.textContent('.hero [data-open-label]');
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, innerHeight * 1.8); });
  await p.waitForTimeout(900);
  r.barVisible = await p.evaluate(() => document.querySelector('[data-bar]').classList.contains('is-visible'));
  r.barButtons = await p.$$eval('[data-bar] a, [data-bar] button', (as) => as.map((a) => { const b = a.getBoundingClientRect(); return a.textContent.trim().replace(/\s+/g, ' ').slice(0, 26) + ' ' + Math.round(b.width) + 'x' + Math.round(b.height) + (a.getAttribute('href') ? ' -> ' + a.getAttribute('href').slice(0, 60) : ''); }));
  r.barInViewport = await p.evaluate(() => { const b = document.querySelector('[data-bar] .bar__in').getBoundingClientRect(); return b.bottom <= innerHeight + 1 && b.top >= 0; });
  await p.screenshot({ path: `private/shots/live-bar-${name}.png` });
  await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await p.waitForTimeout(900);
  r.barHiddenAtFooter = !(await p.evaluate(() => document.querySelector('[data-bar]').classList.contains('is-visible')));
  // Shop Now in the bar opens the in-site menu page
  await p.evaluate(() => window.scrollTo(0, innerHeight * 1.8)); await p.waitForTimeout(700);
  await p.tap('[data-bar] .bar__btn--shop');
  await p.waitForLoadState('load'); await p.waitForTimeout(800);
  r.shopNowLandsOn = p.url().replace(BASE, '/');
  r.shopPageHasEmbedScript = await p.$('script#dutchie--embed__script') !== null;
  r.gateRememberedOnNextPage = !(await p.isVisible('[data-gate] .gate__panel'));
  r.overflowX = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  r.errors = errors;
  out[name] = r;
  await c.close();
}
await b.close();
console.log(JSON.stringify(out, null, 1));
