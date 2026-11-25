import { readFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
  ".webmanifest": "application/manifest+json",
};

function contentType(file) {
  return MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
}

async function readDist(pathname) {
  let candidate = pathname === "/" ? "/index.html" : pathname;
  if (candidate.endsWith("/")) candidate += "index.html";
  try {
    return { body: await readFile(path.join(dist, candidate)), file: candidate };
  } catch {
    // SPA fallback: unknown routes are handled by the client router.
    return { body: await readFile(path.join(dist, "index.html")), file: "/index.html" };
  }
}

/**
 * Serve the built site to a Playwright page without opening a network socket.
 * Requests to the SITE_ORIGIN host are fulfilled from dist/; everything else is
 * left alone. This is how visual checks run in environments that forbid listening
 * on a local port.
 */
export async function serveDist(page, origin = process.env.SITE_ORIGIN || "http://yurripe.local") {
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) {
      await route.continue();
      return;
    }
    const { body, file } = await readDist(decodeURIComponent(url.pathname));
    await route.fulfill({ status: 200, body, headers: { "content-type": contentType(file) } });
  });
  return origin;
}
