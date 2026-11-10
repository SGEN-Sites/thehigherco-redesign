// journal.mjs — /journal/ hub and the four articles (new pages; adopted IA: education journal with labels,
// article = contents -> body with a table -> quick answers -> shop CTA -> related posts).
import { esc, u, icon } from '../lib/html.mjs';
import { site } from '../content/site.mjs';
import { articles, REVIEWED } from '../content/journal.mjs';
import { img, aiTag, btn, kicker, pageHero, crumbsLD, sectionHead } from '../lib/parts.mjs';
import { articleLD } from '../lib/seo.mjs';

const bySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));

export function journalCards(list = articles, { cls = '' } = {}) {
  return `<ul class="jcards ${cls}" role="list">${list.map((a, i) => `<li class="jcard" data-reveal style="--i:${i % 4}">
  <a class="jcard__a" href="${u(`/journal/${a.slug}/`)}">
    <span class="jcard__media">${img(a.img, { sizes: '(max-width: 700px) 92vw, 320px', cls: 'jcard__img', alt: '', decorative: true })}</span>
    <span class="jcard__body"><span class="jcard__label">${esc(a.label)}</span><span class="jcard__t">${esc(a.h1.charAt(0).toUpperCase() + a.h1.slice(1))}</span><span class="jcard__meta">${a.minutes} min read</span></span>
  </a>
</li>`).join('')}</ul>`;
}

export function journalHub() {
  const [lead, ...rest] = articles;
  const main = `
${pageHero({
  kicker: 'The Journal', title: 'Learn before <em>you visit.</em>',
  lead: '<p>Straight answers from the shop floor at 123 E Willow St: how to read trichomes, what the strain labels mean, what to expect on your first visit, and New York&rsquo;s cannabis laws in plain English.</p>',
  crumbList: [['Home', '/'], ['Journal', '/journal/']],
  art: `<div class="phero__frame">${img('macro-v', { sizes: '(max-width: 900px) 60vw, 420px', cls: 'phero__img' })}${aiTag()}</div>`,
  cls: 'phero--art',
})}
<section class="band band--gallery" aria-labelledby="feat-t">
  <div class="container">
    <a class="jfeature" href="${u(`/journal/${lead.slug}/`)}" data-reveal>
      <span class="jfeature__media">${img(lead.img, { sizes: '(max-width: 900px) 100vw, 60vw', cls: 'jfeature__img', alt: '', decorative: true })}</span>
      <span class="jfeature__body"><span class="jcard__label">${esc(lead.label)} &middot; Featured</span><span class="jfeature__t" id="feat-t">${esc(lead.title)}</span><span class="jfeature__dek">${esc(lead.dek)}</span><span class="link-arrow">Read the guide ${icon('arrow')}</span></span>
    </a>
    <div class="jlabels" aria-label="Topics"><span class="chip">Learn</span><span class="chip">Visit</span><span class="chip">Law</span></div>
    ${journalCards(rest)}
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

export function articlePage(a) {
  const path = `/journal/${a.slug}/`;
  const crumb = [['Home', '/'], ['Journal', '/journal/'], [a.h1.charAt(0).toUpperCase() + a.h1.slice(1), path]];
  const toc = a.sections.map(([id, h]) => `<li><a href="#${id}">${h}</a></li>`).join('');
  const body = a.sections.map(([id, h, html]) => `<section class="art__sec" id="${id}" aria-labelledby="${id}-h"><h2 class="art__h2" id="${id}-h">${h}</h2>${html}</section>`).join('');
  const related = a.related.map((s) => bySlug[s]).filter(Boolean);
  const main = `
${pageHero({
  kicker: `${a.label} &middot; ${a.minutes} min read`, title: esc(a.h1.charAt(0).toUpperCase() + a.h1.slice(1)),
  lead: `<p>${esc(a.dek)}</p><p class="phero__meta">Reviewed ${REVIEWED} &middot; ${esc(site.name)}</p>`,
  crumbList: crumb,
  art: `<div class="phero__frame">${img(a.img, { sizes: '(max-width: 900px) 70vw, 460px', cls: 'phero__img' })}${aiTag()}</div>`,
  cls: 'phero--art phero--article',
})}
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
      <aside class="art__cta" aria-label="Shop">
        <p class="art__cta-t">${a.cta[0]}</p>
        ${btn(a.cta[2], a.cta[1], { v: 'mint' })}
      </aside>
      ${a.sources.length ? `<section class="sources" aria-labelledby="src-h"><h2 class="art__h3" id="src-h">Sources</h2><ul>${a.sources.map(([l, h]) => `<li><a href="${h}" rel="noopener" target="_blank">${l}<span class="sr-only"> (opens in a new tab)</span></a></li>`).join('')}</ul><p class="sources__note">General information for adults 21+, not legal advice. Laws and regulations change; last reviewed ${REVIEWED}.</p></section>` : `<p class="sources__note">General information for adults 21+. Last reviewed ${REVIEWED}.</p>`}
    </div>
  </div>
</article>
<section class="band band--gallery-2" aria-labelledby="rel-t">
  <div class="container">
    ${sectionHead('Keep reading', 'Related guides', '', { id: 'rel-t' })}
    ${journalCards(related, { cls: 'jcards--two' })}
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
