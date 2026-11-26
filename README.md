# Yurripe — academic portfolio

A personal academic site for **Yurripe**, an undergraduate in Electronic Science and Technology at Nanjing University of Posts and Telecommunications (expected graduation 2029). It is a working notebook rather than a finished record: research directions, two inspectable computational models, a CV, and only the public records that actually exist.

Live site: <https://aomk20201110-commits.github.io/>

## Stack

| Layer | Choice |
| --- | --- |
| App | React 19 + TypeScript, Vite 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`), CSS custom properties for dark/light |
| Motion | Motion (`motion/react`), CSS transitions, reduced-motion fallbacks |
| 3D / field | Three.js + React Three Fiber, delayed and optional; static SVG field plate is the default fallback |
| Routing | React Router 7, URL-based locale prefix `/zh` |
| i18n | i18next + react-i18next, English default, Chinese at `/zh/**` |
| Math | KaTeX for the coupled-mode model |
| Rendering | Build-time static HTML for all routes + client-side mount |
| Deploy | GitHub Actions → GitHub Pages |

All visual material is original. The hero field plate is hand-authored SVG (interference contours, a concrete megastructure, two travellers); the live version is a custom point-cloud shader. The array-factor and resonance panels are computed models, not measurements. No stock imagery or template components.

## Local development

Requires Node 22 or newer.

```bash
npm install
npm run dev          # http://localhost:5173
npm run check        # TypeScript project build
npm run build        # typecheck → client build → SSR build → static prerender
npm run preview      # preview dist (a port is required)
```

`npm run build` writes static, per-route HTML to `dist/` (English + `/zh/`, plus `404.html`, `sitemap.xml`, `robots.txt`). Interactive panels are hydrated by a normal client mount; the static HTML is generated from the same component tree so crawlers and no-JS readers see the content.

## Editing content

Everything public comes from one source of truth: **`site.config.json`**.

| What | Where |
| --- | --- |
| Name, handle, affiliation, links, default locale, site URL | `site.config.json` → `profile`, `site` |
| Page titles, descriptions, paths | `site.config.json` → `pages` |
| CV PDF path | `site.config.json` → `cv.pdf` |
| Research directions | `src/data/research.ts` |
| Publications / projects / honours / education | `src/data/publications.ts`, `projects.ts`, `honors.ts` |
| Demo-only sample entries | `src/data/samples.ts` |
| UI copy (en / zh) | `src/i18n/locales/en.ts`, `src/i18n/locales/zh.ts` |

Publications, projects and honours are intentionally empty. They appear in navigation only once a real entry is added, and their pages are marked `noindex` until then. Add a record, rebuild, and the empty state disappears automatically.

`?demo=1` shows clearly labelled sample entries for layout review. Demo pages are `noindex`, are never entered into the sitemap, and the banner can be dismissed.

Unknown or private information is left `null` / omitted. The site contains no real name beyond the public handle, no email address, no marks, no awards, no unpublished manuscripts and no raw research data.

## Internationalisation and SEO

- English lives at `/`, `/research/`, …; Chinese at `/zh/`, `/zh/research/`, …
- The URL decides the language; no stored language preference can desynchronise a page from its canonical URL.
- `scripts/prerender.mjs` writes one static HTML file per locale and route, with unique title, description, canonical, Open Graph/Twitter tags, `hreflang` (`en`, `zh`, `x-default`) and structured data.
- Pages for empty sections are `noindex, nofollow` and excluded from `sitemap.xml`.
- The 404 page is `noindex` and carries no canonical.

## Theme

Dark is the default; a complete light "warm paper" theme is available from the header or footer. The choice is stored in `localStorage` under `yr.theme` and applied before paint. Chart colours, the field plate and the WebGL shader all read the same CSS variables, so figures stay legible in both themes.

## CV PDF

The CV page is print-styled (A4, light sheet). Regenerate `public/cv/Yurripe-CV.pdf` with:

```bash
npm run cv:pdf
```

The script loads the **built** site through Playwright, switches to print media and writes the PDF. On machines where Node cannot spawn Chrome, start Chrome with remote debugging and set `CDP_URL`:

```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  -ArgumentList "--headless=new","--remote-debugging-port=9333","--user-data-dir=$PWD\.cache\chrome"
$env:CDP_URL = "http://127.0.0.1:9333"
npm run cv:pdf
```

All browser tooling serves `dist/` through Playwright request interception (`scripts/lib/site.mjs`), so no local port is needed.

## Verification

```bash
npm run test:models   # array-factor + coupled-mode numerical checks
npm run test:links    # internal links, canonical/hreflang/sitemap/robots consistency
npm run qa            # Prerender + Playwright + axe checks across routes, locales, themes, motion, demo
npm run shots         # responsive screenshots → .screenshots/
npm run og:image      # regenerate the 1200×630 social card
```

`npm run qa` checks static HTML, unique metadata, hreflang, horizontal overflow, page errors, mobile navigation, theme persistence, URL-based locale switching, reduced motion, preview-mode indexability, both interactive models, serious/critical axe findings, and the no-JavaScript reading experience.

CI runs the build, numerical tests, link checks and the browser QA before deploying. A failing check blocks the deployment.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`: install → build → verify → configure Pages → deploy. In the repository settings, **Pages → Source** must be set to **GitHub Actions** once.

`BASE_PATH` is derived from the repository name:

- `<owner>.github.io` → served from `/`
- any other repository → served from `/<repo>/`

For a custom domain, add `public/CNAME`, update `site.config.json` (`site.url`) and rebuild. The canonical URLs, sitemap and robots file are generated from that single value.

## Structure

```
site.config.json     single source for site/profile/page metadata
src/
  components/
    lab/             array-factor + coupled-mode resonance models
    layout/          navbar, footer, page shell, scroll progress
    sections/        hero, field plate, research glyphs
    three/           WebGL hero field
    ui/              primitives, metadata, toggles, empty states
  data/              research and archive content
  i18n/              dictionaries and initialisation
  lib/               routing, SEO, content availability, theme, motion, preview
  models/            pure numerical models (array factor, resonance)
  pages/             seven routes + 404
  styles/            design tokens, dark/light themes, print rules
  entry-server.tsx   static render entry for prerender
public/              favicon, social card, CV PDF
scripts/             build/prerender, CV, OG, QA, tests
.github/workflows/   deploy pipeline
```

## Content policy

- No unpublished manuscripts, raw research data or private files are published.
- Every diagram is a conceptual or mathematical model unless explicitly labelled otherwise.
- Unknown information is omitted rather than inferred. Contact is handled through GitHub.
- The site follows the owner's public-information approval: public handle only, degree programme, expected graduation, city, research interests and GitHub profile.

Fonts are bundled with Fontsource (Newsreader, Space Grotesk, Inter, Instrument Serif, IBM Plex Mono) under the SIL Open Font License. Code and original artwork © Yurripe.
