# Publish and verification record

## Where it lives

- Repository: https://github.com/SGEN-Sites/thehigherco-redesign (`main`: source, production build `dist/`, docs,
  audit record; `gh-pages`: the noindex preview build)
- Preview: https://sgen-sites.github.io/thehigherco-redesign/ (every page `noindex, nofollow`; `robots.txt` disallows all)

## How to republish

```bash
bash tools/prove.sh                                                  # rebuild dist/ and re-run every proof stage
node src/build.mjs --preview --out dist-preview --base /thehigherco-redesign/
# commit + push main; copy dist-preview/ into the gh-pages worktree, commit + push gh-pages
```

Then wait until GitHub Pages reports the new gh-pages commit as built before checking the live preview.

Two traps: a plain `node src/build.mjs` wipes `dist/` and drops the `sitemap.xml` and `llms.txt` that `sr-seo --apply`
writes, so commit only after `tools/prove.sh`. And scan for reference-site and other-client names in code comments,
job files and file names too, not just page text (comments quoting operator messages are how they get in).

## Release 2 (2026-11-10, evening): the inner pages in the home page's design language

- Every inner page rebuilt with the home page's components and principles (27 pages in 5 groups): glass category
  cases on the shop pages, the visit bar on Visit and Contact, stacked picture accordions, the Journal bento and
  reading layout, numbered legal documents, the floating buds on the 404.
- Framed hero tiles (About, Crew, Connect, Contact, FAQs, Journal and its four guides) slant to the right and hang over
  the next section; the section below starts clear of the tile at every width.
- No shelf under any product (the Lifestyle accessories ledge removed); the home Drops section on phones and tablets
  puts the plinth under the drop and the words on the ink.

| check | result |
|---|---|
| site-reforge gate (`audit/gate.json`) | 23 PASS, 6 FAIL, 0 UNPROVEN of 29. The five structural FAILs as in release 1 (C04, C05, C17, C19, C22), plus C23 below |
| responsive sweep, 51 pages x 390/768/1024/1440 | 0 blocker. 508 "major" findings, all of three kinds the sweep cannot tell apart from defects: decorative layers that bleed past the screen edge inside sections that clip them (the cars on the skyline, the home hero's push-in photo, the founders banner hands), the Journal cards' title links (the whole card is the link), and the table header kept for screen readers on phones. No page scrolls sideways: 0 px horizontal overflow on all 27 pages at 390 and 1440 |
| text over imagery (`tools/scene-contrast.mjs --all`, now also inner heroes and dark bands) | PASS: 6,251 text lines, 27 pages x 1440/1024/390, 0 under WCAG AA |
| page checks | final build, 50 pages x 1440/390: 0 script errors, failed requests or horizontal overflow; 27 pages x 1440/390 (also broken images and one h1 per page): 0 problems |
| hero tiles over the next section | 10 pages x 7 widths (390-1440), scroll motion on, 3 scroll positions: nothing covered (closest 22 px) |
| hero text vs the next section's top edge | 27 pages x 1440/1024/390: 0 covered or tight |
| button groups | 36 groups: every button in a group the same width, 0 overflow |
| interactive parts | floating buds keep their size through a resize; accordion panels animate (and do not under reduced motion); Journal rotator, visit bar and Find us panels pass their checks |
| fabrication (`--strict`) | 84 claims checked, 0 blocker, 0 major |
| decontamination (`--strict`) | clean |
| internal links and assets in the preview build | 3,555 checked under `/thehigherco-redesign/`, 0 broken |
| reference names and other-client names | 0 in the repository (working tree and both branches' history) and the preview build |
| API keys | 0 occurrences of the fal key in the repository, its history or the preview build |

## Checks run on 2026-11-10 (release 1)

| check | result |
|---|---|
| site-reforge gate (`audit/gate.json`) | 24 PASS, 5 FAIL, 0 UNPROVEN of 29. The five FAILs are structural for a redesign: C04/C05 (the live site's empty pages and a static-HTML heuristic), C17/C19 (23 retired theme-demo pages and their placeholder contacts, deliberately not republished), C22 (pixel parity with the old design) |
| responsive sweep, 51 pages x 390/768/1024/1440 | 0 blocker, 0 major introduced |
| parity on the 7 pages with client content | word recall 96.8% to 100%, no major or blocker finding |
| fabrication (`--strict`) | 83 claims checked, 0 blocker, 0 major |
| decontamination (`--strict`) | clean: no WordPress traces |
| internal links in the preview build | 1,987 checked, 0 broken |
| shop and category buttons | 482 found; every one lands on an in-site page that carries the live menu |
| live menu on the preview, in a real browser | `/shop/`, all six category pages and the Lifestyle accessories shelf open straight on products with prices and the menu's cart; add-to-cart and remove verified on `/shop/flower/` |
| live preview pages | all 51 return 200 and carry noindex; an unknown URL returns the 404 page |
| phone check on the live preview (390 and 360 px) | 21+ gate shows first, answer buttons 64 px tall, choice remembered; quick-action bar appears past the hero, every button at least 44 x 64 px, hides at the footer, Shop Now opens the menu page; no horizontal scroll; no script errors |
| reference names and the menu provider's other store name | 0 occurrences in the repository, both branches and the live preview |
| API keys | 0 occurrences of the fal key or any token pattern in the repository, its history or the preview |

## Not verified

- Checkout past the cart (no order was placed).
- The menu provider's own pages inside its frame beyond browsing and the cart.
- Real-device testing on iOS Safari and Android Chrome (checked with browser emulation at 390 and 360 px).
- Release 2 in Safari and Firefox: every check above ran in Chromium. The Journal reading-progress line (scroll-driven
  animation) and the phone category chips opening on the active chip (`scroll-initial-target`) fall back to no effect
  where unsupported.
