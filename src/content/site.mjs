// site.mjs — the store's facts, in one place. Nothing here is typed from memory: every value names its source
// (facts/client-facts.json carries the full trail). Change a fact here and every page, the JSON-LD, the sticky bar
// and the hours logic follow.

export const site = {
  name: 'The Higher Company',
  short: 'The Higher Co.',
  legal: 'The Higher Company LLC',                       // OCM licence record
  license: 'OCM-CAURD-24-000155',                         // OCM licence record, status Active
  licenseType: 'Adult-Use Conditional Retail Dispensary', // OCM licence record
  origin: 'https://www.thehigherco420.com',               // live site; OCM list
  address: {
    street: '123 E Willow St', city: 'Syracuse', region: 'NY', zip: '13202', country: 'US',
    line: '123 E Willow St, Syracuse, NY 13202',
    long: '123 E. Willow Street, Syracuse, NY 13202',     // live /contact/ wording
  },
  phone: { display: '315-870-7140', paren: '(315) 870-7140', tel: '+13158707140' }, // live /contact/
  email: 'info@thehighercompanyllc.com',                                              // live /contact/
  // Store hours as shown site-wide on the live site (footer + /contact/). [CONFIRM WITH CLIENT] — the live
  // /faqs/ and the OCM record say Sunday 10am – 8pm; the menu's online ordering hours say Sunday 12pm – 6pm.
  hours: [
    { day: 0, name: 'Sunday', open: '11:00', close: '18:00' },
    { day: 1, name: 'Monday', open: '10:00', close: '21:00' },
    { day: 2, name: 'Tuesday', open: '10:00', close: '21:00' },
    { day: 3, name: 'Wednesday', open: '10:00', close: '21:00' },
    { day: 4, name: 'Thursday', open: '10:00', close: '21:00' },
    { day: 5, name: 'Friday', open: '10:00', close: '22:00' },
    { day: 6, name: 'Saturday', open: '10:00', close: '22:00' },
  ],
  hoursLines: ['Sunday: 11am – 6pm', 'Monday – Thursday: 10am – 9pm', 'Friday & Saturday: 10am – 10pm'],
  timezone: 'America/New_York',
  directions: {
    google: 'https://www.google.com/maps/dir/?api=1&destination=123+E+Willow+St%2C+Syracuse%2C+NY+13202',
    apple: 'https://maps.apple.com/?daddr=123+E+Willow+St,+Syracuse,+NY+13202',
    embed: 'https://www.google.com/maps?q=123+E+Willow+St,+Syracuse,+NY+13202&output=embed',
  },
  socials: [
    // Instagram: the old handle is dead (operator brief) — placeholder until the client names the new one. [CONFIRM WITH CLIENT]
    { key: 'ig', name: 'Instagram', url: '#instagram-handle-pending', placeholder: true },
    { key: 'fb', name: 'Facebook', url: 'https://www.facebook.com/thehigherco' },     // live footer
    { key: 'yt', name: 'YouTube', url: 'https://www.youtube.com/@TheHigherCo' },     // the store's own hero video channel
  ],
  youtube: { id: 'J6GR_35qW58', title: "The Higher Co, Syracuse's 2nd legal cannabis dispensary in downtown!" },
  menu: {
    // The store's own embedded online menu (live /shop/). Deep links verified 2026-11-10: the embed reads
    // dtche[category] / dtche[path] from the page URL on load and opens straight to products.
    script: 'https://dutchie.com/api/v2/embedded-menu/64a2e0444b41a8000934d3bd.js',
    all: 'dtche[path]=products',
  },
  ocm: {
    verify: 'https://cannabis.ny.gov/dispensary-location-verification',
    buyLegal: 'https://buylegal.cannabis.ny.gov/',
    knowTheLaw: 'https://cannabis.ny.gov/know-law',
  },
  hopeline: { phone: '1-877-8-HOPENY', phoneDigits: '1-877-846-7369', tel: '+18778467369', text: 'HOPENY', textNumber: '467369', url: 'https://oasas.ny.gov/hopeline' },
  poison: { phone: '1-800-222-1222', tel: '+18002221222' },
};

// 9 NYCRR 129.2(c)(1) — required warning, verbatim (rules effective Dec 3, 2025).
export const REQUIRED_WARNING = 'For use only by persons 21 years of age and older. Keep out of reach of children and pets. If someone accidentally consumes cannabis, contact the Poison Center. Consume responsibly.';
// 129.2(d)(1)-(4) — one rotating warning per advertisement; OCM guidance: do not use the same one everywhere,
// so each page is assigned one in rotation.
export const ROTATING_WARNINGS = [
  'Cannabis can be addictive.',
  'Cannabis can impair concentration and coordination. Do not operate a vehicle or machinery under the influence of cannabis.',
  'There may be health risks associated with consumption of this product.',
  'Cannabis is not recommended for use by persons who are pregnant or nursing.',
];

// The six categories the online menu carries (verified on the live menu 2026-11-10). Topicals appear in the
// live About copy but not on the menu, so they get no shop page. [CONFIRM WITH CLIENT]
export const categories = [
  { slug: 'flower', name: 'Flower', dutchie: 'flower', img: 'cat-flower', line: 'Premium sativas, indicas, and hybrids.', more: 'Ninety strains wait under glass at the Flower Bar in store. Here is what is on the menu right now, ready to order ahead for pickup.' },
  { slug: 'pre-rolls', name: 'Pre-Rolls', dutchie: 'pre-rolls', img: 'cat-prerolls', line: 'Convenient and ready-to-use pre-rolled joints.', more: 'Singles, packs and infused options, straight from today\'s menu.' },
  { slug: 'vaporizers', name: 'Vaporizers', dutchie: 'vaporizers', img: 'cat-vapes', line: 'Cartridges and more, straight from today\'s menu.', more: 'Browse what is in stock, add it to your cart and pick it up at the counter.' },
  { slug: 'concentrates', name: 'Concentrates', dutchie: 'concentrates', img: 'cat-concentrates', line: 'Pure extracts like wax, shatter, and oils.', more: 'Live rosin and other extracts, as listed on the menu today.' },
  { slug: 'edibles', name: 'Edibles', dutchie: 'edibles', img: 'cat-edibles', line: 'Gummies, chocolates, drinks and more.', more: 'Start low and take your time: edibles can take up to two hours to kick in.' },
  { slug: 'accessories', name: 'Accessories', dutchie: 'accessories', img: 'cat-accessories', line: 'Everything you need to enhance your cannabis experience.', more: 'Glassware, grinders, papers and rolling supplies, lighters, batteries and cleaning gear.' },
];

// The five pillars (operator brief). Each line is built from declared facts only.
export const pillars = [
  { n: '01', name: 'Legacy to Legal', line: 'From The Higher Calling and the Stop the Stigma rally to the shop on Willow Street, told by the people who lived it.' },
  { n: '02', name: 'The Flower Bar', line: 'Ninety strains under glass. Smell them, then look closer with a magnifying glass.' },
  { n: '03', name: 'Downtown Syracuse Local', line: 'Two Syracuse locals and one downtown storefront at 123 E Willow St.' },
  { n: '04', name: 'Good People', line: 'Budtenders who know their stuff and take the time to help you find your match.' },
  { n: '05', name: 'New York Pride', line: 'One of the first 137 dispensaries to open in the state, and proud of it.' },
];

export const nav = [
  { label: 'Shop Cannabis', href: '/shop/', mega: 'shop' },
  { label: 'Shop Lifestyle', href: '/lifestyle/' },
  { label: 'The Flower Bar', href: '/the-flower-bar/' },
  { label: 'Our Story', href: '/about/', children: [{ label: 'Our Story', href: '/about/' }, { label: 'The Crew', href: '/about/the-crew/' }] },
  { label: 'Journal', href: '/journal/' },
  { label: 'Visit Us', href: '/visit/' },
];

export const footerCols = [
  { title: 'Shop Cannabis', links: [['All products', '/shop/'], ...categories.map((c) => [c.name, `/shop/${c.slug}/`])] },
  { title: 'Explore', links: [['Shop Lifestyle', '/lifestyle/'], ['The Flower Bar', '/the-flower-bar/'], ['Our Story', '/about/'], ['The Crew', '/about/the-crew/'], ['Journal', '/journal/'], ['Join the List', '/subscribe/']] },
  { title: 'Help', links: [['Visit Us', '/visit/'], ['FAQ', '/faqs/'], ['Contact', '/contact/'], ['Send a message', '/connect/']] },
  { title: 'Legal', links: [['Legal hub', '/legal/'], ['NY compliance', '/legal/compliance/'], ['Privacy', '/legal/privacy/'], ['Terms of use', '/legal/terms/'], ['Accessibility', '/legal/accessibility/']] },
];
