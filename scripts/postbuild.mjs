import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const indexFile = path.join(dist, "index.html");
const html = await readFile(indexFile, "utf8");

const siteUrl = "https://aomk20201110-commits.github.io";
const base = (process.env.BASE_PATH || "/").replace(/\/+$/, "/");
const rootUrl = `${siteUrl}${base}`;

const homeDesc =
  "Academic portfolio of Yurripe, an undergraduate in Electronic Science and Technology at Nanjing University of Posts and Telecommunications, working on terahertz electromagnetics, metasurfaces, microfluidic sensing and scientific computing.";

const routes = [
  { dir: "", segment: "", title: "Fields, surfaces & signals", desc: homeDesc },
  {
    dir: "research",
    segment: "research/",
    title: "Research",
    desc: "Research directions in terahertz electromagnetics, metasurfaces, microfluidic sensing, computational electromagnetics and scientific computing — with an interactive array-factor model.",
  },
  {
    dir: "publications",
    segment: "publications/",
    title: "Publications",
    desc: "A verified archive of papers, preprints and conference records. Entries are listed only once they are public.",
  },
  {
    dir: "projects",
    segment: "projects/",
    title: "Projects",
    desc: "Engineering work, experiments and computational tools, documented as they become shareable.",
  },
  {
    dir: "honors",
    segment: "honors/",
    title: "Honors",
    desc: "Confirmed academic milestones, awards and the current degree programme.",
  },
  {
    dir: "cv",
    segment: "cv/",
    title: "Curriculum vitae",
    desc: "One-page academic CV, generated from the site content and available as a PDF.",
  },
  {
    dir: "about",
    segment: "about/",
    title: "About",
    desc: "About Yurripe's academic background, research interests, and the design and engineering behind this site.",
  },
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceMeta(source, pattern, value) {
  if (!pattern.test(source)) {
    throw new Error(`postbuild: head tag not found for replacement: ${pattern}`);
  }
  return source.replace(pattern, value);
}

function renderRoute({ title, desc, segment }) {
  const fullTitle = `${title} — Yurripe`;
  const canonical = `${rootUrl}${segment}`;
  let page = html;

  page = replaceMeta(page, /<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);
  page = replaceMeta(
    page,
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta\n      name="description"\n      content="${escapeHtml(desc)}"\n    />`,
  );
  page = replaceMeta(
    page,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`,
  );
  page = replaceMeta(
    page,
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta\n      property="og:description"\n      content="${escapeHtml(desc)}"\n    />`,
  );
  page = replaceMeta(
    page,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${canonical}" />`,
  );
  page = replaceMeta(
    page,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`,
  );
  page = replaceMeta(
    page,
    /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/,
    `<meta\n      name="twitter:description"\n      content="${escapeHtml(desc)}"\n    />`,
  );
  page = replaceMeta(
    page,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonical}" />`,
  );

  return page;
}

for (const route of routes) {
  const page = renderRoute(route);
  const target = path.join(dist, route.dir, "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, page, "utf8");
}

// The SPA fallback: any unknown path gets the shell, but must not be indexed.
const notFound = replaceMeta(
  html,
  /<meta\s+name="robots"\s+content="[^"]*"\s*\/>/,
  `<meta name="robots" content="noindex, nofollow" />`,
)
  .replace(/<title>[^<]*<\/title>/, "<title>Signal lost — Yurripe</title>")
  .replace(/<link rel="canonical" href="[^"]*" \/>/, "");
await writeFile(path.join(dist, "404.html"), notFound, "utf8");

for (const route of routes) {
  const size = (await stat(path.join(dist, route.dir, "index.html"))).size;
  console.log(
    `postbuild: ${route.segment || "/"} -> ${(size / 1024).toFixed(1)} kB`,
  );
}
console.log(`postbuild: dist/index.html is ${(html.length / 1024).toFixed(1)} kB`);
