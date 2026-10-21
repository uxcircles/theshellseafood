# The Shell — website redesign

A redesign concept for [The Shell Seafood Restaurant](https://www.theshellseafood.com/), a French-style seafood and steak restaurant at 124 Southampton Row, Holborn, London WC1B 5AA. Built as plain HTML, CSS and JavaScript, with no build step.

**Pages:** Home · Menu · Private dining · Book a table

> **Concept design:** this is a redesign proposal by [UX CIRCLES](https://ux-circles.com/web), not The Shell's official website. Every page has a "Concept" bar, carries `noindex`, and `robots.txt` blocks crawlers so it doesn't compete with the real site in search.
> If the restaurant adopts it: delete the `.concept-bar` block on each page, remove `<meta name="robots" content="noindex, nofollow">`, and change `robots.txt` to `Allow: /`.

## Run locally

```bash
python3 .claude/serve.py
```

Then open http://localhost:5179. (Any static file server works; this one just turns off caching.) The booking widget and map only load over http(s), not when you double-click the HTML files.

## What this fixes on the current site

Reviewed on theshellseafood.com (Wix) in October 2026:

| # | Problem | What the redesign does |
|---|---|---|
| 1 | Home page hours read **"12.00am – 23.00pm"**, which means midnight to 11pm. The contact page says 12:00–23:00 | One set of hours everywhere (12 noon – 11pm), plus a live "Open now" status worked out on London time |
| 2 | Footer on every page says **"© 2035 by The Pizza Shop"** (Wix template leftover) | Correct footer |
| 3 | The Contact page lives at **`/副本-about`** ("copy of about" in Chinese), and the "About" page is titled "CONTACT" in some places | Clear pages and URLs; old URLs redirect (see `_redirects` / `vercel.json`) |
| 4 | **Specials are poster images only**: no text for screen readers or Google, and too small to read on a phone | Specials are real text with prices on the home page |
| 5 | **BOOKING sends guests off-site** to an unbranded page whose browser tab reads "My ASP.NET Application" | Booking page on the site with the same BookingHero widget embedded, plus hours, phone and a large-group route |
| 6 | The home page "Top 1 in 2024" text **cuts off mid-sentence**: "We are ...." | Rewritten |
| 7 | Several H1s per page (the logo, "Join seafood paradise…", "For promotions & offers"); address, phone and hours are all H2s | One H1 per page and a proper heading structure |
| 8 | Menu photos load from originals up to **10 MB each**; the menu page is 30,000 px tall on a phone | 320/640 px WebP thumbnails (≈30 KB), two-column list, sticky section tabs and search |
| 9 | Parking guide and private dining photos are only images, and the parking details sit inside a JPEG | Parking info as text in the Visit section; private dining has its own page |
| 10 | Group and private dining bookings say "email us" but give no form | Enquiry form that opens a pre-filled email (no backend needed) |
| 11 | Structured data is generic | `SeafoodRestaurant` JSON-LD with address, coordinates, phone, hours and menu link |
| 12 | Google reviews icon links to a giant Google search URL for "the shell 评价" | Socials link to Instagram, Facebook and Tripadvisor directly |

## Structure

```
index.html            Home: hero, signature platters, all-day specials, story, good to know, private dining, visit + parking
menu.html             Full menu with photos, prices, section tabs and search
private-dining.html   Private dining & groups (2–40 guests) with enquiry form
book.html             BookingHero widget (same one the current site uses) + hours and contact
assets/css/style.css  All styles. Colours and fonts are the variables at the top (:root)
assets/js/main.js     Mobile nav, open-now status, menu search + tabs, enquiry form, scroll reveal
assets/img/           Photos (WebP), cutout dishes, logo badge, og.jpg share image
assets/img/menu/      Menu thumbnails, 320 and 640 px squares, named after the dish
favicon.png, apple-touch-icon.png, robots.txt
_redirects            Old Wix URLs → new pages (Netlify / Cloudflare Pages)
vercel.json           Same redirects + cache headers (Vercel)
```

Photos, the logo and the hand-drawn crab, fish, shrimp and squid illustrations all come from theshellseafood.com. The illustrations are recoloured into two versions: navy for cream sections and light blue for navy sections (`assets/img/sketch-*-ink.webp` / `-light.webp`).

## Design direction

- **Colours:** deep navy and the cyan from The Shell's lobster badge, the lobster-orange from the current site's "A seafood lover's paradise!" script, and an oyster-shell cream for light sections.
- **Type:** Anton (hero wordmark), Fraunces (headings, with italic for accents) and Figtree (body). Both SIL Open Font License, loaded from Google Fonts.
- **Illustrations:** the current site's hand-drawn seafood sketches return as quiet accents: beside headings, peeking from section edges, and next to Starters / Chilled platters / Grilled fish / Linguine on the menu. They're decorative only (empty `alt`), so screen readers skip them.
- **Hero, "anatomy of a platter":** a huge THE SHELL wordmark in Anton (echoing the heavy condensed lettering of their logo) with the platter overlapping it like a magazine cover. Pointer lines in the style of the engraved sketches name what's on the plate, and draw themselves in on load (skipped if the visitor prefers reduced motion). On phones the labels turn into a numbered key. To swap the photo, the pins and lines in the hero SVG and the `.l1`–`.l5` label positions need moving to match.
- **Imagery:** the restaurant's own dish cutouts float on navy. Private dining uses the room photos with the glass-fish chandeliers.
- **Phones:** a fixed Call / Book a table bar, platters as a swipeable row, menu tabs that follow your scroll.
- **Map:** OpenStreetMap embed (no API key, no cookies).

## To confirm before going live

- [ ] **Opening hours**: the site uses Monday–Sunday 12:00–23:00 (from the current contact page). Confirm, especially last orders
- [ ] **Tripadvisor claim**: "Top seafood on Tripadvisor, London 2024" restates the current site's "Top 1 seafood restaurant on Trip Advisor in 2024". Confirm the exact wording of the award
- [ ] **Booking widget**: the widget says groups over 12 should call; the site sends 13+ to the private dining enquiry. Confirm the cut-off
- [ ] **Private dining**: "2–40 guests" comes from the current site. Are there set menus or a minimum spend to mention?
- [ ] **Menu prices** are copied from theshellseafood.com/menus (October 2026). The "Lobster Linguine" description differs between the menu (half lobster) and the specials poster (half lobster + king prawns); the specials text follows the poster
- [ ] **Illustration licence**: confirm where the crab / fish / shrimp / squid drawings came from and that the licence covers web use
- [ ] **Newsletter**: the current "Subscribe" box is left out. Add it back if they actively send offers
- [ ] **French and Chinese versions** (`/fr`, `/zh`) aren't redesigned yet
- [ ] When moving to the real domain, update `canonical`, `og:url`, `og:image` and the JSON-LD URLs (currently `https://uxcircles.github.io/theshellseafood/`)

## Everyday updates

| What | Where |
|---|---|
| Dishes and prices | `menu.html` (each `.menu-section`). Platter and specials prices on `index.html` too |
| Opening hours | Footer and Visit section on every page, the hours table in `book.html`, the JSON-LD, and `OPEN` / `CLOSE` at the top of the "Open now" block in `assets/js/main.js` |
| New dish photo | Save to `assets/img/menu/` as `dish-name-320.webp` and `dish-name-640.webp` (square) |
| CSS / JS changes | Bump `style.css?v=1` / `main.js?v=1` in all four pages so visitors don't get a cached copy |

## Deploy

Any static host works:

- **Netlify** or **Cloudflare Pages**: upload the folder; `_redirects` is picked up automatically.
- **Vercel**: run `npx vercel` in the folder; uses `vercel.json`.
- **GitHub Pages**: works for a demo, but doesn't support the redirects.
