import { mkdir, stat } from "node:fs/promises";
import { withChrome } from "./lib/chrome.mjs";
import { serveDist } from "./lib/site.mjs";

await mkdir("public/cv", { recursive: true });

await withChrome(async ({ context }) => {
  const page = await context.newPage();
  const origin = await serveDist(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const response = await page.goto(`${origin}/cv`, { waitUntil: "networkidle" });
  if (!response || !response.ok()) {
    throw new Error(`Could not load ${origin}/cv (status ${response?.status()})`);
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: "public/cv/Yurripe-CV.pdf",
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  const info = await stat("public/cv/Yurripe-CV.pdf");
  if (info.size < 20000) {
    throw new Error(`Generated PDF looks empty (${info.size} bytes)`);
  }
  console.log(`cv: wrote public/cv/Yurripe-CV.pdf (${(info.size / 1024).toFixed(1)} kB)`);
});
