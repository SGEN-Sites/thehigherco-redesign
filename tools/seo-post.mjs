// seo-post.mjs — run after sr-seo.mjs --apply. Rewrites the emitted sitemap.xml and llms.txt to list each page by
// its canonical directory URL ("/about/", not "/about/index.html") and to leave out the 404 page and the noindex
// redirect pages, which a sitemap must not offer to crawlers. Reads the built pages; invents nothing.
//   node tools/seo-post.mjs [dist]
import fs from 'node:fs';
import path from 'node:path';
const DIR = path.resolve(process.argv[2] || 'dist');
const SITE = 'https://www.thehigherco420.com';
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const pages = walk(DIR).filter((f) => f.endsWith('.html')).map((f) => {
  const rel = path.relative(DIR, f).replace(/\\/g, '/');
  const html = fs.readFileSync(f, 'utf8');
  const noindex = /<meta name="robots" content="[^"]*noindex/i.test(html);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const url = SITE + '/' + rel.replace(/index\.html$/, '');
  return { rel, noindex, url, title, desc, mtime: fs.statSync(f).mtime.toISOString().slice(0, 10) };
}).filter((p) => !p.noindex && p.rel !== '404.html').sort((a, b) => a.url.localeCompare(b.url));
const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...pages.map((p) => `<url><loc>${p.url}</loc><lastmod>${p.mtime}</lastmod></url>`), '</urlset>', ''].join('\n');
fs.writeFileSync(path.join(DIR, 'sitemap.xml'), xml);
const un = (s) => s.replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"');
const llms = [`# The Higher Company (The Higher Co.)`, '', '> Licensed adult-use cannabis dispensary at 123 E Willow St, downtown Syracuse, NY 13202. Adults 21+ with valid ID. Order ahead on the live menu for in-store pickup.', '', '## Pages', '',
  ...pages.map((p) => `- [${un(p.title)}](${p.url}): ${un(p.desc)}`), ''].join('\n');
fs.writeFileSync(path.join(DIR, 'llms.txt'), llms);
console.log('sitemap.xml + llms.txt:', pages.length, 'indexable pages (404 and noindex redirect pages left out)');
