// story.mjs — /about/ (live URL kept, now "Our Story"), /about/the-crew/, /the-flower-bar/, /lifestyle/.
import { esc, u, icon } from '../lib/html.mjs';
import { site, pillars, categories } from '../content/site.mjs';
import { img, aiTag, wallLabel, btn, kicker, pageHero, crumbsLD, sectionHead, pillarList, ytFacade, joinBand, videoMeta, menuEmbed } from '../lib/parts.mjs';
import { markSVG, logoSVG, mono3D } from '../lib/brand.mjs';

// ---------------------------------------------------------------- /about/  (Our Story)
export function about() {
  const crumb = [['Home', '/'], ['Our Story', '/about/']];
  const main = `
${pageHero({
  kicker: 'About The Higher Company', title: 'Our Story',
  lead: '<p>Two Syracuse locals, a clothing shop with a mission, a rally at the Inner Harbor, and one of New York&rsquo;s CAURD licenses. This is how The Higher Company got to 123 E Willow St.</p>',
  crumbList: crumb,
  art: `<div class="phero__frame phero__frame--mark" data-tilt>${logoSVG('phero__logo', 'The Higher Co. logo')}</div>`,
  cls: 'phero--art',
})}

<section class="band band--gallery story-open" aria-labelledby="pioneer-t">
  <div class="container narrow">
    <h2 class="sect-t" id="pioneer-t" data-reveal>Pioneering a New Era in Cannabis</h2>
    <p class="lead" data-reveal style="--i:1">Welcome to The Higher Company, Syracuse&rsquo;s second downtown licensed New York State dispensary. As one of the first 137 dispensaries to open in the state, we are proud to be part of a historic moment in cannabis legalization. Our mission is to provide high-quality cannabis products and create a welcoming environment for our community.</p>
  </div>
</section>

<section class="band band--ink timeline" aria-labelledby="legacy-t" data-spot>
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

<section class="band band--gallery story" aria-labelledby="story-t">
  <div class="container story__grid">
    <div class="story__copy">
      <h2 class="sect-t" id="story-t" data-reveal>Our Story</h2>
      <p data-reveal style="--i:1">The Higher Company was founded with a vision to transform the cannabis industry and promote its benefits to a wider audience. Our founding members are proud participants in New York&rsquo;s Cannabis Adult-Use Retail Dispensary (CAURD) program. Having been previously convicted for cannabis-related offenses, they have turned their past experiences into a positive force for change. Their journey from adversity to advocacy is a testament to resilience and the transformative power of cannabis.</p>
      <figure class="pull" data-reveal style="--i:2">
        <blockquote><p>Our journey began with a passion for the plant and a commitment to providing safe, accessible, and high-quality cannabis products to our community.</p></blockquote>
        <figcaption>Joe Sweet</figcaption>
      </figure>
      <!-- [CONFIRM WITH CLIENT] Joe Sweet's role/title (OCM lists "Joseph Sweet" as the licence's primary contact). The quote's first sentence ("We believe in the power of cannabis to enhance well-being and improve quality of life") was trimmed: 9 NYCRR 129.2(b)(9) bars wellness claims in advertising, and the whole website counts as advertising (128.1(b)). -->
    </div>
    <figure class="story__fig" data-reveal="develop">
      <div class="frame frame--tall" data-depth="0.06">${img('brick', { sizes: '(max-width: 900px) 90vw, 40vw', cls: 'story__img' })}</div>
      ${aiTag()}
    </figure>
  </div>
</section>

<section class="band band--ink pillarsband" aria-labelledby="pillars-t" data-spot>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container pillarsband__grid">
    <div>
      ${sectionHead('What we stand on', 'Five pillars', 'The ideas that run through everything we do, from the jars on the Flower Bar to the way we answer your questions.', { id: 'pillars-t' })}
    </div>
    ${pillarList({ cls: 'pillars--open' })}
  </div>
</section>

<section class="band band--gallery-2 mission2" aria-labelledby="mission2-t">
  <div class="container mission2__grid">
    <div>
      <h2 class="sect-t" id="mission2-t" data-reveal>Our Mission</h2>
      <p data-reveal style="--i:1">Our mission is to deliver the highest quality cannabis products while fostering a sense of community and support. We strive to educate the public, break down stigmas, and advocate for the responsible use of cannabis. At The Higher Company, we are dedicated to:</p>
    </div>
    <ul class="values" role="list">
      <li class="value" data-reveal><span class="value__n">01</span><span><strong>Quality</strong>: Sourcing only the best products from trusted growers and producers.</span></li>
      <li class="value" data-reveal style="--i:1"><span class="value__n">02</span><span><strong>Variety</strong>: Offering a wide range of products to meet diverse needs and preferences.</span></li>
      <li class="value" data-reveal style="--i:2"><span class="value__n">03</span><span><strong>Education</strong>: Providing accurate information and resources to help our customers make informed decisions.</span></li>
      <li class="value" data-reveal style="--i:3"><span class="value__n">04</span><span><strong>Community</strong>: Building a supportive and inclusive community through events, outreach, and advocacy.</span></li>
    </ul>
  </div>
</section>

<section class="band band--gallery products" aria-labelledby="products-t">
  <div class="container">
    <h2 class="sect-t" id="products-t" data-reveal>Our Products</h2>
    <p data-reveal style="--i:1">At The Higher Company, quality is our top priority. We offer a diverse selection of cannabis products, including:</p>
    <ul class="prodlist" role="list">
      <li><a href="${u('/shop/flower/')}"><strong>Flower</strong>: Premium sativas, indicas, and hybrids.</a></li>
      <li><a href="${u('/shop/edibles/')}"><strong>Edibles</strong>: Tasty options, from gummies to baked goods.</a></li>
      <li><a href="${u('/shop/concentrates/')}"><strong>Concentrates</strong>: Pure extracts like wax, shatter, and oils.</a></li>
      <li><a href="${u('/shop/pre-rolls/')}"><strong>Pre-Rolls</strong>: Convenient and ready-to-use pre-rolled joints.</a></li>
      <li><span><strong>Topicals</strong>: Cannabis-infused lotions, balms, and creams for topical use.</span></li>
      <li><a href="${u('/shop/accessories/')}"><strong>Accessories</strong>: Everything you need to enhance your cannabis experience.</a></li>
    </ul>
    <!-- [CONFIRM WITH CLIENT] compliance trims in this list: "Potent" removed before "and pure extracts" (129.2(b)(13), potency promotion) and "and effective" removed after "Tasty" (129.2(b)(9)). Topicals: not on the online menu today, so not linked. -->
  </div>
</section>

<section class="band band--ink community" aria-labelledby="community-t" data-spot>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container community__grid">
    <div>
      <h2 class="sect-t" id="community-t" data-reveal>Community Engagement</h2>
      <p data-reveal style="--i:1">We believe in giving back to our community and promoting positive change. Through our Stop the Stigma initiatives, we aim to educate the public about the benefits of cannabis and dispel common misconceptions. Join us at our events, workshops, and rallies to learn more and get involved.</p>
      <div class="actions" data-reveal style="--i:2">${btn('Join the List for updates', '/subscribe/', { v: 'mint' })}${btn('Meet the crew', '/about/the-crew/', { v: 'ghost' })}</div>
    </div>
    <div class="community__stamp" aria-hidden="true"><span class="stamp">Stop the Stigma</span></div>
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
  const person = (initials, name, role, line) => `<li class="person" data-reveal>
  <div class="person__frame frame frame--spot" data-tilt><span class="person__initials" aria-hidden="true">${initials}</span></div>
  ${wallLabel(name, [role, line], 'person__label')}
</li>`;
  const main = `
${pageHero({
  kicker: 'Good People', title: 'The Crew',
  lead: '<p>The people behind the counter at 123 E Willow St: the founders who built it, and the budtenders who&rsquo;ll guide you through it.</p>',
  crumbList: crumb,
  art: `<div class="phero__frame phero__frame--mark" data-tilt>${markSVG('phero__mark', 'The Higher Co. monogram')}</div>`,
  cls: 'phero--art',
})}
<section class="band band--gallery crew" aria-labelledby="founders-t">
  <div class="container">
    ${sectionHead('The founders', 'Two Syracuse locals', 'They came up together in Syracuse, built The Higher Calling, ran the Stop the Stigma rally, and opened The Higher Company downtown.', { id: 'founders-t' })}
    <ul class="people" role="list">
      ${person('MG', 'Mike Golden', 'Co-founder', 'Syracuse local. Co-founder of The Higher Calling and The Higher Company.')}
      ${person('C', 'Cage', 'Co-founder', 'Syracuse local. Co-founder of The Higher Calling and The Higher Company.')}
    </ul>
    <!-- [CONFIRM WITH CLIENT] founder photos and short bios; Cage's first name is not printed (sources disagree). -->
  </div>
</section>
<section class="band band--ink budtenders" aria-labelledby="bud-t" data-spot>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container budtenders__grid">
    <div>
      ${sectionHead('Behind the counter', 'Joint Masters at Your Service', '', { id: 'bud-t' })}
      <p class="lead" data-reveal>Our squad of budtenders knows their stuff! They&rsquo;ll guide you through the world of cannabis and help you find your perfect match.</p>
    </div>
    <ul class="placards placards--dark" role="list">
      <li class="placard" data-reveal><span class="placard__ico">${icon('lens')}</span><h3 class="placard__t">At the Flower Bar</h3><p>They&rsquo;ll pull jars, hand you a magnifying glass and show you what to look for.</p></li>
      <li class="placard" data-reveal style="--i:1"><span class="placard__ico">${icon('book')}</span><h3 class="placard__t">Before you buy</h3><p>Talk to our budtenders to fully understand the product you are purchasing.</p></li>
      <li class="placard" data-reveal style="--i:2"><span class="placard__ico">${icon('star')}</span><h3 class="placard__t">Promotions</h3><p>Ask about current promotions on non-cannabis items such as accessories and apparel.</p></li>
    </ul>
    <!-- [CONFIRM WITH CLIENT] budtender names, photos and bios if the crew wants to be featured; none are invented here. -->
  </div>
</section>
<section class="band band--gallery-2 crewcta" aria-labelledby="crewcta-t">
  <div class="container narrow center">
    <h2 class="sect-t" id="crewcta-t" data-reveal>Come say hi.</h2>
    <p data-reveal style="--i:1">Meet the crew at the counter. Bring your ID and your questions.</p>
    <div class="actions actions--center" data-reveal style="--i:2">${btn('Plan your visit', '/visit/', { v: 'ink' })}${btn('Read our story', '/about/', { v: 'ghost-dark' })}</div>
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

<section class="band band--gallery howbar" aria-labelledby="how-t">
  <div class="container">
    ${sectionHead('How the Flower Bar works', 'Look. Smell. <em>Look closer.</em> Ask.', 'You can even smell and view the trichomes with a magnifying glass! Here is how a visit to the bar goes.', { id: 'how-t' })}
    <ol class="steps4" role="list">
      <li class="step4" data-reveal><span class="step4__n">01</span><span class="step4__ico">${icon('jar')}</span><h3>Look</h3><p>Walk the bar. Ninety strains sit under glass, sativas to indicas.</p></li>
      <li class="step4" data-reveal style="--i:1"><span class="step4__n">02</span><span class="step4__ico">${icon('leaf')}</span><h3>Smell</h3><p>Ask for a jar and lean in. Aroma is the fastest way to find what you like.</p></li>
      <li class="step4" data-reveal style="--i:2"><span class="step4__n">03</span><span class="step4__ico">${icon('lens')}</span><h3>Look closer</h3><p>Pick up a magnifying glass and see the trichomes for yourself.</p></li>
      <li class="step4" data-reveal style="--i:3"><span class="step4__n">04</span><span class="step4__ico">${icon('people')}</span><h3>Ask</h3><p>Your budtender takes it from there and helps you find your match.</p></li>
    </ol>
  </div>
</section>

<section class="band band--ink lensband" aria-labelledby="lens-t" data-spot>
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
      <div class="lens lens--big" data-lens aria-hidden="true" style="--lens-img:url('${u('/assets/img/gen/macro-c-2048.webp')}')"></div>
      ${aiTag('corner')}
    </div>
  </div>
</section>

<section class="band band--gallery footage" aria-labelledby="footage-t">
  <div class="container footage__grid">
    <div>
      ${sectionHead('Real footage', 'See the real thing', 'This one isn&rsquo;t an illustration: it&rsquo;s our own video from the shop.', { id: 'footage-t' })}
      <figure class="footage__jars">
        <div class="frame" data-depth="0.05">${img('oak-jars', { sizes: '(max-width: 900px) 90vw, 36vw', cls: 'footage__img' })}</div>
        ${aiTag()}
      </figure>
    </div>
    ${ytFacade({ cls: 'footage__yt' })}
  </div>
</section>

<section class="band band--ink fbcta" aria-labelledby="fbcta-t" data-spot>
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
  const m3d = mono3D(18);
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

<section class="band band--ink drops" id="drops" aria-labelledby="drops-t" data-spot>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container">
    ${sectionHead('The drops', 'Wear the <em>mark.</em>', 'Two pieces from The Higher Co. Ask at the counter for what&rsquo;s in stock.', { id: 'drops-t' })}
    <div class="drops__grid">
      <article class="drop drop--mono" aria-labelledby="d1-t" data-reveal>
        <div class="drop__stage">
          ${m3d.sym}
          <div class="m3d m3d--drop" data-m3d tabindex="0" role="img" aria-label="The THC monogram in 3D. Drag, or use the arrow keys, to turn it." style="--ratio:${m3d.ratio}">
            <div class="m3d__spin" data-m3d-spin>${m3d.html}</div>
            <div class="m3d__shadow" aria-hidden="true"></div>
          </div>
          <p class="display__hint" aria-hidden="true">${icon('drag')} Drag to turn</p>
        </div>
        <div class="drop__body">
          <p class="drop__n">Drop 01</p>
          <h3 class="drop__t" id="d1-t">THC Monogram Snapback</h3>
          <p>The THC monogram from our logo, on a snapback. In store only.</p>
          <p class="drop__tag">${icon('cap')} In store</p>
        </div>
      </article>
      <article class="drop drop--liberty" aria-labelledby="d2-t" data-reveal style="--i:1">
        <div class="drop__poster" aria-hidden="true"><span class="drop__poster-word">Liberty</span><span class="drop__poster-sub">The Higher Co. &middot; NY</span></div>
        <div class="drop__body">
          <p class="drop__n">Drop 02</p>
          <h3 class="drop__t" id="d2-t">The Lady Liberty Graphic</h3>
          <p>Lady Liberty, done the Higher Co. way, with plenty of New York pride. See it in store.</p>
          <p class="drop__tag">${icon('star')} In store</p>
        </div>
      </article>
    </div>
    <!-- [CONFIRM WITH CLIENT] merch line-up, garment types, sizes, colours, prices and photos. The Liberty graphic shows Liberty smoking a joint (operator brief): the site names it but never shows it, because 9 NYCRR 129.2(b)(5) and (12) bar depicting consumption or smoking in advertising, and 128.1(b) counts the website as advertising. -->
    <p class="drops__law">${icon('info')} New York only lets a dispensary sell its own branded apparel at its own store, so our drops live at ${esc(site.address.street)}.</p>
  </div>
</section>

<section class="band band--gallery accshelf" aria-labelledby="acc-t">
  <div class="container accshelf__grid">
    <figure class="accshelf__fig" data-reveal>
      <span class="accshelf__spot" aria-hidden="true"></span>
      ${img('cut-accessories', { sizes: '(max-width: 900px) 70vw, 420px', cls: 'accshelf__img' })}
      <span class="accshelf__ledge" aria-hidden="true"></span>
    </figure>
    <div class="accshelf__copy">
      ${sectionHead('The accessories shelf', 'Gear for your setup', 'Everything you need to enhance your cannabis experience, on the live menu for pickup.', { id: 'acc-t' })}
      <ul class="tags" role="list">${subs.map((s) => `<li><a class="chip chip--light" href="${u('/shop/accessories/')}">${esc(s)}</a></li>`).join('')}</ul>
      <div class="actions">${btn('Shop accessories', '/shop/accessories/', { v: 'ink' })}</div>
    </div>
  </div>
</section>

<section class="band band--gallery-2 lsmenu" id="shop-accessories" aria-labelledby="lsmenu-t">
  <div class="container">
    ${sectionHead('On the live menu now', 'Shop the accessories shelf', 'Today&rsquo;s accessories with prices and stock. Add to your cart, choose &ldquo;Pick Up In-Store&rdquo; at checkout, and bring your ID.', { id: 'lsmenu-t' })}
    ${menuEmbed({ category: 'accessories', label: 'Accessories' })}
    <p class="shopnote">Prices and stock come straight from the live menu and can change. Apparel drops are sold in store only.</p>
  </div>
</section>

<section class="band band--gallery-2 mood" aria-label="Lifestyle mood">
  <div class="container mood__grid">
    <figure class="mood__fig" data-reveal="develop"><div class="frame" data-depth="0.06">${img('merch-mood', { sizes: '(max-width: 900px) 80vw, 34vw', cls: 'mood__img' })}</div>${aiTag()}</figure>
    <div class="mood__copy">
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
