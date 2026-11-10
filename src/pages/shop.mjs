// shop.mjs — Shop Cannabis: /shop/ (live URL kept; the menu opens on all products) and one in-site page per
// category the menu carries. Every page carries the store's real embedded menu (products, prices, cart,
// checkout), opened on the matching category, so no button lands on an empty page.
//
// Inner-pages update (operator, 2026-11-10: "now that you have an idea and design principle from how we built the home
// page, i would like you to update all inner pages"), in the home page's language (styles: src/styles/inner-shop.css):
//  - the hero is tighter; its product cut-outs stand in a thin glass case and rise out of its top, like the home "Our
//    Products" cases; the four pickup facts sit in one dark bar under the words (before, the light sheet covered half of
//    them); the hours fact carries the live open/closed dot
//  - the live menu is unchanged and stays high on the page, under the category chips
//  - "More from the menu" is the home glass category cases (the five other categories; all six on the hub, where no
//    category is current) and the two in-store links as cards with the shop's own photos; a brass divider marks the
//    straight light-to-dark edge; the band ends the page and runs into the footer (shared CSS)
import { esc, u, icon } from '../lib/html.mjs';
import { site, categories } from '../content/site.mjs';
import { img, imgMeta, kicker, crumbs, crumbsLD, menuEmbed } from '../lib/parts.mjs';

function chips(active) {
  return `<nav class="chips" aria-label="Menu categories">
  <a class="chip chip--cat${active === 'all' ? ' is-on' : ''}" href="${u('/shop/')}"${active === 'all' ? ' aria-current="page"' : ''}>All products</a>
  ${categories.map((c) => `<a class="chip chip--cat${active === c.slug ? ' is-on' : ''}" href="${u(`/shop/${c.slug}/`)}"${active === c.slug ? ' aria-current="page"' : ''}>${esc(c.name)}</a>`).join('')}
</nav>`;
}

// the pickup facts: one dark bar of four cells; the hours cell carries the live open/closed dot (site.js)
const facts = `<ul class="shopfacts" role="list">
  <li><span class="shopfacts__ico">${icon('bag')}</span><span><strong>Pickup in store</strong> at ${esc(site.address.street)}</span></li>
  <li><span class="shopfacts__ico">${icon('card')}</span><span><strong>$50 minimum</strong> for online orders</span></li>
  <li><span class="shopfacts__ico">${icon('id')}</span><span><strong>Bring your ID</strong>: the person who orders picks up</span></li>
  <li><span class="shopfacts__ico">${icon('clock')}</span><span class="shopfacts__now"><span class="status__dot" data-open-dot aria-hidden="true"></span><span data-open-label>Hours</span></span></li>
</ul>`;

// the hero's display case: the products stand in a thin glass case and rise out of its top (the home cases' look),
// each floating gently (still under reduced motion). Decorative: the words carry the meaning. Above the fold, so the
// pictures load first.
function showcase(ids, mod) {
  const sizes = mod === 'solo' ? '(max-width: 700px) 30vw, 260px' : '(max-width: 700px) 18vw, 180px';
  return `<div class="showcase showcase--${mod}">${ids.map((id, i) => `<span class="showcase__obj showcase__obj--${i}">${img(id, { cls: 'showcase__img', sizes, decorative: true, priority: true })}</span>`).join('')}</div>`;
}

function shopHero({ k, title, lead, crumb, art, mod }) {
  return `<section class="shophero shophero--${mod}" data-spot>
  <div class="phero__light" aria-hidden="true"></div>
  <div class="container shophero__in">
    <div class="shophero__copy">
      ${crumbs(crumb)}
      ${kicker(k)}
      <h1 class="shophero__t" data-reveal>${title}</h1>
      <p class="shophero__lead" data-reveal style="--i:1">${lead}</p>
    </div>
    <div class="shophero__art" aria-hidden="true">${art}</div>
    ${facts}
  </div>
</section>`;
}

const menuBand = (label, embed, chipRow) => `<section class="band band--gallery band--tight shopbody" aria-label="${label}">
  <div class="container">
    ${chipRow}
    ${embed}
    <p class="shopnote">Prices and stock come straight from the live menu and can change. Menu images and names are supplied by the brands.</p>
  </div>
</section>`;

export function shopHub() {
  const crumb = [['Home', '/'], ['Shop Cannabis', '/shop/']];
  const main = `
${shopHero({
  k: 'Shop Cannabis &middot; Live menu',
  title: 'Shop Cannabis',
  lead: 'Every product on our live menu, with today&rsquo;s prices and stock. Add to your cart, choose &ldquo;Pick Up In-Store&rdquo; at checkout, and we&rsquo;ll have it ready.',
  crumb,
  mod: 'hub',
  art: showcase(['cat-flower', 'cat-prerolls', 'cat-concentrates'], 'hub'),
})}
${menuBand('Menu', menuEmbed({ label: 'All products' }), chips('all'))}
${crossLinks()}`;
  return {
    path: '/shop/',
    title: 'Shop Cannabis: Live Menu for Pickup | The Higher Company, Syracuse',
    description: 'Shop the live menu at The Higher Co., 123 E Willow St, Syracuse: flower, pre-rolls, vaporizers, concentrates, edibles and accessories. Order ahead, pick up in store. 21+.',
    main,
    jsonld: [crumbsLD(crumb)],
    bodyClass: 'page-shop',
  };
}

// One glass case per category, the home "Our Products" markup (categoryShelf in parts.mjs): the product rises out of
// the top of its case, the brass bag button sits in the corner. The image sizes follow the shelf's own rule; a row of
// five cases (a category page) is wider per case than the home row of six, so its desktop cap is a little higher.
function caseItem(c, i, n) {
  const r = imgMeta(c.img).ratio;
  const desk = n > 5 ? 10 : 12;
  const sizes = `(max-width: 700px) ${Math.max(4, Math.round(Math.min(40 * r, 31)))}vw, (max-width: 1180px) ${Math.max(3, Math.round(Math.min(24 * r, 20)))}vw, ${Math.max(2, Math.round(Math.min(15 * r, desk)))}vw`;
  return `<li class="shelf__item" data-reveal style="--i:${i % 3}">
        <a class="case" href="${u(`/shop/${c.slug}/`)}" data-tilt>
          <span class="case__obj">${img(c.img, { sizes, cls: 'case__img', alt: '', decorative: true })}</span>
          <span class="case__name">${esc(c.name)}</span>
          <span class="case__line">${esc(c.line)}</span>
          <span class="case__cart" aria-hidden="true">${icon('bag')}</span>
          <span class="sr-only">Shop ${esc(c.name.toLowerCase())}</span>
        </a>
      </li>`;
}

// the two in-store links as photo cards: the words on the dark, the shop's own photo fading in on the right; hover
// lifts the card, draws a brass hairline and brings the photo up. The photos are decorative: the words name the link.
// (The fade-up sits on the list item, as on the home cases: the reveal's own translate would cancel the card's lift.)
function linkCard({ href, k, t, line, pic, pos, i = 0 }) {
  return `<li data-reveal${i ? ` style="--i:${i}"` : ''}><a class="shoplink" href="${u(href)}">
        <span class="shoplink__media" style="--pos:${pos}">${img(pic, { cls: 'shoplink__img', sizes: '(max-width: 760px) 54vw, 440px', decorative: true })}</span>
        <span class="shoplink__body"><span class="kicker">${k}</span><strong class="shoplink__t">${t}</strong><span class="shoplink__line">${line}</span><span class="shoplink__go" aria-hidden="true">${icon('arrow')}</span></span>
      </a></li>`;
}

function crossLinks(current = '') {
  const others = categories.filter((c) => c.slug !== current);
  return `<section class="band band--ink band--tight shelf crossshop" aria-labelledby="cross-t" data-spot>
  <span class="brass-rule brass-rule--top" aria-hidden="true"></span>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container">
    <div class="sect-head">${kicker('Keep browsing')}<h2 class="sect-t" id="cross-t" data-reveal>More from the menu</h2></div>
    <ul class="shelf__grid shopcases shopcases--n${others.length}" role="list">
      ${others.map((c, i) => caseItem(c, i, others.length)).join('')}
    </ul>
    <!-- [CONFIRM WITH CLIENT] the two cards use the shop's interior and display-case photos (the same photos the home page
         credits to The Higher Co.): confirm both are the client's own, not Google Maps customer photos, before launch. -->
    <ul class="shoplinks" role="list">
      ${linkCard({ href: '/the-flower-bar/', k: 'In store', t: 'The Flower Bar', line: '90 strains to smell and see up close.', pic: 'photo-interior', pos: '72% 50%' })}
      ${linkCard({ href: '/lifestyle/', k: 'Shop Lifestyle', t: 'Merch drops', line: 'The THC monogram snapback and more, in store.', pic: 'photo-display', pos: '50% 46%', i: 1 })}
    </ul>
  </div>
</section>`;
}

export function categoryPage(c) {
  const path = `/shop/${c.slug}/`;
  const crumb = [['Home', '/'], ['Shop Cannabis', '/shop/'], [c.name, path]];
  const main = `
${shopHero({
  k: 'Shop Cannabis &middot; Live menu',
  title: esc(c.name),
  lead: `${esc(c.line)} ${esc(c.more)}`,
  crumb,
  mod: 'cat',
  art: showcase([c.img], 'solo'),
})}
${menuBand(`${esc(c.name)} menu`, menuEmbed({ category: c.dutchie, label: c.name }), chips(c.slug))}
${crossLinks(c.slug)}`;
  return {
    path,
    title: `${c.name} for Pickup in Syracuse | The Higher Company`,
    description: `Shop ${c.name.toLowerCase()} on the live menu at The Higher Co., 123 E Willow St, downtown Syracuse. Order ahead for in-store pickup. Adults 21+ with valid ID.`,
    main,
    jsonld: [crumbsLD(crumb)],
    bodyClass: `page-shop page-shop--cat page-shop--${c.slug}`,
  };
}

export const shopPages = () => [shopHub(), ...categories.map(categoryPage)];
