// html.mjs — tiny string helpers for the static build. No dependencies.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const attr = (o) => Object.entries(o).filter(([, v]) => v !== false && v != null).map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`)).join(' ');
export const cx = (...c) => c.filter(Boolean).join(' ');

// Page-relative URL from the page being rendered (pagePath like "/shop/flower/") to a site path ("/about/" or
// "/assets/img/x.webp"). Every internal URL in the build goes through here, so the same output works at the
// domain root and under a sub-path (GitHub Pages preview) without a base tag.
let CURRENT = '/';
export const setPage = (p) => { CURRENT = p; };
export const getPage = () => CURRENT;
// u(): canonical site path for an internal target. Content is rendered with root-relative URLs ("/about/");
// build.mjs then rewrites every root-relative URL in the finished document relative to that page (rel()), so a page
// never depends on which page happened to be "current" while its body was rendered.
export function u(target) {
  if (!target || /^(https?:|mailto:|tel:|#|data:)/.test(target)) return target;
  return target.startsWith('/') ? target : '/' + target;
}
// rel(): root-relative -> page-relative for the page being written (setPage).
export function rel(target) {
  if (!target || !target.startsWith('/') || target.startsWith('//')) return target;
  const [p, hash = ''] = target.split('#');
  const [pathOnly, query = ''] = p.split('?');
  const depth = CURRENT.split('/').filter(Boolean).length - (CURRENT.endsWith('/') ? 0 : 1);
  const up = depth > 0 ? '../'.repeat(depth) : './';
  const out = up + pathOnly.replace(/^\//, '');
  return out + (query ? '?' + query : '') + (hash ? '#' + hash : '');
}

export const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
export const readJSON = (p) => JSON.parse(read(p));

// Icons: hand-coded 24px line icons (stroke = currentColor).
const I = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  out: '<path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  bag: '<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chev: '<path d="m6 9 6 6 6-6"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2.4"/><path d="M5.8 16.5c.7-1.6 1.9-2.4 3.2-2.4s2.5.8 3.2 2.4M14.5 10h4M14.5 13h3"/>',
  card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>',
  car: '<path d="M5 16h14M6.5 16l1.4-5.3A2 2 0 0 1 9.8 9h4.4a2 2 0 0 1 1.9 1.7L17.5 16M6 16v2.5M18 16v2.5"/><circle cx="8.5" cy="13.6" r=".8"/><circle cx="15.5" cy="13.6" r=".8"/>',
  lens: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/><path d="M8 9.2a2.8 2.8 0 0 1 2.4-1.8"/>',
  jar: '<path d="M7 7h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z"/><path d="M6.5 4h11v3h-11z"/><path d="M10 12.5c1-.9 3-.9 4 0"/>',
  leaf: '<path d="M12 21v-6M12 15c-3.5 0-6-2.2-7-5.6 3.2.2 5.6 1.6 7 3.6 1.4-2 3.8-3.4 7-3.6-1 3.4-3.5 5.6-7 5.6z"/><path d="M12 13c-1-2.6-1-5.6 0-9 1 3.4 1 6.4 0 9z"/>',
  people: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5"/><circle cx="17" cy="9" r="2.4"/><path d="M15.6 14.2c2.4-.3 4.3 1.2 4.9 4.3"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.6 2.6M15.4 15.4 18 18M18 6l-2.6 2.6M8.6 15.4 6 18"/>',
  star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>',
  shield: '<path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
  cap: '<path d="M3 15c0-5 4-9 9-9s9 4 9 9"/><path d="M3 15h13c2.6 0 4.6.8 5 2H3z"/><path d="M12 6v-.5"/>',
  tee: '<path d="M8 4 3.5 6.5 5.5 11 7.5 10v10h9V10l2 1 2-4.5L16 4c-.6 1.5-2.1 2.5-4 2.5S8.6 5.5 8 4z"/>',
  ig: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".9"/>',
  fb: '<path d="M14 21v-7.5h2.6l.4-3H14V8.7c0-.9.3-1.5 1.6-1.5H17V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9v2.2H8.5v3H11V21"/>',
  yt: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10.2 9.2 4.8 2.8-4.8 2.8z"/>',
  map: '<path d="M9 4 3 6.5v13.5L9 17.5l6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  drag: '<path d="M12 3v18M3 12h18M12 3l-2.5 2.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5-2.5M3 12l2.5-2.5M3 12l2.5 2.5M21 12l-2.5-2.5M21 12l-2.5 2.5"/>',
};
export const icon = (n, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${I[n] || ''}</svg>`;
