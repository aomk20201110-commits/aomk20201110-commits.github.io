# Yurripe — academic portfolio

A personal academic site for **Yurripe**, an undergraduate in Electronic Science and Technology at Nanjing University of Posts and Telecommunications (2025 intake, expected graduation 2029). It is a working record, not a finished one: research directions, training records, verified honours and qualifications, a one-page CV, and two inspectable computational models.

Live site: <https://aomk20201110-commits.github.io/>

## What is here

| Route | Content |
| --- | --- |
| `/` | Seven-part home: profile, research focus, selected work, honours, interactive laboratory, academic timeline, CV & contact |
| `/research/` | Five research directions and two live numerical models |
| `/projects/` | Four public training records with method-level detail |
| `/projects/:id/` | Pre-rendered detail page for each record |
| `/honors/` | Journal-style record of 8 honours and 4 qualifications |
| `/cv/` | Print-first single-page CV and PDF download |
| `/about/` | Short profile, interests, public activities, colophon and content policy |
| `/notes/` | Reserved for research notes; hidden and `noindex` while empty |
| `/publications/` | Kept available, but hidden and `noindex` while there is no public entry |

Chinese translations live under `/zh/**`. English is the default.

## Stack

| Layer | Choice |
| --- | --- |
| App | React 19 + TypeScript, Vite 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`), CSS custom properties for dark/light |
| Motion | Motion (`motion/react`), CSS transitions, reduced-motion fallbacks |
| Field visual | Original SVG field plate; optional Three.js / React Three Fiber live field on capable desktops |
| Routing | React Router 7, URL-based locale prefix `/zh` |
| i18n | i18next + react-i18next, English default |
| Math | KaTeX for the coupled-mode model |
| Rendering | Build-time static HTML for every route + React hydration |
| Deploy | GitHub Actions → GitHub Pages |

All visual material is original: the field plate, the two traveller silhouettes, the array-factor and coupled-mode panels, and the typography system. No stock imagery or template components. Both interactive panels are computed models, not measurements, and say so in the interface.

## Architecture

- `scripts/prerender.mjs` writes one static HTML file per page, project detail and locale, with its own title, description, canonical URL, Open Graph/Twitter metadata, `hreflang` and JSON-LD.
- Empty or reserved sections are `noindex, nofollow`, omitted from `sitemap.xml`, and filtered out of navigation. Adding a real record rebuilds the navigation, sitemap and indexability automatically.
- The client loads only the current route’s page chunk, preloads it before `hydrateRoot`, and pulls in other pages on navigation. The WebGL hero and the two instruments are loaded only when needed.
- The theme is applied before paint from `localStorage` (`yr.theme`); chart colours, the field plate and the WebGL shader all read the same CSS variables.
- A no-JavaScript reader gets the complete text of every page from the static HTML.

## Local development

Requires Node 22 or newer.

```bash
npm install
npm run dev          # http://localhost:5173
npm run check        # TypeScript project build
npm run build        # typecheck → client build → SSR build → prerender
npm run preview      # preview dist on 127.0.0.1
```

`npm run build` writes roughly 25 HTML documents to `dist/` (seven sections × two locales, four project details × two locales, plus `404.html`), along with `sitemap.xml` and `robots.txt`.

## Editing content

Public content is split between one site configuration and typed data modules.

| What | Where |
| --- | --- |
| Site URL, languages, theme colours, default locale | `site.config.json` → `site` |
| Public handle, programme, years, city, links, research interests | `site.config.json` → `profile` |
| Page titles, descriptions, route indices | `site.config.json` → `pages` |
| CV PDF path | `site.config.json` → `cv.pdf` |
| Research directions | `src/data/research.ts` |
| Honours, education and categories | `src/data/honors.ts` |
| Language / computer qualifications | `src/data/certifications.ts` |
| Technical skills (no proficiency percentages) | `src/data/skills.ts` |
| Public activities | `src/data/service.ts` |
| Academic timeline | `src/data/timeline.ts` |
| Projects and public method records | `src/data/projects.ts` |
| Reserved research notes | `src/data/notes.ts` |
| UI copy (en / zh) | `src/i18n/locales/en.ts`, `zh.ts` |

Any unknown field stays `null` or is omitted. A record is added only when it is public and verifiable. The CMC entries are explicitly **First Prize, Provincial Level** — not national-final awards. The CV and the honours page state that dates without an explicit calendar year are shown by edition or academic year only.

## Privacy boundaries

The published record is limited to the public handle, university and programme, years, city, research interests, verified public honours and qualifications, public method-level training descriptions, and the GitHub profile. The repository intentionally contains no GPA, transcript, student number, real name, private email, phone number, school name, supervisor or team-member details, unpublished manuscripts, simulation source files, raw data or credentials.

Project detail pages describe methods, tools, validation habits and public boundaries only. They do not publish parameters, unpublished questions, results or source files. The same rule applies to the field plate and both interactive instruments: they are conceptual or mathematical models.

## CV PDF

The CV page is print-styled as a light A4 sheet. Regenerate the PDF with:

```bash
npm run cv:pdf
```

The script loads the **built** site through Playwright, switches to print media and writes `public/cv/Yurripe-CV.pdf`. On machines where Node cannot spawn Chrome, start Chrome with remote debugging and set `CDP_URL`:

```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  -ArgumentList "--headless=new","--remote-debugging-port=9333","--user-data-dir=$PWD\.cache\chrome"
$env:CDP_URL = "http://127.0.0.1:9333"
npm run cv:pdf
```

## Verification

```bash
npm run test:models   # array-factor and coupled-mode numerical checks
npm run test:links    # internal links, canonical/hreflang/sitemap/robots consistency
npm run qa            # prerender + Playwright + axe across routes, locales, themes, motion, demo
npm run shots         # responsive screenshots → .screenshots/
npm run og:image      # regenerate the 1200×630 social card
```

`npm run qa` checks static HTML, unique metadata, `hreflang`, horizontal overflow, page errors, mobile navigation, theme persistence, URL-based locale switching, reduced motion, preview-mode indexability, both models, serious/critical axe findings, and the no-JavaScript reading experience.

CI runs the build, numerical tests, link checks and browser QA before deploying. A failing check blocks deployment.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`: install → build → verify → configure Pages → deploy. **Pages → Source** must be set to **GitHub Actions** once in the repository settings.

`BASE_PATH` is derived from the repository name:

- `<owner>.github.io` → served from `/`
- any other repository → served from `/<repo>/`

For a custom domain, add `public/CNAME`, update `site.config.json` (`site.url`) and rebuild. Canonical URLs, the sitemap and robots all derive from that value.

## Structure

```text
site.config.json     single source for site/profile/page metadata
src/
  components/
    lab/             array-factor, coupled-mode and tabbed instrument
    layout/          navbar, footer, page shell, scroll progress
    sections/        hero, field plate, research glyphs
    three/           WebGL hero field (lazy, desktop-only)
    ui/              primitives, metadata, toggles, tabs, empty states
  data/              research, projects, honours, skills, service, timeline, notes
  i18n/              dictionaries and initialisation
  lib/               routing, SEO, page loaders, content availability, theme, motion
  models/            pure numerical models (array factor, resonance)
  pages/             seven sections, four project records, notes, 404
  styles/            design tokens, dark/light themes, print rules
  entry-server.tsx   static render entry for prerender
public/              favicon, social card, CV PDF
scripts/             build/prerender, CV, OG, QA, tests
.github/workflows/   deploy pipeline
```

## Notes

- The optional third coupled-mode explorer (two-mode anti-crossing) is not enabled; the site keeps two well-tested instruments rather than adding an unverified one.
- Preview mode (`?demo=1`) is for layout review only; demo pages are `noindex`, never enter the sitemap, and can be dismissed.
- Contact is handled through the public GitHub profile only.

Fonts are bundled with Fontsource (Newsreader, Space Grotesk, Inter, Instrument Serif, IBM Plex Mono) under the SIL Open Font License. Code and original artwork © Yurripe.
