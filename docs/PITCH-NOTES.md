# Pitch notes: The Higher Company redesign

A design concept for The Higher Company (The Higher Co.), 123 E Willow St, Syracuse, NY. Built 2026-11-10.

## What was kept, exactly

- The live URLs that carry the store's content: `/`, `/about/`, `/shop/`, `/faqs/`, `/contact/`, `/connect/`, `/subscribe/`.
- Every sentence of the store's own copy on those pages (home welcome and Flower Bar paragraph, the About story, mission,
  values, products and community sections, every FAQ question and answer, the contact copy), except the rewrites listed
  in `docs/CHANGE-LOG.md` ("Copy that changed": clichés the brief asked to drop, and phrases New York's advertising
  rules no longer allow).
- The store's own embedded online menu, its own YouTube video, its logo (vectorised from the live file), the brass
  gold `#B79B65` and the Poppins body face.
- The 21+ gate (now with the pickup / in-store choice) and the "You must be 21 years old to enter." line.

## What is new

- Information architecture built on a market-leading dispensary pattern: Shop Cannabis split from Shop Lifestyle,
  one in-site page per menu category, an education journal, a list page in place of a membership programme, a store
  page, The Crew, legal and compliance pages.
- Founders' mission front and centre on the home page (Mike Golden and co-founder Cage, The Higher Calling, Stop the
  Stigma, CAURD), plus the five pillars: Legacy to Legal, The Flower Bar, Downtown Syracuse Local, Good People, New
  York Pride.
- A full design system ("Gallery meets block party"), a scroll-built THC monogram, a 3D monogram on a gallery plinth,
  a magnifier lens over trichome macros, a full-screen night storefront, and a sticky quick-action bar (Shop Now, Call,
  Directions, Today's Hours).
- New York compliance on every page: licensee name and licence number, the required warning and a rotating warning in
  the bright yellow box, the HOPEline, and a link to the state's licence verification.
- Generated imagery (labelled "AI illustration" on the page, in alt text and in file metadata) where the live site only
  had theme placeholders. None of it shows the real store, staff, customers or products.

## Confirm with the client

Each item also sits as a `[CONFIRM WITH CLIENT]` comment in the page source where it applies.

1. **Menu store name.** The embedded menu is the store's own, but its store profile at the menu provider still carries
   another business name, which shows in the menu's cart. Rename the profile and its announcement text to The Higher
   Company in the provider's back office (cannot be changed from the website).
2. **Licence on the site.** OCM lists The Higher Company LLC, OCM-CAURD-24-000155, at 123 E Willow St (shown). Another
   licensee markets the same address under its own licence number. Confirm the name and number to display.
3. **Sunday hours.** Footer and contact say 11am to 6pm (shown site-wide); the FAQ and the OCM record say 10am to 8pm;
   online ordering says 12pm to 6pm.
4. **Delivery.** The FAQ says "We currently do not offer delivery"; the OCM record carries a delivery flag.
5. **Instagram.** The old handle is dead; the footer icon is a placeholder until the new one is confirmed.
6. **Joe Sweet.** Role or title for the About quote (OCM lists him as the licence's primary contact). The quote's first
   sentence was trimmed as a wellness claim.
7. **Compliance trims** to the client's copy ("Potent", "effective", "smoking sessions legendary", "goodies", the
   well-being sentence): approve or adjust.
8. **Discounts.** The FAQ says state rules bar discounts on cannabis; OCM's revised rules (effective Dec 3, 2025) allow
   some with conditions. Confirm the policy.
9. **Topicals.** Named in the About copy, absent from the online menu today (no shop page built).
10. **People.** Founder and budtender photos and bios. Cage's first name is deliberately not printed (sources disagree).
11. **Merch.** Line-up, garment types, sizes, colours, prices and photos for the THC monogram snapback and the Lady
    Liberty graphic. The Liberty graphic shows smoking, so the site names it but does not show it.
12. **Photos.** Replace the AI storefront and interior illustrations with real photos of 123 E Willow St.
13. **Forms.** Choose a form service and an email/SMS list provider (forms currently open an email to the store).
14. **Legal review** of the privacy notice, terms of use and compliance page.
15. **Story timeline.** Wording; the Stop the Stigma rally year is omitted (sources disagree).
16. **Domain.** OCM's data lists thehighercompanyllc.com; the live site and OCM's public list use thehigherco420.com
    (canonical URLs use the latter).
17. **Payment.** The FAQ lists cash, debit, Apple Pay and Dutchie Pay (and credit at pickup for pre-orders); the online
    menu lists debit, pay by bank and cash.

## Defects found on the live site

- The header logo is a broken placeholder image on every page, and every nav label except "About" is empty.
- 23 of the 30 URLs in the sitemap are WordPress theme demo pages (beauty services, music-award posts) indexed under
  the brand, including a page titled "Need Weed? We Deliver!" while the FAQ says there is no delivery.
- The Subscribe and Contact forms render no visible fields.
- The home page "Our Products" section, the Gallery and the Media pages render empty.
- No licence number, required warning or HOPEline text appears anywhere in the live HTML; New York requires them on
  advertising, websites included, under the rules in effect since Dec 3, 2025.
- Three different sets of hours across the site and its records.
- Home says "Syracuse's leading downtown" dispensary while About says "Syracuse's second downtown".
- The Instagram link is dead; every image slot except the logo is a theme placeholder.

## Verification

See `audit/gate.json`, `audit/reports/` and the publish log in `docs/PUBLISH.md` for the measured results of this
build (gate verdict, parity, fabrication, decontamination, sweeps, the live-menu check and the preview check).
