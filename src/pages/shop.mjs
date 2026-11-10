// shop.mjs — Shop Cannabis: /shop/ (live URL kept; the menu opens on all products) and one in-site page per
// category the menu carries. Every page carries the store's real embedded menu (products, prices, cart,
// checkout), opened on the matching category, so no button lands on an empty page.
import { esc, u, icon } from '../lib/html.mjs';
import { site, categories } from '../content/site.mjs';
import { img, btn, kicker, crumbs, crumbsLD, menuEmbed } from '../lib/parts.mjs';

function chips(active) {
  return `<nav class="chips" aria-label="Menu categories">
  <a class="chip chip--cat${active === 'all' ? ' is-on' : ''}" href="${u('/shop/')}"${active === 'all' ? ' aria-current="page"' : ''}>All products</a>
  ${categories.map((c) => `<a class="chip chip--cat${active === c.slug ? ' is-on' : ''}" href="${u(`/shop/${c.slug}/`)}"${active === c.slug ? ' aria-current="page"' : ''}>${esc(c.name)}</a>`).join('')}
</nav>`;
}

const facts = `<ul class="shopfacts" role="list">
  <li>${icon('bag')}<span><strong>Pickup in store</strong> at ${esc(site.address.street)}</span></li>
  <li>${icon('card')}<span><strong>$50 minimum</strong> for online orders</span></li>
  <li>${icon('id')}<span><strong>Bring your ID</strong>: the person who orders picks up</span></li>
  <li>${icon('clock')}<span><span data-open-label>Hours</span></span></li>
</ul>`;

function shopHero({ k, title, lead, crumb, art }) {
  return `<section class="shophero" data-spot>
  <div class="phero__light" aria-hidden="true"></div>
  <div class="container shophero__in">
    <div class="shophero__copy">
      ${crumbs(crumb)}
      ${kicker(k)}
      <h1 class="shophero__t">${title}</h1>
      <p class="shophero__lead">${lead}</p>
    </div>
    ${art ? `<div class="shophero__art" aria-hidden="true">${art}</div>` : ''}
  </div>
  <div class="container">${facts}</div>
</section>`;
}

export function shopHub() {
  const crumb = [['Home', '/'], ['Shop Cannabis', '/shop/']];
  const main = `
${shopHero({
  k: 'Shop Cannabis &middot; Live menu',
  title: 'Shop Cannabis',
  lead: 'Every product on our live menu, with today&rsquo;s prices and stock. Add to your cart, choose &ldquo;Pick Up In-Store&rdquo; at checkout, and we&rsquo;ll have it ready.',
  crumb,
  art: `<div class="shophero__stack">${['flower', 'prerolls', 'concentrates'].map((c, i) => `<span class="shophero__obj shophero__obj--${i}">${img('cut-' + c, { sizes: '160px', alt: '', decorative: true })}</span>`).join('')}</div>`,
})}
<section class="band band--gallery shopbody" aria-label="Menu">
  <div class="container">
    ${chips('all')}
    ${menuEmbed({ label: 'All products' })}
    <p class="shopnote">Prices and stock come straight from the live menu and can change. Menu images and names are supplied by the brands.</p>
  </div>
</section>
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

function crossLinks(current = '') {
  const others = categories.filter((c) => c.slug !== current).slice(0, 5);
  return `<section class="band band--ink crossshop" aria-labelledby="cross-t" data-spot>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container">
    <div class="sect-head">${kicker('Keep browsing')}<h2 class="sect-t" id="cross-t">More from the menu</h2></div>
    <ul class="minicases" role="list">${others.map((c) => `<li><a class="minicase" href="${u(`/shop/${c.slug}/`)}" data-tilt><span class="minicase__obj">${img(c.img, { sizes: '120px', alt: '', decorative: true })}</span><span class="minicase__name">${esc(c.name)}</span>${icon('arrow')}</a></li>`).join('')}</ul>
    <div class="crossshop__more">
      <a class="crossshop__card" href="${u('/the-flower-bar/')}"><span class="kicker">In store</span><strong>The Flower Bar</strong><span>90 strains to smell and see up close.</span>${icon('arrow')}</a>
      <a class="crossshop__card" href="${u('/lifestyle/')}"><span class="kicker">Shop Lifestyle</span><strong>Merch drops</strong><span>The THC monogram snapback and more, in store.</span>${icon('arrow')}</a>
    </div>
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
  art: `<span class="shophero__obj shophero__obj--solo">${img(c.img, { sizes: '(max-width: 700px) 40vw, 260px', alt: '', decorative: true })}</span>`,
})}
<section class="band band--gallery shopbody" aria-label="${esc(c.name)} menu">
  <div class="container">
    ${chips(c.slug)}
    ${menuEmbed({ category: c.dutchie, label: c.name })}
    <p class="shopnote">Prices and stock come straight from the live menu and can change. Menu images and names are supplied by the brands.</p>
  </div>
</section>
${crossLinks(c.slug)}`;
  return {
    path,
    title: `${c.name} for Pickup in Syracuse | The Higher Company`,
    description: `Shop ${c.name.toLowerCase()} on the live menu at The Higher Co., 123 E Willow St, downtown Syracuse. Order ahead for in-store pickup. Adults 21+ with valid ID.`,
    main,
    jsonld: [crumbsLD(crumb)],
    bodyClass: 'page-shop page-shop--cat',
  };
}

export const shopPages = () => [shopHub(), ...categories.map(categoryPage)];
