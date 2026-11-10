# Deployment

## Target

Any static host. The public preview runs on GitHub Pages (`gh-pages` branch of the project repo, built with
`--preview`). For production, Netlify, Cloudflare Pages or the client's current host all work: upload `dist/`.

## Build

```bash
node src/build.mjs                                                    # production -> dist/
node src/build.mjs --preview --out dist-preview --base /thehigherco-redesign/   # preview -> dist-preview/
```

Node 18 or later. No `npm install`: the build has no dependencies. Image processing (`tools/process-images.py`,
Pillow + OpenCV) and generation (`tools/fal.mjs`, needs `FAL_KEY` in the environment, never in a file) are only for
rebuilding media.

## DNS and redirects

The live site's only recorded redirect chains are WordPress's trailing-slash 301s (`/about` to `/about/`, and the same
for every page, 29 chains in `audit/site-inventory.json`). Every static host listed above does the same for directory
URLs, so they carry over unchanged.

Retired live URLs (no client content lived there) keep working as small redirect pages in `dist/`. On a host that
supports server redirects, replace them with 301s:

| from | to |
|---|---|
| `/gallery/` | `/the-flower-bar/` |
| `/media/` | `/journal/` |
| `/delivery/` | `/faqs/#q-13` |
| `/sample-page-2/`, `/retail-space/` | `/` |
| `/author/admin/`, `/category/uncategorized/` | `/journal/` |
| `/alpha-classics-artists-named-polar-music-prize-winners/`, `/arcana-wins-the-choral-award-at-the-2022-icmas/`, `/music-for-lovers-our-valentines-day-promotion/`, `/outhere-music-receives-four-award-nominations/` | `/journal/` |
| `/services/*` (12 theme demo pages) | `/` |

## Headers

Recommended for production:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://dutchie.com; frame-src https://dutchie.com https://www.youtube-nocookie.com https://www.google.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; media-src 'self'; connect-src 'self'; base-uri 'self'; form-action mailto:
```

The inline scripts are the 21+ pre-paint check, the store-hours JSON and the menu deep link; hash them instead of
`'unsafe-inline'` if the host supports it. The menu provider's script injects its own iframe from `dutchie.com`.

## Forms

The live site's forms posted to WordPress plugins that will not exist after the move. The rebuild's Contact, Connect
and Join the List forms open the visitor's email app with the message addressed to info@thehighercompanyllc.com
(`action="mailto:..."`). Before launch, point them at the client's chosen provider (form service and email/SMS list):
change the `action` in `src/pages/info.mjs` and remove `data-mailto-form`.

## Post-deploy verification

```bash
node scripts/sr-parity.mjs --project <project> --new <deployed dir or mirror>
node scripts/sr-decontaminate.mjs --project <project> --strict
```

Then open `/shop/flower/` in a normal browser: the menu must open on Flower with prices and a working cart.
