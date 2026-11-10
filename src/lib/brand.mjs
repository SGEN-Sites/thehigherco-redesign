// brand.mjs — the client's real logo, vectorised from the live site's own file (tools/trace-logo.py), served as
// inline SVG in several arrangements. The shapes are never redrawn or AI-altered; only cropped and recoloured
// through CSS (fill: currentColor / tokens).
import { readJSON } from './html.mjs';

const parts = readJSON('src/assets/brand/thc-logo-parts.json');
const VB_W = 1000, VB_H = Number(parts.viewBox[3]);
const mono = parts.mono.join(' ');
const leaf = parts.leaf.join(' ');
const word = parts.word.join(' ');

function bbox(d) {
  const n = d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i + 1 < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]); }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}
const bMono = bbox(mono), bLeaf = bbox(leaf), bWord = bbox(word);
const vb = (b, pad = 4) => `${(b.x0 - pad).toFixed(1)} ${(b.y0 - pad).toFixed(1)} ${(b.w + pad * 2).toFixed(1)} ${(b.h + pad * 2).toFixed(1)}`;
const markBox = { x0: bMono.x0, y0: bMono.y0, x1: Math.max(bMono.x1, bLeaf.x1), y1: Math.max(bMono.y1, bLeaf.y1) };
markBox.w = markBox.x1 - markBox.x0; markBox.h = markBox.y1 - markBox.y0;

// THC monogram + leaf (no wordmark) — header, favicon-sized uses
export const markSVG = (cls = 'mark', label = '') => `<svg class="${cls}" viewBox="${vb(markBox)}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"'}><path class="mark__mono" fill-rule="evenodd" d="${mono}"/><path class="mark__leaf" fill-rule="evenodd" d="${leaf}"/></svg>`;
// the logo's own leaf, alone (hero floating objects)
export const leafSVG = (cls = 'leaf') => `<svg class="${cls}" viewBox="${vb(bLeaf, 2)}" aria-hidden="true" focusable="false"><path fill-rule="evenodd" d="${leaf}"/></svg>`;
// boxed "THE HIGHER CO." wordmark alone
export const wordSVG = (cls = 'word', label = '') => `<svg class="${cls}" viewBox="${vb(bWord)}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"'}><path fill-rule="evenodd" d="${word}"/></svg>`;
// the full stacked logo
export const logoSVG = (cls = 'logo', label = 'The Higher Co.') => `<svg class="${cls}" viewBox="0 0 ${VB_W} ${VB_H}" role="img" aria-label="${label}"><path class="logo__mono" fill-rule="evenodd" d="${mono}"/><path class="logo__leaf" fill-rule="evenodd" d="${leaf}"/><path class="logo__word" fill-rule="evenodd" d="${word}"/></svg>`;

// Scroll-built monogram. The single monogram outline is split into three letter bands by clip rects placed in
// the slot between T and H (x≈300) and at the H/C junction (x≈667, measured from the trace's column profile).
// The bands tile exactly; at the end JS swaps in the unbroken path so no seam can show.
export function buildSVG(id = 'mb') {
  const splits = [0, 300, 667, VB_W];
  const bands = ['t', 'h', 'c'].map((k, i) => `<clipPath id="${id}-clip-${k}"><rect x="${splits[i]}" y="-20" width="${splits[i + 1] - splits[i]}" height="${VB_H + 40}"/></clipPath>`).join('');
  return `<svg class="mbuild__svg" viewBox="-20 -20 ${VB_W + 40} ${VB_H + 40}" role="img" aria-label="The Higher Co. monogram">
  <defs>${bands}</defs>
  <path class="mbuild__outline" data-mb-outline fill="none" fill-rule="evenodd" d="${mono}"/>
  ${['t', 'h', 'c'].map((k) => `<g class="mbuild__part mbuild__part--${k}" data-mb-part="${k}"><path clip-path="url(#${id}-clip-${k})" fill-rule="evenodd" d="${mono}"/></g>`).join('')}
  <path class="mbuild__whole" data-mb-whole fill-rule="evenodd" d="${mono}"/>
  <g class="mbuild__leaf" data-mb-leaf style="transform-origin:${((bLeaf.x0 + bLeaf.x1) / 2).toFixed(0)}px ${((bLeaf.y0 + bLeaf.y1) / 2).toFixed(0)}px"><path fill-rule="evenodd" d="${leaf}"/></g>
  <g class="mbuild__word" data-mb-word><path fill-rule="evenodd" d="${word}"/></g>
</svg>`;
}

// Layered 3D monogram: one <symbol>, N stacked <use> layers pushed back in Z; CSS rotates the stack.
export function mono3D(layers = 18) {
  const v = vb(markBox, 8);
  const sym = `<svg width="0" height="0" class="sr-only" aria-hidden="true" focusable="false"><symbol id="m3d-mark" viewBox="${v}"><path fill-rule="evenodd" d="${mono}"/></symbol><symbol id="m3d-leaf" viewBox="${v}"><path fill-rule="evenodd" d="${leaf}"/></symbol></svg>`;
  let html = '';
  for (let i = layers - 1; i >= 0; i--) {
    html += `<svg class="m3d__layer${i === 0 ? ' m3d__layer--front' : ''}" style="--i:${i}" viewBox="${v}" aria-hidden="true" focusable="false"><use href="#m3d-mark"/>${i === 0 ? '<use class="m3d__leaf" href="#m3d-leaf"/>' : ''}</svg>`;
  }
  return { sym, html, ratio: (markBox.w / markBox.h).toFixed(4) };
}

export const logoDims = { mono: bMono, leaf: bLeaf, word: bWord, viewBox: [0, 0, VB_W, VB_H] };
