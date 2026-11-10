// svg-shot.mjs — render an SVG (or an HTML snippet file) to PNG with headless Chromium, for review.
//   node tools/svg-shot.mjs <in.svg|in.html> <out.png> [width] [height] [background]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW_CORE || '/Users/carlcelino/OSOFT/.claude/skills/client-site-build/scripts/node_modules/playwright-core');
const [inp, out, w = '1200', h = '1000', bg = '#e8e8e8'] = process.argv.slice(2);
const src = fs.readFileSync(inp, 'utf8');
const html = inp.endsWith('.html') ? src : `<!doctype html><html><body style="margin:0;background:${bg}"><div style="width:${w}px;height:${h}px;display:grid;place-items:center">${src.replace(/<\?xml[^>]*>/, '')}</div></body></html>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Number(w), height: Number(h) } });
await p.setContent(html, { waitUntil: 'load' });
await p.waitForTimeout(300);
await p.screenshot({ path: out });
await b.close();
console.log('wrote', path.relative(process.cwd(), out));
