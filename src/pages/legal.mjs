// legal.mjs — /legal/ hub, /legal/compliance/, /legal/privacy/, /legal/terms/, /legal/accessibility/ (new pages),
// the 404 page, and redirect pages for live URLs that carried no client content.
//
// Inner-pages update (2026-11-10), in the home page's language: a compact ink hero (title on the left, the lead on the
// right, so the band is full instead of half empty); the document on one light sheet as numbered rows (the heading on
// the left stays in view while its text scrolls, the text on the right at a reading measure); the page's last section
// in a dark band that runs straight into the footer, marked from the light sheet by one brass rule. Copy unchanged;
// "Help with cannabis use" moved to the end of the compliance page, so it closes the page the way its lead promises
// (license, warnings, then where to get help). Styles: src/styles/inner-legal.css (scoped to .page-legal / .page-404).
import { esc, u, icon, readJSON } from '../lib/html.mjs';
import { site, REQUIRED_WARNING, ROTATING_WARNINGS } from '../content/site.mjs';
import { img, btn, kicker, pageHero, crumbsLD } from '../lib/parts.mjs';

const UPDATED = 'November 10, 2026';
const BUDS = readJSON('src/content/buds.json');   // the Flower Bar's floating buds (sprite atlas), reused on the 404 page
const nn = (n) => String(n).padStart(2, '0');

// compact hero: crumbs, kicker and title on the left; the lead and the date on the right, level with the title's foot
const legalHero = (title, lead, crumb) => pageHero({
  kicker: 'Legal', title, crumbList: crumb, cls: 'phero--legal',
  aside: `<div class="phero__lead" data-reveal style="--i:1"><p>${lead}</p><p class="phero__meta">Last updated ${UPDATED}</p></div>`,
});
// one numbered row per section of the document
const row = (n, [id, h, body, cls = '']) => `<div class="ldoc__row${cls ? ' ' + cls : ''}" data-reveal>
  <div class="ldoc__head"><span class="ldoc__n" aria-hidden="true">${nn(n)}</span><h2 class="ldoc__h" id="${id}">${h}</h2></div>
  <div class="ldoc__body prose">${body}</div>
</div>`;
// the document: a light sheet that slides over the hero (its rounded top is automatic after .phero)
const doc = (rows, note = '') => `<section class="band band--gallery band--tight ldoc">
  ${note}
  <div class="container ldoc__in">
    ${rows.map((r, i) => row(i + 1, r)).join('\n    ')}
  </div>
</section>`;
// the page's last section: a dark band (it fades into the footer by itself), its straight top edge marked in brass.
// A photo of the shop, when given, sits beside the words as a print and develops in; it is decorative (the words
// beside it are about something else), so it carries no alt text.
const close = ({ n, id, h, body, photo = '', fx = '50%', fy = '50%', note = '' }) => `<section class="band band--ink band--tight lclose${photo ? '' : ' lclose--plain'}" aria-labelledby="${id}" data-spot>
  <span class="brass-rule brass-rule--top" aria-hidden="true"></span>
  <div class="band__light" aria-hidden="true"></div>
  ${note}
  <div class="container lclose__in">
    <div class="lclose__copy" data-reveal>
      <span class="ldoc__n" aria-hidden="true">${nn(n)}</span>
      <h2 class="lclose__t" id="${id}">${h}</h2>
      ${photo ? `<div class="lclose__body">${body}</div>` : ''}
    </div>
    ${photo ? `<div class="lclose__photo" aria-hidden="true" style="--fx:${fx};--fy:${fy}">${img(photo, { cls: 'lclose__img', sizes: '(max-width: 900px) 92vw, 44vw', decorative: true, attrs: 'data-reveal="develop"' })}</div>` : body}
  </div>
</section>`;
const REVIEW = '<!-- [CONFIRM WITH CLIENT] legal review before launch: this page describes the redesigned site as built (no analytics, no ad pixels, click-to-load embeds) and the store\'s own published policies; counsel should confirm it. -->';

export function legalHub() {
  const crumb = [['Home', '/'], ['Legal', '/legal/']];
  const cards = [
    ['/legal/compliance/', 'NY compliance', 'Our license, the required warnings, the HOPEline and how to check a dispensary&rsquo;s license.', 'shield'],
    ['/legal/privacy/', 'Privacy', 'What this website collects (very little) and the third-party services it connects to.', 'info'],
    ['/legal/terms/', 'Terms of use', 'The rules for using this website and ordering ahead for pickup.', 'book'],
    ['/legal/accessibility/', 'Accessibility', 'How we built this site to work for everyone, and how to tell us if it doesn&rsquo;t.', 'people'],
  ];
  // the hero's right half carries the shop itself (the lead names it): the store's own photo as a tilted print
  const main = `${pageHero({ kicker: 'Legal', title: 'Legal &amp; compliance', lead: '<p>The fine print for The Higher Company, the adult-use cannabis dispensary at 123 E Willow St in downtown Syracuse.</p>', crumbList: crumb, cls: 'phero--legal phero--hub',
    aside: `<figure class="lhub__frame">${img('photo-interior', { cls: 'lhub__img', sizes: '(max-width: 900px) 92vw, 460px', priority: true, attrs: 'data-reveal="develop"' })}</figure>` })}
<section class="band band--gallery band--tight lhub">
  <!-- the four legal pages as paper placards in the home card language: a lift and a brass hairline on hover, the
       number in brass, the mark in a mint-on-ink tile; one row on desktop, so all four sit above the fold -->
  <div class="container"><ul class="lhub__cards" role="list">${cards.map(([h, t, l, i], k) => `<li class="lhub__card" data-reveal style="--i:${k}"><a class="lhub__a" href="${u(h)}"><span class="lhub__top"><span class="placard__ico lhub__ico">${icon(i)}</span><span class="lhub__n" aria-hidden="true">${nn(k + 1)}</span></span><h2 class="lhub__t">${t}</h2><p>${l}</p><span class="link-arrow">Read ${icon('arrow')}</span></a></li>`).join('')}</ul></div>
</section>`;
  return { path: '/legal/', title: 'Legal and Compliance | The Higher Company, Syracuse', description: 'Legal information for The Higher Co.: New York OCM compliance and license, privacy, terms of use and accessibility.', main, jsonld: [crumbsLD(crumb)], bodyClass: 'page-legal' };
}

export function compliance() {
  const crumb = [['Home', '/'], ['Legal', '/legal/'], ['NY compliance', '/legal/compliance/']];
  const main = `${legalHero('New York compliance', 'The Higher Company is licensed by the New York State Office of Cannabis Management. Here is our license, the warnings the state requires, and where to get help.', crumb)}
${doc([
  ['license', 'Our license', `<div class="lcert">
<table class="table"><caption>License details as published by the NYS Office of Cannabis Management</caption><tbody>
<tr><th scope="row">Licensee</th><td>${esc(site.legal)}</td></tr>
<tr><th scope="row">Doing business as</th><td>${esc(site.short)}</td></tr>
<tr><th scope="row">License number</th><td class="lcert__num">${site.license}</td></tr>
<tr><th scope="row">License type</th><td>${site.licenseType}</td></tr>
<tr><th scope="row">Premises</th><td>${esc(site.address.line)}</td></tr>
</tbody></table>
</div>
<p><a href="${site.ocm.verify}" rel="noopener" target="_blank">Verify our license on the OCM&rsquo;s dispensary list<span class="sr-only"> (opens in a new tab)</span></a>. New York also requires every legal dispensary to post the state&rsquo;s verification QR code near its main entrance.</p>`],
  ['adults', 'Adults 21 and over only', `<p>Sales are restricted to adults 21 and over. We check a valid photo ID for every purchase and every pickup, and we do not sell to anyone who is visibly intoxicated. This website asks every visitor to confirm they are 21 or older.</p>`],
  ['warnings', 'Required warnings', `<p>New York requires these warnings on our advertising, including this website:</p>
<div class="ocm__box ocm__box--page" role="note"><p>${esc(REQUIRED_WARNING)}</p></div>
<p>Each of our pages also carries one of the state&rsquo;s rotating warnings:</p>
<div class="ocm__box ocm__box--page" role="note">${ROTATING_WARNINGS.map((w) => `<p>${esc(w)}</p>`).join('')}</div>`],
  ['limits', 'Purchase and possession limits', `<p>Adults 21 and older may possess up to 3 ounces of cannabis and up to 24 grams of concentrated cannabis. We cannot sell an amount that would put you over those limits. All cannabis sales are final.</p>`],
  ['marketing', 'How we market', `<ul class="ticks">
<li>We do not give away cannabis, and we do not offer &ldquo;free&rdquo; cannabis with a purchase.</li>
<li>We do not make medical or health claims about cannabis.</li>
<li>Our branded apparel is sold only at our store at 123 E Willow St.</li>
<li>Product details on the live menu come from the brands and our online menu provider, and can change.</li>
</ul>
<p>Read more in our <a href="${u('/journal/new-york-cannabis-laws/')}">plain-English guide to New York cannabis laws</a>.</p>`],
], REVIEW)}
${close({ n: 6, id: 'help', h: 'Help with cannabis use', body: `<div class="lhelp">
      <div class="lhelp__card glass"><span class="lhelp__ico" aria-hidden="true">${icon('phone')}</span><p>Concerned about your cannabis use? Contact the New York State HOPEline by texting &ldquo;${site.hopeline.text}&rdquo; to ${site.hopeline.textNumber}, calling <a href="tel:${site.hopeline.tel}">${site.hopeline.phone}</a> <span class="nowrap">(${site.hopeline.phoneDigits})</span>, or visiting <a href="${site.hopeline.url}" rel="noopener" target="_blank">oasas.ny.gov/hopeline<span class="sr-only"> (opens in a new tab)</span></a>.</p></div>
      <div class="lhelp__card glass"><span class="lhelp__ico" aria-hidden="true">${icon('info')}</span><p>If someone may have consumed cannabis by accident or consumed too much, call the Poison Center at <a href="tel:${site.poison.tel}">${site.poison.phone}</a>. Call 911 in an emergency.</p></div>
    </div>`, note: '<!-- Sources: 9 NYCRR Parts 128/129 (effective Dec 3, 2025): 129.2(c)(1) required warning, 129.2(d) rotating warnings, 129.2(e) yellow box, 129.2(f) HOPEline, 129.2(j) apparel, 129.2(k) licensee name + number, 129.2(l) age gate, 129.3 giveaways; Cannabis Law 85 proof of age; OCM licence record OCM-CAURD-24-000155. -->' })}`;
  return { path: '/legal/compliance/', title: 'New York OCM Compliance and License | The Higher Company', description: 'The Higher Company LLC, NYS OCM license OCM-CAURD-24-000155: required warnings, HOPEline, ID and purchase limits, and how to verify a licensed dispensary.', main, jsonld: [crumbsLD(crumb)], bodyClass: 'page-legal' };
}

export function privacy() {
  const crumb = [['Home', '/'], ['Legal', '/legal/'], ['Privacy', '/legal/privacy/']];
  const main = `${legalHero('Privacy notice', 'This notice explains what information this website handles and who else is involved when you use it.', crumb)}
${doc([
  ['short', 'The short version', `<p>This website does not use advertising pixels or analytics trackers. It keeps two small preferences in your own browser, and it only connects you to other services (our online menu, YouTube, Google Maps) when you use them.</p>`, 'ldoc__row--lead'],
  ['browser', 'What stays in your browser', `<ul class="ticks"><li><strong>Age confirmation.</strong> When you confirm you are 21 or older, your browser remembers it so you are not asked on every page.</li><li><strong>Shopping preference.</strong> If you choose &ldquo;order ahead&rdquo; or &ldquo;shop in store&rdquo;, your browser remembers that too.</li><li><strong>Quick-action bar.</strong> If you hide it, your browser remembers that for the visit.</li></ul>
<p>These preferences stay on your device. You can clear them at any time by clearing this site&rsquo;s data in your browser.</p>`],
  ['menu', 'Our online menu and orders', `<p>The menu on our shop pages, including the cart and checkout, is provided by our online ordering partner, Dutchie. When you browse the menu or place an order, the information you enter is handled by that service under its own terms and privacy policy, and is shared with us so we can prepare your order and check your ID at pickup.</p>`],
  ['messages', 'Messages and the list', `<p>Our contact and &ldquo;Join the List&rdquo; forms open your own email app with your message addressed to ${site.email}. We receive only what you choose to send, and use it to reply to you or, if you asked to join the list, to send you news from the shop. Ask us to stop at any time.</p>`],
  ['video', 'Video and maps', `<p>Our YouTube video and the Google map load only when you press play or ask for the map. From that moment, Google&rsquo;s privacy policy applies to that content.</p>`],
  ['children', 'Children', `<p>This website is for adults 21 and older. We do not knowingly collect information from anyone under 21.</p>`],
], REVIEW)}
${close({ n: 7, id: 'contact', h: 'Contact', body: `<p>Questions about privacy: <a href="mailto:${site.email}">${site.email}</a>, or ${esc(site.legal)}, ${esc(site.address.line)}.</p>`, photo: 'photo-display', fy: '58%' })}`;
  return { path: '/legal/privacy/', title: 'Privacy Notice | The Higher Company', description: 'How The Higher Company website handles your information: no ad trackers, preferences kept in your browser, the online menu provider, forms, video and maps.', main, jsonld: [crumbsLD(crumb)], bodyClass: 'page-legal' };
}

export function terms() {
  const crumb = [['Home', '/'], ['Legal', '/legal/'], ['Terms of use', '/legal/terms/']];
  const main = `${legalHero('Terms of use', 'By using this website you agree to these terms. Please read them along with our privacy notice.', crumb)}
${doc([
  ['adults', 'Adults 21 and over', `<p>This website is for adults 21 and older. By entering you confirm that you are at least 21.</p>`],
  ['information', 'Information on this website', `<p>Our articles and guides are general information, not medical or legal advice. Menu details, prices and availability come from our live menu and can change at any time.</p>`],
  ['ordering', 'Ordering ahead for pickup', `<ul class="ticks"><li>Online orders are for pickup in store at ${esc(site.address.line)}, during regular business hours.</li><li>Online orders require a $50 minimum purchase.</li><li>We check ID at pickup; someone else can&rsquo;t pick up your order.</li><li>Purchases must stay within New York&rsquo;s possession limits.</li><li>We cannot accept any returns or exchanges for any cannabis sales, due to regulations and the nature of our products.</li><li>Checkout is provided by our online ordering partner and is also subject to its terms.</li></ul>`],
  ['using', 'Using this website', `<p>Please use this website lawfully. Don&rsquo;t try to disrupt it, copy it wholesale, or use it to resell cannabis.</p>`],
  ['content', 'Our content', `<p>The Higher Co. name, logo and the content of this website belong to ${esc(site.legal)} or the people who gave us permission to use it. Some images on this website are AI-generated artwork, not photographs of our store, staff or products.</p>`],
  ['links', 'Links to other websites', `<p>We link to government resources and to services such as our online menu, YouTube and Google Maps. Those websites have their own terms.</p>`],
  ['changes', 'Changes', `<p>We may update these terms. The date at the top shows the latest version.</p>`],
], REVIEW)}
${close({ n: 8, id: 'contact', h: 'Contact', body: `<p><a href="mailto:${site.email}">${site.email}</a> &middot; <a href="tel:${site.phone.tel}">${site.phone.display}</a> &middot; ${esc(site.address.line)}</p>`, photo: 'photo-interior', fx: '36%' })}`;
  return { path: '/legal/terms/', title: 'Terms of Use | The Higher Company', description: 'Terms of use for The Higher Company website: 21+ only, information not advice, ordering ahead for in-store pickup, our content and links.', main, jsonld: [crumbsLD(crumb)], bodyClass: 'page-legal' };
}

export function accessibility() {
  const crumb = [['Home', '/'], ['Legal', '/legal/'], ['Accessibility', '/legal/accessibility/']];
  const main = `${legalHero('Accessibility', 'We want everyone 21 and over to be able to use this website comfortably.', crumb)}
${doc([
  ['aim', 'What we aim for', `<p>This website is built to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.</p>`],
  ['built-in', 'What we built in', `<ul class="ticks"><li>Every page works with a keyboard, with visible focus and a skip link.</li><li>Text colors are chosen for strong contrast against their backgrounds.</li><li>If your device asks for reduced motion, scroll effects, parallax and video loops turn off.</li><li>Images have text alternatives; decorative art is hidden from screen readers.</li><li>Menus, the age check and the quick-action bar are labelled for assistive technology.</li></ul>`],
  ['limits', 'Known limits', `<p>Our online menu, cart and checkout are provided by a third-party service inside the shop pages, so we can&rsquo;t change everything about how they work. If anything there gets in your way, call us at <a href="tel:${site.phone.tel}">${site.phone.display}</a> and we&rsquo;ll help you order.</p>`],
])}
${close({ n: 4, id: 'tell-us', h: 'Tell us', body: `<p>If something on this website doesn&rsquo;t work for you, email <a href="mailto:${site.email}">${site.email}</a> or call <a href="tel:${site.phone.tel}">${site.phone.display}</a>. Tell us the page and what happened, and we&rsquo;ll fix it.</p>`, photo: 'photo-counter', fx: '30%', fy: '38%',
    note: '<!-- [CONFIRM WITH CLIENT] the counter photo shows staff and identifiable customers: confirm consent (everyone pictured agreed to appear on the website), or blur the customers; and confirm the photo is the client\'s own. -->' })}`;
  return { path: '/legal/accessibility/', title: 'Accessibility Statement | The Higher Company', description: 'Accessibility at The Higher Company website: our WCAG 2.2 AA goal, keyboard and reduced-motion support, known limits and how to report a problem.', main, jsonld: [crumbsLD(crumb)], bodyClass: 'page-legal' };
}

export function notFound() {
  // The 404 is served at any depth under a <base href> (build.mjs), so the sprite atlas paths are written relative
  // (no leading slash) and resolve against that base, in production and in the preview sub-path alike.
  const main = `<section class="band band--ink nf" aria-labelledby="nf-t">
  <!-- the floating buds of the home Flower Bar (site.js [data-pit]) in place of the THC monogram (operator on home:
       complementing imagery instead of the logo): they drift behind the message, a bud can be dragged and tossed, the
       magnifier follows the pointer; reduced motion: they hold still. Sprites: src/content/buds.json. -->
  <div class="nf__media" data-lens-zone>
    <canvas class="nf__pit" data-pit data-atlas="${BUDS.files.hi.file}" data-atlas-lo="${BUDS.files.lo.file}" data-cell="${BUDS.files.hi.cell}" data-cell-lo="${BUDS.files.lo.cell}" data-cols="${BUDS.cols}" data-n="${BUDS.n}" data-r="${BUDS.r.join(',')}" aria-hidden="true"></canvas>
    <div class="lens" data-lens aria-hidden="true"><canvas></canvas></div>
  </div>
  <div class="container nf__in">
    <div class="nf__card glass" data-reveal>
      ${kicker('404')}
      <h1 class="nf__t" id="nf-t">This page wandered off.</h1>
      <p class="nf__lead">The link may be old, or the page may have moved in our redesign. Try one of these:</p>
      <div class="actions">${btn('Shop Cannabis', '/shop/', { v: 'mint' })}${btn('Visit Us', '/visit/', { v: 'ghost' })}${btn('Home', '/', { v: 'ghost' })}</div>
    </div>
  </div>
</section>`;
  return { path: '/404.html', title: 'Page Not Found | The Higher Company', description: 'This page could not be found. Shop the live menu, plan your visit or head back home.', main, robots: 'noindex, follow', bodyClass: 'page-404' };
}

// Live URLs whose pages carried no client content (theme demo text, empty pages). Each keeps working as a small
// page that says where the content went and forwards the visitor. Recorded as REMOVE rows in the ledger.
export const REDIRECTS = [
  ['/gallery/', '/the-flower-bar/', 'Gallery', 'The gallery now lives on The Flower Bar page, with our own video from the shop.'],
  ['/media/', '/journal/', 'Media', 'Our media and guides now live in the Journal.'],
  ['/sample-page-2/', '/', 'Coming Soon', 'This &ldquo;Coming Soon&rdquo; page has been retired.'],
  ['/delivery/', '/faqs/#q-13', 'Delivery', 'We currently do not offer delivery but we are working on it. Order ahead for pickup instead.'],
  ['/retail-space/', '/', 'Retail Space', 'This page has been retired.'],
  ['/author/admin/', '/journal/', 'Journal', 'Posts now live in the Journal.'],
  ['/category/uncategorized/', '/journal/', 'Journal', 'Posts now live in the Journal.'],
  ['/alpha-classics-artists-named-polar-music-prize-winners/', '/journal/', 'Journal', 'This page has been retired.'],
  ['/arcana-wins-the-choral-award-at-the-2022-icmas/', '/journal/', 'Journal', 'This page has been retired.'],
  ['/music-for-lovers-our-valentines-day-promotion/', '/journal/', 'Journal', 'This page has been retired.'],
  ['/outhere-music-receives-four-award-nominations/', '/journal/', 'Journal', 'This page has been retired.'],
  ...['beauty-treatments', 'body-recovery', 'cosmetics-and-care', 'eyelash-extensions', 'flowers-in-your-eyes', 'makeup', 'moon-swing', 'new-cats-turbo', 'our-little-big', 'rocky-mountain', 'skin-care', 'streetball-with-guys'].map((s) => [`/services/${s}/`, '/', 'The Higher Company', 'This page has been retired.']),
];

export function redirectPage([from, to, title, text]) {
  return { from, to, title, text };
}
