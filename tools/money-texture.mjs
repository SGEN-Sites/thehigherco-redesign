// money-texture.mjs — the banknote line work behind the light bands, drawn from maths (no image model, no font).
//
//   node tools/money-texture.mjs
//
// Writes two SVGs that the stylesheet uses as CSS MASKS (the colour comes from the --money token):
//   src/assets/img/texture/guilloche-field.svg    seamless 240x72 tile: two families of crossing sine lines, the
//                                                 "lathe work" that fills the background of a bank note
//   src/assets/img/texture/guilloche-rosette.svg  one engraved rosette (rings of rotated petal curves), placed
//                                                 half off the edge of a band like the seal on a note
// No words, numbers or portraits: the texture must never read as text behind the copy. Every line is a <use> of a
// handful of base paths, so both files stay small. Deterministic: same input, same bytes.
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'src/assets/img/texture');
fs.mkdirSync(OUT, { recursive: true });
const f1 = (n) => (Math.round(n * 10) / 10).toString();
const poly = (pts) => 'M' + pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join('L');

// ---- field tile -------------------------------------------------------------------------------------------------
// Line i of family A: y = c_i + a*sin(k*x + phi_i). A phase shift is a horizontal translation, so every line is the
// same base wave moved by (-phi_i/k, c_i). Family B is the same wave mirrored (drifting the other way), which makes
// the crossing lattice. phi_i walks one full turn over n lines, so the tile repeats vertically after n*d px.
const W = 240, n = 9, d = 8, H = n * d, a = 6.2, k = (2 * Math.PI * 2) / W;
const base = [];
for (let x = -W; x <= 2 * W; x += 2) base.push([x, a * Math.sin(k * x)]);
const uses = [];
for (let i = -3; i < n + 3; i++) {
  const c = (i + 0.5) * d;
  const shift = ((2 * Math.PI * i) / n) / k;
  uses.push(`<use href="#w" x="${f1(-shift)}" y="${f1(c)}"/>`);
  uses.push(`<use href="#m" x="${f1(shift)}" y="${f1(c)}"/>`);
}
const field = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`
  + `<defs><path id="w" d="${poly(base)}"/><path id="m" d="${poly(base.map(([x, y]) => [x, -y]))}"/></defs>`
  + `<g fill="none" stroke="#000" stroke-width=".55" stroke-opacity=".6">${uses.join('')}</g></svg>\n`;
fs.writeFileSync(path.join(OUT, 'guilloche-field.svg'), field);

// ---- rosette ----------------------------------------------------------------------------------------------------
// A ring = one closed petal curve r(t) = R + A*sin(L*t), drawn `copies` times, each rotated by a fraction of one
// petal so the copies interleave into the woven band typical of engraved security printing.
function curve(R, A, L, samples) {
  const pts = [];
  for (let s = 0; s <= samples; s++) {
    const t = (2 * Math.PI * s) / samples;
    const r = R + A * Math.sin(L * t);
    pts.push([r * Math.cos(t), r * Math.sin(t)]);
  }
  return poly(pts) + 'Z';
}
const rings = [
  { id: 'r1', R: 300, A: 30, L: 15, copies: 12, w: .8 },   // outer woven band
  { id: 'r2', R: 232, A: 20, L: 24, copies: 8, w: .7 },    // rope band
  { id: 'r3', R: 124, A: 64, L: 9, copies: 10, w: .7 },    // inner flower
  { id: 'r4', R: 46, A: 14, L: 12, copies: 6, w: .6 },     // centre
];
let defs = '', body = '';
for (const g of rings) {
  defs += `<path id="${g.id}" d="${curve(g.R, g.A, g.L, g.L * 48)}"/>`;
  const step = (360 / g.L) / g.copies;
  body += `<g stroke-width="${g.w}">` + Array.from({ length: g.copies }, (_, c) => `<use href="#${g.id}"${c ? ` transform="rotate(${f1(c * step)})"` : ''}/>`).join('') + '</g>';
}
// fine engraved rules framing the bands
body += '<g stroke-width=".9">' + [342, 350, 266, 198, 64].map((r) => `<circle r="${r}"/>`).join('') + '</g>';
const rosette = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="-400 -400 800 800">`
  + `<defs>${defs}</defs><g fill="none" stroke="#000">${body}</g></svg>\n`;
fs.writeFileSync(path.join(OUT, 'guilloche-rosette.svg'), rosette);

for (const f of ['guilloche-field.svg', 'guilloche-rosette.svg']) console.log(f, fs.statSync(path.join(OUT, f)).size, 'bytes');
