import { copyFile, readFile, stat } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const indexFile = path.join(dist, "index.html");
const notFoundFile = path.join(dist, "404.html");

const html = await readFile(indexFile, "utf8");

// GitHub Pages serves 404.html for any unknown path. Copying the SPA shell lets
// the client-side router resolve deep links such as /research on a hard refresh.
await copyFile(indexFile, notFoundFile);

const size = (await stat(notFoundFile)).size;
console.log(`postbuild: wrote dist/404.html (${(size / 1024).toFixed(1)} kB)`);
console.log(`postbuild: dist/index.html is ${(html.length / 1024).toFixed(1)} kB`);
