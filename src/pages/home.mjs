// home.mjs — "/" (live URL kept). Every live sentence is carried (clichés and two compliance phrases rewritten,
// see docs/CHANGE-LOG.md); new copy is built only from facts/client-facts.json.
import { esc, u, icon, readJSON } from '../lib/html.mjs';
import { site, pillars } from '../content/site.mjs';
import { img, storefrontPicture, heroPicture, aiTag, btn, kicker, categoryShelf, joinBand, faqList, visitBar, pillarList, sectionHead, videoMeta } from '../lib/parts.mjs';
import { articles } from '../content/journal.mjs';
import { orgLD, storeLD, websiteLD } from '../lib/seo.mjs';

const BUDS = readJSON('src/content/buds.json');   // the Flower Bar ball pit's sprite atlas

// The hero's life layers, placed in the golden-hour photograph's own pixel coordinates (see .hero__stage):
// traffic glimpsed above the elevated highway deck, bird shadows sweeping the sunlit side wall, a flock crossing the
// sky behind the gables. All decorative; stopped under reduced motion.
const BIRD = '<svg viewBox="0 0 100 40" aria-hidden="true" focusable="false"><path d="M50 31C46.5 27.5 42 24.4 36.5 22.6 25.5 19 13.5 17.6 0 19.2 11 13.8 24.5 9.4 37.5 13.2 43 14.8 47.2 18 50 21.4 52.8 18 57 14.8 62.5 13.2 75.5 9.4 89 13.8 100 19.2 86.5 17.6 74.5 19 63.5 22.6 58 24.4 53.5 27.5 50 31Z" fill="currentColor"/></svg>';
const RIM = 'fill="none" stroke="url(#hl-sun)" stroke-width="1.6" stroke-linecap="round"';
const VEHICLES = {
  sedan: { l: 132, h: 41, vb: '0 0 120 36', svg: `<path d="M3 31V25.5C3 22.6 5.2 21 8.4 20.5L27 18 37.5 9.6C40.4 7.3 43.8 6 47.6 6H76.5C81.4 6 85.6 7.9 88.8 11.6L95 18.6 110.6 20.6C114.6 21.1 117 23.6 117 27V31Z" fill="currentColor"/><path d="M40.8 17.2 47.2 10.6C48.4 9.4 49.9 8.8 51.6 8.8H62V17.2ZM65.2 8.8H75.6C78.6 8.8 81.3 10 83.3 12.2L88.4 17.2H65.2Z" fill="url(#hl-glass)"/><path d="M27 18 37.5 9.6C40.4 7.3 43.8 6 47.6 6H76.5" ${RIM}/>` },
  suv: { l: 140, h: 51, vb: '0 0 120 42', svg: `<path d="M3 37V28C3 25 5 23.4 8 23L22 21.6 30 10C31.6 7.6 34.3 6 37.4 6H88C91.6 6 94.6 7.9 96.2 11L102.4 22.4 112 23.8C115 24.3 117 26.6 117 29.6V37Z" fill="currentColor"/><path d="M33.4 20.6 38.6 11.6C39.4 10.2 40.9 9.4 42.5 9.4H60V20.6ZM63.4 9.4H86C88.2 9.4 90.1 10.6 91.1 12.6L95.6 20.6H63.4Z" fill="url(#hl-glass)"/><path d="M22 21.6 30 10C31.6 7.6 34.3 6 37.4 6H88" ${RIM}/>` },
  truck: { l: 200, h: 80, vb: '0 0 200 80', svg: `<path d="M3 76V8C3 5.8 4.8 4 7 4H140C142.2 4 144 5.8 144 8V76Z" fill="currentColor"/><path d="M146 76V30C146 27.8 147.8 26 150 26H174C176.6 26 179 27.4 180.4 29.6L193.4 50.6C194.4 52.2 195 54 195 56V76Z" style="fill:var(--cab)"/><path d="M152 31H172.6C174 31 175.4 31.8 176.2 33L186.4 49H152Z" fill="url(#hl-glass)"/><path d="M3 8C3 5.8 4.8 4 7 4H140" ${RIM}/>` },
};
// [type, colour, direction, lane, cycle s, delay s]: irregular on purpose, each crossing is 7% of its cycle
const TRAFFIC = [
  ['sedan', '#d8d2c8', 'r', 'near', 9, -1],
  ['suv', '#2c2f35', 'l', 'far', 11.5, 3.2],
  ['truck', '#b9b2a6', 'r', 'near', 17, 6],
  ['sedan', '#7a2b22', 'l', 'far', 13, 0.6],
  ['sedan', '#9ca1a6', 'r', 'near', 14.5, 8.4],
  ['suv', '#e3ddd2', 'l', 'far', 19, 11],
];
// bird-shadow flocks: start point (source px), cycle, delay, then [dx, dy, size, blur, wingbeat s] per bird
const FLOCKS = [
  { cls: 'flock--a', x: 1620, y: 1740, dur: 13, delay: 2.5, birds: [[0, 0, 290, 5, .29], [212, -125, 250, 6, .33], [375, 69, 273, 5, .27], [-194, 106, 230, 6.5, .31]] },
  { cls: 'flock--b', x: 1440, y: 2260, dur: 17, delay: 9, birds: [[0, 0, 360, 10, .35], [300, -70, 320, 11, .32], [125, 156, 300, 10, .38]] },
];
const SKYFLOCK = [[0, 0, 74, .22], [90, -38, 62, .26], [160, 22, 68, .24], [250, -12, 58, .28], [60, 54, 56, .25]];
// Which hero: 'golden' (golden hour) or 'night' (operator, 2026-11-10: "a night version of his storefront, but make it
// look more cinematic"). Both keep their own photo, phone crop and life layers; switching is this one constant.
const HERO_TIME = 'golden';
// at night the car bodies read as dark shapes; their lamps sit below the barrier, so only their light shows
const NIGHT_BODY = ['#202328', '#16181c', '#2a2d32', '#1b1d21', '#25282d', '#2f3237'];
function heroLife(time) {
  const night = time === 'night';
  const cars = TRAFFIC.map(([t, c, dir, lane, dur, delay], i) => { const v = VEHICLES[t]; if (night) c = NIGHT_BODY[i % NIGHT_BODY.length];
    return `<span class="car car--${dir} car--${lane} car--${t}" style="--l:${v.l};--h:${v.h};--c:${c};--cab:#6b2d24;--dur:${dur}s;--delay:${delay}s"><svg viewBox="${v.vb}" preserveAspectRatio="none" aria-hidden="true" focusable="false">${v.svg}</svg></span>`; }).join('');
  const flocks = FLOCKS.map((f) => `<span class="flock ${f.cls}" style="--fx:${f.x};--fy:${f.y};--dur:${f.dur}s;--delay:${f.delay}s">${f.birds.map(([dx, dy, s, b, w]) => `<span class="bshadow" style="--dx:${dx};--dy:${dy};--s:${s};--b:${b};--flap:${w}s">${BIRD}</span>`).join('')}</span>`).join('');
  const sky = `<span class="skyflock">${SKYFLOCK.map(([dx, dy, s, w]) => `<span class="skybird" style="--dx:${dx};--dy:${dy};--s:${s};--flap:${w}s">${BIRD}</span>`).join('')}</span>`;
  return `<div class="hero__life" aria-hidden="true">
    <svg class="hero__defs" width="0" height="0" focusable="false"><defs><linearGradient id="hl-sun" x1="0" x2="1"><stop offset="0" stop-color="#ffd29a" stop-opacity=".95"/><stop offset="1" stop-color="#ffd29a" stop-opacity=".15"/></linearGradient><linearGradient id="hl-glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a8c94"/><stop offset=".55" stop-color="#2a313b"/><stop offset="1" stop-color="#1b2028"/></linearGradient></defs></svg>
    <div class="hero__traffic"><div class="hero__road">${cars}</div></div>
    ${night
      ? '<div class="hero__sweep"></div><div class="hero__mist"></div>'
      : `<div class="hero__shade">${flocks}</div>\n    <div class="hero__birds">${sky}</div>`}
  </div>`;
}

// the five pillars as a gallery walk: a "museum of the everyday" (operator, 2026-11-10: fun pictures that match
// the humour of the founders' hands) - each pillar's everyday object shown like a priceless exhibit
const PILLAR_PICS = ['pillar-megaphone', 'pillar-jewel', 'pillar-snowglobe', 'pillar-sommelier', 'pillar-crown'];
// where each exhibit sits in its portrait frame: the landscape cards of the curved strip crop to it
const PILLAR_FOCUS = ['62%', '55%', '55%', '36%', '48%'];

export function home() {
  const vStore = videoMeta('vid-storefront');
  const tapeText = Array(3).fill(pillars.map((p) => p.name).join('  ✦  ')).join('  ✦  ') + '  ✦';
  const main = `
<section class="hero hero--${HERO_TIME}" data-hero data-spot>
  <div class="hero__photo"><div class="hero__stage">${heroPicture('hero-' + HERO_TIME, { cls: 'hero__pic', priority: true })}${heroLife(HERO_TIME)}</div></div>
  <div class="hero__leak" aria-hidden="true"></div>
  <div class="hero__grade" aria-hidden="true"><span class="grain"></span></div>
  ${aiTag('hero')}
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

<section class="band band--gallery mission mission--banner" id="mission" aria-labelledby="mission-t">
  <span class="brass-rule brass-rule--bottom" aria-hidden="true"></span>
  <figure class="mbanner">
    <div class="mbanner__stage" data-meet>
      <p class="mbanner__word" aria-hidden="true"><span>The Founders</span></p>
      ${img('hands-l', { cls: 'mbanner__hand mbanner__hand--l', sizes: '(max-width: 900px) 136vw, 100vw' })}
      ${img('hands-r', { cls: 'mbanner__hand mbanner__hand--r', sizes: '(max-width: 900px) 136vw, 100vw', decorative: true })}
    </div>
    ${aiTag('onlight')}
  </figure>
  <div class="container mbanner__in">
    <div class="mbanner__head">
      ${kicker('Our founders&rsquo; mission')}
      <h2 class="mission__t" id="mission-t" data-reveal>Legacy to legal, <em>on Willow Street.</em></h2>
    </div>
    <div class="mbanner__body">
      <p class="lead" data-reveal style="--i:1">Mike Golden and co-founder Cage are Syracuse locals who came up together in the city&rsquo;s neighborhoods. Before the license there was The Higher Calling, their smoke-accessories and clothing shop, and a mission-based brand about breaking the stigma around cannabis.</p>
      <p data-reveal style="--i:2">They took that mission to Syracuse&rsquo;s Inner Harbor with the Stop the Stigma rally, then earned one of New York&rsquo;s CAURD licenses and opened The Higher Company downtown in June 2024. The goal hasn&rsquo;t changed: good product, honest answers, and a shop where everyone is welcome.</p>
      <div class="actions" data-reveal style="--i:3">${btn('Read our story', '/about/', { v: 'ink' })}${btn('Meet the crew', '/about/the-crew/', { v: 'ghost-dark' })}</div>
    </div>
  </div>
</section>

<section class="walk" data-walk aria-labelledby="walk-t">
  <div class="walk__sticky">
    <div class="container walk__head">
      ${kicker('What we stand on')}
      <h2 class="walk__t" id="walk-t">Five pillars, <em>one mark.</em></h2>
    </div>
    <div class="walk__viewport">
      <ol class="walk__track">
        ${pillars.map((p, i) => `<li class="walk__card" style="--oy:${PILLAR_FOCUS[i]}">
          <figure class="walk__media">${img(PILLAR_PICS[i], { cls: 'walk__img', sizes: '(max-width: 900px) 66vw, 520px' })}${aiTag('card')}</figure>
          <div class="walk__text">
            <p class="walk__n">${esc(p.n)}</p>
            <h3 class="walk__name">${esc(p.name)}</h3>
            <p class="walk__line">${esc(p.line)}</p>
          </div>
        </li>`).join('')}
      </ol>
    </div>
    <div class="container walk__caption" aria-hidden="true"><p class="walk__n" data-walk-n></p><p class="walk__name" data-walk-name></p><p class="walk__line" data-walk-line></p>${aiTag('strip')}</div>
  </div>
</section>

<section class="band band--gallery choice" aria-labelledby="choice-t">
  <span class="brass-rule brass-rule--top" aria-hidden="true"></span>
  <span class="brass-rule brass-rule--bottom" aria-hidden="true"></span>
  <!-- A magazine bento (operator, 2026-11-10: "lets go for the bento"): the heading, both paragraphs, the shop's own three
       photos (upscaled 2x, golden-hour graded; tools/process-images.py) and the 137 fact, each in its own tile.
       [CONFIRM WITH CLIENT] the counter photo shows staff and identifiable customers: confirm everyone pictured agreed
       to appear on the website, or blur the customers; and confirm all three photos are the client's own (not Google
       Maps customer photos), because the caption credits The Higher Co. -->
  <div class="container choice__bento">
    <div class="choice__t choice__t--head">
      ${kicker('Welcome')}
      <h2 class="sect-t" id="choice-t" data-reveal>Make The Higher Choice!</h2>
    </div>
    <figure class="choice__t choice__t--wide choice__crop">${img('photo-interior', { sizes: '(max-width: 900px) 150vw, (max-width: 1180px) 118vw, 74vw', cls: 'choice__img', attrs: 'data-reveal="develop"' })}</figure>
    <div class="choice__t choice__t--p1">
      <p data-reveal style="--i:1">Welcome to The Higher Company, Syracuse&rsquo;s leading downtown licensed New York State dispensary. As one of the first 137 dispensaries to open in the state, we are proud to be at the forefront of this new era in cannabis legalization. Our mission is to provide our community with the highest quality cannabis products and an unparalleled shopping experience.</p>
    </div>
    <figure class="choice__t choice__t--crew choice__crop" style="--fx:40%;--fy:42%;--z:1.12">${img('photo-counter', { sizes: '(max-width: 900px) 54vw, 56vw', cls: 'choice__img', attrs: 'data-reveal="develop"' })}</figure>
    <div class="choice__t choice__t--p2">
      <h3 class="choice__h3" data-reveal>Discover Our Wide Variety</h3>
      <p data-reveal style="--i:1">At <strong>The Higher Company</strong>, we believe that everyone deserves access to premium cannabis products that cater to their unique needs and preferences. We are really proud of our <a href="${u('/the-flower-bar/')}">Flower Bar</a> that holds 90 strains. From Sativas to Indicas and everything in between, our curated flower selection is sure to meet your needs. You can even smell and view the trichomes with a magnifying glass! We also carry an excellent selection of <a href="${u('/shop/pre-rolls/')}">pre-rolls</a>, <a href="${u('/shop/concentrates/')}">concentrates</a>, <a href="${u('/shop/edibles/')}">edibles</a>, topicals, and <a href="${u('/shop/accessories/')}">accessories</a>. There&rsquo;s something for everyone here at <strong>T.H.C</strong>. You can even pre-order online, and we&rsquo;ll have it ready! <a href="${u('/shop/')}">Shop now</a></p>
      <!-- [CONFIRM WITH CLIENT] "topicals" is in the live copy but the online menu shows no Topicals category (2026-11-10), so it is not linked. -->
    </div>
    <p class="choice__t choice__t--fact" aria-hidden="true"><b>137</b><span>We were one of the first 137 dispensaries to open in New York State</span></p>
    <div class="choice__t choice__t--detail choice__crop" style="--fy:55%">${img('photo-display', { sizes: '(max-width: 900px) 100vw, 62vw', cls: 'choice__img', attrs: 'data-reveal="develop"' })}<span class="choice__cap">123 E Willow St &middot; Photos: The Higher Co.</span></div>
  </div>
</section>

${categoryShelf({ id: 'products', title: 'Our Products', lead: 'Six shelves from the live menu, each one a tap away from products, prices and your cart.' })}

<section class="band band--ink fbar" aria-labelledby="fbar-t" data-spot>
  <!-- the ball pit (operator, 2026-11-10: a ball pit with ~90 different buds instead of balls; the
       magnifying glass kept, the teal "90" removed): site.js drops the buds in from the top when the section shows,
       they pile up and roll, the cursor nudges them, a bud can be grabbed and thrown, a click bursts them; the lens
       redraws the buds under it, magnified. Sprites: src/content/buds.json + the atlas (tools/process-images.py). -->
  <div class="fbar__media" data-lens-zone>
    <canvas class="fbar__pit" data-pit data-atlas="${u('/' + BUDS.files.hi.file)}" data-atlas-lo="${u('/' + BUDS.files.lo.file)}" data-cell="${BUDS.files.hi.cell}" data-cell-lo="${BUDS.files.lo.cell}" data-cols="${BUDS.cols}" data-n="${BUDS.n}" data-r="${BUDS.r.join(',')}" aria-hidden="true"></canvas>
    <div class="lens" data-lens aria-hidden="true"><canvas></canvas></div>
    ${aiTag('corner')}
  </div>
  <div class="container fbar__in">
    <div class="fbar__copy glass" data-reveal>
      ${kicker('In store &middot; The Flower Bar')}
      <h2 class="sect-t" id="fbar-t">Ninety strains, <em>under glass.</em></h2>
      <p>Lean in, smell the jars, then look closer: we keep magnifying glasses on the bar so you can see the trichomes for yourself. When you&rsquo;ve found the one, your budtender takes it from there.</p>
      <div class="actions">${btn('Explore the Flower Bar', '/the-flower-bar/', { v: 'mint' })}${btn('Shop flower', '/shop/flower/', { v: 'ghost' })}</div>
    </div>
  </div>
</section>

<section class="night" data-night aria-labelledby="night-t">
  <span class="brass-rule brass-rule--top" aria-hidden="true"></span>
  <!-- [CONFIRM WITH CLIENT] AI illustration of a brick storefront at night (no longer tagged on the page: the operator removed the visible AI tags, 2026-11-10; the alt text still says AI); replace with a real photo of 123 E Willow St before launch. -->
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
    <!-- the three promises, merged in beside the address (operator, 2026-11-10: "merge [the accordion] and this section
         because this section has so many empty space"): stacked here so each title stays on one line; the open panel
         grows and shows its text (hover, focus or tap). Pictures are the site's own AI illustrations, decorative. -->
      <ul class="acc acc--stack" role="list" data-acc aria-label="Why The Higher Co.">
        <li class="acc__p is-open" tabindex="0" data-reveal>${img('oak-jars', { cls: 'acc__img', sizes: '(max-width: 900px) 100vw, 60vw', alt: '', decorative: true })}<div class="acc__body"><span class="placard__ico acc__ico">${icon('jar')}</span><h3 class="acc__t">Mind-Blowing Selection</h3><p class="acc__text">Brace yourselves for an out-of-this-world collection of adult-use recreational cannabis. We&rsquo;ve got everything you need, from the Flower Bar to the accessories shelf.</p></div></li>
        <li class="acc__p" tabindex="0" data-reveal>${img('magnifier', { cls: 'acc__img', sizes: '(max-width: 900px) 100vw, 60vw', alt: '', decorative: true })}<div class="acc__body"><span class="placard__ico acc__ico">${icon('people')}</span><h3 class="acc__t">Joint Masters at Your Service</h3><p class="acc__text">Our squad of budtenders knows their stuff! They&rsquo;ll guide you through the world of cannabis and help you find your perfect match.</p></div></li>
        <li class="acc__p" tabindex="0" data-reveal>${img('blockparty', { cls: 'acc__img', sizes: '(max-width: 900px) 100vw, 60vw', alt: '', decorative: true })}<div class="acc__body"><span class="placard__ico acc__ico">${icon('spark')}</span><h3 class="acc__t">Top-Notch Vibes</h3><p class="acc__text">We&rsquo;re all about keeping it chill and making everyone feel welcome. From our staff to our products, good vibes are guaranteed!</p></div></li>
      </ul>
  </div>
  <button class="vidctl" type="button" data-vid-toggle hidden>${icon('pause')}<span class="sr-only">Pause the background film</span></button>
  ${aiTag('corner')}
</section>

<section class="band band--ink display" aria-labelledby="display-t" data-spot>
  <div class="display__bg" aria-hidden="true">${img('plinth', { sizes: '100vw', cls: 'display__plinth', decorative: true })}</div>
  <div class="container display__in">
    <!-- the drops on the plinth (operator, 2026-11-10): choosing a drop below shows it here. Drop 02 is the Lady Liberty tee
         (the operator's mockup, cut out). [CONFIRM WITH CLIENT] the picture is an EDITED version of the graphic: the joint and the smoke cloud were removed (operator, 2026-11-10) because New York's cannabis advertising rules bar depicting consumption (9 NYCRR 129.2(b)(5) per a secondary source; check the current official text, Parts 128-129 were recently amended). The tee sold in store still has them, so the client either prints this version or the type poster comes back (its styles are kept); the cannabis-leaf crown still needs their compliance review; the artwork matches a Shutterstock stock illustration (ID 1795674991): confirm the licence covers merch and edits. -->
    <div class="display__stage" data-drops>
      <div class="dropshow">
        <figure class="dropshow__item is-on" data-drop="0">${img('drop-cap', { cls: 'dropshow__img', sizes: '(max-width: 900px) 64vw, 420px' })}</figure>
        <figure class="dropshow__item" data-drop="1">${img('drop-tee', { cls: 'dropshow__img', sizes: '(max-width: 900px) 64vw, 420px' })}</figure>
        <div class="dropshow__shadow" aria-hidden="true"></div>
      </div>
    </div>
    <div class="display__copy">
      ${kicker('Shop Lifestyle')}
      <h2 class="sect-t" id="display-t" data-reveal>The mark, <em>on display.</em></h2>
      <p data-reveal style="--i:1">Our THC monogram rides on the snapback, and Lady Liberty gets a graphic of her own. Lifestyle drops are sold in store only, next to the accessories shelf.</p>
      <ol class="droplist" role="list" data-reveal style="--i:2">
        <li><button class="droplist__b is-on" type="button" data-drop-btn="0" aria-pressed="true"><span class="droplist__n">Drop 01</span><span class="droplist__t">THC Monogram Snapback</span><span class="droplist__s">In store</span></button></li>
        <li><button class="droplist__b" type="button" data-drop-btn="1" aria-pressed="false"><span class="droplist__n">Drop 02</span><span class="droplist__t">The Lady Liberty Graphic</span><span class="droplist__s">In store</span></button></li>
      </ol>
      <!-- [CONFIRM WITH CLIENT] merch availability, colours and pricing; the Liberty tee is now shown (operator, 2026-11-10; see the compliance note on the plinth above); Drop 01's picture is an AI re-image of the client's own snapback photo with the brand's real wordmark on the patch: confirm it matches the cap sold in store. -->
      <div class="actions" data-reveal style="--i:3">${btn('Shop Lifestyle', '/lifestyle/', { v: 'mint' })}${btn('Shop accessories', '/shop/accessories/', { v: 'ghost' })}</div>
    </div>
  </div>
  ${aiTag('corner')}
</section>

<section class="band band--gallery journal-teaser" aria-labelledby="jt-t">
  <div class="container">
    ${sectionHead('The Journal', 'Learn before <em>you visit.</em>', 'Short, straight guides from the shop floor: trichomes, strain types, your first visit and New York&rsquo;s cannabis laws.', { id: 'jt-t' })}
    <!-- J3 "feature rotator" (operator, 2026-11-10, from the layout lab): one guide shown large, the next every five
         seconds once the section is on screen (a progress line counts down); hover, tap or focus a title to jump to it;
         it holds while the pointer or focus is inside. The four titles fill the feature's height (operator). Reduced
         motion: no auto-advance. Only the guide on show is reachable (the others are visibility: hidden). -->
    <div class="jrot" data-jrot>
      <div class="jrot__stage">${articles.map((a, i) => `<a class="jrot__feat${i === 0 ? ' is-on' : ''}" href="${u(`/journal/${a.slug}/`)}"><span class="jrot__media">${img(a.img, { cls: 'jrot__img', sizes: '(max-width: 900px) 100vw, 58vw', alt: '', decorative: true })}</span><span class="jrot__body"><span class="jrot__label">${esc(a.label)} &middot; ${a.minutes} min read</span><span class="jrot__t">${esc(a.h1.charAt(0).toUpperCase() + a.h1.slice(1))}</span><span class="jrot__dek">${esc(a.dek)}</span></span></a>`).join('')}</div>
      <ol class="jrot__list" role="list" aria-label="The four guides">${articles.map((a, i) => `<li><button class="jrot__row${i === 0 ? ' is-on' : ''}" type="button" aria-pressed="${i === 0}"><span class="jrot__n">0${i + 1}</span><span class="jrot__rt">${esc(a.h1.charAt(0).toUpperCase() + a.h1.slice(1))}</span><span class="jrot__meta">${esc(a.label)} &middot; ${a.minutes} min read</span><span class="jrot__bar" aria-hidden="true"><i></i></span></button></li>`).join('')}</ol>
    </div>
    <p class="center">${btn('Read the Journal', '/journal/', { v: 'ghost-dark' })}</p>
  </div>
</section>

<!-- Quick answers as F2 "Visit bar" (operator, 2026-11-10, from the layout lab): the visit details in one dark bar under
     the heading (address, live status, the week as seven chips with today lit, the two buttons); the questions in two
     columns; All FAQs centred below them. -->
<section class="band band--gallery-2 faqprev" aria-labelledby="faqprev-t">
  <div class="container">
    ${sectionHead('«&#8206;Got Questions?»', 'Quick answers', '', { id: 'faqprev-t' })}
    ${visitBar()}
    <div class="faqprev__qs">
      ${faqList([
        ['Do I need a medical marijuana card to make a purchase?', '<p>No you do not.</p>'],
        ['What forms of ID are accepted?', '<p>A valid government photo ID showing your age: a driver&rsquo;s license or non-driver ID, a passport, an IDNYC card or a U.S. armed forces ID. <a href="' + u('/faqs/') + '#q-5">See the full list</a>.</p>'],
        ['Is there parking available?', '<p>Yes, you can park directly across the street in our reserved parking slots free of charge. There is also more parking under the bridge.</p>'],
        ['Can I place an order for pickup at the store?', '<p>Yes! Browse the <a href="' + u('/shop/') + '">live menu</a>, add items to your cart, and select the &ldquo;Pick Up In-Store&rdquo; option at checkout.</p>'],
      ], { idPrefix: 'hq', openFirst: false })}
    </div>
    <p class="faqprev__all">${btn('All FAQs', '/faqs/', { v: 'ghost-dark', size: 'sm' })}</p>
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
