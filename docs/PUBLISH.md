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

## Checks run on 2026-11-10

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
