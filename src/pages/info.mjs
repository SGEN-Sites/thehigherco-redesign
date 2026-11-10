// info.mjs — /faqs/, /contact/, /connect/, /subscribe/ (live URLs kept) and /visit/ (new).
// Inner-pages update (operator, 2026-11-10: "now that you have an idea and design principle from how we built the home
// page, i would like you to update all inner pages"): the home page's language carried over: light and dark bands, the
// shop's own photos, the visit bar, the picture accordion, compact bands. Every sentence, link and form is the same
// as before; inner-info.css holds the looks (every rule scoped to these five pages' body classes).
import { esc, u, icon } from '../lib/html.mjs';
import { site } from '../content/site.mjs';
import { img, imgMeta, aiTag, btn, kicker, crumbs, pageHero, crumbsLD, sectionHead, faqList, mapFacade, storefrontPicture, visitBar, accordion } from '../lib/parts.mjs';
import { faqLD, storeLD } from '../lib/seo.mjs';

const hoursAnswer = () => `<p>Hours:</p><ul>${site.hoursLines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul><p>Today: <span data-open-label>see our hours</span>.</p>`;

const ID_LIST = `<ul>
<li>A valid federal, state, or local government identification, including IDNYC, stating the customer&rsquo;s age and featuring a photograph of the individual&rsquo;s face.</li>
<li>A valid driver&rsquo;s license or non-driver identification card issued by the department of motor vehicles, the federal government, any United States territory, commonwealth or possession, the District of Columbia, a state government within the United States, or a provincial government of the dominion of Canada.</li>
<li>A valid passport issued by the United States government or any other country</li>
<li>An identification card issued by the armed forces of the United States</li>
</ul>`;

// the counter photo: real staff and customers, so every use carries the consent note
const COUNTER_NOTE = '<!-- [CONFIRM WITH CLIENT] the counter photo shows staff and identifiable customers: confirm consent -->';

// A picture tile cut from one of the shop's own photos (develops in as it scrolls into view, like the home bento).
// --fx / --fy place the crop on what matters in the frame.
const photoTile = (id, { cls = '', sizes = '100vw', fx = '50%', fy = '50%' } = {}) =>
  `<figure class="ix-photo ${cls}" style="--fx:${fx};--fy:${fy}">${img(id, { cls: 'ix-photo__img', sizes, attrs: 'data-reveal="develop"' })}</figure>`;

export const FAQS = () => [
  ['Where are you located?', '<p>We are located at 123 E Willow St., Syracuse NY, 13202</p>'],
  ['What are your hours?', hoursAnswer() + '<!-- [CONFIRM WITH CLIENT] the live FAQ listed Sunday 10am – 8pm, the live footer/contact Sunday 11am – 6pm (shown site-wide here), the online menu Sunday 12pm – 6pm. -->'],
  ['Is there parking available?', '<p>Yes, you can park directly across the street in our reserved parking slots free of charge. There is also more parking under the bridge.</p>'],
  ['Do I need a medical marijuana card to make a purchase?', '<p>No you do not.</p>'],
  ['What forms of ID are accepted?', ID_LIST],
  ['What are my payment options?', '<p>We take cash, debit cards*, Apple Pay, or Dutchie Pay (ACH) for payment. If you prefer to pay in cash, we have an ATM machine in the store. We&rsquo;ve partnered with the only compliant credit card solution for cannabis, and they have systems to address compliance, safety, and anti-money laundering (AML).</p><p>*We operate debit payments as a cashless ATM, which means when the charge is made it has to be rounded up to the nearest dollar. Once payment is made we will give you the difference in change.</p>'],
  ['How much can I purchase?', '<p>For anyone 21 years or older, you can possess up to 3 ounces of flower, or 24 grams of cannabis concentrate, including edibles and oil, at one time.</p>'],
  ['Can someone else pick up my order?', '<p>No. When you come to the store we will check your ID and use that to verify it&rsquo;s you picking up your pre-order.</p>'],
  ['What is pre order?', '<p>Pre-ordering is great when you want to skip the line and you know what you want. Simply place your order through our website. You can pay online using Dutchie Pay, pay via cash, or with a debit or credit card when you pick up in the store.</p>'],
  ['Can I place an order for pickup at the store?', `<p>Yes! Just go to our <a href="${u('/shop/')}">thehigherco420.com</a>, browse our extensive product selection, add items to your cart, and select the &ldquo;Pick Up In-Store&rdquo; option at checkout. It&rsquo;s that easy! Your order will be prepared for you to pick up at The Higher Company during regular business hours.</p>`],
  ['Is there a minimum order for online orders?', '<p>Online orders require a $50 minimum purchase.</p>'],
  ['Can I return a cannabis product if I&rsquo;m not satisfied with it?', '<p>Unfortunately, we cannot accept any returns or exchanges for any cannabis sales, due to regulations and the nature of our products. However, we are dedicated to helping you find the product that is right for you. Please talk to our budtenders to fully understand the product you are purchasing.</p>'],
  ['Do you deliver?', '<p>We currently do not offer delivery but we are working on it.</p>'],
  ['Do you offer discounts or special offers?', '<p>In accordance with New York State regulations, we are unable to provide discounts on our cannabis products. However, we do our best to offer competitive pricing and promotions on our non-cannabis items, such as accessories, apparel, and educational materials. Talk to our budtenders about current promotions.</p><!-- [CONFIRM WITH CLIENT] OCM\'s revised Part 129 (effective Dec 3, 2025) allows some discounts and loyalty programs with conditions (129.3); confirm the store\'s policy before launch. -->'],
];

export function faqs() {
  const items = FAQS();
  const crumb = [['Home', '/'], ['FAQ', '/faqs/']];
  const main = `
${pageHero({
  kicker: '«&#8206;Got Questions?»', title: 'Frequently Asked Questions',
  lead: '<p>ID, payment, parking, pickup and the rest. Still stuck? Call <a href="tel:' + site.phone.tel + '">' + site.phone.display + '</a> or <a href="' + u('/connect/') + '">send us a message</a>.</p>',
  crumbList: crumb,
  art: `<div class="phero__frame">${img('magnifier', { sizes: '(max-width: 900px) 70vw, 460px', cls: 'phero__img' })}${aiTag()}</div>`,
  cls: 'phero--art',
})}
<!-- the home "Quick answers" language at full size: the jump-to index as one dark bar over the questions (three columns,
     a swipe strip on phones), the questions in two columns, closed (as on home) so the grid stays even; the open one wears
     a mint ring -->
<section class="band band--gallery band--tight fq" aria-label="Questions and answers">
  <div class="container">
    <nav class="fq-index" aria-label="Questions"><p class="kicker">Jump to</p><ol>${items.map(([q], i) => `<li><a href="#q-${i + 1}">${q}</a></li>`).join('')}</ol></nav>
    <div class="fq-list">${faqList(items, { openFirst: false })}</div>
  </div>
</section>`;
  return {
    path: '/faqs/',
    title: 'FAQ: ID, Payment, Parking and Pickup | The Higher Company, Syracuse',
    description: 'Answers from The Higher Co. in downtown Syracuse: accepted IDs, payment options, parking, pre-orders and pickup, purchase limits, returns, delivery and hours.',
    main,
    jsonld: [faqLD(items), crumbsLD(crumb)],
    bodyClass: 'page-faq',
  };
}

function messageForm({ id = 'msg', subject = 'Message from the website', intro = '' } = {}) {
  return `<form class="form" id="${id}" action="mailto:${site.email}?subject=${encodeURIComponent(subject)}" method="post" enctype="text/plain" data-mailto-form data-subject="${esc(subject)}">
  ${intro}
  <!-- [CONFIRM WITH CLIENT] form provider: until one is chosen, the form opens the visitor's email app with the message addressed to ${site.email}. -->
  <div class="field"><label for="${id}-name">Name</label><input id="${id}-name" name="name" autocomplete="name" required aria-describedby="${id}-name-err"><p class="field__err" id="${id}-name-err">Fill out this field</p></div>
  <div class="field"><label for="${id}-email">Email</label><input id="${id}-email" name="email" type="email" autocomplete="email" required aria-describedby="${id}-email-err"><p class="field__err" id="${id}-email-err">Please enter a valid email address.</p></div>
  <div class="field"><label for="${id}-text">Message</label><textarea id="${id}-text" name="message" rows="5" required aria-describedby="${id}-text-err"></textarea><p class="field__err" id="${id}-text-err">Fill out this field</p></div>
  <div class="form__row"><button class="btn btn--mint" type="submit"><span class="btn__t">Send Message</span>${icon('mail')}</button><p class="form__note">Sending opens your email app with your message ready to go.</p></div>
  <p class="form__status" role="status" aria-live="polite" data-form-status></p>
</form>`;
}

export function contact() {
  const crumb = [['Home', '/'], ['Contact', '/contact/']];
  const main = `
${pageHero({
  kicker: 'Get in touch', title: 'Contact',
  lead: `<p>For more information, please reach out to us at <a href="mailto:${site.email}">${site.email}</a> or use the form below. You can also call us at <a href="tel:${site.phone.tel}">${site.phone.display}</a>.</p>`,
  crumbList: crumb,
  art: `<div class="phero__frame phero__frame--tilt ct-art">${img('photo-interior', { sizes: '(max-width: 900px) 74vw, 440px', cls: 'phero__img' })}</div>`,
  cls: 'phero--art',
})}
<!-- the Location, Phone and Hours cards became the home visit bar (address, live status, the week with today lit,
     Directions and Call: the same facts); the Mail card and the social links sit right under it -->
<section class="band band--gallery band--tight ct-details" aria-label="Contact details">
  <div class="container">
    ${visitBar()}
    <div class="ct-more">
      <div class="infocard ct-mail" data-reveal><span class="infocard__ico">${icon('mail')}</span><div><h2 class="infocard__t">Mail</h2><p><a href="mailto:${site.email}">${site.email}</a></p></div></div>
      <div class="ct-social" data-reveal style="--i:1"><p class="social-line">Follow us on social media to stay updated on new products, events, and more! ${site.socials.filter((s) => !s.placeholder).map((s) => `<a href="${s.url}" rel="noopener" target="_blank">${esc(s.name)}<span class="sr-only"> (opens in a new tab)</span></a>`).join(' &middot; ')}</p></div>
    </div>
  </div>
</section>
<!-- the message on a dark band that runs into the footer (brass edge where it meets the light band): the form on a
     paper card, the map as tall as the card -->
<section class="band band--ink band--tight ct-form" aria-labelledby="cf-t" data-spot>
  <span class="brass-rule brass-rule--top" aria-hidden="true"></span>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container">
    ${sectionHead('Send a message', 'We&rsquo;ll get back to you', 'A member of our team will be happy to answer your question as soon as possible.', { id: 'cf-t' })}
    <div class="ct-form__grid">
      <div class="ix-formcard" data-reveal>${messageForm({ id: 'contact-form', subject: 'Question from the website' })}</div>
      ${mapFacade()}
    </div>
  </div>
</section>`;
  return {
    path: '/contact/',
    title: 'Contact The Higher Company: 123 E Willow St, Syracuse, NY',
    description: 'Contact The Higher Co.: 123 E. Willow Street, Syracuse, NY 13202. Call 315-870-7140 or email info@thehighercompanyllc.com. Hours, directions and a message form.',
    main,
    jsonld: [storeLD(), crumbsLD(crumb)],
    bodyClass: 'page-contact',
  };
}

export function connect() {
  const crumb = [['Home', '/'], ['Contact', '/contact/'], ['Connect', '/connect/']];
  const main = `
${pageHero({
  kicker: 'Ask us anything', title: 'Connect',
  lead: `<p>Have questions? Reach out to us! A member of our team will be happy to answer your question as soon as possible.</p><p>If you prefer to email us directly you can contact us at <a href="mailto:${site.email}">${site.email}</a></p>`,
  crumbList: crumb,
  art: `${COUNTER_NOTE}<div class="phero__frame cn-art">${img('photo-counter', { sizes: '(max-width: 900px) 64vw, 400px', cls: 'phero__img' })}</div>`,
  cls: 'phero--art',
})}
<section class="band band--gallery band--tight cn-form" aria-label="Message form">
  <div class="container narrow"><div class="ix-formcard" data-reveal>${messageForm({ id: 'connect-form', subject: 'Message from the Connect page' })}</div></div>
</section>`;
  return {
    path: '/connect/',
    title: 'Connect with The Higher Company | Send Us a Message',
    description: 'Questions for The Higher Co. in downtown Syracuse? Send the crew a message or email info@thehighercompanyllc.com and we will answer as soon as possible.',
    main,
    jsonld: [crumbsLD(crumb)],
    bodyClass: 'page-connect',
  };
}

export function subscribe() {
  const crumb = [['Home', '/'], ['Join the List', '/subscribe/']];
  const tall = imgMeta('join-sky-tall');
  const tallSet = tall.files.map((f) => `${u('/' + f.file)} ${f.w}w`).join(', ');
  const main = `
<!-- the hero over the home Join band's skyline (Lady Liberty), so the list looks the same wherever you meet it: the words
     on a deep fade at the left, Liberty kept in view on the right; phones get her right-hand crop as a banner on top -->
<section class="vhero sub-hero" aria-labelledby="sub-t">
  <div class="vhero__media" data-depth="-0.06"><picture class="vhero__pic">
    <source media="(max-width: 700px)" srcset="${tallSet}" sizes="100vw" width="${tall.w}" height="${tall.h}">
    ${img('join-sky', { sizes: '100vw', cls: 'pic__img', priority: true })}
  </picture></div>
  <div class="vhero__scrim" aria-hidden="true"></div>
  <div class="container vhero__in sub-hero__in">
    ${crumbs(crumb)}
    ${kicker('Unlock Exclusive Offers &amp; More')}
    <h1 class="vhero__t sub-hero__t" id="sub-t" data-reveal>Join the List</h1>
    <div class="sub-hero__lead" data-reveal style="--i:1"><p>Stay connected and get the latest updates!</p><p>Join the list for news on new products, events and in-store promotions from the shop on Willow Street.</p></div>
  </div>
</section>
<!-- what you get as the home picture accordion (stacked, so each title stays on one line): the jars for new products, the
     block party for events (the picture the hero used before), the shop's own display case for drops and promotions;
     the form and the three steps beside it -->
<section class="band band--gallery band--tight sub" aria-labelledby="perks-t">
  <div class="container sub__grid">
    <div class="sub__perks">
      ${sectionHead('What you get', 'On the list', '', { id: 'perks-t' })}
      ${accordion([
        { img: 'oak-jars', icon: 'leaf', title: 'New products', text: 'Hear when something new lands on the menu or the Flower Bar.' },
        { img: 'blockparty', icon: 'star', title: 'Events and more', text: 'News about our events, workshops, and rallies, straight from the shop.' },
        { img: 'photo-display', icon: 'cap', title: 'Drops and promotions', text: 'Promotions on non-cannabis items, such as accessories, apparel, and educational materials.' },
      ], { cls: 'sub-acc', sizes: '(max-width: 900px) 100vw, 760px' })}
    </div>
    <div class="sub__join">
      <div class="sub__form" data-reveal style="--i:1">
      <form class="form form--card" id="join-form" action="mailto:${site.email}?subject=${encodeURIComponent('Join the list')}" method="post" enctype="text/plain" data-mailto-form data-subject="Join the list">
        <!-- [CONFIRM WITH CLIENT] email/SMS list provider; until one is chosen the form opens an email to ${site.email} asking to be added. -->
        <h2 class="form__t">Join the List</h2>
        <div class="field"><label for="join-name">First name</label><input id="join-name" name="first_name" autocomplete="given-name" required></div>
        <div class="field"><label for="join-email">Email</label><input id="join-email" name="email" type="email" autocomplete="email" required></div>
        <div class="check"><input id="join-21" name="age_21_plus" type="checkbox" value="yes" required><label for="join-21">I am 21 or older.</label></div>
        <div class="check"><input id="join-ok" name="consent" type="checkbox" value="yes" required><label for="join-ok">Email me about new products, events and in-store promotions. I can ask to be removed any time.</label></div>
        <button class="btn btn--mint btn--block" type="submit"><span class="btn__t">Join</span>${icon('arrow')}</button>
        <p class="form__note">Joining opens your email app with a ready-to-send request to the store.</p>
        <p class="form__status" role="status" aria-live="polite" data-form-status></p>
      </form>
      </div>
      <ol class="steps3" role="list"><li><strong>Join</strong> with your first name and email.</li><li><strong>Watch your inbox</strong> for news from the shop.</li><li><strong>Come in</strong> and ask the crew about what you read.</li></ol>
    </div>
  </div>
</section>`;
  return {
    path: '/subscribe/',
    title: 'Join the List: News and Drops from The Higher Company',
    description: 'Join The Higher Co. list for updates on new products, events and in-store promotions on accessories and apparel, from our shop in downtown Syracuse. 21+ only.',
    main,
    jsonld: [crumbsLD(crumb)],
    bodyClass: 'page-subscribe',
  };
}

export function visit() {
  const crumb = [['Home', '/'], ['Visit Us', '/visit/']];
  const card = (key, ico, title, body, i) => `<article class="vcard vis-card vis-card--${key}" data-reveal style="--i:${i}"><span class="vcard__ico">${icon(ico)}</span><h3>${title}</h3><p>${body}</p></article>`;
  const main = `
<section class="vhero" aria-labelledby="visit-t">
  <!-- [CONFIRM WITH CLIENT] AI illustration of a storefront (no longer tagged on the page: the operator removed the visible AI tags, 2026-11-10; the alt text still says AI); replace with a real photo of 123 E Willow St before launch. -->
  <div class="vhero__media" data-depth="-0.06">${storefrontPicture({ cls: 'vhero__pic', priority: true })}</div>
  <div class="vhero__scrim" aria-hidden="true"></div>
  <div class="container vhero__in">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="${u('/')}">Home</a></li><li><span aria-current="page">Visit Us</span></li></ol></nav>
    ${kicker('Downtown Syracuse')}
    <h1 class="vhero__t" id="visit-t" data-reveal>Visit Us</h1>
    <p class="vhero__addr" data-reveal style="--i:1">${esc(site.address.line)}</p>
    <p class="vhero__now" data-reveal style="--i:2"><span class="status__dot" data-open-dot aria-hidden="true"></span><span data-open-label>Hours</span></p>
    <div class="actions" data-reveal style="--i:3">${btn('Get directions', site.directions.google, { v: 'mint', ext: true })}${btn('Call ' + site.phone.display, 'tel:' + site.phone.tel, { v: 'ghost', ico: 'phone' })}</div>
  </div>
  ${aiTag('corner')}
</section>

<!-- the hours as the home visit bar (the week as seven chips, today lit, from the same hours data the old 7-row table
     used, so the hours show once); the section keeps id="hours" for the sticky bar's "Today's Hours" link; under it the
     map beside the shop's own photo of the floor -->
<section class="band band--gallery band--tight vis-hours" id="hours" aria-labelledby="hours-t">
  <div class="container">
    <div class="vis-hours__head">
      ${sectionHead('Hours', 'Open seven days', '', { id: 'hours-t' })}
      <p class="visit__note">Online pre-orders follow the menu&rsquo;s own ordering hours, shown at checkout.</p>
    </div>
    ${visitBar()}
    <div class="vis-where">
      ${mapFacade()}
      ${photoTile('photo-interior', { cls: 'vis-where__photo', sizes: '(max-width: 700px) 100vw, (max-width: 1100px) 42vw, 560px', fx: '36%', fy: '55%' })}
    </div>
  </div>
</section>

<!-- the six cards as a bento like the home "Make The Higher Choice" one: a dark heading tile, the crew at the counter,
     the cards on paper (a small lift and a brass edge on hover) -->
<section class="band band--gallery-2 band--tight vis-bring" aria-labelledby="bring-t">
  ${COUNTER_NOTE}
  <div class="container vis-bento">
    <div class="vis-bento__head">${kicker('Before you come')}<h2 class="sect-t" id="bring-t" data-reveal>What to bring, how it works</h2></div>
    ${card('id', 'id', 'Valid photo ID', `You must be 21 or older, and we check ID at the door. We accept a government photo ID that shows your age (IDNYC included), a driver&rsquo;s license or non-driver ID, a passport, or a U.S. armed forces ID. <a href="${u('/faqs/')}#q-5">Full list</a>.`, 0)}
    ${photoTile('photo-counter', { cls: 'vis-bento__crew', sizes: '(max-width: 620px) 100vw, (max-width: 900px) 50vw, 440px', fx: '46%', fy: '40%' })}
    ${card('pay', 'card', 'Payment', 'We take cash, debit cards, Apple Pay, or Dutchie Pay (ACH). If you prefer to pay in cash, we have an ATM machine in the store.', 1)}
    ${card('park', 'car', 'Parking', 'Yes, you can park directly across the street in our reserved parking slots free of charge. There is also more parking under the bridge.', 2)}
    ${card('order', 'bag', 'Ordering ahead', `Order on the <a href="${u('/shop/')}">live menu</a>, choose &ldquo;Pick Up In-Store&rdquo;, and bring your ID. Online orders require a $50 minimum purchase, and only the person who ordered can pick up.`, 0)}
    ${card('bar', 'lens', 'The Flower Bar', `Ninety strains under glass. Smell the jars and view the trichomes with a magnifying glass. <a href="${u('/the-flower-bar/')}">How it works</a>.`, 1)}
    ${card('lic', 'shield', 'Check our license', `New York requires every legal dispensary to post the state&rsquo;s verification QR code near its entrance. <a href="${site.ocm.verify}" rel="noopener" target="_blank">Check our license with the OCM<span class="sr-only"> (opens in a new tab)</span></a>.`, 2)}
  </div>
</section>

<section class="band band--ink band--tight visitcta" aria-labelledby="vcta-t" data-spot>
  <span class="brass-rule brass-rule--top" aria-hidden="true"></span>
  <div class="band__light" aria-hidden="true"></div>
  <div class="container visitcta__grid">
    <div>
      <h2 class="sect-t" id="vcta-t" data-reveal>Questions before you come?</h2>
      <p data-reveal style="--i:1">Call <a href="tel:${site.phone.tel}">${site.phone.display}</a>, email <a href="mailto:${site.email}">${site.email}</a>, or read the <a href="${u('/journal/first-visit-guide/')}">first-visit guide</a>.</p>
    </div>
    <div class="actions">${btn('First-visit guide', '/journal/first-visit-guide/', { v: 'mint' })}${btn('FAQ', '/faqs/', { v: 'ghost' })}</div>
  </div>
</section>`;
  return {
    path: '/visit/',
    title: 'Visit The Higher Company: Hours, Parking and Directions, Syracuse',
    description: 'Visit The Higher Co. at 123 E Willow St, downtown Syracuse: hours, directions, free reserved parking across the street, accepted IDs, payment and order-ahead pickup.',
    main,
    jsonld: [crumbsLD(crumb)],
    bodyClass: 'page-visit',
  };
}
