import { mkdir } from "node:fs/promises";
import { withChrome } from "./lib/chrome.mjs";
import { serveDist } from "./lib/site.mjs";

const outDir = ".screenshots";
await mkdir(outDir, { recursive: true });

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const pages = [
  { path: "/", slug: "home" },
  { path: "/research", slug: "research" },
  { path: "/publications", slug: "publications" },
  { path: "/projects", slug: "projects" },
  { path: "/honors", slug: "honors" },
  { path: "/cv", slug: "cv" },
  { path: "/about", slug: "about" },
];

const consoleIssues = [];
const layoutIssues = [];

async function autoScroll(page) {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.8);
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 90));
    }
    window.scrollTo(0, max);
    await new Promise((resolve) => setTimeout(resolve, 220));
  });
}

await withChrome(async ({ context }) => {
  await context.addInitScript(() => {
    try {
      localStorage.setItem("yr.theme", "dark");
    } catch {
      /* storage unavailable */
    }
  });
  for (const viewport of viewports) {
    const page = await context.newPage();
    const origin = await serveDist(page);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleIssues.push(`[${viewport.name}] ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => {
      consoleIssues.push(`[${viewport.name}] pageerror: ${error.message}`);
    });

    for (const entry of pages) {
      await page.goto(`${origin}${entry.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(650);
      await autoScroll(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(250);

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      if (overflow.scrollWidth > overflow.clientWidth + 1) {
        layoutIssues.push(
          `[${viewport.name}${entry.path}] horizontal overflow: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}`,
        );
      }

      await page.screenshot({
        path: `${outDir}/${viewport.name}-${entry.slug}.png`,
        fullPage: true,
      });
    }
    await page.close();
  }

  // ---- Interaction checks (desktop) ----
  const page = await context.newPage();
  const origin = await serveDist(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${outDir}/hero-desktop.png`, fullPage: false });
  await page.getByRole("button", { name: "中文" }).first().click();
  await page.waitForTimeout(500);
  const lang = await page.evaluate(() => document.documentElement.lang);
  const zhNav = await page.getByRole("navigation").first().innerText();
  if (lang !== "zh-CN") layoutIssues.push(`locale switch: html lang is "${lang}", expected zh-CN`);
  if (!/研究|论文|项目/.test(zhNav)) {
    layoutIssues.push(`locale switch: nav did not localise (${zhNav.replace(/\s+/g, " ").slice(0, 80)})`);
  }
  await page.screenshot({ path: `${outDir}/interaction-home-zh.png`, fullPage: false });

  // Chinese rendering sweep — catches CJK wrapping and overflow page by page.
  for (const entry of pages) {
    await page.goto(`${origin}${entry.path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(350);
    await autoScroll(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    const zhOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    if (zhOverflow.scrollWidth > zhOverflow.clientWidth + 1) {
      layoutIssues.push(
        `[zh desktop${entry.path}] horizontal overflow: ${zhOverflow.scrollWidth} > ${zhOverflow.clientWidth}`,
      );
    }
    await page.screenshot({ path: `${outDir}/zh-desktop-${entry.slug}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const entry of pages) {
    await page.goto(`${origin}${entry.path}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(350);
    await autoScroll(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(200);
    const zhOverflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    if (zhOverflow.scrollWidth > zhOverflow.clientWidth + 1) {
      layoutIssues.push(
        `[zh mobile${entry.path}] horizontal overflow: ${zhOverflow.scrollWidth} > ${zhOverflow.clientWidth}`,
      );
    }
    await page.screenshot({ path: `${outDir}/zh-mobile-${entry.slug}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "EN" }).first().click();
  await page.waitForTimeout(300);

  // Preview mode: sample content is gated, labelled and noindexed.
  await page.goto(`${origin}/publications?demo=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const previewBanner = page.getByText(/preview mode/i).first();
  if (!(await previewBanner.isVisible().catch(() => false))) {
    layoutIssues.push("preview mode: sample banner is not visible");
  }
  const sampleCount = await page.getByText(/^sample$/i).count();
  if (sampleCount < 1) layoutIssues.push(`preview mode: expected sample badges, found ${sampleCount}`);
  const previewMeta = await page.evaluate(() => ({
    robots: [...document.querySelectorAll('meta[name="robots"]')].map((m) => m.getAttribute("content") ?? ""),
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
  }));
  if (!previewMeta.robots.some((value) => value.startsWith("noindex"))) {
    layoutIssues.push(`preview mode: robots meta is ${JSON.stringify(previewMeta.robots)}, expected noindex`);
  }
  if (!previewMeta.canonical.endsWith("/publications/")) {
    layoutIssues.push(`preview mode: canonical is "${previewMeta.canonical}", expected /publications/`);
  }
  await page.screenshot({ path: `${outDir}/preview-publications.png`, fullPage: false });
  await page.getByRole("button", { name: /exit preview/i }).first().click();
  await page.waitForTimeout(400);
  if (page.url().includes("demo=1")) layoutIssues.push("preview mode: exit did not clear the demo query");

  await page.goto(`${origin}/research`, { waitUntil: "networkidle" });
  const researchMeta = await page.evaluate(() => ({
    title: document.title,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
    robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "",
  }));
  if (!researchMeta.canonical.endsWith("/research/")) {
    layoutIssues.push(`metadata: research canonical is "${researchMeta.canonical}"`);
  }
  if (!researchMeta.robots.startsWith("index")) {
    layoutIssues.push(`metadata: research robots is "${researchMeta.robots}"`);
  }
  if (!researchMeta.title.includes("Research")) {
    layoutIssues.push(`metadata: research title is "${researchMeta.title}"`);
  }
  await page.waitForTimeout(700);
  const lab = page.locator("#lab");
  await lab.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const sliders = page.locator('input[type="range"]');
  if ((await sliders.count()) >= 2) {
    await sliders.first().fill("30");
    await sliders.nth(1).fill("0.62");
    await page.waitForTimeout(350);
  } else {
    layoutIssues.push("array lab: expected two range inputs");
  }
  await page.getByRole("button", { name: /sweep/i }).click().catch(() => {});
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${outDir}/interaction-lab.png`, fullPage: false });
  await page.getByRole("button", { name: /pause/i }).click().catch(() => {});

  // ---- Mobile navigation ----
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /menu|open menu/i }).click();
  await page.waitForTimeout(450);
  const menuVisible = await page.locator("#mobile-menu").isVisible();
  if (!menuVisible) layoutIssues.push("mobile menu did not open");
  await page.screenshot({ path: `${outDir}/interaction-mobile-menu.png`, fullPage: false });
  await page.keyboard.press("Escape");

  // ---- Reduced motion ----
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(700);
  const motionSetting = await page.evaluate(() => document.documentElement.dataset.motion);
  if (motionSetting !== "reduced") {
    layoutIssues.push(`reduced motion: data-motion="${motionSetting}", expected "reduced"`);
  }
  await page.screenshot({ path: `${outDir}/reduced-motion-home.png`, fullPage: false });

  // Print stylesheet view used for the PDF CV.
  await page.emulateMedia({ reducedMotion: "no-preference", media: "print" });
  await page.setViewportSize({ width: 1024, height: 1400 });
  await page.goto(`${origin}/cv`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.locator(".print-sheet").screenshot({ path: `${outDir}/print-cv.png` });
  await page.emulateMedia({ media: "screen" });
  await page.close();
});

console.log(`screenshots: wrote images to ${outDir}/`);
if (layoutIssues.length) {
  console.log("\nLAYOUT / BEHAVIOUR ISSUES:");
  for (const issue of layoutIssues) console.log(` - ${issue}`);
}
if (consoleIssues.length) {
  console.log("\nCONSOLE ERRORS (may include third-party noise):");
  for (const issue of [...new Set(consoleIssues)].slice(0, 20)) console.log(` - ${issue}`);
}

if (layoutIssues.length) process.exitCode = 1;
