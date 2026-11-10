# The Higher Company: developer README

Redesign of thehigherco420.com for The Higher Company (The Higher Co.), a licensed adult-use cannabis dispensary at
123 E Willow St, downtown Syracuse, NY. Rebuilt with site-reforge (redesign lane): a static, platform-free site,
built by a small Node script with no dependencies. `audit/` is the evidence behind every decision.

Art direction: **Gallery meets block party**. A bright, calm gallery (white walls, light oak, lit glass, brass) set
against New York street energy (poster type, a brass tape, brick red used sparingly). Details in `docs/BRAND-SYSTEM.md`.

## Run it locally

```bash
node src/build.mjs                       # production build -> dist/ (indexable, canonical on thehigherco420.com)
python3 -m http.server 8080 -d dist      # then open http://localhost:8080/
```

Preview build (what the public preview serves): noindex on every page, `robots.txt` disallow, a preview note in
the footer, all URLs page-relative so it works under a sub-path:

```bash
node src/build.mjs --preview --out dist-preview --base /thehigherco-redesign/
```

## Structure

| path | what |
|---|---|
| `src/build.mjs` | renders every page into `dist/` (Node builtins only) |
| `src/content/site.mjs` | the store's facts in one place: address, phone, hours, licence, menu, socials, categories, pillars |
| `src/content/journal.mjs` | the four Journal articles (sources cited in the law guide) |
| `src/content/images.json` | every generated image and loop: files, sizes, alt text, model and request id |
| `src/lib/` | page shell (`layout.mjs`), components (`parts.mjs`), logo SVGs (`brand.mjs`), JSON-LD (`seo.mjs`) |
| `src/pages/` | one module per page family |
| `src/styles/tokens.css` | the brand system: measured live values first, then the redesign layer. Change values HERE |
| `src/styles/motion.css` | the old site's measured motion inventory, kept as the record (the redesign's motion is in `signature.css`) |
| `src/scripts/site.js` | all behaviour, vanilla JS |
| `src/assets/` | fonts (self-hosted, OFL), processed images, loops, the vectorised logo |
| `assets/source/` | original assets downloaded from the live site |
| `facts/client-facts.json` | every claim not on the live site, with its source |
| `tools/` | capture, generation (fal), image processing, logo trace, screenshots, docs |
| `audit/` | crawl, inventories, ledger, captures, sweeps, gate record |
| `docs/` | this directory |

## Pages

| URL | page | notes |
|---|---|---|
| `/` | Home | live URL kept |
| `/shop/` | Shop Cannabis | live URL kept; the live menu opens on all products |
| `/shop/flower/` `/pre-rolls/` `/vaporizers/` `/concentrates/` `/edibles/` `/accessories/` | category pages | the live menu opens on that category (products, prices, cart, checkout) |
| `/lifestyle/` | Shop Lifestyle | merch drops (in store only) and the accessories shelf |
| `/the-flower-bar/` | The Flower Bar | 90 strains, magnifier lens, the store's own video |
| `/about/` | Our Story | live URL kept |
| `/about/the-crew/` | The Crew | founders and budtenders |
| `/journal/` + 4 articles | Journal | trichomes, strain types, first visit, NY cannabis laws |
| `/visit/` | Visit Us | hours, map, parking, ID, payment, pickup |
| `/faqs/` `/contact/` `/connect/` `/subscribe/` | FAQ, Contact, Connect, Join the List | live URLs kept |
| `/legal/` + compliance, privacy, terms, accessibility | Legal | NY OCM notices |
| 23 retired URLs | redirect pages | theme demo pages and empty pages; see `docs/CHANGE-LOG.md` |

## How the shop works

Every Shop Now button and every category button goes to a page on this site that carries the store's real embedded
menu. A small inline script writes the menu's deep link (`dtche[category]=flower`, or `dtche[path]=products` on
`/shop/`) into the page URL before the menu's own script loads, so each page opens straight on products with the
menu's cart and checkout. Verified in a real browser on 2026-11-10.

## Before you change anything

Read `docs/CHANGE-LOG.md` (every section of the old site has a recorded decision) and `docs/PITCH-NOTES.md`
(open questions for the client, including every [CONFIRM WITH CLIENT] item; the same notes sit as HTML comments in
the page source where they apply).

## Known open items

See `docs/PITCH-NOTES.md`, section "Confirm with the client". The most important: rename the menu provider's store
profile to The Higher Company (its cart shows another business name), confirm Sunday hours, confirm which licence
name and number to display, replace the AI storefront and interior illustrations with real photos, and choose a form
and email-list provider.
