/**
 * Build the self-hosted Latin subsets used by src/styles/fonts.css.
 *
 * The site ships a handful of variable/static faces from Fontsource, but each
 * Latin face carried the full Fontsource glyph set (~47-58 kB for the variable
 * text faces). The visible copy uses a small, stable alphabet, so we subset
 * each face to the characters that actually appear in the built copy plus the
 * usual printers' punctuation. Re-run this script after changing public copy:
 *
 *   npm run fonts:subset
 *
 * Variable axes are kept (subset-font instantiates nothing unless asked), so
 * font-weight ranges in fonts.css still animate as before. Greek symbols
 * (Δ γ λ ω and the rest of the alphabet) live in Inter's Greek face, which is
 * declared separately in fonts.css with a Greek unicode-range.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "src", "assets", "fonts");
const moduleDir = path.join(root, "node_modules");

const faces = [
  {
    output: "inter-latin-subset.woff2",
    source: "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
    charset: "latin",
  },
  {
    output: "inter-greek-subset.woff2",
    source: "@fontsource-variable/inter/files/inter-greek-wght-normal.woff2",
    charset: "greek",
  },
  {
    output: "newsreader-latin-subset.woff2",
    source:
      "@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2",
    charset: "latin",
  },
  {
    output: "space-grotesk-latin-subset.woff2",
    source:
      "@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
    charset: "latin",
  },
  {
    output: "instrument-serif-400-subset.woff2",
    source:
      "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2",
    charset: "latin",
  },
  {
    output: "instrument-serif-400-italic-subset.woff2",
    source:
      "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2",
    charset: "latin",
  },
  {
    output: "ibm-plex-mono-400-subset.woff2",
    source:
      "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2",
    charset: "latin",
  },
  {
    output: "ibm-plex-mono-500-subset.woff2",
    source:
      "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2",
    charset: "latin",
  },
];

const sourceFile = /\.(ts|tsx|css|json|html)$/;
const skipDirs = new Set([
  "node_modules",
  "dist",
  ".git",
  ".cache",
  "public",
  "screenshots",
  ".screenshots",
]);

async function collectSourceFiles(dir, files = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) await collectSourceFiles(full, files);
    } else if (sourceFile.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

// Typographic punctuation and symbols seen in copy or likely to appear when a
// sentence is reworded. Including them costs a handful of glyphs and prevents
// a reinstated em dash from silently falling back to a system serif.
const extra = `\u00a0\u00a9\u00ae\u00b0\u00b1\u00b2\u00b3\u00b5\u00b7\u00d7\u00f7\u2013\u2014\u2018\u2019\u201c\u201d\u2020\u2021\u2022\u2026\u2030\u2032\u2033\u2044\u20ac\u2116\u2122\u2190\u2191\u2192\u2193\u2194\u2212\u221a\u221d\u221e\u2248\u2260\u2261\u2264\u2265\u25c8\u2080\u2081\u2082\u2083\u2084\u2085\u2086\u2087\u2088\u2089\u0391\u0392\u0393\u0394\u0395\u0396\u0397\u0398\u0399\u039a\u039b\u039c\u039d\u039e\u039f\u03a0\u03a1\u03a3\u03a4\u03a5\u03a6\u03a7\u03a8\u03a9\u03b1\u03b2\u03b3\u03b4\u03b5\u03b6\u03b7\u03b8\u03b9\u03ba\u03bb\u03bc\u03bd\u03be\u03bf\u03c0\u03c1\u03c3\u03c4\u03c5\u03c6\u03c7\u03c8\u03c9\u03c2\u1f00\u2202\u2207`;

// Latin/Latin-1/Latin Extended, plus the punctuation, arrows, maths and
// geometric-symbol blocks that appear in copy. Everything from CJK radicals
// (U+2E80) upwards is left to the system fallback, as before.
const SYMBOL_BLOCK_START = 0x2000;
const SYMBOL_BLOCK_END = 0x2e80;

function isLatinRelevant(codePoint) {
  if (codePoint < 0x370) return codePoint >= 0x20;
  return codePoint >= SYMBOL_BLOCK_START && codePoint < SYMBOL_BLOCK_END;
}

function decodeEntities(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

/** Visible text of the prerendered pages, with markup and code stripped. */
function htmlText(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

async function collectRenderedText() {
  const distDir = path.join(root, "dist");
  let entries;
  try {
    entries = await fs.readdir(distDir, { recursive: true });
  } catch {
    return null;
  }
  const pages = entries.filter((entry) => entry.endsWith(".html"));
  if (pages.length === 0) return null;
  const parts = [];
  for (const page of pages) {
    parts.push(htmlText(await fs.readFile(path.join(distDir, page), "utf8")));
  }
  return parts.join("\n");
}

async function collectSourceTexts() {
  const files = await collectSourceFiles(root);
  const parts = [];
  for (const file of files) parts.push(await fs.readFile(file, "utf8"));
  return parts;
}

async function main() {
  // Prefer the prerendered text: it is exactly what a visitor reads, so the
  // subset covers every glyph in rendered copy while skipping code identifiers
  // and comments. Before the first build, fall back to the source strings.
  const rendered = await collectRenderedText();
  const characters = new Set(extra);

  for (let codePoint = 0x20; codePoint <= 0x7e; codePoint += 1) {
    characters.add(String.fromCodePoint(codePoint));
  }
  // A small set of accented Latin letters that may appear in names or words;
  // everything else outside actual copy falls back to the next family.
  for (const character of "éèêëàâäáãåçñôöòóõøœæüûùúíìîïýÿß") {
    characters.add(character);
  }

  const texts = rendered ? [rendered] : await collectSourceTexts();
  for (const text of texts) {
    for (const character of text) {
      const codePoint = character.codePointAt(0) ?? 0;
      if (isLatinRelevant(codePoint)) characters.add(character);
      else if (codePoint >= 0x370 && codePoint < 0x400) characters.add(character);
    }
  }

  const latinText = [...characters]
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return isLatinRelevant(codePoint) && codePoint < 0x370;
    })
    .concat(
      [...characters].filter((character) => {
        const codePoint = character.codePointAt(0) ?? 0;
        return (
          codePoint >= SYMBOL_BLOCK_START && codePoint < SYMBOL_BLOCK_END
        );
      }),
    )
    .join("");
  const greekText = [...characters]
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint >= 0x370 && codePoint < 0x400;
    })
    .join("");

  // Fonts only add glyphs they contain, so a charset with letters they lack
  // (Greek in the Latin faces) simply leaves those code points out.
  const charsets = { latin: latinText, greek: greekText };

  await fs.mkdir(outDir, { recursive: true });

  let inputTotal = 0;
  let outputTotal = 0;
  for (const face of faces) {
    const sourcePath = path.join(moduleDir, face.source);
    const input = await fs.readFile(sourcePath);
    const output = await subsetFont(input, charsets[face.charset], {
      targetFormat: "woff2",
    });
    await fs.writeFile(path.join(outDir, face.output), output);
    inputTotal += input.length;
    outputTotal += output.length;
    process.stdout.write(
      `${face.output.padEnd(42)} ${String(input.length).padStart(7)} -> ${String(output.length).padStart(6)} bytes\n`,
    );
  }

  process.stdout.write(
    `\n${faces.length} faces, ${(inputTotal / 1024).toFixed(1)} KiB -> ${(outputTotal / 1024).toFixed(1)} KiB ` +
      `(latin charset ${latinText.length} chars, greek ${greekText.length} chars)\n`,
  );

  await copyLicences();
}

async function copyLicences() {
  const licenceDir = path.join(outDir, "licenses");
  await fs.mkdir(licenceDir, { recursive: true });
  const licences = [
    ["@fontsource-variable/inter/LICENSE", "OFL-Inter.txt"],
    ["@fontsource-variable/newsreader/LICENSE", "OFL-Newsreader.txt"],
    ["@fontsource-variable/space-grotesk/LICENSE", "OFL-SpaceGrotesk.txt"],
    ["@fontsource/instrument-serif/LICENSE", "OFL-InstrumentSerif.txt"],
    ["@fontsource/ibm-plex-mono/LICENSE", "OFL-IBMPlexMono.txt"],
  ];
  for (const [from, to] of licences) {
    const text = await fs.readFile(path.join(moduleDir, from), "utf8");
    await fs.writeFile(path.join(licenceDir, to), text);
  }
}

await main();
