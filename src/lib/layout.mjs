// layout.mjs — the page shell shared by every page: head (SEO + JSON-LD), utility bar, header + mega menu,
// mobile drawer, footer with the NY OCM compliance block, the sticky quick-action bar and the 21+ gate.
import { esc, u, icon, getPage } from './html.mjs';
import { site, nav, footerCols, categories, REQUIRED_WARNING, ROTATING_WARNINGS } from '../content/site.mjs';
import { wordSVG, logoSVG } from './brand.mjs';
import { img } from './parts.mjs';

const OPTS = { preview: false, base: '/' };
export const setBuildOptions = (o) => Object.assign(OPTS, o);
export const buildOptions = () => OPTS;

let ROT = 0;
const nextRotating = () => ROT++ % ROTATING_WARNINGS.length;

function head({ title, description, canonicalPath, jsonld = [], ogImage, robots }) {
  const canonical = site.origin + canonicalPath;
  const og = ogImage ? site.origin + '/' + ogImage.replace(/^\//, '') : site.origin + '/assets/img/gen/storefront-1920.webp';
  const robotsMeta = OPTS.preview ? 'noindex, nofollow' : (robots || 'index, follow');
  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta name="robots" content="${robotsMeta}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(og)}">
<meta property="og:image:alt" content="AI illustration: a red-brick building at night with glowing arched shop windows">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0E0E0E">
${getPage() === '/404.html' ? '<!--SR-BASE-->' : ''}
<link rel="icon" href="${u('/assets/img/brand/favicon.svg')}" type="image/svg+xml">
<link rel="preload" href="${u('/assets/fonts/archivo-normal-100-900.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${u('/assets/fonts/poppins-normal-400.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${u('/assets/css/site.css')}">
<script>(function(d){var h=d.documentElement;h.className=h.className.replace('no-js','js');var ok=false;try{ok=localStorage.getItem('thc-age')==='1'}catch(e){}if(!ok)h.classList.add('age-pending');try{var m=localStorage.getItem('thc-mode');if(m)h.setAttribute('data-mode',m)}catch(e){}})(document);</script>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>`;
}

function utility() {
  return `<div class="utility" data-utility>
  <div class="container utility__in">
    <p class="utility__l"><span class="utility__dot" aria-hidden="true"></span>NYS adult-use license <span class="utility__lic">${site.license}</span> <span class="utility__sep" aria-hidden="true">/</span> Adults 21+ with valid ID</p>
    <p class="utility__r"><a href="${u('/visit/')}">${icon('pin')}<span>${esc(site.address.street)}<span class="utility__city">, ${esc(site.address.city)}</span></span></a><span class="utility__sep" aria-hidden="true">/</span><span data-hours-today>${esc(site.hoursLines[1])}</span></p>
  </div>
</div>`;
}

function megaShop() {
  return `<div class="mega" id="mega-shop" data-mega>
  <div class="mega__in container">
    <div class="mega__cats">
      <p class="kicker">Shop Cannabis</p>
      <ul class="mega__grid">
        ${categories.map((c) => `<li><a class="mega__cat" href="${u(`/shop/${c.slug}/`)}"><span class="mega__thumb">${img(c.img, { sizes: '96px', cls: 'mega__img', alt: '', decorative: true })}</span><span class="mega__name">${esc(c.name)}</span><span class="mega__line">${esc(c.line)}</span></a></li>`).join('')}
      </ul>
      <a class="link-arrow" href="${u('/shop/')}">All products ${icon('arrow')}</a>
    </div>
    <a class="mega__feature" href="${u('/the-flower-bar/')}">
      ${img('macro-a', { sizes: '360px', cls: 'mega__feature-img', alt: '', decorative: true })}
      <span class="mega__feature-t"><span class="kicker">In store</span><strong>The Flower Bar</strong><span>90 strains under glass. Bring your curiosity, we bring the magnifying glass.</span></span>
    </a>
  </div>
</div>`;
}

function header(current) {
  const isOn = (href) => (href === '/' ? current === '/' : current.startsWith(href));
  const items = nav.map((n, i) => {
    const on = isOn(n.href) ? ' aria-current="page"' : '';
    if (n.mega) {
      return `<li class="nav__item nav__item--mega" data-nav-item>
        <a class="nav__link" href="${u(n.href)}"${on}>${esc(n.label)}</a><button class="nav__toggle" type="button" aria-expanded="false" aria-controls="mega-shop" data-mega-toggle><span class="sr-only">Show ${esc(n.label)} categories</span>${icon('chev')}</button>
        ${megaShop()}
      </li>`;
    }
    if (n.children) {
      return `<li class="nav__item nav__item--drop" data-nav-item>
        <a class="nav__link" href="${u(n.href)}"${on}>${esc(n.label)}</a><button class="nav__toggle" type="button" aria-expanded="false" aria-controls="drop-${i}" data-mega-toggle><span class="sr-only">Show ${esc(n.label)} pages</span>${icon('chev')}</button>
        <ul class="navdrop" id="drop-${i}" data-mega>${n.children.map((c) => `<li><a href="${u(c.href)}"${current === c.href ? ' aria-current="page"' : ''}>${esc(c.label)}</a></li>`).join('')}</ul>
      </li>`;
    }
    return `<li class="nav__item"><a class="nav__link" href="${u(n.href)}"${on}>${esc(n.label)}</a></li>`;
  }).join('');
  return `<header class="hdr" data-header>
  <div class="hdr__in container">
    <a class="hdr__brand" href="${u('/')}" aria-label="The Higher Co. home">${wordSVG('hdr__word')}</a>
    <nav class="nav" aria-label="Main"><ul class="nav__list">${items}</ul></nav>
    <div class="hdr__actions">
      <a class="status" href="${u('/visit/')}" data-status><span class="status__dot" data-open-dot aria-hidden="true"></span><span data-open-label>Hours</span></a>
      <a class="btn btn--mint btn--sm hdr__shop" href="${u('/shop/')}" data-magnetic>Shop Now</a>
      <button class="hdr__menu" type="button" aria-expanded="false" aria-controls="drawer" data-drawer-open>${icon('menu')}<span class="sr-only">Open the menu</span></button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer" data-drawer role="dialog" aria-modal="true" aria-label="Menu" hidden>
  <div class="drawer__panel">
    <div class="drawer__top"><a class="hdr__brand" href="${u('/')}" aria-label="The Higher Co. home">${wordSVG('hdr__word')}</a><button class="drawer__x" type="button" data-drawer-close>${icon('close')}<span class="sr-only">Close the menu</span></button></div>
    <nav class="drawer__nav" aria-label="Mobile">
      <details class="drawer__group" open><summary>Shop Cannabis ${icon('chev')}</summary><ul>
        <li><a href="${u('/shop/')}">All products</a></li>${categories.map((c) => `<li><a href="${u(`/shop/${c.slug}/`)}">${esc(c.name)}</a></li>`).join('')}
      </ul></details>
      <a class="drawer__link" href="${u('/lifestyle/')}">Shop Lifestyle</a>
      <a class="drawer__link" href="${u('/the-flower-bar/')}">The Flower Bar</a>
      <details class="drawer__group"><summary>Our Story ${icon('chev')}</summary><ul><li><a href="${u('/about/')}">Our Story</a></li><li><a href="${u('/about/the-crew/')}">The Crew</a></li></ul></details>
      <a class="drawer__link" href="${u('/journal/')}">Journal</a>
      <a class="drawer__link" href="${u('/visit/')}">Visit Us</a>
      <a class="drawer__link" href="${u('/faqs/')}">FAQ</a>
      <a class="drawer__link" href="${u('/subscribe/')}">Join the List</a>
    </nav>
    <div class="drawer__foot">
      <a class="btn btn--mint btn--block" href="${u('/shop/')}">Shop Now ${icon('arrow')}</a>
      <p class="drawer__meta">${icon('pin')} ${esc(site.address.line)}</p>
      <p class="drawer__meta">${icon('clock')} <span data-hours-today>${esc(site.hoursLines[1])}</span></p>
    </div>
  </div>
</div>`;
}

export function ocmBlock(rot) {
  const r = ROTATING_WARNINGS[rot];
  return `<section class="ocm" aria-label="New York State cannabis notices">
  <!-- [CONFIRM WITH CLIENT] licensee name and licence number as published by OCM for 123 E Willow St (The Higher Company LLC, OCM-CAURD-24-000155); another licensee markets this address under its own licence number, so confirm which name and number belong on this website. -->
  <p class="ocm__lic"><strong>${esc(site.legal)}</strong> &middot; NYS Office of Cannabis Management license <span class="nowrap">${site.license}</span> &middot; Sales restricted to adults 21 and over.</p>
  <div class="ocm__box" role="note" aria-label="Health and safety warnings"><p>${esc(REQUIRED_WARNING)}</p><p>${esc(r)}</p></div>
  <p class="ocm__hope">Concerned about your cannabis use? Contact the New York State HOPEline by texting &ldquo;${site.hopeline.text}&rdquo; to ${site.hopeline.textNumber}, calling <a href="tel:${site.hopeline.tel}">${site.hopeline.phone}</a>, or visiting <a href="${site.hopeline.url}" rel="noopener" target="_blank">oasas.ny.gov/hopeline<span class="sr-only"> (opens in a new tab)</span></a>.</p>
  <p class="ocm__verify"><a href="${site.ocm.verify}" rel="noopener" target="_blank">Verify our license with the NYS Office of Cannabis Management ${icon('out')}<span class="sr-only"> (opens in a new tab)</span></a></p>
</section>`;
}

function footer(rot) {
  const socials = site.socials.map((s) => s.placeholder
    ? `<!-- [CONFIRM WITH CLIENT] Instagram: the old handle (instagram.com/thehighercothc) is dead; placeholder link until the new handle is confirmed. --><a class="social" href="${s.url}" aria-label="${esc(s.name)} (link coming soon)" data-placeholder>${icon(s.key)}</a>`
    : `<a class="social" href="${esc(s.url)}" rel="noopener" target="_blank" aria-label="${esc(s.name)} (opens in a new tab)">${icon(s.key)}</a>`).join('');
  return `<footer class="ftr" data-footer>
  <div class="ftr__glow" aria-hidden="true"></div>
  <div class="container ftr__top">
    <div class="ftr__brand">
      <a class="ftr__logo" href="${u('/')}" aria-label="The Higher Co. home">${logoSVG('ftr__logo-svg', 'The Higher Co.')}</a>
      <p class="ftr__tag">Syracuse&rsquo;s downtown dispensary. Order ahead and pick up in store at 123 E Willow St.</p>
      <div class="ftr__social">${socials}</div>
    </div>
    <div class="ftr__visit">
      <h2 class="ftr__h">Visit</h2>
      <address class="ftr__addr"><a href="${site.directions.google}" rel="noopener" target="_blank">${esc(site.address.long)}<span class="sr-only"> (directions open in a new tab)</span></a></address>
      <p><a href="tel:${site.phone.tel}">${site.phone.display}</a></p>
      <p><a href="mailto:${site.email}">${site.email}</a></p>
      <h2 class="ftr__h ftr__h--hours">Hours:</h2>
      <ul class="ftr__hours">${site.hoursLines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
      <!-- [CONFIRM WITH CLIENT] Sunday hours differ by source: live footer/contact 11am–6pm (shown), live FAQ + OCM record 10am–8pm, online ordering 12pm–6pm. -->
    </div>
    <nav class="ftr__cols" aria-label="Footer">
      ${footerCols.map((c) => `<div class="ftr__col"><h2 class="ftr__h">${esc(c.title)}</h2><ul>${c.links.map(([l, h]) => `<li><a href="${u(h)}">${esc(l)}</a></li>`).join('')}</ul></div>`).join('')}
    </nav>
  </div>
  <div class="container">${ocmBlock(rot)}</div>
  <div class="container ftr__bottom">
    <p>&copy; 2026 ${esc(site.legal)}. All rights reserved.</p>
    <p>Some images on this site are AI-generated artwork, not photos of our store, staff or products.</p>
    ${OPTS.preview ? '<p class="ftr__preview">Design concept preview, not the live website. Menu links open the store&rsquo;s real online menu.</p>' : ''}
  </div>
</footer>`;
}

function stickyBar() {
  return `<aside class="bar" data-bar aria-label="Quick actions">
  <div class="bar__in">
    <a class="bar__btn bar__btn--shop" href="${u('/shop/')}">${icon('bag')}<span class="bar__t">Shop Now</span></a>
    <a class="bar__btn" href="tel:${site.phone.tel}">${icon('phone')}<span class="bar__t">Call</span><span class="sr-only"> ${site.phone.display}</span></a>
    <a class="bar__btn" href="${site.directions.google}" rel="noopener" target="_blank">${icon('pin')}<span class="bar__t">Directions</span><span class="sr-only"> (opens in a new tab)</span></a>
    <a class="bar__btn bar__btn--hours" href="${u('/visit/')}#hours" data-bar-hours>${icon('clock')}<span class="bar__hours"><span class="bar__cap">Today&rsquo;s Hours</span><span class="bar__val"><span class="bar__dot" data-open-dot aria-hidden="true"></span><span data-hours-short>${esc(site.hoursLines[1].replace('Monday – Thursday: ', ''))}</span></span></span></a>
    <button class="bar__x" type="button" data-bar-close>${icon('close')}<span class="sr-only">Hide the quick actions for this visit</span></button>
  </div>
</aside>`;
}

function gate() {
  return `<div class="gate" data-gate role="dialog" aria-modal="true" aria-labelledby="gate-t" aria-describedby="gate-d" hidden>
  <div class="gate__veil" aria-hidden="true"></div>
  <div class="gate__panel">
    <div class="gate__logo">${logoSVG('gate__logo-svg', 'The Higher Co.')}</div>
    <div data-gate-ask>
      <h2 class="gate__t" id="gate-t">Are you 21 or older?</h2>
      <p class="gate__d" id="gate-d">You must be 21 years old to enter.</p>
      <div class="gate__choices" role="group" aria-label="Confirm your age and how you are shopping today">
        <button class="btn btn--mint btn--block gate__yes" type="button" data-gate-yes="pickup"><span class="gate__yes-t">Yes, I&rsquo;m 21+</span><span class="gate__yes-s">Order ahead for pickup</span></button>
        <button class="btn btn--ghost btn--block gate__yes" type="button" data-gate-yes="instore"><span class="gate__yes-t">Yes, I&rsquo;m 21+</span><span class="gate__yes-s">Shop in store at the Flower Bar</span></button>
      </div>
      <button class="gate__no" type="button" data-gate-no>No, I&rsquo;m under 21</button>
      <!-- [CONFIRM WITH CLIENT] delivery: the live FAQ says "We currently do not offer delivery", while the OCM licence record carries a delivery flag. -->
      <p class="gate__note">Pickup only, at ${esc(site.address.street)}. Delivery isn&rsquo;t available yet.</p>
    </div>
    <div class="gate__denied" data-gate-denied hidden tabindex="-1">
      <h2 class="gate__t">Come back when you&rsquo;re 21.</h2>
      <p class="gate__d">This site is only for adults 21 and older.</p>
    </div>
    <p class="gate__legal">${esc(site.legal)} &middot; <span class="nowrap">${site.license}</span></p>
  </div>
</div>`;
}

// page(): returns a complete HTML document. `main` is the page body (without <main>).
export function page({ path, title, description, main, jsonld = [], ogImage, robots, bodyClass = '', noChrome = false }) {
  const rot = nextRotating();
  return `${head({ title, description, canonicalPath: path === '/404.html' ? '/404.html' : path, jsonld, ogImage, robots })}
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
${noChrome ? '' : utility()}
${noChrome ? '' : header(path)}
<main id="main" tabindex="-1">
${main}
</main>
${noChrome ? '' : footer(rot)}
${noChrome ? '' : stickyBar()}
${noChrome ? '' : gate()}
<noscript><p class="noscript">This site is for adults 21 and older. Menus and some features need JavaScript.</p></noscript>
<script type="application/json" id="thc-hours">${JSON.stringify({ tz: site.timezone, days: site.hours.map((h) => ({ open: h.open, close: h.close })) })}</script>
<script src="${u('/assets/js/site.js')}" defer></script>
</body>
</html>
`;
}
