import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(await fs.readFile(path.join(root, "site.config.json"), "utf8"));

const rawBase = (process.env.BASE_PATH || "/").trim();
const basePath = rawBase === "/" || rawBase === "" ? "" : `/${rawBase.replace(/^\/+|\/+$/g, "")}`;
const origin = config.site.url.replace(/\/+$/, "");
const siteRoot = `${origin}${basePath}/`;

const ssr = await import(pathToFileURL(path.join(root, ".cache/ssr/entry-server.js")).href);
const availability = ssr.availability;
const template = await fs.readFile(path.join(root, "dist/index.html"), "utf8");

// Above-the-fold type is the LCP element on most pages. Preload the two
// variable faces so the first paint uses the intended typeface and the LCP
// candidate is not deferred behind CSS/font discovery.
const assetFiles = await fs.readdir(path.join(root, "dist/assets"));
const findAsset = (prefix) =>
  assetFiles.find((file) => file.startsWith(prefix) && file.endsWith(".woff2"));
const fontPreloads = ["newsreader-latin-wght-normal", "inter-latin-wght-normal"]
  .map(findAsset)
  .filter(Boolean)
  .map(
    (file) =>
      `<link rel="preload" href="${basePath}/assets/${file}" as="font" type="font/woff2" crossorigin />`,
  )
  .join("\n    ");

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const localizedPath = (pagePath, lang) => {
  const prefix = lang === "zh" ? "/zh" : "";
  const normalised = pagePath === "/" ? "" : pagePath.replace(/\/+$/, "");
  return `${prefix}${normalised}/` || "/";
};

const canonical = (pagePath, lang) => {
  const localised = localizedPath(pagePath, lang);
  return localised === "/" ? `${origin}${basePath}/` : `${origin}${basePath}${localised}`;
};

const outputPath = (pagePath, lang) => {
  const localised = localizedPath(pagePath, lang);
  const rel = localised.replace(/^\/+|\/+$/g, "");
  return rel ? path.join(root, "dist", rel, "index.html") : path.join(root, "dist", "index.html");
};

const isIndexable = (key) => availability[key] !== false;
const fullTitle = (title) => `${title} — ${config.site.name}`;

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
}

function replaceNameMeta(html, name, content, insert = false) {
  const pattern = new RegExp(`<meta\\s+name="${name}"[\\s\\S]*?/>`);
  const tag = `<meta name="${name}" content="${esc(content)}" />`;
  if (pattern.test(html)) return html.replace(pattern, tag);
  return insert ? html.replace("</head>", `    ${tag}\n  </head>`) : html;
}

function replacePropertyMeta(html, property, content) {
  const pattern = new RegExp(`<meta\\s+property="${property}"[\\s\\S]*?/>`);
  return html.replace(pattern, `<meta property="${property}" content="${esc(content)}" />`);
}

function replaceCanonical(html, href) {
  const pattern = /<link\s+rel="canonical"[^>]*\/?>/;
  if (!href) return html.replace(pattern, "");
  const tag = `<link rel="canonical" href="${esc(href)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function buildJsonLd() {
  const person = {
    "@type": "Person",
    "@id": `${siteRoot}#person`,
    name: config.profile.displayName,
    url: siteRoot,
    jobTitle: config.profile.role.en,
    description: config.pages.find((page) => page.key === "home")?.description.en,
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: config.profile.affiliation.en,
    },
    sameAs: [config.profile.links.github].filter(Boolean),
  };
  const website = {
    "@type": "WebSite",
    "@id": `${siteRoot}#website`,
    url: siteRoot,
    name: config.site.name,
    inLanguage: config.site.locales,
    publisher: { "@id": `${siteRoot}#person` },
  };
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [person, website] }, null, 2);
}

/**
 * Compose a fully static page: pre-rendered app markup plus matching head.
 */
function composePage(html, meta) {
  const alternates = meta.indexable
    ? [
        `<link rel="alternate" hreflang="en" href="${esc(canonical(meta.pagePath, "en"))}" />`,
        `<link rel="alternate" hreflang="zh" href="${esc(canonical(meta.pagePath, "zh"))}" />`,
        `<link rel="alternate" hreflang="x-default" href="${esc(canonical(meta.pagePath, "en"))}" />`,
      ].join("\n    ")
    : "";

  let out = html.replace(/<html lang="[^"]*"/, `<html lang="${meta.langAttribute}"`);
  out = out.replace(/\s*<link rel="alternate" hreflang="[^"]+" href="[^"]*"\s*\/>/g, "");
  out = replaceTitle(out, meta.title);
  out = replaceNameMeta(out, "description", meta.description);
  out = replaceNameMeta(out, "robots", meta.robots);
  out = replaceNameMeta(out, "googlebot", meta.robots, true);
  out = replacePropertyMeta(out, "og:title", meta.title);
  out = replacePropertyMeta(out, "og:description", meta.description);
  out = replacePropertyMeta(out, "og:url", meta.canonical || siteRoot);
  out = replacePropertyMeta(out, "og:image", meta.image);
  out = replacePropertyMeta(out, "og:image:alt", `${config.site.name} — academic portfolio`);
  out = replacePropertyMeta(out, "og:locale", meta.ogLocale);
  out = replacePropertyMeta(out, "og:locale:alternate", meta.ogLocaleAlternate);
  out = replaceNameMeta(out, "twitter:title", meta.title);
  out = replaceNameMeta(out, "twitter:description", meta.description);
  out = replaceNameMeta(out, "twitter:image", meta.image);
  out = replaceCanonical(out, meta.canonical);

  out = out.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${buildJsonLd()}\n    </script>`,
  );

  if (alternates) {
    out = out.replace("</head>", `    ${alternates}\n  </head>`);
  }
  if (fontPreloads) {
    out = out.replace("</head>", `    ${fontPreloads}\n  </head>`);
  }

  // The application markup replaces the empty mount node. Keep a single root.
  out = out.replace(/<div id="root">[\s\S]*?<\/div>\s*<noscript>/, `<div id="root">${meta.html}</div>\n    <noscript>`);
  return out;
}

function pageMeta(page, lang) {
  const title = fullTitle(page.title[lang]);
  const description = page.description[lang];
  const indexable = isIndexable(page.key);
  return {
    pagePath: page.path,
    langAttribute: lang === "zh" ? "zh-CN" : "en",
    title,
    description,
    canonical: canonical(page.path, lang),
    robots: indexable ? "index, follow" : "noindex, nofollow",
    image: `${origin}${basePath}${config.site.ogImage}`,
    ogLocale: lang === "zh" ? "zh_CN" : "en_US",
    ogLocaleAlternate: lang === "zh" ? "en_US" : "zh_CN",
    indexable,
  };
}

async function renderPage(page, lang) {
  const meta = pageMeta(page, lang);
  const html = await ssr.render(localizedPath(page.path, lang), lang);
  const output = composePage(template, { ...meta, html });
  const file = outputPath(page.path, lang);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, output, "utf8");
  return { ...meta, file };
}

const written = [];
for (const page of config.pages) {
  for (const lang of config.site.locales) {
    written.push(await renderPage(page, lang));
  }
}

// 404: one static shell, no canonical, no hreflang, no indexing.
const notFoundHtml = await ssr.render("/404", "en");
const notFound = {
  title: fullTitle(config.notFound.title.en),
  description: config.notFound.description.en,
  robots: "noindex, nofollow",
  langAttribute: "en",
  pagePath: "/404",
  indexable: false,
  canonical: "",
  image: `${origin}${basePath}${config.site.ogImage}`,
  ogLocale: "en_US",
  ogLocaleAlternate: "zh_CN",
  html: notFoundHtml,
};
await fs.writeFile(path.join(root, "dist/404.html"), composePage(template, notFound), "utf8");
written.push({ ...notFound, file: path.join(root, "dist/404.html") });

// Sitemap: only pages with public content.
const sitemapEntries = [];
for (const page of config.pages) {
  if (!isIndexable(page.key)) continue;
  for (const lang of config.site.locales) {
    sitemapEntries.push(
      `  <url>\n    <loc>${esc(canonical(page.path, lang))}</loc>\n    <lastmod>${config.site.updated}</lastmod>\n  </url>`,
    );
  }
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join("\n")}\n</urlset>\n`;
await fs.writeFile(path.join(root, "dist/sitemap.xml"), sitemap, "utf8");

const robots = `User-agent: *\nAllow: /\nDisallow: /*?demo=1\n\nSitemap: ${siteRoot}sitemap.xml\n`;
await fs.writeFile(path.join(root, "dist/robots.txt"), robots, "utf8");

const indexableCount = written.filter((entry) => entry.indexable).length;
console.log(
  `prerender: ${written.length} pages written (${indexableCount} indexable), sitemap ${sitemapEntries.length} URLs, 404 shell ready`,
);
