# Change log

One row per section of the source site, generated from `audit/change-control.json` by `tools/docs-changelog.mjs`.
The live site had 30 URLs: 7 carried the store's own content and were kept on the same URLs; the rest were theme demo pages or empty pages (removed, each URL kept as a redirect page).

## Legend
- **PRESERVE**: kept as-is; content and function unchanged
- **IMPROVE**: same content and meaning, better structure, hierarchy or design
- **REPLACE**: superseded by a better structure (reason required)
- **REMOVE**: deliberately dropped (reason required)
- **ADD**: new section that did not exist on the source

## Decisions: kept pages

| page | section | decision | narrative slot | why |
|---|---|---|---|---|
| / | Your Premier Destination for Quality Cannabis in Downtown Syracuse, NY | IMPROVE | value-proposition | Hero rebuilt as the Liberty art + monogram hero; H1 "The Higher Co." and the subline kept verbatim; the YouTube background video becomes a click-to-play film on The Flower Bar page. |
| / | Make The Higher Choice! | IMPROVE | trust-positioning | Welcome, Flower Bar and three-feature copy kept; "ganja gurus", "spreading the love" and "legendary smoking sessions" rewritten (operator brief + 9 NYCRR 129.2(b)(4)); the five pillars added. |
| / | Our Products | REPLACE | benefits-solution | The live "Our Products" block rendered empty; replaced by the six categories the online menu carries, each linking to an in-site category page that opens straight to products with a working cart. |
| / | Stay Connected | IMPROVE | strategic-cta | "Stay Connected" kept as the Join the List band. |
| / | Unlock Exclusive Offers & More | IMPROVE | strategic-cta | "Unlock Exclusive Offers & More / Join" kept, linking to /subscribe/. |
| / | l-section wpb_row height_small width_full color_footer-bottom | IMPROVE | footer | Footer rebuilt: address, hours, licence, NY OCM warnings, socials. |
| /about | Pioneering a New Era in Cannabis | IMPROVE | trust-positioning | About copy kept on the same URL as Our Story; 'Pioneering a New Era in Cannabis' and 'Our Story' now share one band (both headings and every sentence kept); founders, The Higher Calling and Stop the Stigma added from declared facts; "Potent" and the quote's well-being sentence trimmed (9 NYCRR 129.2(b)(9),(13)) [CONFIRM WITH CLIENT]. |
| /about | l-section wpb_row height_small color_secondary | IMPROVE | benefits-solution | Mission, values, products and community sections kept and restyled. |
| /about | l-section wpb_row height_small width_full color_footer-bottom | IMPROVE | footer | Shared footer. |
| /connect | l-section wpb_row height_huge | IMPROVE | strategic-cta | Connect copy and Name / Email / Message form kept; the form now opens a pre-filled email to the store (no backend) [CONFIRM WITH CLIENT form provider]. |
| /connect | l-section wpb_row height_small width_full color_footer-bottom | IMPROVE | footer | Shared footer. |
| /contact | l-section wpb_row us_custom_46b994a9 height_medium | IMPROVE | strategic-cta | Contact copy, phone and email kept. |
| /contact | l-section wpb_row us_custom_0e1e04c8 height_medium | IMPROVE | strategic-cta | The location, phone and hours cards are merged into one visit bar (same address, the same Google directions link, Call 315-870-7140, live open/closed status and the week's hours); the mail and social cards kept; the Leaflet map becomes a click-to-load map plus directions links. |
| /contact | l-section wpb_row height_small width_full color_footer-bottom | IMPROVE | footer | Shared footer. |
| /faqs | l-section wpb_row height_huge | IMPROVE | objection-handling | Every live question and answer kept verbatim as an accessible accordion (all start closed), with a jump-to index of the questions; FAQPage JSON-LD. |
| /faqs | l-section wpb_row height_small width_full color_footer-bottom | IMPROVE | footer | Shared footer. |
| /shop | l-section wpb_row height_huge | IMPROVE | benefits-solution | The live embedded menu kept, opened on all products, framed as Shop Cannabis with category chips. |
| /shop | l-section wpb_row height_small width_full color_footer-bottom | IMPROVE | footer | Shared footer. |
| /subscribe | Stay connected and get the latest updates! | IMPROVE | strategic-cta | Kept as Join the List (no rewards programme exists). |
| /subscribe | l-section wpb_row height_huge | IMPROVE | strategic-cta | The live form rendered no fields; rebuilt with name, email and a 21+ confirmation, sent by email until a list provider is chosen [CONFIRM WITH CLIENT]. |
| /subscribe | l-section wpb_row height_small width_full color_footer-bottom | IMPROVE | footer | Shared footer. |

## Decisions: added pages

| page | decision | narrative slot | why |
|---|---|---|---|
| /shop/flower/ | ADD | benefits-solution | Shop Cannabis category page: the store's own menu opened on Flower, so the category button lands on products with a working cart. |
| /shop/pre-rolls/ | ADD | benefits-solution | Category page: menu opened on Pre-Rolls. |
| /shop/vaporizers/ | ADD | benefits-solution | Category page: menu opened on Vaporizers. |
| /shop/concentrates/ | ADD | benefits-solution | Category page: menu opened on Concentrates. |
| /shop/edibles/ | ADD | benefits-solution | Category page: menu opened on Edibles. |
| /shop/accessories/ | ADD | benefits-solution | Category page: menu opened on Accessories. |
| /lifestyle/ | ADD | benefits-solution | Shop Lifestyle: merch drops (in store only, 9 NYCRR 129.2(j)) and the accessories shelf, split from Shop Cannabis per the adopted IA. |
| /the-flower-bar/ | ADD | trust-positioning | The Flower Bar: 90 strains, smell and view the trichomes with a magnifying glass (live claims), the store's own video. |
| /about/the-crew/ | ADD | trust-positioning | The Crew: founders and budtenders, no invented names or photos [CONFIRM WITH CLIENT]. |
| /journal/ | ADD | benefits-solution | Journal hub (adopted IA: education journal). |
| /journal/what-are-trichomes/ | ADD | benefits-solution | Journal: trichomes, written from general botany, no health claims. |
| /journal/indica-sativa-hybrid/ | ADD | benefits-solution | Journal: strain types. |
| /journal/first-visit-guide/ | ADD | objection-handling | Journal: first-visit guide from the live FAQ facts. |
| /journal/new-york-cannabis-laws/ | ADD | objection-handling | Journal: NY cannabis laws, cited to statute and OCM, reviewed 2026-11-10. |
| /visit/ | ADD | strategic-cta | Visit Us: address, hours, parking, ID, payment, pickup rules. |
| /legal/ | ADD | footer | Legal hub. |
| /legal/privacy/ | ADD | footer | Privacy notice for this site [CONFIRM WITH CLIENT legal review]. |
| /legal/terms/ | ADD | footer | Terms of use [CONFIRM WITH CLIENT legal review]. |
| /legal/compliance/ | ADD | footer | NY OCM compliance: licence, required warnings, HOPEline, verification. |
| /legal/accessibility/ | ADD | footer | Accessibility statement. |
| /404.html | ADD | footer | Not-found page. |

## Decisions: removed pages (grouped by URL)

Every section of these pages is recorded as REMOVE in the ledger with the reason below. The preset answers recorded for
these rows in `audit/preset-match.json` only close the matcher's queue; no section was built for them.

| page | sections | decision | why |
|---|---|---|---|
| /alpha-classics-artists-named-polar-music-prize-winners | 2 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /arcana-wins-the-choral-award-at-the-2022-icmas | 2 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /author/admin | 8 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /category/uncategorized | 8 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /delivery | 2 | REMOVE | The live page is titled "Need Weed? We Deliver!" but its body is theme demo text, and the live FAQ says "We currently do not offer delivery". URL redirects to that FAQ answer. |
| /gallery | 6 | REMOVE | The live Gallery page shows a heading and three attachment cards with no images; nothing to carry. URL redirects to The Flower Bar, which carries the store's own video. |
| /media | 1 | REMOVE | The live Media page is empty. URL redirects to the Journal. |
| /music-for-lovers-our-valentines-day-promotion | 2 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /outhere-music-receives-four-award-nominations | 2 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /retail-space | 2 | REMOVE | Title "Retail Space Coming Soon" over theme demo text. URL redirects home. |
| /sample-page-2 | 2 | REMOVE | A theme "Coming Soon" placeholder. URL redirects home. |
| /services/beauty-treatments | 14 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /services/body-recovery | 14 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /services/cosmetics-and-care | 14 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /services/eyelash-extensions | 14 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /services/flowers-in-your-eyes | 14 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /services/makeup | 14 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /services/moon-swing | 14 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /services/new-cats-turbo | 14 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /services/our-little-big | 14 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /services/rocky-mountain | 14 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /services/skin-care | 14 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |
| /services/streetball-with-guys | 14 | REMOVE | Theme demo filler shipped with the WordPress theme (music-award posts / beauty-service pages / archive stubs), not The Higher Company's content; republishing it under the brand would mislead. URL kept as a redirect page. |

## Copy that changed

AI may tighten wording. It may not change meaning, and it may not add a fact. Every rewrite keeps its original here.

| where | original | rewritten | reason |
|---|---|---|---|
| Home, Top-Notch Vibes | We’re all about keeping it chill and spreading the love. | We’re all about keeping it chill and making everyone feel welcome. | Operator brief: drop the cliché. |
| Home, Joint Masters at Your Service | Our squad of ganja gurus knows their stuff! They’ll guide you through the magic world of cannabis and help you find your perfect match. | Our squad of budtenders knows their stuff! They’ll guide you through the world of cannabis and help you find your perfect match. | Operator brief: drop the cliché. |
| Home, Mind-Blowing Selection | Brace yourselves for an out-of-this-world collection of Adult-use recreational cannabis goodies. We’ve got everything you need to make your smoking sessions legendary! | Brace yourselves for an out-of-this-world collection of adult-use recreational cannabis. We’ve got everything you need, from the Flower Bar to the accessories shelf. | 9 NYCRR 129.2(b)(4) and (12): no promotion of overconsumption, no smoking imagery; "goodies" read as candy-adjacent (128.1(c)). |
| About, Our Products | Concentrates: Potent and pure extracts like wax, shatter, and oils. | Concentrates: Pure extracts like wax, shatter, and oils. | 9 NYCRR 129.2(b)(13): no potency promotion. [CONFIRM WITH CLIENT] |
| About, Our Products | Edibles: Tasty and effective options, from gummies to baked goods. | Edibles: Tasty options, from gummies to baked goods. | 9 NYCRR 129.2(b)(9): no efficacy or wellness claims. [CONFIRM WITH CLIENT] |
| About, quote | “We believe in the power of cannabis to enhance well-being and improve quality of life,” says Joe Sweet. “Our journey began with a passion for the plant …” | “Our journey began with a passion for the plant and a commitment to providing safe, accessible, and high-quality cannabis products to our community.” (Joe Sweet) | 9 NYCRR 129.2(b)(9): no wellness claims; second sentence kept verbatim. [CONFIRM WITH CLIENT] |
| FAQ, What are your hours? | Sunday: 10am – 8pm (FAQ) / Sunday: 11am – 6pm (footer, contact) | One set of hours site-wide, from the footer and contact page | The live site contradicted itself; one data source now drives every page. [CONFIRM WITH CLIENT] |

New copy on new pages (the Journal, The Flower Bar, The Crew, Visit Us, Join the List, Shop pages, legal pages) is
built only from `facts/client-facts.json`, the live site's own words, general botany, or New York statute and OCM
sources fetched on 2026-11-10 (cited on the page where it matters).

## Imagery

Nothing on the live site could be reused except the logo (in the 21+ gate image) and the store's own YouTube video:
every other image slot was a theme placeholder. The logo is vectorised from the client's own file
(`tools/trace-logo.py`, colour separation + potrace), never redrawn or AI-altered. The video plays from YouTube.

Generated with fal (FLUX1.1 [pro] Ultra stills, Recraft V4.1 vector, BiRefNet cut-outs, Bria eraser for two text
clean-ups, Kling 2.1 Pro loops). None depicts a real person, the real store, staff, customers or a real product:
each is labelled "AI illustration" on the page, carries `data-ai="generated"` and IPTC `trainedAlgorithmicMedia` in
its XMP, and is listed below with its request id. Real photos should replace the place images before launch.

| asset | what it shows | model / request id |
|---|---|---|
| storefront | a red-brick building at night, its tall arched shop windows glowing warm over a wet, empty street | fal-ai/bria/eraser 01a1c2c6-eeff-7c12-9688-410fa8f227d2 + fal-ai/flux-pro/v1.1-ultra 01a1c2c3-dc20-7400-a207-eb13713972bf |
| interior | a bright gallery-like shop with white walls, exposed red brick, light oak counters and lit glass display cases | fal-ai/bria/eraser 01a1c2c6-ef03-77e1-8485-009ef3a9e764 + fal-ai/flux-pro/v1.1-ultra 01a1c2c3-e4aa-7882-b19c-6e81400a7b63 |
| macro-a | extreme close-up of a cannabis flower covered in glistening trichomes, with orange pistils, on black | fal-ai/flux-pro/v1.1-ultra 01a1c2c4-08c1-7423-8281-4a0a17b898d3 |
| macro-b | a cured cannabis bud frosted with trichomes, some turning amber, lit in warm gold against black | fal-ai/flux-pro/v1.1-ultra 01a1c2c4-18f1-7a81-a251-98b6214d3642 |
| macro-c | trichome heads up close, like tiny clear and amber crystals, against a dark background | fal-ai/flux-pro/v1.1-ultra 01a1c2c4-31b1-7090-a14b-f78068ec8e56 |
| macro-v | the frosted tip of a cannabis flower with orange pistils, lit from above on black | fal-ai/flux-pro/v1.1-ultra 01a1c2c4-373a-7891-82ae-90ce96d01b1c |
| magnifier | a brass magnifying glass on a light oak counter beside a cannabis bud, under a warm spotlight | fal-ai/flux-pro/v1.1-ultra 01a1c2c4-44ee-75f0-bbd9-2959fe3cb739 |
| oak-jars | clear glass jars of cannabis flower lined up along a light oak counter under warm gallery light | fal-ai/flux-pro/v1.1-ultra 01a1c2c4-af62-7c23-9c9d-1ae346cd3b69 |
| plinth | an empty white gallery plinth under a single warm spotlight against an old red-brick wall | fal-ai/flux-pro/v1.1-ultra 01a1c2c4-9ff4-7202-a1bf-ef4e56b91b7c |
| brick | a black cast-iron column against weathered red brick at blue hour, warm window light at the edge | fal-ai/flux-pro/v1.1-ultra 01a1c2c4-ba4c-7b83-89e0-8cf058ccbb1b |
| blockparty | string lights zigzag over a red-brick street at dusk, a boombox and a crate of records waiting on a folding table | fal-ai/flux-pro/v1.1-ultra 01a1c2c6-ef03-72c1-9038-de375f6b3d6c |
| merch-mood | a plain black cap and a folded black t-shirt on a light oak bench in a white gallery room | fal-ai/flux-pro/v1.1-ultra 01a1c2c4-cad2-7701-adfc-9eb0bc5f4efb |
| storefront-tall | a red-brick building at night, its tall arched shop windows glowing warm over a wet street | fal-ai/bria/eraser 01a1c2c6-eeff-7c12-9688-410fa8f227d2 + fal-ai/flux-pro/v1.1-ultra 01a1c2c3-dc20-7400-a207-eb13713972bf |
| hero-golden | AI illustration of the red-brick building at 123 E Willow St at golden hour: arched windows, twin gables and a small cupola, the ground-floor shop windows glowing warm over an empty street | fal-ai/nano-banana-pro/edit 01a1c34a-699d-77e0-b624-330b56f3ca19 + local: tools/process-images.py clean_hero (OpenCV)  |
| hero-golden-tall | AI illustration of the red-brick building at 123 E Willow St at golden hour: arched windows, twin gables and a small cupola, the ground-floor shop windows glowing warm over an empty street | fal-ai/nano-banana-pro/edit 01a1c34a-699d-77e0-b624-330b56f3ca19 + local: tools/process-images.py clean_hero (OpenCV)  |
| hero-night | AI illustration of the red-brick building at 123 E Willow St at night: arched windows, twin gables and a small cupola against a deep blue sky, the ground-floor shop windows glowing warm over a wet street | fal-ai/nano-banana-pro/edit 01a1c3b8-1a98-7812-a6f8-d9e4911fa5f0 + local: tools/process-images.py (OpenCV inpaint)  |
| hero-night-tall | AI illustration of the red-brick building at 123 E Willow St at night: arched windows, twin gables and a small cupola against a deep blue sky, the ground-floor shop windows glowing warm over a wet street | fal-ai/nano-banana-pro/edit 01a1c3b8-1a98-7812-a6f8-d9e4911fa5f0 + local: tools/process-images.py (OpenCV inpaint)  |
| hands-l | two hands in rolled-up work-shirt sleeves, one denim and one flannel, reach toward each other, fingertips almost touching, drawn in fine banknote-style lines | fal-ai/nano-banana-pro 01a1c38b-b40c-7f41-9f66-9cba9d707a2a |
| hands-r |  | fal-ai/nano-banana-pro 01a1c38b-b40c-7f41-9f66-9cba9d707a2a |
| pillar-megaphone | a scuffed vintage red megaphone displayed on a white museum plinth behind a velvet rope | fal-ai/nano-banana-pro 01a1c3e2-2d54-7fa0-be88-142428fd9373 |
| pillar-jewel | a single frosty cannabis bud on a black velvet cushion in a glass display case, lit like a gemstone | fal-ai/nano-banana-pro 01a1c3e2-2d4f-7ab2-998a-43ecb0e7845b |
| pillar-snowglobe | a snow globe holding a tiny red-brick building with arched windows, twin gables and a cupola, on a museum plinth | fal-ai/nano-banana-pro 01a1c3e2-2d55-7141-ae2a-7337daa75485 |
| pillar-sommelier | a white-gloved hand presenting a glass jar of cannabis flower like a sommelier, a napkin over the forearm | fal-ai/nano-banana-pro 01a1c3e2-9de9-7270-a1a8-9423a90472bc |
| pillar-crown | a mint-green foam Statue of Liberty souvenir crown on a museum plinth behind a red velvet rope | fal-ai/nano-banana-pro 01a1c3e2-9e0b-7351-bd04-f517c01beb35 |
| photo-interior | Inside The Higher Co. at 123 E Willow St: the light-oak counter with the THC logo, glass display cases lit along both walls, black cast-iron columns and ring lights overhead | fal-ai/topaz/upscale/image 01a1c3f8-0a65-7b41-ac76-4fe87d8579c6 + local: tools/process-images.py indoor_light()  |
| photo-counter | Budtenders in black The Higher Co. shirts helping customers at the light-oak checkout counter, the lit THC sign on the wall behind them | fal-ai/topaz/upscale/image 01a1c3f8-022e-7fb2-a62b-e1b18236e80e + local: tools/process-images.py indoor_light()  |
| photo-display | A glass display case at The Higher Co. lined with gold velvet: a black THC snapback cap in the middle among edibles, tins and packs, gold hand sculptures, and the lit THC sign over glassware shelves on the back wall | fal-ai/topaz/upscale/image 01a1c418-bdbb-7b82-a7b3-8a0cae37d805 + local: tools/process-images.py indoor_light()  |
| cut-flower | a single frosted cannabis flower bud | fal-ai/birefnet/v2 01a1c2c9-b85a-77f2-aa47-4b97d0977dbb + fal-ai/flux-pro/v1.1-ultra 01a1c2c4-55de-7d72-aa35-62e362d6629d |
| cut-prerolls | three cone-shaped pre-rolls in natural brown paper | fal-ai/birefnet/v2 01a1c2c9-b85f-7603-955f-aee6d2c6c82d + fal-ai/flux-pro/v1.1-ultra 01a1c2c4-5e79-7770-a2ae-85bf25ad2d5f |
| cut-vapes | an unbranded glass vape cartridge filled with golden oil | fal-ai/birefnet/v2 01a1c2c9-b860-7360-9047-fbb7b40e8d25 + fal-ai/flux-pro/v1.1-ultra 01a1c2c4-74fe-7dc2-aa55-cb3a50f56d96 |
| cut-concentrates | shards of golden amber shatter beside a dollop of creamy badder | fal-ai/birefnet/v2 01a1c2c9-b858-7d50-8d60-b3838a486a92 + fal-ai/flux-pro/v1.1-ultra 01a1c2c4-7603-76c2-9dfb-ccaf96b4ccb7 |
| cut-edibles | squares of dark chocolate beside a small black tin | fal-ai/birefnet/v2 01a1c2c9-d345-7012-894b-9a27214aa375 + fal-ai/flux-pro/v1.1-ultra 01a1c2c4-7ffe-75f0-93ee-35086cede646 |
| cut-accessories | a brass herb grinder beside a clear glass hand pipe | fal-ai/birefnet/v2 01a1c2c9-d3af-7c30-8502-c376804f4092 + fal-ai/flux-pro/v1.1-ultra 01a1c2c4-98e1-7dc1-9cb6-41ac4a72bf5a |
| cat-flower | a clear glass jar with a brass lid, filled to the brim with green cannabis buds | fal-ai/flux-pro/v1.1-ultra 01a1c442-f511-7b80-9bb5-d1322f10d249 + fal-ai/birefnet/v2 01a1c444-a265-7972-bcd0-a08b5e2c94d4 |
| cat-prerolls | a single cone pre-roll with a kraft paper tip, standing at a slant | fal-ai/flux-pro/kontext 01a1c443-6190-7352-918f-33117a5807d3 + fal-ai/birefnet/v2 01a1c444-a265-7132-b15a-7bac01ce2c89 |
| cat-vapes | a slim black vape pen with a clear cartridge of golden oil | fal-ai/flux-pro/v1.1-ultra 01a1c442-f511-7bf3-ba1e-79162257ee50 + fal-ai/birefnet/v2 01a1c444-a266-7c93-ada5-ab233fbfa8ee |
| cat-concentrates | a small glass jar with a brass lid, filled with golden cannabis budder | fal-ai/flux-pro/v1.1-ultra 01a1c443-2255-7702-b8ca-b74e3ade17c8 + fal-ai/birefnet/v2 01a1c444-a25e-7782-b874-a46240d41f59 |
| cat-edibles | a clear glass jar with a brass lid, filled with sugar-coated fruit gummies | fal-ai/flux-pro/v1.1-ultra 01a1c443-3247-7930-9dd3-4be9951e50f5 + fal-ai/birefnet/v2 01a1c444-a265-76d3-b036-368bf9565ab2 |
| cat-accessories | a polished brass herb grinder with a knurled rim | fal-ai/flux-pro/v1.1-ultra 01a1c443-4e6a-7f62-95dd-033ea04f904e + fal-ai/birefnet/v2 01a1c444-a266-70c3-8285-9efca34380ea |
| drop-cap | AI illustration of the THC Monogram Snapback: a black snapback with the white THC monogram and a gold-bordered The Higher Co. patch | fal-ai/flux-pro/kontext 01a1c4ae-be48-7210-9b19-bdcc573375cf + fal-ai/birefnet/v2 01a1c4af-a89b-7240-8c8b-59b3c2db498d |
| drop-tee | AI illustration of the Lady Liberty Graphic tee: a folded black T-shirt printed with Lady Liberty in mint, crowned with cannabis leaves, raising an open hand in a wave | operator mockup (chat image, 2026-11-10), origin unconfirmed  + fal-ai/flux-pro/kontext 01a1c522-42f0-7c53-98ff-ba70dd661b7d + fal-ai/birefnet/v2 01a1c525-0c46-7443-9b0b-902cd025460d |
| join-sky | the Statue of Liberty flashing a peace sign beside the Lower Manhattan skyline at sunset | operator image (chat, 2026-11-10), origin unconfirmed  + fal-ai/topaz/upscale/image 01a1c52d-999a-70a0-af62-eca06778adfd |
| join-sky-tall | the Statue of Liberty flashing a peace sign beside the Lower Manhattan skyline at sunset | operator image (chat, 2026-11-10), origin unconfirmed  + fal-ai/topaz/upscale/image 01a1c52d-999a-70a0-af62-eca06778adfd |
| liberty | an original line drawing of the Statue of Liberty raising her torch, in mint on black | fal-ai/recraft/v4.1/text-to-vector 01a1c2c3-9caa-7cc3-af6a-0de80bc67978 |
| vid-storefront | AI-generated loop: mist and light shimmer outside a red-brick building at night | fal-ai/kling-video/v2.1/pro/image-to-video 01a1c2c9-e757-70c2-b43f-4b2f35b96a0e |
| vid-macro | AI-generated loop: light glints across the trichomes of a cannabis flower | fal-ai/kling-video/v2.1/pro/image-to-video 01a1c2c9-d46d-7a23-ad89-ac21585eb051 |
