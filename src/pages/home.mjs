// home.mjs — "/" (live URL kept). Every live sentence is carried (clichés and two compliance phrases rewritten,
// see docs/CHANGE-LOG.md); new copy is built only from facts/client-facts.json.
import { esc, u, icon } from '../lib/html.mjs';
import { site, pillars } from '../content/site.mjs';
import { img, storefrontPicture, aiTag, wallLabel, btn, kicker, categoryShelf, joinBand, faqList, hoursTable, storeCard, pillarList, sectionHead, videoMeta } from '../lib/parts.mjs';
import { buildSVG, markSVG, leafSVG, mono3D } from '../lib/brand.mjs';
import { journalCards } from './journal.mjs';
import { orgLD, storeLD, websiteLD } from '../lib/seo.mjs';

export function home() {
  const m3d = mono3D(18);
  const vStore = videoMeta('vid-storefront');
  const tapeText = Array(3).fill(pillars.map((p) => p.name).join('  ✦  ')).join('  ✦  ') + '  ✦';
  const main = `
<section class="hero" data-hero data-spot>
  <div class="hero__ground" aria-hidden="true"><span class="hero__glow hero__glow--a"></span><span class="hero__glow hero__glow--b"></span><span class="hero__beam"></span><span class="grain"></span></div>
  <div class="hero__art" data-depth="0.16">
    <div class="hero__liberty-wrap">
      ${img('liberty', { cls: 'hero__liberty', priority: true })}
      <span class="hero__torch" aria-hidden="true"></span>
    </div>
    ${aiTag('hero')}
  </div>
  <div class="hero__float" aria-hidden="true">
    <span class="float float--leaf f1" data-depth="0.45">${leafSVG('float__svg')}</span>
    <span class="float float--leaf f5" data-depth="0.25">${leafSVG('float__svg')}</span>
    <span class="float float--dot f2" data-depth="0.6"></span><span class="float float--dot f3" data-depth="0.3"></span><span class="float float--dot f4" data-depth="0.8"></span>
  </div>
  <div class="container hero__in">
    <p class="kicker hero__kicker" data-reveal>${esc(site.address.street)} &middot; Downtown Syracuse, NY</p>
    <h1 class="hero__t" data-reveal style="--i:1"><span class="hero__t-a">The Higher</span> <span class="hero__t-b">Co.</span></h1>
    <h2 class="hero__sub" data-reveal style="--i:2">Your Premier Destination for Quality Cannabis in Downtown Syracuse, NY</h2>
    <div class="actions hero__actions" data-reveal style="--i:3">
      ${btn('Check Out Our Products', '/shop/', { v: 'mint' })}
      ${btn('Shop Lifestyle', '/lifestyle/', { v: 'ghost' })}
    </div>
    <div class="hero__meta" data-reveal style="--i:4">
      <a class="chip chip--glass" href="${u('/visit/')}"><span class="status__dot" data-open-dot aria-hidden="true"></span><span data-open-label>Hours</span></a>
      <a class="chip chip--glass" href="${u('/the-flower-bar/')}">${icon('lens')}<span>90 strains on the Flower Bar</span></a>
    </div>
  </div>
  <a class="hero__cue" href="#mission"><span class="sr-only">Skip to our founders&rsquo; mission</span><span class="hero__cue-line" aria-hidden="true"></span></a>
</section>

<div class="tape" aria-hidden="true" data-tape="${esc(tapeText)}"></div>

<section class="band band--gallery mission" id="mission" aria-labelledby="mission-t">
  <div class="container mission__in">
    <div class="mission__copy">
      ${kicker('Our founders&rsquo; mission')}
      <h2 class="mission__t" id="mission-t" data-reveal>Legacy to legal, <em>on Willow Street.</em></h2>
      <p class="lead" data-reveal style="--i:1">Mike Golden and co-founder Cage are Syracuse locals who came up together in the city&rsquo;s neighborhoods. Before the license there was The Higher Calling, their smoke-accessories and clothing shop, and a mission-based brand about breaking the stigma around cannabis.</p>
      <p data-reveal style="--i:2">They took that mission to Syracuse&rsquo;s Inner Harbor with the Stop the Stigma rally, then earned one of New York&rsquo;s CAURD licenses and opened The Higher Company downtown in June 2024. The goal hasn&rsquo;t changed: good product, honest answers, and a shop where everyone is welcome.</p>
      <div class="actions" data-reveal style="--i:3">${btn('Read our story', '/about/', { v: 'ink' })}${btn('Meet the crew', '/about/the-crew/', { v: 'ghost-dark' })}</div>
    </div>
    <div class="mission__piece" data-reveal style="--i:1">
      <div class="frame frame--spot" data-tilt>${markSVG('mission__mark', 'The Higher Co. monogram')}</div>
      <div class="mission__cap">${wallLabel('The Founders', ['Mike Golden &amp; co-founder Cage', 'Syracuse, New York', 'From The Higher Calling to The Higher Co.'])}</div>
    </div>
  </div>
</section>

<section class="mbuild" data-mbuild aria-labelledby="mbuild-t">
  <div class="mbuild__sticky">
    <div class="mbuild__light" aria-hidden="true"></div>
    <div class="container mbuild__in">
      <div class="mbuild__copy">
        ${kicker('What we stand on')}
        <h2 class="mbuild__t" id="mbuild-t">Five pillars, <em>one mark.</em></h2>
        ${pillarList({ cls: 'pillars--build' })}
      </div>
      <div class="mbuild__stage" aria-hidden="false">${buildSVG('mb')}</div>
    </div>
    <div class="mbuild__rail" aria-hidden="true"><span data-mb-rail></span></div>
  </div>
</section>

<section class="band band--gallery choice" aria-labelledby="choice-t">
  <div class="container choice__grid">
    <div class="choice__copy">
      ${kicker('Welcome')}
      <h2 class="sect-t" id="choice-t" data-reveal>Make The Higher Choice!</h2>
      <p data-reveal style="--i:1">Welcome to The Higher Company, Syracuse&rsquo;s leading downtown licensed New York State dispensary. As one of the first 137 dispensaries to open in the state, we are proud to be at the forefront of this new era in cannabis legalization. Our mission is to provide our community with the highest quality cannabis products and an unparalleled shopping experience.</p>
      <h3 class="choice__h3" data-reveal>Discover Our Wide Variety</h3>
      <p data-reveal style="--i:1">At <strong>The Higher Company</strong>, we believe that everyone deserves access to premium cannabis products that cater to their unique needs and preferences. We are really proud of our <a href="${u('/the-flower-bar/')}">Flower Bar</a> that holds 90 strains. From Sativas to Indicas and everything in between, our curated flower selection is sure to meet your needs. You can even smell and view the trichomes with a magnifying glass! We also carry an excellent selection of <a href="${u('/shop/pre-rolls/')}">pre-rolls</a>, <a href="${u('/shop/concentrates/')}">concentrates</a>, <a href="${u('/shop/edibles/')}">edibles</a>, topicals, and <a href="${u('/shop/accessories/')}">accessories</a>. There&rsquo;s something for everyone here at <strong>T.H.C</strong>. You can even pre-order online, and we&rsquo;ll have it ready! <a href="${u('/shop/')}">Shop now</a></p>
      <!-- [CONFIRM WITH CLIENT] "topicals" is in the live copy but the online menu shows no Topicals category (2026-11-10), so it is not linked. -->
    </div>
    <!-- [CONFIRM WITH CLIENT] AI illustration of a gallery-like interior, labelled on the page; replace with a real interior photo before launch. -->
    <div class="choice__fig" data-reveal="develop">
      <div class="choice__frame" data-depth="0.08">${img('interior', { sizes: '(max-width: 900px) 100vw, 56vw', cls: 'choice__img' })}</div>
      ${aiTag()}
    </div>
  </div>
</section>

${categoryShelf({ id: 'products', title: 'Our Products', lead: 'Six shelves from the live menu, each one a tap away from products, prices and your cart.' })}

<section class="band band--ink fbar" aria-labelledby="fbar-t" data-spot>
  <div class="fbar__media" data-lens-zone>
    ${img('macro-a', { sizes: '100vw', cls: 'fbar__img' })}
    <div class="lens" data-lens aria-hidden="true" style="--lens-img:url('${u('/' + 'assets/img/gen/macro-a-2400.webp')}')"></div>
    ${aiTag('corner')}
  </div>
  <div class="container fbar__in">
    <p class="fbar__num" aria-hidden="true"><span data-count="90">90</span></p>
    <div class="fbar__copy glass" data-reveal>
      ${kicker('In store &middot; The Flower Bar')}
      <h2 class="sect-t" id="fbar-t">Ninety strains, <em>under glass.</em></h2>
      <p>Lean in, smell the jars, then look closer: we keep magnifying glasses on the bar so you can see the trichomes for yourself. When you&rsquo;ve found the one, your budtender takes it from there.</p>
      <div class="actions">${btn('Explore the Flower Bar', '/the-flower-bar/', { v: 'mint' })}${btn('Shop flower', '/shop/flower/', { v: 'ghost' })}</div>
    </div>
  </div>
</section>

<section class="band band--gallery-2 feats" aria-label="Why The Higher Co.">
  <div class="container">
    <ul class="feats__grid" role="list">
      <li class="placard" data-reveal><span class="placard__ico">${icon('jar')}</span><h3 class="placard__t">Mind-Blowing Selection</h3><p>Brace yourselves for an out-of-this-world collection of adult-use recreational cannabis. We&rsquo;ve got everything you need, from the Flower Bar to the accessories shelf.</p></li>
      <li class="placard" data-reveal style="--i:1"><span class="placard__ico">${icon('people')}</span><h3 class="placard__t">Joint Masters at Your Service</h3><p>Our squad of budtenders knows their stuff! They&rsquo;ll guide you through the world of cannabis and help you find your perfect match.</p></li>
      <li class="placard" data-reveal style="--i:2"><span class="placard__ico">${icon('spark')}</span><h3 class="placard__t">Top-Notch Vibes</h3><p>We&rsquo;re all about keeping it chill and making everyone feel welcome. From our staff to our products, good vibes are guaranteed!</p></li>
    </ul>
  </div>
</section>

<section class="night" data-night aria-labelledby="night-t">
  <!-- [CONFIRM WITH CLIENT] AI illustration of a brick storefront at night, labelled on the page; replace with a real photo of 123 E Willow St before launch. -->
  <div class="night__media" data-depth="-0.08">
    ${storefrontPicture({ cls: 'night__pic' })}
    <video class="night__video" data-loop muted loop playsinline preload="none" width="${vStore.w}" height="${vStore.h}" poster="${u('/' + vStore.poster)}" data-src="${u('/' + vStore.file)}" aria-hidden="true"></video>
  </div>
  <div class="night__scrim" aria-hidden="true"></div>
  <div class="container night__in">
    <div class="night__plate glass" data-reveal>
      ${kicker('Downtown Syracuse')}
      <h2 class="night__t" id="night-t">Find us on Willow Street.</h2>
      <p class="night__addr">${esc(site.address.line)}</p>
      <p class="night__now"><span class="status__dot" data-open-dot aria-hidden="true"></span><span data-open-label>Hours</span></p>
      <ul class="ticks" role="list"><li>${icon('car')}Free reserved parking directly across the street</li><li>${icon('id')}Bring a valid government photo ID</li><li>${icon('bag')}Pre-order online, pick up in store</li></ul>
      <div class="actions">${btn('Directions', site.directions.google, { v: 'mint', ext: true })}${btn('Plan your visit', '/visit/', { v: 'ghost' })}</div>
    </div>
  </div>
  <button class="vidctl" type="button" data-vid-toggle hidden>${icon('pause')}<span class="sr-only">Pause the background film</span></button>
  ${aiTag('corner')}
</section>

<section class="band band--ink display" aria-labelledby="display-t" data-spot>
  <div class="display__bg" aria-hidden="true">${img('plinth', { sizes: '100vw', cls: 'display__plinth', decorative: true })}</div>
  <div class="container display__in">
    <div class="display__stage">
      ${m3d.sym}
      <div class="m3d" data-m3d tabindex="0" role="img" aria-label="The Higher Co. monogram in 3D. Drag, or use the arrow keys, to turn it." style="--ratio:${m3d.ratio}">
        <div class="m3d__spin" data-m3d-spin>${m3d.html}</div>
        <div class="m3d__shadow" aria-hidden="true"></div>
      </div>
      <p class="display__hint" aria-hidden="true">${icon('drag')} Drag to turn</p>
    </div>
    <div class="display__copy">
      ${kicker('Shop Lifestyle')}
      <h2 class="sect-t" id="display-t" data-reveal>The mark, <em>on display.</em></h2>
      <p data-reveal style="--i:1">Our THC monogram rides on the snapback, and Lady Liberty gets a graphic of her own. Lifestyle drops are sold in store only, next to the accessories shelf.</p>
      <ol class="droplist" role="list" data-reveal style="--i:2">
        <li><span class="droplist__n">Drop 01</span><span class="droplist__t">THC Monogram Snapback</span><span class="droplist__s">In store</span></li>
        <li><span class="droplist__n">Drop 02</span><span class="droplist__t">The Lady Liberty Graphic</span><span class="droplist__s">In store</span></li>
      </ol>
      <!-- [CONFIRM WITH CLIENT] merch availability, colours and pricing; the Liberty graphic is named but not shown (it depicts smoking; 9 NYCRR 129.2(b)(5),(12)). -->
      <div class="actions" data-reveal style="--i:3">${btn('Shop Lifestyle', '/lifestyle/', { v: 'mint' })}${btn('Shop accessories', '/shop/accessories/', { v: 'ghost' })}</div>
    </div>
  </div>
  ${aiTag('corner')}
</section>

<section class="band band--gallery journal-teaser" aria-labelledby="jt-t">
  <div class="container">
    ${sectionHead('The Journal', 'Learn before <em>you visit.</em>', 'Short, straight guides from the shop floor: trichomes, strain types, your first visit and New York&rsquo;s cannabis laws.', { id: 'jt-t' })}
    ${journalCards()}
    <p class="center">${btn('Read the Journal', '/journal/', { v: 'ghost-dark' })}</p>
  </div>
</section>

<section class="band band--gallery-2 faqprev" aria-labelledby="faqprev-t">
  <div class="container faqprev__grid">
    <div>
      ${sectionHead('«&#8206;Got Questions?»', 'Quick answers', '', { id: 'faqprev-t' })}
      ${faqList([
        ['Do I need a medical marijuana card to make a purchase?', '<p>No you do not.</p>'],
        ['What forms of ID are accepted?', '<p>A valid government photo ID showing your age: a driver&rsquo;s license or non-driver ID, a passport, an IDNYC card or a U.S. armed forces ID. <a href="' + u('/faqs/') + '#q-5">See the full list</a>.</p>'],
        ['Is there parking available?', '<p>Yes, you can park directly across the street in our reserved parking slots free of charge. There is also more parking under the bridge.</p>'],
        ['Can I place an order for pickup at the store?', '<p>Yes! Browse the <a href="' + u('/shop/') + '">live menu</a>, add items to your cart, and select the &ldquo;Pick Up In-Store&rdquo; option at checkout.</p>'],
      ], { idPrefix: 'hq' })}
      <p>${btn('All FAQs', '/faqs/', { v: 'ghost-dark', size: 'sm' })}</p>
    </div>
    <aside class="faqprev__store">
      ${storeCard()}
      ${hoursTable({ id: 'home-hours' })}
    </aside>
  </div>
</section>

${joinBand()}
`;
  return {
    path: '/',
    title: 'The Higher Company | Licensed Cannabis Dispensary in Downtown Syracuse, NY',
    description: 'The Higher Co. at 123 E Willow St, Syracuse: 90 strains on the Flower Bar, pre-rolls, vaporizers, concentrates, edibles and accessories. Order ahead for in-store pickup. 21+.',
    main,
    jsonld: [storeLD(), orgLD(), websiteLD()],
    bodyClass: 'page-home',
  };
}
