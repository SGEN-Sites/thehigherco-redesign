// plan-decisions.mjs — Phase B: record a change-control decision for every ledger row (through sr-plan --set),
// answer every preset match (through sr-match --answer), and append one ADD row per new page.
//   node tools/plan-decisions.mjs
// Decisions are data below, so the ledger can be rebuilt and diffed. Removed rows get the matcher's own top
// candidate only to close its queue: no section is built for them (stated in docs/CHANGE-LOG.md).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SR = path.join(process.env.HOME, '.claude/skills/site-reforge/scripts');
const ORIGIN = 'https://www.thehigherco420.com';
const run = (script, args) => execFileSync('node', [path.join(SR, script), '--project', ROOT, ...args], { encoding: 'utf8' });

const DEMO_WHY = 'Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company\'s content; republishing it under the brand would mislead. URL kept as a redirect page.';
const keep = {
  'www.thehigherco420.com/#s1': ['IMPROVE', 'value-proposition', '01-transitions-hero-motion-8-the-dominant-hero', 'Hero rebuilt as the Liberty art + monogram hero; H1 "The Higher Co." and the subline kept verbatim; the YouTube background video becomes a click-to-play film on The Flower Bar page.'],
  'www.thehigherco420.com/#s2': ['IMPROVE', 'trust-positioning', '10-sections-4-features-services', 'Welcome, Flower Bar and three-feature copy kept; "ganja gurus", "spreading the love" and "legendary smoking sessions" rewritten (operator brief + 9 NYCRR 129.2(b)(4)); the five pillars added.'],
  'www.thehigherco420.com/#s3': ['REPLACE', 'benefits-solution', 'card-grid', 'The live "Our Products" block rendered empty; replaced by the six categories the online menu carries, each linking to an in-site category page that opens straight to products with a working cart.'],
  'www.thehigherco420.com/#s4': ['IMPROVE', 'strategic-cta', 'cta-banner', '"Stay Connected" kept as the Join the List band.'],
  'www.thehigherco420.com/#s5': ['IMPROVE', 'strategic-cta', '10-sections-11-forms-lead-gen', '"Unlock Exclusive Offers & More / Join" kept, linking to /subscribe/.'],
  'www.thehigherco420.com/#s6': ['IMPROVE', 'footer', '10-sections-10-footers', 'Footer rebuilt: address, hours, licence, NY OCM warnings, socials.'],
  'www.thehigherco420.com/about#s1': ['IMPROVE', 'trust-positioning', 'feature-split', 'About copy kept on the same URL as Our Story; founders, The Higher Calling and Stop the Stigma added from declared facts; "Potent" and the quote\'s well-being sentence trimmed (9 NYCRR 129.2(b)(9),(13)) [CONFIRM WITH CLIENT].'],
  'www.thehigherco420.com/about#s2': ['IMPROVE', 'benefits-solution', '10-sections-4-features-services', 'Mission, values, products and community sections kept and restyled.'],
  'www.thehigherco420.com/about#s3': ['IMPROVE', 'footer', '10-sections-10-footers', 'Shared footer.'],
  'www.thehigherco420.com/connect#s1': ['IMPROVE', 'strategic-cta', 'contact-form-1', 'Connect copy and Name / Email / Message form kept; the form now opens a pre-filled email to the store (no backend) [CONFIRM WITH CLIENT form provider].'],
  'www.thehigherco420.com/connect#s2': ['IMPROVE', 'footer', '10-sections-10-footers', 'Shared footer.'],
  'www.thehigherco420.com/contact#s1': ['IMPROVE', 'strategic-cta', 'contact-form-2', 'Contact copy, phone and email kept.'],
  'www.thehigherco420.com/contact#s2': ['IMPROVE', 'strategic-cta', 'card-grid', 'Location / phone / mail / hours cards kept; the Leaflet map becomes a click-to-load map plus directions links.'],
  'www.thehigherco420.com/contact#s3': ['IMPROVE', 'footer', '10-sections-10-footers', 'Shared footer.'],
  'www.thehigherco420.com/faqs#s1': ['IMPROVE', 'objection-handling', 'accordion-faq', 'Every live question and answer kept verbatim as an accessible accordion; FAQPage JSON-LD.'],
  'www.thehigherco420.com/faqs#s2': ['IMPROVE', 'footer', '10-sections-10-footers', 'Shared footer.'],
  'www.thehigherco420.com/shop#s1': ['IMPROVE', 'benefits-solution', '14-ecommerce-2-sgen-living-styleguide-14-e-commerce-flow-components-live-2', 'The live embedded menu kept, opened on all products, framed as Shop Cannabis with category chips.'],
  'www.thehigherco420.com/shop#s2': ['IMPROVE', 'footer', '10-sections-10-footers', 'Shared footer.'],
  'www.thehigherco420.com/subscribe#s1': ['IMPROVE', 'strategic-cta', 'cta-banner', 'Kept as Join the List (no rewards programme exists).'],
  'www.thehigherco420.com/subscribe#s2': ['IMPROVE', 'strategic-cta', '10-sections-11-forms-lead-gen', 'The live form rendered no fields; rebuilt with name, email and a 21+ confirmation, sent by email until a list provider is chosen [CONFIRM WITH CLIENT].'],
  'www.thehigherco420.com/subscribe#s3': ['IMPROVE', 'footer', '10-sections-10-footers', 'Shared footer.'],
};
const removeWhy = {
  gallery: 'The live Gallery page shows a heading and three attachment cards with no images; nothing to carry. URL redirects to The Flower Bar, which carries the store\'s own video.',
  media: 'The live Media page is empty. URL redirects to the Journal.',
  'sample-page-2': 'A theme "Coming Soon" placeholder. URL redirects home.',
  delivery: 'The live page is titled "Need Weed? We Deliver!" but its body is theme demo text, and the live FAQ says "We currently do not offer delivery". URL redirects to that FAQ answer.',
  'retail-space': 'Title "Retail Space Coming Soon" over theme demo text. URL redirects home.',
};

const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit/change-control.json'), 'utf8'));
const match = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit/preset-match.json'), 'utf8'));
const top = new Map(match.rows.map((r) => [r.rowId, r.candidates && r.candidates[0] && r.candidates[0].presetId]));
const answers = [];
let n = 0;
for (const row of ledger.rows) {
  const k = keep[row.id];
  let decision, slot = '', preset, why;
  if (k) { [decision, slot, preset, why] = k; }
  else {
    const p = new URL(row.url).pathname.replace(/^\/|\/$/g, '');
    decision = 'REMOVE'; preset = top.get(row.id);
    why = removeWhy[p] || DEMO_WHY;
  }
  const args = ['--set', row.id, '--decision', decision, '--why', why];
  if (slot) args.push('--slot', slot);
  if (preset && decision !== 'REMOVE') args.push('--preset', preset);
  run('sr-plan.mjs', args);
  if (preset) answers.push(row.id + '=' + preset);
  n++;
}
console.log('rows set:', n);
// answer the matcher in chunks
for (let i = 0; i < answers.length; i += 40) {
  const chunk = answers.slice(i, i + 40).flatMap((a) => ['--answer', a]);
  try { run('sr-match.mjs', chunk); } catch (e) { process.stdout.write(String(e.stdout || '')); }
}

// ADD rows: one per new page (C16 counts build pages that are in neither the source nor an ADD decision)
const ADD = [
  ['/shop/flower/', 'benefits-solution', 'card-grid', 'Shop Cannabis category page: the store\'s own menu opened on Flower, so the category button lands on products with a working cart.'],
  ['/shop/pre-rolls/', 'benefits-solution', 'card-grid', 'Category page: menu opened on Pre-Rolls.'],
  ['/shop/vaporizers/', 'benefits-solution', 'card-grid', 'Category page: menu opened on Vaporizers.'],
  ['/shop/concentrates/', 'benefits-solution', 'card-grid', 'Category page: menu opened on Concentrates.'],
  ['/shop/edibles/', 'benefits-solution', 'card-grid', 'Category page: menu opened on Edibles.'],
  ['/shop/accessories/', 'benefits-solution', 'card-grid', 'Category page: menu opened on Accessories.'],
  ['/lifestyle/', 'benefits-solution', 'gallery-row', 'Shop Lifestyle: merch drops (in store only, 9 NYCRR 129.2(j)) and the accessories shelf, split from Shop Cannabis per the adopted IA.'],
  ['/the-flower-bar/', 'trust-positioning', 'feature-split', 'The Flower Bar: 90 strains, smell and view the trichomes with a magnifying glass (live claims), the store\'s own video.'],
  ['/about/the-crew/', 'trust-positioning', '10-sections-8-team-gallery', 'The Crew: founders and budtenders, no invented names or photos [CONFIRM WITH CLIENT].'],
  ['/journal/', 'benefits-solution', '10-sections-9-content-blog', 'Journal hub (adopted IA: education journal).'],
  ['/journal/what-are-trichomes/', 'benefits-solution', '10-sections-9-content-blog', 'Journal: trichomes, written from general botany, no health claims.'],
  ['/journal/indica-sativa-hybrid/', 'benefits-solution', '10-sections-9-content-blog', 'Journal: strain types.'],
  ['/journal/first-visit-guide/', 'objection-handling', '10-sections-9-content-blog', 'Journal: first-visit guide from the live FAQ facts.'],
  ['/journal/new-york-cannabis-laws/', 'objection-handling', '10-sections-9-content-blog', 'Journal: NY cannabis laws, cited to statute and OCM, reviewed 2026-11-10.'],
  ['/visit/', 'strategic-cta', 'feature-split', 'Visit Us: address, hours, parking, ID, payment, pickup rules.'],
  ['/legal/', 'footer', '10-sections-10-footers', 'Legal hub.'],
  ['/legal/privacy/', 'footer', '10-sections-10-footers', 'Privacy notice for this site [CONFIRM WITH CLIENT legal review].'],
  ['/legal/terms/', 'footer', '10-sections-10-footers', 'Terms of use [CONFIRM WITH CLIENT legal review].'],
  ['/legal/compliance/', 'footer', '10-sections-10-footers', 'NY OCM compliance: licence, required warnings, HOPEline, verification.'],
  ['/legal/accessibility/', 'footer', '10-sections-10-footers', 'Accessibility statement.'],
  ['/404.html', 'footer', '10-sections-10-footers', 'Not-found page.'],
];
ledger.rows = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit/change-control.json'), 'utf8')).rows.filter((r) => r.decision !== 'ADD');
for (const [p, slot, preset, why] of ADD) {
  ledger.rows.push({ id: 'add:' + p, url: ORIGIN + p, pageType: 'added', index: 0, label: p, sourceTag: '', sourceClass: '', decision: 'ADD', why, narrativeSlot: slot, presetId: preset, rebuiltAs: p.endsWith('.html') ? p.slice(1) : p.slice(1) + 'index.html' });
}
ledger.rowCount = ledger.rows.length;
ledger.updated = new Date().toISOString();
fs.writeFileSync(path.join(ROOT, 'audit/change-control.json'), JSON.stringify(ledger, null, 2));
console.log('ADD rows:', ADD.length, 'total rows:', ledger.rows.length);
console.log(run('sr-plan.mjs', ['--check']).split('\n').slice(-6).join('\n'));
