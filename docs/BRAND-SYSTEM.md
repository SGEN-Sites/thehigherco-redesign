# Brand system

Derived from the live site by `sr-tokens.mjs`, then extended for the redesign. The measured values and their evidence
live in `audit/design-baseline.json`; the tokens themselves are in `src/styles/tokens.css` (measured layer first,
redesign layer second). Nothing outside `tokens.css` declares a colour.

Art direction: **Gallery meets block party.** The real store is bright, clean and gallery-like (white walls, light oak
counters, lit glass cases, black cast-iron columns, warm light) inside a historic red-brick building. The site pairs
that calm with New York street energy: expanded poster type, a brass tape across the seams, brick red used rarely.

## Evidence

`audit/design-baseline.json`: `"evidence": "computed (browser capture)"`, 28 captures across 390 / 768 / 1024 / 1440 px
of the seven pages that carry the store's content. Carried over from the measurement: brass `#b79b65` (`--c-8`, used
as `--brass`) and the body face Poppins (`--font-body`).

## Colour

| token | value | role |
|---|---|---|
| `--ink` | #0E0E0E | base dark ground, primary text on light |
| `--ink-2` / `--ink-3` / `--ink-4` | #161514 / #1F1D1B / #2B2723 | raised dark bands, cards, hover |
| `--gallery` | #F6F4EF | base light ground ("gallery white") |
| `--gallery-2` / `--gallery-3` | #EDE9E0 / #E2DCCF | second light ground, light rules |
| `--brass` | #B79B65 (measured) | rules, numerals, the tape, the leaf and wordmark |
| `--brass-ink` | #6E5732 | brass for small text on light grounds |
| `--oak` / `--oak-2` / `--oak-3` | #D9B98A / #C6A272 / #A8865A | shelves, footer headings, 3D monogram sides |
| `--mint` | #3FBFA0 | Liberty mint, the accent: CTAs, live status, accents on dark |
| `--mint-ink` | #17695A | mint for text on light grounds |
| `--brick` | #9E3B2A | rare accent: the founders' headline, drop numbers, quote rule, a tape |
| `--ocm-yellow` | #FFFF00 | the required warning box (9 NYCRR 129.2(e)) |

Measured contrast (WCAG 2.x):

| foreground | background | ratio | use |
|---|---|---|---|
| `--on-dark` #F6F4EF | `--ink` #0E0E0E | 17.56:1 | body and headings on dark |
| `--on-dark-2` #B5B4B0 | `--ink` | 9.30:1 | secondary text on dark |
| `--on-dark-3` #9E9D9A | `--ink` | 7.12:1 | captions on dark |
| `--mint` #3FBFA0 | `--ink` | 8.43:1 | kickers, links, accents on dark |
| `--ink` | `--mint` | 8.43:1 | text on mint buttons |
| `--brass` #B79B65 | `--ink` | 7.25:1 | numerals, labels on dark |
| `--oak` #D9B98A | `--ink` | 10.35:1 | footer headings |
| `--ink` | `--gallery` #F6F4EF | 17.56:1 | body and headings on light |
| `--on-light-2` #4A4743 | `--gallery` | 8.40:1 | secondary text on light |
| `--on-light-3` #5C5853 | `--gallery` | 6.42:1 | captions on light |
| `--mint-ink` #17695A | `--gallery` | 5.96:1 | links and kickers on light |
| `--brass-ink` #6E5732 | `--gallery` | 6.22:1 | numerals on light |
| `--brick` #9E3B2A | `--gallery` | 6.14:1 | the founders' headline accent |
| `--ink` | `--ocm-yellow` #FFFF00 | 17.98:1 | the warning box |

## Type

- Display: **Archivo** (variable, width 62 to 125%, weight 100 to 900). Headlines run expanded (`--wdth-poster: 125%`)
  at 820 to 900, uppercase for posters, sentence case for section titles. Line height `.86` to `.94`.
- Accent: **Instrument Serif** italic, one word or phrase per heading (`<em>`), mint on dark, mint-ink or brick on light.
- Body and UI: **Poppins** 400 / 500 / 600 / 700, 17px at 1.68.
- Legal: Arial / Helvetica for the required warnings (129.2(e) names the allowed faces).
- Scale: `--fs-mega` clamp(4.25rem, 15vw, 15rem), `--fs-display` clamp(3rem, 8vw, 7.4rem), `--fs-h1` clamp(2.6rem, 6vw,
  5.4rem), `--fs-h2` clamp(2rem, 4.2vw, 3.7rem), `--fs-h3` clamp(1.3rem, 1.9vw, 1.65rem), lead 1.1 to 1.3rem, kickers
  13px caps tracked .18em (never under 13px on a phone).
- All fonts self-hosted (SIL Open Font License), latin subset, with size-matched fallbacks.

## Space, shape, layout

- Container 1320px plus a fluid gutter (16 to 48px); a 760px narrow column for long reading.
- Band padding clamp(80px, 11vw, 168px); tight bands clamp(56px, 7vw, 104px).
- Radii: 4px for gallery frames and cards, 14px for soft panels, pill buttons. Light bands slide over dark ones with
  40px top corners (the "sheet" seam).
- Shadows are tokens (`--shadow-lift`, `--shadow-float`, `--shadow-light`).
- Breakpoints used: 1560 (header status chip), 1240 (desktop nav to drawer), 1180 / 1080 / 1000 / 960 / 900 (grids
  fold), 760 / 700 (phone layout, sticky bar goes full width), 560 / 520 / 420 / 360.
- Three planes: bands (grounds + a key light that follows the pointer), glass (header, sticky bar, age gate, plates
  over imagery only), depth objects (category cut-outs and art that cross card and section edges).

## Motion

Easings `--ease` cubic-bezier(.16, 1, .3, 1), `--ease-io` (.65, 0, .35, 1), `--ease-spring` (.34, 1.56, .64, 1);
durations .25 / .5 / 1 / 2.4s. Everything below stops under `prefers-reduced-motion`, and the page is complete without
JavaScript (default state = final state).

| component | trigger |
|---|---|
| THC monogram builds itself (outline draws, T / H / C fly in, leaf turns in, wordmark wipes), pillars light up | scroll through the pinned section on the home page |
| 3D monogram on a plinth (18 layered SVG slices) | drag, arrow keys; gentle sway while on screen |
| Hero: drifting mint / brass light, raking beam, torch flicker, floating brass leaves, parallax exit | load and scroll |
| Key light follows the pointer on dark bands; tilt + glint on category cases and frames; magnetic buttons | pointer (fine pointers only) |
| Category cases: spotlight brightens, cut-out lifts and turns, arrow slides | hover / focus |
| Magnifier lens over macro shots | pointer move (tap on touch screens) |
| Night storefront and Flower Bar loops; scene zoom settles as it enters | on screen, desktop, no Save-Data; pause button |
| Reveals: fade up with blur-to-sharp; photos "develop" from grey | entering the viewport |
| Brass tape marquee, count-up "90" | always / on view |

The old site's own keyframes are recorded verbatim in `src/styles/motion.css` (the motion inventory); the redesign
does not load them.
