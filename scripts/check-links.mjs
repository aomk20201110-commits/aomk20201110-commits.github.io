import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const config = JSON.parse(await fs.readFile(path.join(root, "site.config.json"), "utf8"));
const origin = config.site.url.replace(/\/+$/, "");

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

async function walk(dir) {
  const output = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...(await walk(full)));
    else output.push(full);
  }
  return output;
}

const files = await walk(dist);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const htmlByPath = new Map();

for (const file of htmlFiles) {
  const relative = path.relative(dist, file).replace(/\\/g, "/");
  const route = relative === "index.html" ? "/" : `/${relative.replace(/\/index\.html$/, "/").replace(/index\.html$/, "")}`;
  const html = await fs.readFile(file, "utf8");
  htmlByPath.set(route, { file, html, relative });
}

function resolveTarget(pageRoute, href) {
  const url = new URL(href, `${origin}${pageRoute}`);
  if (url.origin !== origin) return null;
  const pathname = decodeURIComponent(url.pathname);
  let candidate;
  if (pathname.endsWith("/")) candidate = path.join(dist, pathname.slice(1), "index.html");
  else candidate = path.join(dist, pathname.slice(1));
  return { url, pathname, candidate };
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

for (const [route, page] of htmlByPath) {
  const { html, relative } = page;

  // Internal links must resolve to a built file.
  const hrefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const href of hrefs) {
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("data:") ||
      href.startsWith("javascript:")
    ) {
      continue;
    }
    const target = resolveTarget(route, href);
    if (!target) continue;
    const ok = await exists(target.candidate);
    if (!ok) fail(`${relative}: broken internal link ${href}`);
  }

  // Each page needs a title and description.
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
  const description = html.match(/<meta\s+name="description"[^>]*content="([^"]*)"/)?.[1];
  if (!title) fail(`${relative}: missing title`);
  if (!description) fail(`${relative}: missing description`);

  const canonicalTags = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map((m) => m[1]);
  const robots = html.match(/<meta\s+name="robots"[^>]*content="([^"]*)"/)?.[1] || "";
  const hreflang = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];

  if (route === "/404.html") {
    if (robots !== "noindex, nofollow") fail("404.html: must be noindex");
    if (canonicalTags.length) fail("404.html: canonical should be omitted");
  } else {
    if (canonicalTags.length !== 1) fail(`${relative}: expected one canonical, found ${canonicalTags.length}`);
    if (canonicalTags[0] && !canonicalTags[0].startsWith(`${origin}${config.site.url.endsWith("/") ? "" : ""}`)) {
      fail(`${relative}: canonical does not use the configured origin`);
    }
    if (robots.includes("noindex") && hreflang.length) {
      warnings.push(`${relative}: noindex page also declares hreflang alternates`);
    }
    if (!robots.includes("noindex") && hreflang.length !== 3) {
      fail(`${relative}: indexable page should declare en, zh and x-default hreflang (found ${hreflang.length})`);
    }
  }

  // Root pages are the only ones allowed to omit the /index.html suffix.
  if (!relative.endsWith("index.html") && relative !== "404.html") {
    warnings.push(`${relative}: non-standard html path`);
  }
}

// Compare sitemap URLs with indexable canonical URLs.
const sitemap = await fs.readFile(path.join(dist, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const canonicalUrls = new Set();
for (const [route, page] of htmlByPath) {
  if (route === "/404.html") continue;
  const canonical = page.html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const robots = page.html.match(/<meta\s+name="robots"[^>]*content="([^"]*)"/)?.[1] || "";
  if (canonical && !robots.includes("noindex")) canonicalUrls.add(canonical);
}

for (const url of sitemapUrls) {
  if (!canonicalUrls.has(url)) fail(`sitemap.xml: ${url} is not an indexable prerendered canonical URL`);
}
for (const url of canonicalUrls) {
  if (!sitemapUrls.includes(url)) fail(`sitemap.xml: missing indexable URL ${url}`);
}

const robotsTxt = await fs.readFile(path.join(dist, "robots.txt"), "utf8");
if (!robotsTxt.includes("Disallow: /*?demo=1")) fail("robots.txt: demo preview URL must not be indexable");

const htmlCount = htmlFiles.length;
if (!htmlByPath.has("/")) fail("missing dist/index.html");
if (!htmlByPath.has("/404.html")) fail("missing dist/404.html");

if (warnings.length) {
  console.log(`warnings (${warnings.length})`);
  for (const warning of warnings) console.log(`  - ${warning}`);
}

if (errors.length) {
  console.error(`link/static checks: ${errors.length} error(s)`);
  for (const error of errors.slice(0, 40)) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(
  `link/static checks: ${htmlCount} html files, ${canonicalUrls.size} indexable URLs, ${sitemapUrls.length} sitemap URLs — ok`,
);
