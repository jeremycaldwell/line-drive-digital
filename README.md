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
Output goes to `_site/`. Netlify builds from `netlify.toml` (`npm run build`, publish `_site`, Node 22); redirects and headers live in `src/_redirects` and `src/_headers`.

The contact form uses Netlify Forms (`data-netlify="true"`, honeypot `bot-field`). Submissions show up under **Forms** in the Netlify dashboard once form detection is enabled for the site; set up email notifications there.

## Structure
- `src/_includes/layout.html` – the only layout: `<head>`, header/nav, footer, JSON-LD
- `src/index.html`, `src/<page>/index.html` – page content (HTML with front matter, formatted by Prettier)
- `src/_includes/` is excluded from Prettier (it would mangle Liquid tags); keep its indentation by hand
- `src/css/styles.css` – ordered `@import` list; PostCSS bundles it to `_site/css/styles.css`. New CSS files must be added here.

## CSS conventions
- **Tokens:** all colors, font families, font sizes, weights, spacing and radii live in `src/css/base/variables.css`. Use `var(--token)` everywhere else.
- **Spacing scale:** `--space-2`, `4`, `8`, `16`, `24`, `32`, `40`, `48`, `56`, `64` (plus `--hairline` for 1px grid lines). Margin, padding and gap must use these.
- **BEM:** `block__element--modifier`, kebab-case. One block per file in `src/css/components/` (`c-<block>.css`); layout objects (`container`, `section`, `grid`, `stack`, `cluster`) live in `src/css/layout/`.
- **No inline styles** in templates; add or extend a component instead.
- **Linting:** `npm run lint` runs stylelint, which enforces BEM class names, bans raw hex/rgb colors outside the tokens file, and requires tokens for spacing, font family, size and weight.
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
- Add a social preview image and `og:image` tags.
