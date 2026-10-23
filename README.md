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

## Structure

```
index.html            Home: hero, signature platters, all-day specials, story, good to know, private dining, visit + parking
menu.html             Full menu with photos, prices, section tabs and search
private-dining.html   Private dining & groups (2–40 guests) with enquiry form
book.html             BookingHero widget (same one the current site uses) + hours and contact
assets/css/style.css  All styles. Colours and fonts are the variables at the top (:root)
assets/js/main.js     Mobile nav, hero loader, open-now status, menu search + tabs, enquiry form, map loader, scroll reveal
assets/js/map.js      Map style and markers (colours are the C object at the top)
assets/vendor/maplibre  MapLibre GL JS 4.7.1 (BSD-3 licence); only loads when the map scrolls near
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
- **Hero, "anatomy of a platter":** a huge THE SHELL wordmark in Anton (echoing the heavy condensed lettering of their logo) with the platter overlapping it like a magazine cover. Pointer lines in the style of the engraved sketches name what's on the plate, and draw themselves in on load (skipped if the visitor prefers reduced motion). On phones the labels turn into a numbered key. While the platter photo loads (slow mobile connections), a plate-rim loader turns in its place; the intro only plays once the image is fully decoded, and if the image fails the loader rim stays as a quiet placeholder. To swap the photo, the pins and lines in the hero SVG and the `.l1`–`.l5` label positions need moving to match.
- **Imagery:** the restaurant's own dish cutouts float on navy. Private dining uses the room photos with the glass-fish chandeliers.
- **Phones:** a fixed Call / Book a table bar, platters as a swipeable row, menu tabs that follow your scroll.
- **Map:** MapLibre vector map with free OpenFreeMap street data (no API key, no cookies). Every layer is recoloured to the site: navy land and buildings, blue-grey streets, deep sea-green parks, badge-blue water. A coral pin holds the lobster badge, and Russell Square and Holborn stations get Tube roundels. One finger scrolls the page on phones; two fingers move the map. If WebGL or the scripts are blocked, the panel shows an "Open in Google Maps" link instead.

## Everyday updates

| What | Where |
|---|---|
| Dishes and prices | `menu.html` (each `.menu-section`). Platter and specials prices on `index.html` too |
| Opening hours | Footer and Visit section on every page, the hours table in `book.html`, the JSON-LD, and `OPEN` / `CLOSE` at the top of the "Open now" block in `assets/js/main.js` |
| New dish photo | Save to `assets/img/menu/` as `dish-name-320.webp` and `dish-name-640.webp` (square) |
| CSS / JS changes | Bump `style.css?v=9` / `main.js?v=2` in all four pages so visitors don't get a cached copy |

## Deploy

Any static host works:

- **Netlify** or **Cloudflare Pages**: upload the folder; `_redirects` is picked up automatically.
- **Vercel**: run `npx vercel` in the folder; uses `vercel.json`.
- **GitHub Pages**: works for a demo, but doesn't support the redirects.

## Internal notes

The review of the current site, the items to confirm with the client and the pitch material are kept locally in `.private/` (git-ignored, never committed).

After cloning, enable the git hooks:

```
git config core.hooksPath .githooks
```

Commits and pushes are then blocked if they include `.private/` or a phrase from `.private/blocklist.txt`, and the open to-dos in `.private/NOTES.md` are printed. To see them any time: `sh .githooks/remind.sh`
