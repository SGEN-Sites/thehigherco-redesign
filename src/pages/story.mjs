// story.mjs — /about/ (live URL kept, now "Our Story"), /about/the-crew/, /the-flower-bar/, /lifestyle/.
// Inner-pages update (operator, 2026-11-10: "now that you have an idea and design principle from how we built the home
// page, i would like you to update all inner pages"): the home's language carried over. Light and dark bands alternate,
// a brass rule marks the meaningful straight light/dark breaks, dark bands that touch read as one field, the shop's own
// photos replace the THC-logo art and the AI stand-ins, and the home's own components do the moving (the accordion, the
// Journal rotator, the glass cases, the founders' hands). Every sentence is the same as before; only layout changed.
import { esc, u, icon } from '../lib/html.mjs';
import { site, pillars } from '../content/site.mjs';
import { img, imgMeta, aiTag, wallLabel, btn, kicker, pageHero, crumbsLD, sectionHead, ytFacade, videoMeta, menuEmbed, accordion } from '../lib/parts.mjs';

// the counter photo shows real people: every use carries this note (see the home Welcome bento)
const COUNTER_NOTE = '<!-- [CONFIRM WITH CLIENT] the counter photo shows staff and identifiable customers: confirm consent (everyone pictured agreed to appear on the website, or blur the customers), and confirm the photo is the client\'s own. -->';

// the five pillars' exhibits, the same pictures and landscape focal points as the home gallery walk
const PILLAR_PICS = ['pillar-megaphone', 'pillar-jewel', 'pillar-snowglobe', 'pillar-sommelier', 'pillar-crown'];
const PILLAR_FOCUS = ['62%', '55%', '55%', '36%', '48%'];

// one glass case (the markup of the home "Our Products" shelf, parts.mjs categoryShelf), with this page's own words.
// The colon of the old list ("Flower: Premium ...") is kept for screen readers and the page text, hidden on screen.
function productCase({ name, line, href, pic }, i) {
  if (!pic) {
    // Topicals: no picture and no shop page (not on the online menu), so a plain case: the jar icon in the brass light,
    // no bag button, not a link
    return `<li class="shelf__item" data-reveal style="--i:${i % 3}">
        <div class="case case--plain">
          <span class="case__obj case__obj--ico" aria-hidden="true">${icon('jar')}</span>
          <span class="case__name">${name}<span class="sr-only">:</span></span>
          <span class="case__line">${line}</span>
        </div>
      </li>`;
  }
  const r = imgMeta(pic).ratio;
  const sizes = `(max-width: 700px) ${Math.max(4, Math.round(Math.min(40 * r, 31)))}vw, (max-width: 1180px) ${Math.max(3, Math.round(Math.min(24 * r, 20)))}vw, ${Math.max(2, Math.round(Math.min(15 * r, 10)))}vw`;
  return `<li class="shelf__item" data-reveal style="--i:${i % 3}">
        <a class="case" href="${u(href)}" data-tilt>
          <span class="case__obj">${img(pic, { sizes, cls: 'case__img', alt: '', decorative: true })}</span>
          <span class="case__name">${name}<span class="sr-only">:</span></span>
          <span class="case__line">${line}</span>
          <span class="case__cart" aria-hidden="true">${icon('bag')}</span>
        </a>
      </li>`;
}

// ---------------------------------------------------------------- /about/  (Our Story)
export function about() {
  const crumb = [['Home', '/'], ['Our Story', '/about/']];
  const products = [
    { name: 'Flower', line: 'Premium sativas, indicas, and hybrids.', href: '/shop/flower/', pic: 'cat-flower' },
    { name: 'Edibles', line: 'Tasty options, from gummies to baked goods.', href: '/shop/edibles/', pic: 'cat-edibles' },
    { name: 'Concentrates', line: 'Pure extracts like wax, shatter, and oils.', href: '/shop/concentrates/', pic: 'cat-concentrates' },
    { name: 'Pre-Rolls', line: 'Convenient and ready-to-use pre-rolled joints.', href: '/shop/pre-rolls/', pic: 'cat-prerolls' },
    { name: 'Topicals', line: 'Cannabis-infused lotions, balms, and creams for topical use.' },
    { name: 'Accessories', line: 'Everything you need to enhance your cannabis experience.', href: '/shop/accessories/', pic: 'cat-accessories' },
  ];
  const main = `
${pageHero({
  kicker: 'About The Higher Company', title: 'Our Story',
  lead: '<p>Two Syracuse locals, a clothing shop with a mission, a rally at the Inner Harbor, and one of New York&rsquo;s CAURD licenses. This is how The Higher Company got to 123 E Willow St.</p>',
  crumbList: crumb,
  // the shop's own photo in the art frame (operator, home: "instead of having THC logo it would make more sense to have
  // complementing imageries")
  art: `<div class="phero__frame phero__frame--photo" data-tilt>${img('photo-interior', { cls: 'phero__photo', sizes: '(max-width: 900px) 74vw, 520px', priority: true })}</div>`,
  cls: 'phero--art',
})}

<!-- The opening and the story in one light sheet (were two bands): the welcome beside its heading, then the shop's own
     display-case photo beside the founding story and the quote. -->
<section class="band band--gallery band--tight story2" aria-labelledby="pioneer-t">
  <span class="brass-rule brass-rule--bottom" aria-hidden="true"></span>
  <div class="container story2__grid">
    <h2 class="sect-t story2__t" id="pioneer-t" data-reveal>Pioneering a New Era in Cannabis</h2>
    <p class="lead story2__lead" data-reveal style="--i:1">Welcome to The Higher Company, Syracuse&rsquo;s second downtown licensed New York State dispensary. As one of the first 137 dispensaries to open in the state, we are proud to be part of a historic moment in cannabis legalization. Our mission is to provide high-quality cannabis products and create a welcoming environment for our community.</p>
    <figure class="story2__fig" data-reveal="develop">
      <div class="frame story2__frame" data-depth="0.05">${img('photo-display', { sizes: '(max-width: 900px) 92vw, 40vw', cls: 'story2__img' })}</div>
    </figure>
    <div class="story2__copy">
      <h2 class="sect-t" id="story-t" data-reveal>Our Story</h2>
      <p data-reveal style="--i:1">The Higher Company was founded with a vision to transform the cannabis industry and promote its benefits to a wider audience. Our founding members are proud participants in New York&rsquo;s Cannabis Adult-Use Retail Dispensary (CAURD) program. Having been previously convicted for cannabis-related offenses, they have turned their past experiences into a positive force for change. Their journey from adversity to advocacy is a testament to resilience and the transformative power of cannabis.</p>
      <figure class="pull" data-reveal style="--i:2">
        <blockquote><p>Our journey began with a passion for the plant and a commitment to providing safe, accessible, and high-quality cannabis products to our community.</p></blockquote>
        <figcaption>Joe Sweet</figcaption>
      </figure>
      <!-- [CONFIRM WITH CLIENT] Joe Sweet's role/title (OCM lists "Joseph Sweet" as the licence's primary contact). The quote's first sentence ("We believe in the power of cannabis to enhance well-being and improve quality of life") was trimmed: 9 NYCRR 129.2(b)(9) bars wellness claims in advertising, and the whole website counts as advertising (128.1(b)). -->
    </div>
  </div>
</section>

<section class="band band--ink band--tight timeline" aria-labelledby="legacy-t" data-spot>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container">
    ${sectionHead('Legacy to Legal', 'From The Higher Calling <em>to The Higher Co.</em>', 'Mike Golden and co-founder Cage built this shop on the same mission they started with: breaking the stigma around cannabis.', { id: 'legacy-t' })}
    <ol class="tl" role="list">
      <li class="tl__item" data-reveal><span class="tl__when">Syracuse</span><h3 class="tl__t">Came up together</h3><p>Mike Golden and co-founder Cage are Syracuse locals who came up together in the city&rsquo;s neighborhoods.</p></li>
      <li class="tl__item" data-reveal style="--i:1"><span class="tl__when">The Higher Calling</span><h3 class="tl__t">A shop with a mission</h3><p>Before the license, they ran The Higher Calling: a smoke-accessories and clothing shop, and a mission-based brand about breaking the stigma around cannabis.</p></li>
      <li class="tl__item" data-reveal style="--i:2"><span class="tl__when">Stop the Stigma</span><h3 class="tl__t">A rally at the Inner Harbor</h3><p>They took the mission public with the Stop the Stigma rally at Syracuse&rsquo;s Inner Harbor.</p></li>
      <li class="tl__item" data-reveal style="--i:3"><span class="tl__when">CAURD</span><h3 class="tl__t">One of New York&rsquo;s CAURD licenses</h3><p>New York&rsquo;s Conditional Adult-Use Retail Dispensary (CAURD) program put the state&rsquo;s first adult-use dispensary licenses in the hands of people affected by past cannabis enforcement. Our founders earned one.</p></li>
      <li class="tl__item tl__item--now" data-reveal style="--i:4"><span class="tl__when">June 2024</span><h3 class="tl__t">123 E Willow St</h3><p>The Higher Company opened in downtown Syracuse, with the Flower Bar front and center.</p></li>
    </ol>
  </div>
</section>
<!-- [CONFIRM WITH CLIENT] timeline wording; Cage's first name is deliberately omitted (sources disagree); rally year omitted (sources disagree). -->

<!-- The five pillars as the home's museum exhibits, one at a time: the home Journal rotator (data-jrot) shows one large,
     moves on every five seconds once in view (a brass line counts down), holds on hover or focus, and each row jumps to
     its pillar. The exhibit stays fully lit (no words over it); the row on show opens its line, and every line stays in
     the page for screen readers. Reduced motion: no auto-advance. Same dark field as the timeline above (no seam). -->
<section class="band band--ink band--tight pillars2" aria-labelledby="pillars-t" data-spot>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container">
    <div class="jrot pillars2__rot" data-jrot>
      ${sectionHead('What we stand on', 'Five pillars', 'The ideas that run through everything we do, from the jars on the Flower Bar to the way we answer your questions.', { id: 'pillars-t' })}
      <div class="jrot__stage">${pillars.map((p, i) => `<div class="jrot__feat${i === 0 ? ' is-on' : ''}" style="--oy:${PILLAR_FOCUS[i]}"><span class="jrot__media">${img(PILLAR_PICS[i], { cls: 'jrot__img', sizes: '(max-width: 900px) 100vw, 50vw' })}</span></div>`).join('')}</div>
      <ol class="jrot__list" role="list" aria-labelledby="pillars-t">${pillars.map((p, i) => `<li><button class="jrot__row${i === 0 ? ' is-on' : ''}" type="button" aria-pressed="${i === 0}"><span class="jrot__n">${esc(p.n)}</span><span class="jrot__rt">${esc(p.name)}</span><span class="pillars2__line">${esc(p.line)}</span><span class="jrot__bar" aria-hidden="true"><i></i></span></button></li>`).join('')}</ol>
    </div>
  </div>
</section>

<!-- The four values as the home's expanding picture panels, stacked beside the mission (as the home's three promises
     beside the address): hover, focus or tap opens one. Pictures are decorative; the words carry the meaning. -->
<section class="band band--gallery-2 band--tight mission3" aria-labelledby="mission2-t">
  <span class="brass-rule brass-rule--bottom" aria-hidden="true"></span>
  <div class="container mission3__grid">
    <div class="mission3__copy">
      <h2 class="sect-t" id="mission2-t" data-reveal>Our Mission</h2>
      <p data-reveal style="--i:1">Our mission is to deliver the highest quality cannabis products while fostering a sense of community and support. We strive to educate the public, break down stigmas, and advocate for the responsible use of cannabis. At The Higher Company, we are dedicated to:</p>
    </div>
    ${accordion([
      { img: 'macro-b', title: 'Quality<span class="sr-only">: </span>', text: 'Sourcing only the best products from trusted growers and producers.' },
      { img: 'oak-jars', title: 'Variety<span class="sr-only">: </span>', text: 'Offering a wide range of products to meet diverse needs and preferences.' },
      { img: 'magnifier', title: 'Education<span class="sr-only">: </span>', text: 'Providing accurate information and resources to help our customers make informed decisions.' },
      { img: 'photo-counter', title: 'Community<span class="sr-only">: </span>', text: 'Building a supportive and inclusive community through events, outreach, and advocacy.' },
    ], { cls: 'acc--stack mission3__acc', tag: 'strong', sizes: '(max-width: 900px) 100vw, 56vw' })}
    ${COUNTER_NOTE}
  </div>
</section>

<!-- Our Products as the home's glass cases (the products rising out of the top, brass bag buttons), with this page's own
     list words; the dark runs on into Community Engagement. -->
<section class="band band--ink band--tight shelf ourprod" aria-labelledby="products-t" data-spot>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container">
    <div class="sect-head">
      <h2 class="sect-t" id="products-t" data-reveal>Our Products</h2>
      <p class="sect-lead" data-reveal style="--i:1">At The Higher Company, quality is our top priority. We offer a diverse selection of cannabis products, including:</p>
    </div>
    <ul class="shelf__grid" role="list">
      ${products.map(productCase).join('')}
    </ul>
    <!-- [CONFIRM WITH CLIENT] compliance trims in this list: "Potent" removed before "and pure extracts" (129.2(b)(13), potency promotion) and "and effective" removed after "Tasty" (129.2(b)(9)). Topicals: not on the online menu today, so not linked. -->
  </div>
</section>

<!-- Ends the page dark, straight into the footer. The block-party illustration on the right fades into the ink behind the
     words (decorative); the Stop the Stigma stamp sits on it. -->
<section class="band band--ink band--tight community2" aria-labelledby="community-t" data-spot>
  <div class="community2__media" aria-hidden="true">${img('blockparty', { cls: 'community2__img', sizes: '(max-width: 700px) 100vw, 64vw', decorative: true })}</div>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container community2__grid">
    <div class="community2__copy">
      <h2 class="sect-t" id="community-t" data-reveal>Community Engagement</h2>
      <p data-reveal style="--i:1">We believe in giving back to our community and promoting positive change. Through our Stop the Stigma initiatives, we aim to educate the public about the benefits of cannabis and dispel common misconceptions. Join us at our events, workshops, and rallies to learn more and get involved.</p>
      <div class="actions" data-reveal style="--i:2">${btn('Join the List for updates', '/subscribe/', { v: 'mint' })}${btn('Meet the crew', '/about/the-crew/', { v: 'ghost' })}</div>
    </div>
    <div class="community__stamp community2__stamp" aria-hidden="true"><span class="stamp">Stop the Stigma</span></div>
  </div>
</section>`;
  return {
    path: '/about/',
    title: 'Our Story: About The Higher Company, Syracuse',
    description: 'The Higher Co. story: Syracuse locals Mike Golden and co-founder Cage, The Higher Calling, the Stop the Stigma rally and one of New York’s CAURD licenses, at 123 E Willow St.',
    main,
    jsonld: [crumbsLD(crumb)],
    bodyClass: 'page-about',
  };
}

// ---------------------------------------------------------------- /about/the-crew/
export function crew() {
  const crumb = [['Home', '/'], ['Our Story', '/about/'], ['The Crew', '/about/the-crew/']];
  const founder = (name, role, line, side, i) => `<li class="founder founder--${side}" data-reveal${i ? ` style="--i:${i}"` : ''}>${wallLabel(name, [role, line], 'founder__label')}</li>`;
  const main = `
${pageHero({
  kicker: 'Good People', title: 'The Crew',
  lead: '<p>The people behind the counter at 123 E Willow St: the founders who built it, and the budtenders who&rsquo;ll guide you through it.</p>',
  crumbList: crumb,
  // the real crew at the counter in the art frame (was the THC monogram)
  art: `${COUNTER_NOTE}<div class="phero__frame phero__frame--photo" data-tilt>${img('photo-counter', { cls: 'phero__photo', sizes: '(max-width: 900px) 74vw, 480px', priority: true })}</div>`,
  cls: 'phero--art',
})}
<!-- The founders as on the home page: the two engraved hands reaching across the band (they travel in and meet as it
     scrolls into view, site.js [data-meet]; met under reduced motion), with a gallery wall label for each founder, so no
     photo is invented. (The initials placeholders "MG" and "C" are gone.) -->
<section class="band band--gallery founders" aria-labelledby="founders-t">
  <span class="brass-rule brass-rule--bottom" aria-hidden="true"></span>
  <figure class="mbanner founders__banner">
    <div class="mbanner__stage" data-meet>
      <p class="mbanner__word" aria-hidden="true"><span>The Founders</span></p>
      ${img('hands-l', { cls: 'mbanner__hand mbanner__hand--l', sizes: '(max-width: 900px) 136vw, 100vw' })}
      ${img('hands-r', { cls: 'mbanner__hand mbanner__hand--r', sizes: '(max-width: 900px) 136vw, 100vw', decorative: true })}
    </div>
  </figure>
  <div class="container founders__in">
    ${sectionHead('The founders', 'Two Syracuse locals', 'They came up together in Syracuse, built The Higher Calling, ran the Stop the Stigma rally, and opened The Higher Company downtown.', { id: 'founders-t' })}
    <ul class="founders__people" role="list">
      ${founder('Mike Golden', 'Co-founder', 'Syracuse local. Co-founder of The Higher Calling and The Higher Company.', 'l', 0)}
      ${founder('Cage', 'Co-founder', 'Syracuse local. Co-founder of The Higher Calling and The Higher Company.', 'r', 1)}
    </ul>
    <!-- [CONFIRM WITH CLIENT] founder photos and short bios; Cage's first name is not printed (sources disagree). -->
  </div>
</section>
<!-- The three ways the budtenders help, as the home's expanding picture panels (were three text cards); pictures are
     decorative, the words carry the meaning. -->
<section class="band band--ink band--tight budtenders2" aria-labelledby="bud-t" data-spot>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container">
    <div class="budtenders2__head">
      ${sectionHead('Behind the counter', 'Joint Masters at Your Service', '', { id: 'bud-t' })}
      <p class="lead" data-reveal>Our squad of budtenders knows their stuff! They&rsquo;ll guide you through the world of cannabis and help you find your perfect match.</p>
    </div>
    ${accordion([
      { img: 'magnifier', icon: 'lens', title: 'At the Flower Bar', text: 'They&rsquo;ll pull jars, hand you a magnifying glass and show you what to look for.' },
      { img: 'photo-interior', icon: 'book', title: 'Before you buy', text: 'Talk to our budtenders to fully understand the product you are purchasing.' },
      { img: 'photo-display', icon: 'star', title: 'Promotions', text: 'Ask about current promotions on non-cannabis items such as accessories and apparel.' },
    ], { cls: 'budtenders2__acc' })}
    <!-- [CONFIRM WITH CLIENT] budtender names, photos and bios if the crew wants to be featured; none are invented here. -->
  </div>
</section>
<!-- Ends the page dark: one field with the panels above and straight into the footer. -->
<section class="band band--ink band--tight crewcta2" aria-labelledby="crewcta-t">
  <div class="container narrow center">
    <h2 class="sect-t" id="crewcta-t" data-reveal>Come say hi.</h2>
    <p data-reveal style="--i:1">Meet the crew at the counter. Bring your ID and your questions.</p>
    <div class="actions actions--center" data-reveal style="--i:2">${btn('Plan your visit', '/visit/', { v: 'mint' })}${btn('Read our story', '/about/', { v: 'ghost' })}</div>
  </div>
</section>`;
  return {
    path: '/about/the-crew/',
    title: 'The Crew: Founders and Budtenders | The Higher Company, Syracuse',
    description: 'Meet The Higher Co. crew: co-founders Mike Golden and Cage, Syracuse locals behind The Higher Calling, and the budtenders who guide you at 123 E Willow St.',
    main,
    jsonld: [crumbsLD(crumb)],
    bodyClass: 'page-crew',
  };
}

// ---------------------------------------------------------------- /the-flower-bar/
// The four steps as the home's expanding picture panels, each keeping its number, icon, heading and line (the same markup
// as parts.mjs accordion(), plus the step number, as an ordered list).
const STEPS = [
  { n: '01', ico: 'jar', t: 'Look', p: 'Walk the bar. Ninety strains sit under glass, sativas to indicas.', pic: 'oak-jars' },
  { n: '02', ico: 'leaf', t: 'Smell', p: 'Ask for a jar and lean in. Aroma is the fastest way to find what you like.', pic: 'macro-b' },
  { n: '03', ico: 'lens', t: 'Look closer', p: 'Pick up a magnifying glass and see the trichomes for yourself.', pic: 'magnifier' },
  { n: '04', ico: 'people', t: 'Ask', p: 'Your budtender takes it from there and helps you find your match.', pic: 'photo-counter' },
];
const stepsAcc = () => `<ol class="acc howbar2__acc" role="list" data-acc>${STEPS.map((s, i) => `<li class="acc__p${i === 0 ? ' is-open' : ''}" tabindex="0" data-reveal${i ? ` style="--i:${i}"` : ''}>${img(s.pic, { cls: 'acc__img', sizes: '(max-width: 900px) 100vw, 50vw', alt: '', decorative: true })}<div class="acc__body"><span class="acc__meta"><span class="placard__ico acc__ico">${icon(s.ico)}</span><span class="acc__n">${s.n}</span></span><h3 class="acc__t">${s.t}</h3><p class="acc__text">${s.p}</p></div></li>`).join('')}</ol>`;

export function flowerBar() {
  const crumb = [['Home', '/'], ['The Flower Bar', '/the-flower-bar/']];
  const v = videoMeta('vid-macro');
  const main = `
<section class="fbhero" data-spot aria-labelledby="fb-t">
  <div class="fbhero__media" data-depth="-0.06">
    ${img('macro-v', { sizes: '100vw', cls: 'fbhero__img fbhero__img--tall', priority: true })}
    ${img('macro-a', { sizes: '100vw', cls: 'fbhero__img fbhero__img--wide' })}
    <video class="fbhero__video" data-loop muted loop playsinline preload="none" width="${v.w}" height="${v.h}" poster="${u('/' + v.poster)}" data-src="${u('/' + v.file)}" aria-hidden="true"></video>
  </div>
  <div class="fbhero__scrim" aria-hidden="true"></div>
  <div class="container fbhero__in">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="${u('/')}">Home</a></li><li><span aria-current="page">The Flower Bar</span></li></ol></nav>
    ${kicker('In store at 123 E Willow St')}
    <h1 class="fbhero__t" id="fb-t" data-reveal>The Flower Bar</h1>
    <p class="fbhero__lead" data-reveal style="--i:1">We are really proud of our Flower Bar that holds 90 strains. From Sativas to Indicas and everything in between, our curated flower selection is sure to meet your needs.</p>
    <div class="actions" data-reveal style="--i:2">${btn('Shop flower online', '/shop/flower/', { v: 'mint' })}${btn('Plan your visit', '/visit/', { v: 'ghost' })}</div>
  </div>
  <button class="vidctl" type="button" data-vid-toggle hidden>${icon('pause')}<span class="sr-only">Pause the background film</span></button>
  ${aiTag('corner')}
</section>

<section class="band band--ink fbstats" aria-label="The Flower Bar in numbers">
  <div class="container fbstats__grid">
    <p class="fbstat"><span class="fbstat__n" data-count="90">90</span><span class="fbstat__l">strains on the bar</span></p>
    <p class="fbstat"><span class="fbstat__w">Sativa <span aria-hidden="true">&rarr;</span> Indica</span><span class="fbstat__l">and everything in between</span></p>
    <p class="fbstat"><span class="fbstat__ico">${icon('lens', 'ico ico--xl')}</span><span class="fbstat__l">magnifying glasses on the bar</span></p>
  </div>
</section>

<!-- A visit to the bar as four picture panels (were four text cards): hover, focus or tap opens a step. -->
<section class="band band--gallery band--tight howbar2" aria-labelledby="how-t">
  <span class="brass-rule brass-rule--top" aria-hidden="true"></span>
  <div class="container">
    ${sectionHead('How the Flower Bar works', 'Look. Smell. <em>Look closer.</em> Ask.', 'You can even smell and view the trichomes with a magnifying glass! Here is how a visit to the bar goes.', { id: 'how-t' })}
    ${stepsAcc()}
    ${COUNTER_NOTE}
  </div>
</section>

<section class="band band--ink band--tight lensband" aria-labelledby="lens-t" data-spot>
  <div class="container lensband__grid">
    <div class="lensband__copy">
      ${sectionHead('Try it here', 'Take a closer look', 'Move over the photo (or drag on a phone) to bring the magnifying glass with you. In store, it&rsquo;s the real thing.', { id: 'lens-t' })}
      <table class="table table--dark"><caption>What trichome colors tell growers</caption><tbody>
        <tr><th scope="row">Clear</th><td>Still developing</td></tr>
        <tr><th scope="row">Cloudy</th><td>Mature</td></tr>
        <tr><th scope="row">Amber</th><td>Aging, past peak</td></tr>
      </tbody></table>
      <p>${btn('What are trichomes?', '/journal/what-are-trichomes/', { v: 'ghost', size: 'sm' })}</p>
    </div>
    <div class="lensband__media" data-lens-zone>
      ${img('macro-c', { sizes: '(max-width: 900px) 92vw, 50vw', cls: 'lensband__img' })}
      <div class="lens lens--big" data-lens aria-hidden="true" style="background-image:url('${u('/assets/img/gen/macro-c-2048.webp')}')"></div>
      ${aiTag('corner')}
    </div>
  </div>
</section>

<!-- The shop's own photo beside the shop's own video (the AI jars picture is gone: the copy says "this one isn't an
     illustration"). -->
<section class="band band--gallery band--tight footage" aria-labelledby="footage-t">
  <span class="brass-rule brass-rule--bottom" aria-hidden="true"></span>
  <div class="container">
    ${sectionHead('Real footage', 'See the real thing', 'This one isn&rsquo;t an illustration: it&rsquo;s our own video from the shop.', { id: 'footage-t' })}
    <div class="footage__pair">
      <figure class="footage__jars" data-reveal="develop">
        <div class="frame" data-depth="0.05">${img('photo-interior', { sizes: '(max-width: 900px) 92vw, 38vw', cls: 'footage__img' })}</div>
      </figure>
      ${ytFacade({ cls: 'footage__yt' })}
    </div>
  </div>
</section>

<section class="band band--ink band--tight fbcta" aria-labelledby="fbcta-t" data-spot>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container narrow center">
    <h2 class="sect-t" id="fbcta-t" data-reveal>Ninety strains. <em>One counter.</em></h2>
    <p data-reveal style="--i:1">Order flower ahead for pickup, or come smell the jars in person.</p>
    <div class="actions actions--center" data-reveal style="--i:2">${btn('Shop flower', '/shop/flower/', { v: 'mint' })}${btn('Directions', site.directions.google, { v: 'ghost', ext: true })}</div>
  </div>
</section>`;
  return {
    path: '/the-flower-bar/',
    title: 'The Flower Bar: 90 Strains in Downtown Syracuse | The Higher Company',
    description: 'The Flower Bar at The Higher Co.: 90 strains under glass, from sativas to indicas. Smell the jars and view the trichomes with a magnifying glass at 123 E Willow St.',
    main,
    jsonld: [crumbsLD(crumb)],
    bodyClass: 'page-flowerbar',
  };
}

// ---------------------------------------------------------------- /lifestyle/
export function lifestyle() {
  const crumb = [['Home', '/'], ['Shop Lifestyle', '/lifestyle/']];
  const subs = ['Glassware', 'Grinders', 'Papers / Rolling Supplies', 'Lighters', 'Batteries', 'Dab Tools', 'Cleaning Solutions'];
  const main = `
<section class="lshero" aria-labelledby="ls-t" data-spot>
  <div class="lshero__media" data-depth="-0.06">${img('blockparty', { sizes: '100vw', cls: 'lshero__img', priority: true })}</div>
  <div class="lshero__scrim" aria-hidden="true"></div>
  <div class="container lshero__in">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="${u('/')}">Home</a></li><li><span aria-current="page">Shop Lifestyle</span></li></ol></nav>
    ${kicker('Shop Lifestyle')}
    <h1 class="lshero__t" id="ls-t" data-reveal>Drops, <em>gear</em> &amp; the mark.</h1>
    <p class="lshero__lead" data-reveal style="--i:1">The Higher Co. merch and the accessories shelf. Apparel drops are sold in store only; accessories are on the live menu for pickup.</p>
    <div class="actions" data-reveal style="--i:2">${btn('Shop accessories', '#shop-accessories', { v: 'mint', ico: 'chev' })}${btn('See the drops', '#drops', { v: 'ghost', ico: 'chev' })}</div>
  </div>
  ${aiTag('corner')}
</section>

<div class="tape tape--brick" aria-hidden="true" data-tape="${esc(Array(4).fill('In store only  ✦  123 E Willow St  ✦  The Higher Co.').join('  ✦  ') + '  ✦')}"></div>

<section class="band band--ink band--tight drops" id="drops" aria-labelledby="drops-t" data-spot>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container">
    ${sectionHead('The drops', 'Wear the <em>mark.</em>', 'Two pieces from The Higher Co. Ask at the counter for what&rsquo;s in stock.', { id: 'drops-t' })}
    <div class="drops__grid">
      <article class="drop drop--mono" aria-labelledby="d1-t" data-reveal>
        <div class="drop__stage">
          ${img('drop-cap', { cls: 'drop__img', sizes: '(max-width: 900px) 70vw, 340px' })}
          <span class="drop__floor" aria-hidden="true"></span>
        </div>
        <div class="drop__body">
          <p class="drop__n">Drop 01</p>
          <h3 class="drop__t" id="d1-t">THC Monogram Snapback</h3>
          <p>The THC monogram from our logo, on a snapback. In store only.</p>
          <p class="drop__tag">${icon('cap')} In store</p>
        </div>
      </article>
      <article class="drop drop--liberty" aria-labelledby="d2-t" data-reveal style="--i:1">
        <div class="drop__stage">
          ${img('drop-tee', { cls: 'drop__img', sizes: '(max-width: 900px) 70vw, 340px' })}
          <span class="drop__floor" aria-hidden="true"></span>
        </div>
        <div class="drop__body">
          <p class="drop__n">Drop 02</p>
          <h3 class="drop__t" id="d2-t">The Lady Liberty Graphic</h3>
          <p>Lady Liberty, done the Higher Co. way, with plenty of New York pride. See it in store.</p>
          <p class="drop__tag">${icon('star')} In store</p>
        </div>
      </article>
    </div>
    <!-- [CONFIRM WITH CLIENT] Drop 01's picture is an AI re-image of the client's own snapback (from their display-case photo) with the brand's real wordmark on the patch: confirm it matches the cap sold. Merch line-up, garment types, sizes, colours, prices and photos. The Liberty tee is shown (operator, 2026-11-10: the operator's mockup, cut out); the picture is an EDITED version of the graphic: the joint and the smoke cloud were removed (operator, 2026-11-10) because New York's cannabis advertising rules bar depicting consumption (9 NYCRR 129.2(b)(5) per a secondary source; check the current official text, Parts 128-129 were recently amended). The tee sold in store still has them, so the client either prints this version or the type poster comes back (its styles are kept); the cannabis-leaf crown still needs their compliance review; the artwork matches a Shutterstock stock illustration (ID 1795674991): confirm the licence covers merch and edits. -->
    <p class="drops__law">${icon('info')} New York only lets a dispensary sell its own branded apparel at its own store, so our drops live at ${esc(site.address.street)}.</p>
  </div>
</section>

<!-- The accessories: the brass grinder of the home's glass cases (was the old grinder-and-pipe cut-out), floating under a
     warm spot. No shelf under it (operator, 2026-11-10: "do not use this shelf across whole site"). -->
<section class="band band--gallery band--tight accshelf" aria-labelledby="acc-t">
  <span class="brass-rule brass-rule--top" aria-hidden="true"></span>
  <div class="container accshelf__grid">
    <figure class="accshelf__fig" data-reveal>
      <span class="accshelf__spot" aria-hidden="true"></span>
      ${img('cat-accessories', { sizes: '(max-width: 900px) 56vw, 300px', cls: 'accshelf__img' })}
    </figure>
    <div class="accshelf__copy">
      ${sectionHead('The accessories shelf', 'Gear for your setup', 'Everything you need to enhance your cannabis experience, on the live menu for pickup.', { id: 'acc-t' })}
      <ul class="tags" role="list">${subs.map((s) => `<li><a class="chip chip--light" href="${u('/shop/accessories/')}">${esc(s)}</a></li>`).join('')}</ul>
      <div class="actions">${btn('Shop accessories', '/shop/accessories/', { v: 'ink' })}</div>
    </div>
  </div>
</section>

<section class="band band--gallery-2 band--tight lsmenu" id="shop-accessories" aria-labelledby="lsmenu-t">
  <div class="container">
    ${sectionHead('On the live menu now', 'Shop the accessories shelf', 'Today&rsquo;s accessories with prices and stock. Add to your cart, choose &ldquo;Pick Up In-Store&rdquo; at checkout, and bring your ID.', { id: 'lsmenu-t' })}
    ${menuEmbed({ category: 'accessories', label: 'Accessories' })}
    <p class="shopnote">Prices and stock come straight from the live menu and can change. Apparel drops are sold in store only.</p>
  </div>
</section>

<!-- Ends the page dark, straight into the footer: the shop's own display case (the THC snapback on the gold velvet, the lit
     sign behind) in place of the AI merch still life. -->
<section class="band band--ink band--tight mood2" aria-label="Lifestyle mood" data-spot>
  <span class="brass-rule brass-rule--top" aria-hidden="true"></span>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container mood2__grid">
    <figure class="mood2__fig" data-reveal="develop"><div class="frame mood2__frame" data-depth="0.05">${img('photo-display', { sizes: '(max-width: 900px) 92vw, 44vw', cls: 'mood2__img' })}</div></figure>
    <div class="mood2__copy">
      ${kicker('Gallery meets block party')}
      <p class="mood__big" data-reveal>Downtown Syracuse, <em>worn well.</em></p>
      <p data-reveal style="--i:1">Drops land in store first. Join the list and we&rsquo;ll tell you when something new is on the wall.</p>
      <div class="actions" data-reveal style="--i:2">${btn('Join the List', '/subscribe/', { v: 'mint' })}</div>
    </div>
  </div>
</section>`;
  return {
    path: '/lifestyle/',
    title: 'Shop Lifestyle: Merch Drops and Accessories | The Higher Company',
    description: 'The Higher Co. lifestyle: the THC monogram snapback and Lady Liberty graphic drops (in store only), plus glassware, grinders, papers and more on the live menu for pickup.',
    main,
    jsonld: [crumbsLD(crumb)],
    bodyClass: 'page-lifestyle',
  };
}
