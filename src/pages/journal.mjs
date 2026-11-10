// journal.mjs — /journal/ hub and the four articles (new pages; adopted IA: education journal with labels,
// article = contents -> body with a table -> quick answers -> shop CTA -> related posts).
// Inner-pages pass (operator, 2026-11-10: "now that you have an idea and design principle from how we built the home
// page, i would like you to update all inner pages"): the home page's language carried over. Every heading, sentence,
// list, table cell, label and read time is the content's own (src/content/journal.mjs); only the layout, the pictures
// and the styling changed (src/styles/inner-journal.css). No new script: the tiles, the contents index and the key
// lights use behaviour site.js already wires by markup (data-reveal, data-spot, .art__toc).
import { esc, u, icon } from '../lib/html.mjs';
import { site } from '../content/site.mjs';
import { articles, REVIEWED } from '../content/journal.mjs';
import { img, aiTag, btn, pageHero, crumbsLD, sectionHead } from '../lib/parts.mjs';
import { articleLD } from '../lib/seo.mjs';

const bySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const TOPICS = ['Learn', 'Visit', 'Law'];   // the guides' labels; each has a colour dot (inner-journal.css [data-topic])

// The guide's picture. The first-visit guide shows the shop's own photograph of 123 E Willow St in place of the AI
// interior (home principle: prefer the store's real photos). The crop holds the aisle of lit display cases on the right
// of the photo, not the counter with the logo: object-position plus a zoom (--z) from the same corner, which the tiles
// and the phone hero apply (inner-journal.css); the tall desktop frame needs no zoom.
const PIC = { 'first-visit-guide': { id: 'photo-interior', pos: '100% 45%', z: 2.1 } };
const pic = (a) => PIC[a.slug] || { id: a.img, pos: '', z: 0 };
const NOTE = {
  'photo-counter': '<!-- [CONFIRM WITH CLIENT] the counter photo shows staff and identifiable customers: confirm consent (everyone pictured agreed to appear on the website, or blur the customers), and that it is the client\'s own photo. -->',
  'photo-interior': '<!-- [CONFIRM WITH CLIENT] the first-visit guide now uses the shop\'s own interior photo (the one on the home page): confirm it is the client\'s own photograph, not a Google Maps customer photo. -->',
};
const note = (id) => NOTE[id] || '';
const picImg = (p, o) => img(p.id, { ...o, style: p.pos ? `object-position: ${p.pos}; transform-origin: ${p.pos}${p.z ? `; --z: ${p.z}` : ''}` : '' });

// A title in the home's heading voice: the words after the colon (or the last comma) in the serif italic, like
// "Legacy to legal, <em>on Willow Street.</em>"; a title without either sets its last word that way. Same words.
function voiced(t) {
  const c = t.indexOf(': '), k = c > 0 ? c + 1 : t.lastIndexOf(', ') > 0 ? t.lastIndexOf(', ') + 1 : t.lastIndexOf(' ');
  return k > 0 ? `${esc(t.slice(0, k))} <em>${esc(t.slice(k + 1))}</em>` : esc(t);
}

// One guide as a tile, shared by the hub's bento and the guides' "Related guides" band so both read alike. The title
// is the link and its overlay covers the tile, so the whole tile is one target with a short accessible name.
//   look 'photo': the picture fills the tile and the words sit on a deep fade; 'card': the picture over a paper panel.
//   peek: the summary opens on hover or focus where the pointer can hover (always shown on touch screens).
function tile(a, { look = 'photo', pos = '', lead = false, tag = 'h2', i = 0, peek = false, sizes = '(max-width: 760px) 92vw, 46vw' } = {}) {
  const p = pic(a);
  if (p.z) sizes = '(max-width: 760px) 100vw, 60vw';   // a zoomed crop needs a larger file
  return `<li class="jt-li${pos ? ' jt-li--' + pos : ''}" data-reveal style="--i:${i}">${note(p.id)}
  <article class="jt jt--${look}${lead ? ' jt--lead' : ''}${peek ? ' jt--peek' : ''}" data-topic="${a.label.toLowerCase()}">
    <span class="jt__media">${picImg(p, { cls: 'jt__img', sizes, alt: '', decorative: true })}</span>
    <div class="jt__body">
      <p class="jt__label"><span class="jt__dot" aria-hidden="true"></span>${esc(a.label)}${lead ? ' &middot; Featured' : ''}</p>
      <${tag} class="jt__t"><a class="jt__a" href="${u(`/journal/${a.slug}/`)}">${esc(lead ? a.title : cap(a.h1))}</a></${tag}>
      <p class="jt__dek">${esc(a.dek)}</p>
      <p class="jt__meta">${a.minutes} min read</p>
      ${lead ? `<span class="link-arrow jt__go" aria-hidden="true">Read the guide ${icon('arrow')}</span>` : ''}
    </div>
  </article>
</li>`;
}

// kept for build.mjs and any caller: a row of guide tiles
export function journalCards(list = articles, { cls = '', tag = 'h2', look = 'photo' } = {}) {
  return `<ul class="jtiles ${cls}" role="list">${list.map((a, i) => tile(a, { look, tag, i })).join('')}</ul>`;
}

export function journalHub() {
  const [lead, b, c, d] = articles;
  const main = `
${pageHero({
  kicker: 'The Journal', title: 'Learn before <em>you visit.</em>',
  // the three topics sit under the lead as glass chips, like the chips under the home hero
  lead: `<p>Straight answers from the shop floor at 123 E Willow St: how to read trichomes, what the strain labels mean, what to expect on your first visit, and New York&rsquo;s cannabis laws in plain English.</p>
<ul class="jtopics" role="list" aria-label="Topics">${TOPICS.map((t) => `<li class="chip chip--glass" data-topic="${t.toLowerCase()}"><span class="jt__dot" aria-hidden="true"></span>${t}</li>`).join('')}</ul>`,
  crumbList: [['Home', '/'], ['Journal', '/journal/']],
  // "straight answers from the shop floor": the shop's own photo of the crew at the counter (was an AI flower close-up)
  art: `${note('photo-counter')}<div class="phero__frame">${img('photo-counter', { sizes: '(max-width: 900px) 92vw, 420px', cls: 'phero__img', style: 'object-position: 42% 40%' })}</div>`,
  cls: 'phero--art phero--journal',
})}
<!-- All four guides at once, as a bento (inner pages, 2026-11-10): the lead guide large, the strain-label guide wide
     beside it, the visit and law guides as paper cards. Pictures wipe in as the tiles rise; on a pointer that can hover,
     the summaries of the three smaller tiles open on hover or focus (always shown on touch screens). -->
<section class="band band--gallery band--tight jhub" aria-label="The four guides">
  <div class="container">
    <ul class="jbento" role="list">
      ${tile(lead, { look: 'photo', pos: 'a', lead: true, i: 0, sizes: '(max-width: 1180px) 92vw, 54vw' })}
      ${tile(b, { look: 'photo', pos: 'b', i: 1, peek: true, sizes: '(max-width: 1000px) 92vw, (max-width: 1180px) 31vw, 46vw' })}
      ${tile(c, { look: 'card', pos: 'c', i: 2, peek: true, sizes: '(max-width: 760px) 92vw, (max-width: 1180px) 46vw, 23vw' })}
      ${tile(d, { look: 'card', pos: 'd', i: 3, peek: true, sizes: '(max-width: 760px) 92vw, (max-width: 1180px) 46vw, 23vw' })}
    </ul>
  </div>
</section>`;
  return {
    path: '/journal/',
    title: 'Journal: Cannabis Guides from The Higher Company, Syracuse',
    description: 'Guides from The Higher Co. in downtown Syracuse: trichomes, indica vs sativa vs hybrid, what to expect on your first visit, and New York cannabis laws in plain English.',
    main,
    jsonld: [crumbsLD([['Home', '/'], ['Journal', '/journal/']])],
    bodyClass: 'page-journal',
  };
}

// Tables: each in a paper card (the wrapper scrolls sideways if a table is ever wider than the column) and each cell
// told its column's name, so phones can show a row as a small card with the column names as labels. The words are the
// content's own; the ARIA roles keep the table's semantics when phones change how the cells display.
function tables(html) {
  return html.replace(/<table class="table">([\s\S]*?)<\/table>/g, (m, inner) => {
    const head = (inner.match(/<thead>([\s\S]*?)<\/thead>/) || ['', ''])[1];
    const cols = [...head.matchAll(/<th scope="col">([\s\S]*?)<\/th>/g)].map((x) => x[1].replace(/<[^>]+>/g, '').trim());
    const t = inner
      .replace('<thead>', '<thead role="rowgroup">').replace('<tbody>', '<tbody role="rowgroup">')
      .replace(/<th scope="col">/g, '<th scope="col" role="columnheader">')
      .replace(/<tr>([\s\S]*?)<\/tr>/g, (r, cells) => { let j = 0; return `<tr role="row">${cells.replace(/<th scope="row">/g, '<th scope="row" role="rowheader">').replace(/<td>/g, () => `<td role="cell" data-label="${esc(cols[++j] || '')}">`)}</tr>`; });
    return `<div class="tablewrap" data-cols="${cols.length}"><table class="table" role="table">${t}</table></div>`;
  });
}

export function articlePage(a) {
  const path = `/journal/${a.slug}/`;
  const name = cap(a.h1);
  const crumb = [['Home', '/'], ['Journal', '/journal/'], [name, path]];
  const p = pic(a);
  const toc = a.sections.map(([id, h]) => `<li><a href="#${id}">${h}</a></li>`).join('');
  const body = a.sections.map(([id, h, html]) => `<section class="art__sec" id="${id}" aria-labelledby="${id}-h"><h2 class="art__h2" id="${id}-h">${h}</h2>${tables(html)}</section>`).join('');
  const related = a.related.map((s) => bySlug[s]).filter(Boolean);
  const main = `
${pageHero({
  kicker: `${a.label} &middot; ${a.minutes} min read`, title: voiced(name),
  lead: `<p>${esc(a.dek)}</p><p class="phero__meta">Reviewed ${REVIEWED} &middot; ${esc(site.name)}</p>`,
  crumbList: crumb,
  art: `${note(p.id)}<div class="phero__frame">${picImg(p, { sizes: '(max-width: 900px) 92vw, 420px', cls: 'phero__img' })}${p.id.startsWith('photo-') ? '' : aiTag()}</div>`,
  cls: 'phero--art phero--article',
})}
<!-- The guide (inner pages, 2026-11-10): a sticky contents card on desktop (a swipe row of chips on phones) and a
     reading column with numbered sections, tables in paper cards, then the quick answers and the shop bar. -->
<article class="band band--gallery art" aria-labelledby="art-t">
  <h2 class="sr-only" id="art-t">${esc(a.title)}</h2>
  <div class="container art__grid">
    <aside class="art__toc" aria-label="On this page">
      <p class="kicker">On this page</p>
      <ol>${toc}<li><a href="#quick">Quick answers</a></li></ol>
    </aside>
    <div class="art__body prose">
      ${body}
      <section class="quick" id="quick" aria-labelledby="quick-h">
        <h2 class="art__h2" id="quick-h">Quick answers</h2>
        <dl>${a.quick.map(([q, ans]) => `<div class="quick__item"><dt>${q}</dt><dd>${ans}</dd></div>`).join('')}</dl>
      </section>
      <aside class="art__cta" aria-label="Shop" data-spot>
        <div class="band__light" aria-hidden="true"></div>
        <p class="art__cta-t">${a.cta[0]}</p>
        ${btn(a.cta[2], a.cta[1], { v: 'mint' })}
      </aside>
      ${a.sources.length ? `<section class="sources" aria-labelledby="src-h"><h2 class="art__h3" id="src-h">Sources</h2><ul>${a.sources.map(([l, h]) => `<li><a href="${h}" rel="noopener" target="_blank">${l}&#8288;${icon('out')}<span class="sr-only"> (opens in a new tab)</span></a></li>`).join('')}</ul><p class="sources__note">General information for adults 21+, not legal advice. Laws and regulations change; last reviewed ${REVIEWED}.</p></section>` : `<p class="sources__note">General information for adults 21+. Last reviewed ${REVIEWED}.</p>`}
    </div>
  </div>
</article>
<!-- Related guides on the dark (inner pages, 2026-11-10): a brass divider marks the straight light-to-dark edge, the
     tiles are the hub's, and the band runs on into the footer (shared CSS fades a dark last band into it). -->
<section class="band band--ink band--tight jrel" aria-labelledby="rel-t" data-spot>
  <span class="brass-rule brass-rule--top" aria-hidden="true"></span>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container">
    ${sectionHead('Keep reading', 'Related guides', '', { id: 'rel-t' })}
    ${journalCards(related, { cls: 'jtiles--two', tag: 'h3' })}
  </div>
</section>`;
  return {
    path,
    title: a.title,
    description: a.description,
    main,
    jsonld: [articleLD(a, path), crumbsLD(crumb)],
    bodyClass: 'page-article',
  };
}

export const journalPages = () => [journalHub(), ...articles.map(articlePage)];
