// docs-changelog.mjs — writes docs/CHANGE-LOG.md from audit/change-control.json (the ledger) and
// src/content/images.json (the generated media record), so the log can never drift from the decisions.
//   node tools/docs-changelog.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const L = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit/change-control.json'), 'utf8'));
const IM = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/images.json'), 'utf8'));
const esc = (s) => String(s || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const pathOf = (u) => { try { return new URL(u).pathname; } catch { return u; } };

const kept = L.rows.filter((r) => r.decision !== 'REMOVE' && r.decision !== 'ADD');
const added = L.rows.filter((r) => r.decision === 'ADD');
const removed = L.rows.filter((r) => r.decision === 'REMOVE');
const byPage = new Map();
for (const r of removed) { const p = pathOf(r.url); if (!byPage.has(p)) byPage.set(p, []); byPage.get(p).push(r); }

const copy = [
  ['Home, Top-Notch Vibes', 'We’re all about keeping it chill and spreading the love.', 'We’re all about keeping it chill and making everyone feel welcome.', 'Operator brief: drop the cliché.'],
  ['Home, Joint Masters at Your Service', 'Our squad of ganja gurus knows their stuff! They’ll guide you through the magic world of cannabis and help you find your perfect match.', 'Our squad of budtenders knows their stuff! They’ll guide you through the world of cannabis and help you find your perfect match.', 'Operator brief: drop the cliché.'],
  ['Home, Mind-Blowing Selection', 'Brace yourselves for an out-of-this-world collection of Adult-use recreational cannabis goodies. We’ve got everything you need to make your smoking sessions legendary!', 'Brace yourselves for an out-of-this-world collection of adult-use recreational cannabis. We’ve got everything you need, from the Flower Bar to the accessories shelf.', '9 NYCRR 129.2(b)(4) and (12): no promotion of overconsumption, no smoking imagery; "goodies" read as candy-adjacent (128.1(c)).'],
  ['About, Our Products', 'Concentrates: Potent and pure extracts like wax, shatter, and oils.', 'Concentrates: Pure extracts like wax, shatter, and oils.', '9 NYCRR 129.2(b)(13): no potency promotion. [CONFIRM WITH CLIENT]'],
  ['About, Our Products', 'Edibles: Tasty and effective options, from gummies to baked goods.', 'Edibles: Tasty options, from gummies to baked goods.', '9 NYCRR 129.2(b)(9): no efficacy or wellness claims. [CONFIRM WITH CLIENT]'],
  ['About, quote', '“We believe in the power of cannabis to enhance well-being and improve quality of life,” says Joe Sweet. “Our journey began with a passion for the plant …”', '“Our journey began with a passion for the plant and a commitment to providing safe, accessible, and high-quality cannabis products to our community.” (Joe Sweet)', '9 NYCRR 129.2(b)(9): no wellness claims; second sentence kept verbatim. [CONFIRM WITH CLIENT]'],
  ['FAQ, What are your hours?', 'Sunday: 10am – 8pm (FAQ) / Sunday: 11am – 6pm (footer, contact)', 'One set of hours site-wide, from the footer and contact page', 'The live site contradicted itself; one data source now drives every page. [CONFIRM WITH CLIENT]'],
];

let md = `# Change log

One row per section of the source site, generated from \`audit/change-control.json\` by \`tools/docs-changelog.mjs\`.
The live site had ${new Set(L.rows.filter((r) => r.decision !== 'ADD').map((r) => pathOf(r.url))).size} URLs: ${new Set(kept.map((r) => pathOf(r.url))).size} carried the store's own content and were kept on the same URLs; the rest were theme demo pages or empty pages (removed, each URL kept as a redirect page).

## Legend
- **PRESERVE**: kept as-is; content and function unchanged
- **IMPROVE**: same content and meaning, better structure, hierarchy or design
- **REPLACE**: superseded by a better structure (reason required)
- **REMOVE**: deliberately dropped (reason required)
- **ADD**: new section that did not exist on the source

## Decisions: kept pages

| page | section | decision | narrative slot | why |
|---|---|---|---|---|
${kept.map((r) => `| ${esc(pathOf(r.url))} | ${esc(r.label).slice(0, 70)} | ${r.decision} | ${esc(r.narrativeSlot)} | ${esc(r.why)} |`).join('\n')}

## Decisions: added pages

| page | decision | narrative slot | why |
|---|---|---|---|
${added.map((r) => `| ${esc(pathOf(r.url))} | ADD | ${esc(r.narrativeSlot)} | ${esc(r.why)} |`).join('\n')}

## Decisions: removed pages (grouped by URL)

Every section of these pages is recorded as REMOVE in the ledger with the reason below. The preset answers recorded for
these rows in \`audit/preset-match.json\` only close the matcher's queue; no section was built for them.

| page | sections | decision | why |
|---|---|---|---|
${[...byPage].map(([p, rows]) => `| ${esc(p)} | ${rows.length} | REMOVE | ${esc(rows[0].why)} |`).join('\n')}

## Copy that changed

AI may tighten wording. It may not change meaning, and it may not add a fact. Every rewrite keeps its original here.

| where | original | rewritten | reason |
|---|---|---|---|
${copy.map((c) => `| ${c.map(esc).join(' | ')} |`).join('\n')}

New copy on new pages (the Journal, The Flower Bar, The Crew, Visit Us, Join the List, Shop pages, legal pages) is
built only from \`facts/client-facts.json\`, the live site's own words, general botany, or New York statute and OCM
sources fetched on 2026-11-10 (cited on the page where it matters).

## Imagery

Nothing on the live site could be reused except the logo (in the 21+ gate image) and the store's own YouTube video:
every other image slot was a theme placeholder. The logo is vectorised from the client's own file
(\`tools/trace-logo.py\`, colour separation + potrace), never redrawn or AI-altered. The video plays from YouTube.

Generated with fal (FLUX1.1 [pro] Ultra stills, Recraft V4.1 vector, BiRefNet cut-outs, Bria eraser for two text
clean-ups, Kling 2.1 Pro loops). None depicts a real person, the real store, staff, customers or a real product:
each is labelled "AI illustration" on the page, carries \`data-ai="generated"\` and IPTC \`trainedAlgorithmicMedia\` in
its XMP, and is listed below with its request id. Real photos should replace the place images before launch.

| asset | what it shows | model / request id |
|---|---|---|
${Object.entries(IM.images).map(([id, m]) => `| ${id} | ${esc(m.alt.replace(/^AI illustration: /, ''))} | ${esc((m.provenance || []).map((p) => (p.endpoint || '') + ' ' + (p.request_id || '')).join(' + '))} |`).join('\n')}
${Object.entries(IM.videos).map(([id, m]) => `| ${id} | ${esc(m.alt)} | ${esc((m.provenance || []).map((p) => (p.endpoint || '') + ' ' + (p.request_id || '')).join(' + '))} |`).join('\n')}
`;
fs.writeFileSync(path.join(ROOT, 'docs/CHANGE-LOG.md'), md);
console.log('docs/CHANGE-LOG.md written:', kept.length, 'kept rows,', added.length, 'added,', byPage.size, 'removed pages');
