// journal.mjs — the four Journal articles (new pages, adopted IA: an education journal). Written for The Higher
// Company from (a) the live site's own facts, (b) general botany, and (c) New York statute / OCM sources fetched
// 2026-11-10 (private/research-ny-law.md). No health, wellness or potency claims (9 NYCRR 129.2(b)(9),(13)): the
// whole site counts as advertising under 128.1(b).

export const REVIEWED = 'November 10, 2026';

export const articles = [
  {
    slug: 'what-are-trichomes',
    label: 'Learn',
    img: 'macro-c',
    title: 'What Are Trichomes? A Close Look at the Flower Bar’s Favorite Detail',
    h1: 'What are trichomes?',
    dek: 'The frost on good flower has a name. Here is what trichomes are, what they do for the plant, and how to read them through the magnifying glass at the Flower Bar.',
    description: 'Trichomes explained: what the frost on cannabis flower is, the three shapes to know, what clear, cloudy and amber mean, and how to look at them with a magnifying glass.',
    minutes: 5,
    sections: [
      ['short', 'The short version', `<p>Trichomes are the tiny resin glands that cover a cannabis flower and, to a lesser degree, the small leaves around it. To the naked eye they look like a coat of frost or sugar. Under a magnifying glass, many of them look like miniature mushrooms: a round head sitting on a slender stalk.</p><p>That frost is why people at the counter call a jar &ldquo;frosty.&rdquo; It is also why we keep magnifying glasses on the Flower Bar: you can smell and view the trichomes for yourself.</p>`],
      ['why', 'What trichomes do for the plant', `<p>For the plant, trichomes are protection. Botanists describe them as a defence against insects and grazing animals and as a buffer against harsh light and wind. Their resin is sticky for a reason.</p><p>They are also where the plant makes most of its cannabinoids, such as THC and CBD, and its terpenes, the aromatic compounds behind each strain&rsquo;s smell. When you lean in to a jar and pick up citrus, pine or diesel, you are smelling what the trichomes made.</p>`],
      ['shapes', 'Three shapes to know', `<p>Look closely and you will find three kinds of glandular trichome:</p>
<table class="table"><caption>The three glandular trichomes on cannabis</caption><thead><tr><th scope="col">Type</th><th scope="col">What it looks like</th><th scope="col">Where to look</th></tr></thead><tbody>
<tr><th scope="row">Bulbous</th><td>The smallest: tiny round dots with almost no stalk.</td><td>Scattered over the whole surface, hard to see without strong magnification.</td></tr>
<tr><th scope="row">Capitate-sessile</th><td>A round head sitting nearly flat on the surface.</td><td>More plentiful than bulbous ones, still small.</td></tr>
<tr><th scope="row">Capitate-stalked</th><td>The classic mushroom: a round head on a stalk.</td><td>All over the flower. These are the ones you will spot through the magnifying glass.</td></tr>
</tbody></table>`],
      ['colors', 'Clear, cloudy, amber: reading the colors', `<p>Growers watch the color of trichome heads to judge when a plant is ready to harvest. On cured flower you will usually see a mix.</p>
<table class="table"><caption>What trichome head colors mean</caption><thead><tr><th scope="col">Color</th><th scope="col">What it tells growers</th></tr></thead><tbody>
<tr><th scope="row">Clear</th><td>Glassy and see-through: the head is still developing.</td></tr>
<tr><th scope="row">Cloudy (milky)</th><td>Opaque white: the head has matured.</td></tr>
<tr><th scope="row">Amber</th><td>Golden to brown: the head is aging and past its peak.</td></tr>
</tbody></table>`],
      ['howto', 'How to look at trichomes at the Flower Bar', `<ol class="steps"><li><strong>Ask for the jar.</strong> Your budtender will bring it into the light.</li><li><strong>Smell first.</strong> Aroma is the terpenes talking.</li><li><strong>Lift the magnifying glass.</strong> Hold it close and look along the edges of the bud, where the heads catch the light.</li><li><strong>Look for intact heads.</strong> Rounded heads on their stalks mean the flower has been handled gently.</li><li><strong>Ask questions.</strong> That is what the crew is there for.</li></ol>`],
      ['limits', 'What trichomes can’t tell you', `<p>Frost is one thing to look at, not a forecast of how a product will feel for you. The cannabinoid and terpene details on New York packaging, and a conversation with your budtender, tell you more than any single look through a lens.</p>`],
    ],
    quick: [
      ['Are trichomes the same as kief?', 'Kief is the name for trichomes that have broken away from the flower: the fine powder that collects in the bottom chamber of a grinder.'],
      ['Why is good flower sticky?', 'The trichome heads are full of resin, and resin is sticky.'],
      ['Can I touch the flower at the Flower Bar?', 'Ask your budtender. The jars are there for you to smell and to look at closely with a magnifying glass.'],
    ],
    cta: ['See what is on the menu today', '/shop/flower/', 'Shop flower'],
    related: ['indica-sativa-hybrid', 'first-visit-guide'],
    sources: [],
  },
  {
    slug: 'indica-sativa-hybrid',
    label: 'Learn',
    img: 'macro-b',
    title: 'Indica, Sativa, Hybrid: What the Labels Actually Tell You',
    h1: 'Indica, sativa, hybrid: what the labels tell you',
    dek: 'Three words on nearly every jar. Here is where they come from, how the plants differ, and why your nose and your budtender tell you more than the label.',
    description: 'Indica, sativa and hybrid explained: where the names come from, how the plants differ, why lineage labels are only a starting point, and the common terpenes by aroma.',
    minutes: 6,
    sections: [
      ['names', 'Where the names come from', `<p>The names are botanical history. Carl Linnaeus named <em>Cannabis sativa</em> in 1753, and Jean-Baptiste Lamarck described <em>Cannabis indica</em> in 1785 from plants collected in India. Over the centuries breeders crossed the two again and again, which is why most strains on shelves today are hybrids.</p>`],
      ['plants', 'How the plants differ', `<table class="table"><caption>Indica-type, sativa-type and hybrid plants</caption><thead><tr><th scope="col">Label</th><th scope="col">How the plant grows</th><th scope="col">Leaves</th></tr></thead><tbody>
<tr><th scope="row">Indica</th><td>Shorter and bushier, usually with a shorter flowering time.</td><td>Broad, wide leaflets.</td></tr>
<tr><th scope="row">Sativa</th><td>Taller and lankier, usually with a longer flowering time.</td><td>Long, narrow leaflets.</td></tr>
<tr><th scope="row">Hybrid</th><td>A cross of the two, often leaning one way.</td><td>Somewhere in between.</td></tr>
</tbody></table><p>On the Flower Bar you will find all three, from Sativas to Indicas and everything in between.</p>`],
      ['labels', 'What the labels don’t tell you', `<p>A lineage label describes where a plant came from, not exactly how a product will feel for you. People respond differently, and the same strain can vary from grower to grower and harvest to harvest. Treat the word on the jar as a starting point.</p><p>The cannabinoid and terpene details on New York packaging say more. So does a conversation with your budtender.</p>`],
      ['terpenes', 'Follow your nose: common terpenes', `<p>Terpenes are the aromatic compounds made in the trichomes. Learning a few by smell is the fastest way to find what you like at the Flower Bar.</p>
<table class="table"><caption>Common cannabis terpenes and their aromas</caption><thead><tr><th scope="col">Terpene</th><th scope="col">Aroma</th><th scope="col">Also found in</th></tr></thead><tbody>
<tr><th scope="row">Myrcene</th><td>Earthy, musky, ripe fruit</td><td>Mango, hops</td></tr>
<tr><th scope="row">Limonene</th><td>Bright citrus</td><td>Lemon and orange peel</td></tr>
<tr><th scope="row">Pinene</th><td>Fresh pine</td><td>Pine needles, rosemary</td></tr>
<tr><th scope="row">Caryophyllene</th><td>Peppery, spicy</td><td>Black pepper, cloves</td></tr>
<tr><th scope="row">Linalool</th><td>Floral</td><td>Lavender</td></tr>
</tbody></table>`],
      ['use', 'Using the labels at The Higher Co.', `<ol class="steps"><li><strong>Start with the label</strong> to narrow the field.</li><li><strong>Smell a few jars</strong> side by side.</li><li><strong>Look closer</strong> with the magnifying glass.</li><li><strong>Tell your budtender</strong> what you liked last time, and let them help you find your match.</li></ol>`],
    ],
    quick: [
      ['Is a hybrid half indica, half sativa?', 'Not necessarily. A hybrid is any cross of the two, and many lean one way.'],
      ['Which is better?', 'Neither. They are descriptions of plants, not grades.'],
      ['Where do I find terpene information?', 'On the product packaging, on the live menu where it is listed, and from your budtender.'],
    ],
    cta: ['Browse every strain on the menu', '/shop/flower/', 'Shop flower'],
    related: ['what-are-trichomes', 'first-visit-guide'],
    sources: [],
  },
  {
    slug: 'first-visit-guide',
    label: 'Visit',
    img: 'interior',
    title: 'Your First Visit to The Higher Co.: What to Bring and What to Expect',
    h1: 'Your first visit: what to bring, what to expect',
    dek: 'Everything you need for a first trip to 123 E Willow St, from the ID at the door to ordering ahead for pickup.',
    description: 'First visit to The Higher Co. in downtown Syracuse: who can buy, accepted IDs, payment, parking, the Flower Bar, ordering ahead for pickup and purchase limits.',
    minutes: 5,
    sections: [
      ['before', 'Before you go', `<ul class="ticks"><li>You must be 21 or older. You do not need a medical marijuana card.</li><li>Bring a valid photo ID that shows your age (see the list below).</li><li>Check today&rsquo;s hours: <span data-hours-today>open daily</span>.</li></ul>
<table class="table"><caption>What to bring</caption><thead><tr><th scope="col">Bring</th><th scope="col">Why</th></tr></thead><tbody>
<tr><th scope="row">Valid photo ID</th><td>A government ID showing your age and photo: a driver&rsquo;s license or non-driver ID card, a passport, an IDNYC card or a U.S. armed forces ID. We check it at the door.</td></tr>
<tr><th scope="row">Payment</th><td>We take cash, debit cards, Apple Pay, or Dutchie Pay (ACH). There is an ATM machine in the store.</td></tr>
<tr><th scope="row">Your pre-order (if you placed one)</th><td>The order is ready for the person who placed it, checked against that person&rsquo;s ID.</td></tr>
</tbody></table>`],
      ['getting', 'Getting here', `<p>We are at <strong>123 E Willow St, Syracuse, NY 13202</strong>, in downtown Syracuse. You can park directly across the street in our reserved parking slots free of charge, and there is more parking under the bridge.</p>`],
      ['inside', 'Inside: the Flower Bar and the crew', `<p>Ninety strains wait under glass at the Flower Bar. Smell them, look at the trichomes with a magnifying glass, and ask questions. Our budtenders will guide you through the world of cannabis and help you find your match.</p>`],
      ['ahead', 'Ordering ahead for pickup', `<ol class="steps"><li>Browse the <a href="/shop/">live menu</a> and add items to your cart.</li><li>Choose &ldquo;Pick Up In-Store&rdquo; at checkout. Online orders require a $50 minimum purchase.</li><li>Pay online with Dutchie Pay, or pay with cash, debit or credit card when you pick up in the store.</li><li>Come in during regular business hours with your ID. Someone else can&rsquo;t pick up your order for you.</li></ol>`],
      ['limits', 'How much can I buy?', `<p>For anyone 21 years or older, you can possess up to 3 ounces of flower, or 24 grams of cannabis concentrate, including edibles and oil, at one time.</p>`],
      ['after', 'Before you leave', `<ul class="ticks"><li>All cannabis sales are final: we cannot accept returns or exchanges on cannabis products, so ask your budtender anything before you buy.</li><li>Store your products locked, out of sight and out of reach of children and pets.</li><li>New to edibles? The state&rsquo;s own guidance notes it may take up to two hours to feel the effect.</li></ul>`],
    ],
    quick: [
      ['Can someone else pick up my order?', 'No. When you come to the store we will check your ID and use that to verify it’s you picking up your pre-order.'],
      ['Do you deliver?', 'We currently do not offer delivery but we are working on it.'],
      ['Is there a minimum for online orders?', 'Online orders require a $50 minimum purchase.'],
    ],
    cta: ['Order ahead for pickup', '/shop/', 'Shop the live menu'],
    related: ['new-york-cannabis-laws', 'what-are-trichomes'],
    sources: [],
  },
  {
    slug: 'new-york-cannabis-laws',
    label: 'Law',
    img: 'brick',
    title: 'New York Cannabis Laws: A Plain-English Guide for Adults 21+',
    h1: 'New York cannabis laws, in plain English',
    dek: 'Who can buy, how much you can carry, where you can and can’t consume, growing at home, and what changes the moment you leave the state.',
    description: 'A plain-English guide to New York adult-use cannabis law: age and ID, possession limits, where you can consume, driving, home grow, gifting, travel and safety. Reviewed November 2026.',
    minutes: 8,
    sections: [
      ['who', 'Who can buy', `<p>Adults 21 and older can buy cannabis from a dispensary that holds a New York State license. Valid proof of age is required for every purchase, and legal stores cannot sell to anyone under 21 or anyone who is visibly intoxicated.</p><p>Not sure a shop is legal? New York requires every legal dispensary to post the state&rsquo;s verification QR code near its main entrance, and the Office of Cannabis Management publishes a <a href="https://cannabis.ny.gov/dispensary-location-verification" rel="noopener" target="_blank">searchable list of legal dispensaries</a>.</p>`],
      ['how-much', 'How much you can have', `<table class="table"><caption>New York possession limits for adults 21+</caption><thead><tr><th scope="col">Where</th><th scope="col">Limit</th></tr></thead><tbody>
<tr><th scope="row">Out and about</th><td>Up to 3 ounces of cannabis and up to 24 grams of concentrated cannabis.</td></tr>
<tr><th scope="row">At home</th><td>Up to 5 pounds of cannabis in your private residence or on its grounds.</td></tr>
<tr><th scope="row">At the dispensary</th><td>Stores may not sell you an amount that would put you over the possession limits, including over several purchases in a day.</td></tr>
</tbody></table>`],
      ['where', 'Where you can and can’t consume', `<p>In general you can smoke or vape cannabis where you can smoke tobacco, such as a private home or back yard. Landlords and buildings with smoke-free policies can still say no.</p><p>You <strong>cannot</strong> consume cannabis:</p><ul class="ticks"><li>anywhere smoking is banned under New York&rsquo;s Clean Indoor Air Act, such as workplaces, bars and restaurants (patios included);</li><li>in a motor vehicle on a public highway;</li><li>on school grounds or on a school bus;</li><li>in hookah or cigar bars and other businesses;</li><li>on federal property, including public housing;</li><li>in most public and state parks, and on beaches.</li></ul>`],
      ['driving', 'Driving', `<p>Driving while impaired by cannabis is illegal in New York, just like driving while impaired by alcohol or any other drug.</p>`],
      ['grow', 'Growing at home', `<table class="table"><caption>Home cultivation limits (adult-use, in effect since June 26, 2024)</caption><thead><tr><th scope="col">Rule</th><th scope="col">Limit</th></tr></thead><tbody>
<tr><th scope="row">Per adult (21+)</th><td>Up to three mature and three immature plants at any one time.</td></tr>
<tr><th scope="row">Per residence</th><td>No more than six mature and six immature plants, however many adults live there.</td></tr>
<tr><th scope="row">Where</th><td>Only in, or on the grounds of, your private residence.</td></tr>
<tr><th scope="row">Safety</th><td>Keep plants and harvest secured and out of reach of anyone under 21.</td></tr>
</tbody></table><p>Selling, trading or bartering homegrown cannabis is illegal.</p>`],
      ['gifting', 'Gifting', `<p>An adult may give another adult up to 3 ounces of cannabis and 24 grams of concentrated cannabis, as long as nothing is given in return. &ldquo;Gifting&rdquo; cannabis alongside a purchase of something else, like a t-shirt or a sticker, is illegal.</p>`],
      ['travel', 'Travel, airports and federal law', `<p>New York&rsquo;s limits apply in New York. Keep cannabis in the state: don&rsquo;t take it across state lines. Cannabis is not allowed on federal property, and if anything illegal turns up at airport security, TSA refers it to law enforcement.</p><p>Federal rules for some cannabis products changed in 2026, but New York&rsquo;s Office of Cannabis Management notes that rescheduling does not legalize cannabis at the federal level.</p>`],
      ['work', 'At work', `<p>New York protects legal, off-duty cannabis use away from your employer&rsquo;s premises. Employers can still act if an employee shows specific signs of impairment while working.</p>`],
      ['safety', 'Safety', `<ul class="ticks"><li>Keep cannabis locked, out of sight and out of reach of children and pets.</li><li>Edibles can take up to two hours to take effect.</li><li>If someone may have consumed cannabis by accident or consumed too much, call the Poison Center at <a href="tel:+18002221222">1-800-222-1222</a>. Call 911 in an emergency.</li><li>Concerned about your cannabis use? Contact the New York State HOPEline: text HOPENY to 467369, call 1-877-8-HOPENY, or visit oasas.ny.gov/hopeline.</li></ul>`],
    ],
    quick: [
      ['How much can I buy at once?', 'Up to the possession limits: 3 ounces of cannabis and 24 grams of concentrated cannabis.'],
      ['Can I smoke in my car if I am parked?', 'No. Consuming cannabis in a motor vehicle on a public highway is prohibited.'],
      ['Can I grow at home?', 'Yes, if you are 21+: three mature and three immature plants per adult, up to six and six per residence.'],
    ],
    cta: ['Shop legal cannabis', '/shop/', 'Shop the live menu'],
    related: ['first-visit-guide', 'indica-sativa-hybrid'],
    sources: [
      ['NY Penal Law § 222.05 (possession, gifting)', 'https://www.nysenate.gov/legislation/laws/PEN/222.05'],
      ['NY Penal Law § 222.10 (where you can’t smoke or vape)', 'https://www.nysenate.gov/legislation/laws/PEN/222.10'],
      ['NY Penal Law § 222.15 (home possession and cultivation)', 'https://www.nysenate.gov/legislation/laws/PEN/222.15'],
      ['NY Cannabis Law § 85 (proof of age)', 'https://www.nysenate.gov/legislation/laws/CAN/85'],
      ['NY Vehicle and Traffic Law § 1227 and § 1192', 'https://www.nysenate.gov/legislation/laws/VAT/1227'],
      ['NY Labor Law § 201-D (off-duty use)', 'https://www.nysenate.gov/legislation/laws/LAB/201-D'],
      ['NYS Office of Cannabis Management: Know the law', 'https://cannabis.ny.gov/know-law'],
      ['OCM: Dispensary location verification', 'https://cannabis.ny.gov/dispensary-location-verification'],
      ['OCM: Adopted adult-use regulations (9 NYCRR 123.10)', 'https://cannabis.ny.gov/adopted-au-regulations'],
      ['TSA: Medical marijuana and airport screening', 'https://www.tsa.gov/travel/security-screening/whatcanibring/items/medical-marijuana'],
    ],
  },
];
