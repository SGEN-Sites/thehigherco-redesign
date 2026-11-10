// parts.mjs — shared components. Markup only; behaviour lives in src/scripts/site.js, looks in src/styles/.
import { esc, u, icon, readJSON, cx } from './html.mjs';
import { site, categories, pillars } from '../content/site.mjs';

const IM = readJSON('src/content/images.json');

// <img> from the processed manifest. data-ai comes from the manifest: "generated" (AI art, alt says so) or
// "enhanced" (the client's own photographs, upscaled and graded, nothing generated).
export function img(id, { sizes = '100vw', cls = '', alt, decorative = false, priority = false, style = '', attrs = '' } = {}) {
  const m = IM.images[id];
  if (!m) throw new Error('unknown image ' + id);
  const files = m.files;
  const a = decorative ? '' : (alt ?? m.alt);
  const load = priority ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"';
  if (files.length === 1 && files[0].file.endsWith('.svg')) {
    return `<img class="${cls}" src="${u('/' + files[0].file)}" width="${m.w}" height="${m.h}" alt="${esc(a)}" ${load} decoding="async" data-ai="${m.ai || 'generated'}"${style ? ` style="${style}"` : ''}${attrs ? ' ' + attrs : ''}>`;
  }
  const srcset = files.map((f) => `${u('/' + f.file)} ${f.w}w`).join(', ');
  const fallback = (files.find((f) => f.w >= 1200) || files[files.length - 1]).file;
  return `<img class="${cls}" src="${u('/' + fallback)}" srcset="${srcset}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(a)}" ${load} decoding="async" data-ai="${m.ai || 'generated'}"${style ? ` style="${style}"` : ''}${attrs ? ' ' + attrs : ''}>`;
}
export const imgMeta = (id) => IM.images[id];
export const videoMeta = (id) => IM.videos[id];

// the night storefront, with the phone crop
export function storefrontPicture({ cls = '', priority = false } = {}) {
  const wide = IM.images.storefront, tall = IM.images['storefront-tall'];
  return `<picture class="${cls}">
  <source media="(max-width: 700px)" srcset="${u('/' + tall.files[0].file)}" width="${tall.w}" height="${tall.h}">
  ${img('storefront', { sizes: '100vw', cls: 'pic__img', priority })}
</picture>`;
}

// the building (home hero) at golden hour or at night: 16:9 on wide screens, a 9:16 crop for phones
export function heroPicture(base, { cls = '', priority = false } = {}) {
  const tall = IM.images[base + '-tall'];
  const set = tall.files.map((f) => `${u('/' + f.file)} ${f.w}w`).join(', ');
  return `<picture class="${cls}">
  <source media="(max-width: 700px)" srcset="${set}" sizes="100vw" width="${tall.w}" height="${tall.h}">
  ${img(base, { sizes: '100vw', cls: 'pic__img', priority })}
</picture>`;
}
export const goldenPicture = (o) => heroPicture('hero-golden', o);

// Gallery wall label — used for every AI illustration (honest + on concept) and for people without photos.
// The visible tag is off site-wide (operator, 2026-11-10: "lets remove these [AI illustration tags] across the site").
// Disclosure stays in each image's alt text ("AI illustration: ..."), in its IPTC DigitalSourceType metadata and in the
// footer and terms notes. Call sites are kept, so the tag can come back in one place.
export const aiTag = () => '';
export const wallLabel = (title, lines = [], cls = '') => `<div class="wall-label ${cls}"><p class="wall-label__t">${title}</p>${lines.map((l) => `<p class="wall-label__l">${l}</p>`).join('')}</div>`;

export function btn(label, href, { v = 'mint', ico = 'arrow', ext = false, cls = '', size = '', attrs = '' } = {}) {
  const extA = ext ? ' rel="noopener" target="_blank"' : '';
  const sr = ext ? '<span class="sr-only"> (opens in a new tab)</span>' : '';
  const i = ico ? icon(ext ? 'out' : ico) : '';
  return `<a class="${cx('btn', 'btn--' + v, size && 'btn--' + size, cls)}" href="${/^(https?:|tel:|mailto:|#)/.test(href) ? href : u(href)}"${extA} ${attrs} data-magnetic><span class="btn__t">${label}</span>${i}${sr}</a>`;
}
export const kicker = (t, cls = '') => `<p class="kicker ${cls}">${t}</p>`;

export function crumbs(list) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${list.map(([l, h], i) => i === list.length - 1
    ? `<li><span aria-current="page">${esc(l)}</span></li>`
    : `<li><a href="${u(h)}">${esc(l)}</a></li>`).join('')}</ol></nav>`;
}
export const crumbsLD = (list) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: list.map(([l, h], i) => ({ '@type': 'ListItem', position: i + 1, name: l, item: site.origin + h })),
});

// Inner-page hero: ink ground, key light, optional art breaking out of the bottom edge.
export function pageHero({ kicker: k, title, lead = '', actions = '', art = '', crumbList, cls = '', aside = '' }) {
  return `<section class="phero ${cls}" data-spot>
  <div class="phero__light" aria-hidden="true"></div>
  <div class="container phero__in">
    <div class="phero__copy">
      ${crumbList ? crumbs(crumbList) : ''}
      ${k ? kicker(k) : ''}
      <h1 class="phero__t" data-reveal>${title}</h1>
      ${lead ? `<div class="phero__lead" data-reveal style="--i:1">${lead}</div>` : ''}
      ${actions ? `<div class="actions" data-reveal style="--i:2">${actions}</div>` : ''}
    </div>
    ${aside ? `<div class="phero__aside">${aside}</div>` : ''}
  </div>
  ${art ? `<div class="phero__art" data-depth="-0.12">${art}</div>` : ''}
</section>`;
}

// The six menu categories as gallery cases on an oak shelf. Every card goes to an in-site page that opens
// straight on that category of the live menu.
export function categoryShelf({ id = 'shop-cats', title = 'Shop by category', lead = '', k = 'Shop Cannabis', headingTag = 'h2' } = {}) {
  return `<section class="band band--ink shelf" id="${id}" aria-labelledby="${id}-t" data-spot>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container">
    <div class="sect-head">
      ${kicker(k)}
      <${headingTag} class="sect-t" id="${id}-t" data-reveal>${title}</${headingTag}>
      ${lead ? `<p class="sect-lead" data-reveal style="--i:1">${lead}</p>` : ''}
    </div>
    <ul class="shelf__grid" role="list">
      ${categories.map((c, i) => {
        // each product is fitted into a box 70% of the case wide and --obj tall: 15vw on six-across desktops, 24vw at
        // three across, 40vw at two across (the CSS caps each)
        const r = IM.images[c.img].ratio;
        const sizes = `(max-width: 700px) ${Math.max(4, Math.round(Math.min(40 * r, 31)))}vw, (max-width: 1180px) ${Math.max(3, Math.round(Math.min(24 * r, 20)))}vw, ${Math.max(2, Math.round(Math.min(15 * r, 10)))}vw`;
        return `<li class="shelf__item" data-reveal style="--i:${i % 3}">
        <a class="case" href="${u(`/shop/${c.slug}/`)}" data-tilt>
          <span class="case__obj">${img(c.img, { sizes, cls: 'case__img', alt: '', decorative: true })}</span>
          <span class="case__name">${esc(c.name)}</span>
          <span class="case__line">${esc(c.line)}</span>
          <span class="case__cart" aria-hidden="true">${icon('bag')}</span>
          <span class="sr-only">Shop ${esc(c.name.toLowerCase())}</span>
        </a>
      </li>`;
      }).join('')}
    </ul>
    <p class="shelf__note">Every category opens the live menu with prices, stock and a cart. Order ahead, then pick up in store with your ID.</p>
  </div>
</section>`;
}

// The store's own embedded menu. The inline script writes the deep link into the URL BEFORE the async embed
// script runs (the embed reads dtche[...] from the page URL on load), unless the visitor already has one.
export function menuEmbed({ category = null, label = 'All products' } = {}) {
  const key = category ? 'dtche[category]' : 'dtche[path]';
  const val = category ? category : 'products';
  return `<section class="menu" aria-label="Live menu: ${esc(label)}">
  <!-- [CONFIRM WITH CLIENT] the embedded menu is the store's own online menu, but its store profile in the menu provider's back office still carries another business name, which shows inside the menu's cart. Rename the store profile (and its announcement text) to The Higher Company before launch; it cannot be changed from this website. -->
  <div class="menu__frame" data-menu>
    <div class="menu__loading" data-menu-loading><span class="spinner" aria-hidden="true"></span><span>Loading the live menu&hellip;</span></div>
    <script>(function(){try{var p=new URLSearchParams(location.search);if(!p.has('dtche[category]')&&!p.has('dtche[path]')&&!p.has('dtche[product]')&&!p.has('dtche[brands]')){p.set(${JSON.stringify(key)},${JSON.stringify(val)});history.replaceState(history.state,'',location.pathname+'?'+p.toString()+location.hash);}}catch(e){}})();</script>
    <script async id="dutchie--embed__script" src="${site.menu.script}"></script>
  </div>
  <noscript><p class="menu__noscript">The live menu needs JavaScript. Call <a href="tel:${site.phone.tel}">${site.phone.display}</a> and we&rsquo;ll help you over the phone.</p></noscript>
</section>`;
}

export function ytFacade({ cls = '' } = {}) {
  return `<div class="yt ${cls}" data-yt="${site.youtube.id}" data-yt-title="${esc(site.youtube.title)}">
  <button class="yt__btn" type="button" data-yt-play>
    <img class="yt__poster" src="${u('/assets/img/brand/yt-poster.webp')}" width="640" height="359" alt="" loading="lazy" decoding="async">
    <span class="yt__play" aria-hidden="true">${icon('play')}</span>
    <span class="yt__label"><span class="kicker">Real footage</span><span class="yt__title">${esc(site.youtube.title)}</span><span class="yt__meta">From our YouTube channel. Plays from YouTube when you press play.</span></span>
    <span class="sr-only">Play the video</span>
  </button>
</div>`;
}

export function mapFacade() {
  return `<div class="map" data-map="${esc(site.directions.embed)}">
  <div class="map__face">
    <p class="map__addr">${icon('pin')} ${esc(site.address.long)}</p>
    <div class="actions">
      <button class="btn btn--ink btn--sm" type="button" data-map-load><span class="btn__t">Show the map</span>${icon('map')}</button>
      ${btn('Google Maps', site.directions.google, { v: 'ghost-dark', size: 'sm', ext: true })}
      ${btn('Apple Maps', site.directions.apple, { v: 'ghost-dark', size: 'sm', ext: true })}
    </div>
    <p class="map__note">The map loads from Google only when you ask for it.</p>
  </div>
</div>`;
}

export function hoursTable({ id = 'hours' } = {}) {
  const fmt = (t) => { const [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'pm' : 'am'; const hh = h % 12 || 12; return m ? `${hh}:${String(m).padStart(2, '0')}${ap}` : `${hh}${ap}`; };
  return `<table class="hours" id="${id}" data-hours-table>
  <caption class="sr-only">Store hours</caption>
  <tbody>${site.hours.map((h) => `<tr data-day="${h.day}"><th scope="row">${h.name}</th><td>${fmt(h.open)} &ndash; ${fmt(h.close)}</td></tr>`).join('')}</tbody>
</table>`;
}

export function faqList(items, { idPrefix = 'q', openFirst = true } = {}) {
  return `<div class="faq">${items.map(([q, a], i) => `<details class="faq__item" id="${idPrefix}-${i + 1}"${i === 0 && openFirst ? ' open' : ''}>
  <summary class="faq__q"><span>${q}</span><span class="faq__ico" aria-hidden="true">${icon('plus')}</span></summary>
  <div class="faq__a">${a}</div>
</details>`).join('')}</div>`;
}

export function pillarList({ cls = '' } = {}) {
  return `<ol class="pillars ${cls}">${pillars.map((p, i) => `<li class="pillars__item" data-pillar="${i}"><span class="pillars__n">${p.n}</span><span class="pillars__body"><span class="pillars__name">${p.name}</span><span class="pillars__line">${p.line}</span></span></li>`).join('')}</ol>`;
}

// The Join band over the skyline (operator, 2026-11-10): Lady Liberty on the right stays in view, so the card sits under
// the heading on the left, over a dark fade; phones get a right-hand crop that keeps her in frame.
export function joinBand({ title = 'Stay Connected', sub = 'Unlock Exclusive Offers &amp; More', cls = '' } = {}) {
  const tall = IM.images['join-sky-tall'];
  const tallSet = tall.files.map((f) => `${u('/' + f.file)} ${f.w}w`).join(', ');
  return `<section class="band band--ink join join--sky ${cls}" aria-labelledby="join-t">
  <div class="join__media" aria-hidden="true"><picture>
    <source media="(max-width: 700px)" srcset="${tallSet}" sizes="120vw" width="${tall.w}" height="${tall.h}">
    ${img('join-sky', { sizes: '100vw', cls: 'join__img', decorative: true })}
  </picture></div>
  <div class="join__scrim" aria-hidden="true"></div>
  <div class="container join__in">
    <div class="join__copy">
      ${kicker('Join the List')}
      <h2 class="join__t" id="join-t" data-reveal>${title}</h2>
    </div>
    <div class="join__card" data-reveal style="--i:1">
      <h3 class="join__sub">${sub}</h3>
      <p class="join__line">Updates on new products, events and more, from the people behind the counter.</p>
      ${btn('Join', '/subscribe/', { v: 'ink' })}
    </div>
  </div>
</section>`;
}

// The expanding accordion with a picture per panel (home "three promises", operator 2026-11-10): the open panel widens
// (stacks on phones) and shows its text; hover (fine pointers), focus or tap opens another (site.js [data-acc]; styles
// .acc in components.css). items: [{ img, icon?, title, text }] (title/text are HTML); pictures are decorative, the words
// carry the meaning. Panels are dark (picture + deep fade), so it works on light and dark bands alike.
export function accordion(items, { cls = '', label = '', open = 0, tag = 'h3', sizes = '(max-width: 900px) 100vw, 60vw' } = {}) {
  return `<ul class="acc${cls ? ' ' + cls : ''}" role="list" data-acc${label ? ` aria-label="${esc(label)}"` : ''}>${items.map((x, i) => `<li class="acc__p${i === open ? ' is-open' : ''}" tabindex="0" data-reveal${i ? ` style="--i:${i}"` : ''}>${img(x.img, { cls: 'acc__img', sizes, alt: '', decorative: true })}<div class="acc__body">${x.icon ? `<span class="placard__ico acc__ico">${icon(x.icon)}</span>` : ''}<${tag} class="acc__t">${x.title}</${tag}><p class="acc__text">${x.text}</p></div></li>`).join('')}</ul>`;
}

// The visit details as one dark bar (home Quick answers, operator 2026-11-10): name, address and live status; the week as
// seven chips (site.js lights today, in the store's time zone); Directions and Call.
export function visitBar() {
  const fmt = (t) => { const [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'pm' : 'am'; const hh = h % 12 || 12; return m ? `${hh}:${String(m).padStart(2, '0')}${ap}` : `${hh}${ap}`; };
  return `<div class="visitbar">
  <div class="visitbar__who">
    <p class="kicker">Visit us</p>
    <p class="store__name">${esc(site.name)}</p>
    <address class="store__addr">${esc(site.address.long)}</address>
    <p class="store__now"><span class="status__dot" data-open-dot aria-hidden="true"></span><span data-open-label>Hours</span></p>
  </div>
  <ol class="week" role="list" aria-label="Store hours" data-hours-week>${site.hours.map((h) => `<li data-day="${h.day}"><b><span aria-hidden="true">${h.name.slice(0, 3)}</span><span class="sr-only">${h.name}</span></b><span>${fmt(h.open)}<br>&ndash;${fmt(h.close)}</span></li>`).join('')}</ol>
  <div class="actions">
    ${btn('Directions', site.directions.google, { v: 'mint', size: 'sm', ext: true })}
    ${btn('Call ' + site.phone.display, 'tel:' + site.phone.tel, { v: 'ghost', size: 'sm', ico: 'phone' })}
  </div>
</div>`;
}

export function storeCard({ cls = '' } = {}) {
  return `<div class="store ${cls}">
  <p class="kicker">Visit us</p>
  <p class="store__name">${esc(site.name)}</p>
  <address class="store__addr">${esc(site.address.long)}</address>
  <p class="store__now"><span class="status__dot" data-open-dot aria-hidden="true"></span><span data-open-label>Hours</span></p>
  <div class="actions">
    ${btn('Directions', site.directions.google, { v: 'mint', size: 'sm', ext: true })}
    ${btn('Call ' + site.phone.display, 'tel:' + site.phone.tel, { v: 'ghost', size: 'sm', ico: 'phone' })}
  </div>
</div>`;
}

export const sectionHead = (k, t, lead = '', { id = '', tag = 'h2', cls = '' } = {}) => `<div class="sect-head ${cls}">${k ? kicker(k) : ''}<${tag} class="sect-t"${id ? ` id="${id}"` : ''} data-reveal>${t}</${tag}>${lead ? `<p class="sect-lead" data-reveal style="--i:1">${lead}</p>` : ''}</div>`;
