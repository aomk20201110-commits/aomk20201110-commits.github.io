import { mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { withChrome } from "./lib/chrome.mjs";

await mkdir("public", { recursive: true });

await withChrome(async ({ context }) => {
  const card = await context.newPage();
  await card.setViewportSize({ width: 1200, height: 630 });
  await card.goto(pathToFileURL(path.resolve("scripts/og.html")).href, { waitUntil: "load" });
  await card.evaluate(() => document.fonts.ready);
  await card.waitForTimeout(250);
  await card.screenshot({ path: "public/og.png" });
  console.log("og: wrote public/og.png (1200×630)");

  const icon = await context.newPage();
  await icon.setViewportSize({ width: 180, height: 180 });
  await icon.goto(pathToFileURL(path.resolve("public/favicon.svg")).href, { waitUntil: "load" });
  await icon.screenshot({ path: "public/apple-touch-icon.png", omitBackground: true });
  console.log("og: wrote public/apple-touch-icon.png (180×180)");
});
