// seo.mjs — JSON-LD from declared facts only (src/content/site.mjs). The store's image is its real logo,
// never an AI illustration standing in for the premises.
import { site } from '../content/site.mjs';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const sameAs = site.socials.filter((s) => !s.placeholder).map((s) => s.url);
const logo = site.origin + '/assets/img/brand/thc-logo-1200.png';

export const storeLD = () => ({
  '@context': 'https://schema.org',
  '@type': ['Store', 'LocalBusiness'],
  '@id': site.origin + '/#store',
  name: site.name,
  alternateName: site.short,
  url: site.origin + '/',
  logo,
  image: logo,
  telephone: '+1-315-870-7140',
  email: site.email,
  address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.city, addressRegion: site.address.region, postalCode: site.address.zip, addressCountry: site.address.country },
  hasMap: site.directions.google,
  openingHoursSpecification: site.hours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: 'https://schema.org/' + days[h.day], opens: h.open, closes: h.close })),
  sameAs,
  parentOrganization: { '@id': site.origin + '/#org' },
});

export const orgLD = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': site.origin + '/#org',
  name: site.name,
  alternateName: site.short,
  legalName: site.legal,
  url: site.origin + '/',
  logo,
  email: site.email,
  telephone: '+1-315-870-7140',
  sameAs,
  founder: [{ '@type': 'Person', name: 'Mike Golden' }],
});

export const websiteLD = () => ({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': site.origin + '/#web', name: site.name, url: site.origin + '/', publisher: { '@id': site.origin + '/#org' } });

export const faqLD = (items) => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q.replace(/<[^>]+>/g, ''), acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() } })),
});

export const articleLD = (a, path) => ({
  '@context': 'https://schema.org', '@type': 'Article',
  headline: a.title, description: a.description,
  mainEntityOfPage: site.origin + path,
  dateModified: '2026-11-10',
  author: { '@type': 'Organization', name: site.name, url: site.origin + '/' },
  publisher: { '@id': site.origin + '/#org' },
});
