# Yurripe — academic portfolio

A personal academic site for **Yurripe**, an undergraduate in Electronic Science and Technology at Nanjing University of Posts and Telecommunications (expected graduation 2029). The site is an intentional working notebook: research directions, a live array-factor model, publications, projects, honours and a one-page CV, in English and Chinese.

Live site: <https://aomk20201110-commits.github.io/>

## Stack

| Layer | Choice |
| --- | --- |
| App | React 19 + TypeScript, Vite 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Motion | Motion (`motion/react`), CSS transitions |
| 3D | Three.js + React Three Fiber (lazy-loaded hero field) |
| Routing | React Router 7, SPA fallback via `dist/404.html` |
| i18n | i18next + react-i18next (English default, Chinese toggle) |
| Deploy | GitHub Actions → GitHub Pages |

All visual material is original: the hero is a custom point-cloud interference shader, the research glyphs are hand-authored SVG, and the array-factor panel computes a normalised uniform-array pattern in the browser. No stock imagery or template components are used.

## Local development

Requires Node 22 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # TypeScript project build
npm run build      # typecheck + production build + 404.html
npm run preview    # preview the production build
```

## Editing content

Personal information is deliberately centralised. Unknown fields stay `null` and are hidden — nothing is invented.

| What | Where |
| --- | --- |
| Name, handle, affiliation, graduation, links | `src/data/profile.ts` |
| Research directions | `src/data/research.ts` |
| Publications | `src/data/publications.ts` |
| Projects | `src/data/projects.ts` |
| Education and honours | `src/data/honors.ts` |
| Demo-only sample entries | `src/data/samples.ts` |
| Navigation | `src/navigation.ts` |
| English / Chinese UI copy | `src/i18n/locales/en.ts`, `src/i18n/locales/zh.ts` |

Publications, projects and honours start empty by design. They only list public, verifiable entries. Append records in the data files; empty states disappear automatically.

`?demo=1` renders clearly labelled sample entries so the layout can be reviewed before real records exist. Demo pages are `noindex` and the banner can be dismissed. Never ship demo mode as the default.

## Internationalisation

English is the default language. The selected language is stored in `localStorage` under `yr.lang`; the document `lang` attribute and all page metadata follow it. Every user-facing string comes from the dictionaries, and structured content uses `Localized<T> = { en: T; zh: T }` (`src/lib/localized.ts`). Add a language by extending that type and the `i18n` initialisation.

## CV PDF

The CV page is print-styled (A4, light background). To regenerate `public/cv/Yurripe-CV.pdf`:

```bash
npm run cv:pdf
```

The script loads the built site through Playwright, switches to print media and writes the PDF. It needs a Chromium browser. On machines where Node cannot spawn Chrome directly, start Chrome yourself with remote debugging and pass `CDP_URL`:

```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  -ArgumentList "--headless=new","--remote-debugging-port=9333","--user-data-dir=$PWD\.cache\chrome"
$env:CDP_URL = "http://127.0.0.1:9333"
npm run cv:pdf
```

The scripts serve `dist/` through Playwright request interception (`scripts/lib/site.mjs`), so no local port is required.

## Visual QA

```bash
npm run shots   # writes .screenshots/ for 1440, 1024, 768 and 390 px
```

The sweep captures every page in English and Chinese, checks for horizontal overflow, exercises navigation, the language toggle, the array-factor controls, the mobile menu, reduced motion and preview mode, and fails on layout errors. `npm run og:image` regenerates the 1200×630 social card.

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which installs with `npm ci`, builds, configures Pages and deploys the `dist` artifact. In the repository settings, **Pages → Source** must be set to **GitHub Actions** once (the workflow also requests automatic enablement).

`BASE_PATH` is derived from the repository name:

- `<owner>.github.io` → site served from `/`
- any other repository → site served from `/<repo>/`

For a custom domain, add a `public/CNAME` file and update `profile.siteUrl`, `public/robots.txt` and `public/sitemap.xml`.

## Content policy

- No unpublished manuscripts, raw research data or private files are published here.
- Diagrams are conceptual models unless explicitly labelled otherwise; the array-factor panel is a mathematical model, not measured data.
- Unknown information is omitted rather than inferred. Contact is currently handled through GitHub.

## Structure

```
src/
  components/
    lab/          interactive array-factor model
    layout/       navbar, footer, page shell, scroll progress
    sections/     hero, research glyphs
    three/        WebGL hero field
    ui/           shared primitives, metadata, toggles, states
  data/           centralised, typed content
  i18n/           dictionaries and initialisation
  lib/            locale, motion, media query, preview helpers
  pages/          seven routes + 404
  styles/         Tailwind theme and base styles
public/           favicon, social image, CV PDF, robots, sitemap
scripts/          build post-processing, CV, OG image, QA
```

Fonts are bundled with Fontsource (Space Grotesk, Inter, Instrument Serif, IBM Plex Mono) under the SIL Open Font License. Code and original artwork © Yurripe.
