# line-drive-digital

Eleventy site for Line Drive Digital.

## Getting Started
```
npm install
```

## Development
```
npm start
```
Runs `eleventy --serve` plus watchers that auto-format and lint CSS/JS on save.

## Deployment
```
npm run build
```
Output goes to `_site/`. Netlify config lives in `src/_redirects` and `src/_headers`.

## Structure
- `src/_includes/layout.html` – the only layout: `<head>`, header/nav, footer, JSON-LD
- `src/index.html`, `src/<page>/index.html` – page content (HTML with front matter, formatted by Prettier)
- `src/_includes/` is excluded from Prettier (it would mangle Liquid tags); keep its indentation by hand
- `src/css/styles.css` – ordered `@import` list; PostCSS bundles it to `_site/css/styles.css`. New CSS files must be added here.
- `src/js/script.js` – all page JS (work filters, contact form demo)
- `src/fonts/` – self-hosted Latin woff2 (Inter, Outfit, IBM Plex Mono, Adamina)
- `src/_data/site.json` – site name, URL, description
- `_src/` – original static design export and logo SVGs, kept for reference

New top-level pages need `eleventyNavigation` front matter (`key`, `order`) to show in the nav.

## Images
```
{% image "images/photo.jpg", "Alt text" %}
{% image "images/photo.jpg", "Alt text", { hero: true, isFirstHero: true } %}
```

## Before launch
- Replace every `[PLACEHOLDER]` (prices, email, phone, hours, client names, results, photos).
- Connect the contact form to a handler (e.g. Netlify Forms).
- Add a social preview image and `og:image` tags.
