import path from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { withChrome } from "./lib/chrome.mjs";
import { serveDist } from "./lib/site.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = process.env.SITE_ORIGIN || "http://yurripe.local";
const issues = [];
const notes = [];

const routes = [
  { path: "/", h1: /fields/i },
  { path: "/research/", h1: /questions/i },
  { path: "/publications/", h1: /written record/i },
  { path: "/projects/", h1: /training, documented/i },
  { path: "/projects/computational-electromagnetics-training/", h1: /computational electromagnetics/i },
  { path: "/honors/", h1: /record, checked/i },
  { path: "/cv/", h1: /short version/i },
  { path: "/about/", h1: /about this site/i },
  { path: "/notes/", h1: /notes, when/i },
  { path: "/zh/", h1: /场/ },
  { path: "/zh/research/", h1: /问题/ },
  { path: "/zh/projects/", h1: /训练|记录/i },
  { path: "/zh/honors/", h1: /荣誉|记录/i },
  { path: "/zh/cv/", h1: /一页/ },
  { path: "/zh/about/", h1: /关于/ },
  { path: "/404.html", h1: /signal lost|信号/i, status: 404 },
];

function addIssue(scope, message) {
  issues.push(`${scope}: ${message}`);
}

const seenProblems = new Set();
const badResponses = [];

function report(scope, message) {
  const key = `${scope}|${message}`;
  if (seenProblems.has(key)) return;
  seenProblems.add(key);
  addIssue(scope, message);
}

function attachDiagnostics(page) {
  page.on("pageerror", (error) => {
    const route = new URL(page.url()).pathname;
    report(route, `pageerror: ${error.message}`);
  });
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (text.includes("favicon.ico")) return;
    const route = new URL(page.url()).pathname;
    report(route, `console: ${text}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && !response.url().endsWith("favicon.ico")) {
      badResponses.push(`${response.status()} ${response.url()}`);
    }
  });
}

async function goto(page, route) {
  await page.goto(`${origin}${route}`, { waitUntil: "load", timeout: 20000 });
  await page.waitForTimeout(environment.slow ? 700 : 350);
}

const environment = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 }, slow: false };

await withChrome(async ({ browser }) => {
  const context = await browser.newContext({
    viewport: environment.desktop,
    colorScheme: "dark",
    reducedMotion: "no-preference",
  });

  const page = await context.newPage();
  await serveDist(page, origin);
  attachDiagnostics(page);

  // Page-level rendering, metadata and overflow.
  for (const route of routes) {
    await goto(page, route.path);

    const details = await page.evaluate(() => ({
      lang: document.documentElement.lang,
      theme: document.documentElement.dataset.theme,
      h1: document.querySelector("h1")?.textContent?.trim() || "",
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
      robots: [...document.querySelectorAll('meta[name="robots"]')].map((node) => node.getAttribute("content")),
      hreflang: document.querySelectorAll('link[rel="alternate"][hreflang]').length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      emptyReveals: [...document.querySelectorAll("[data-reveal]")].filter((node) => {
        const style = getComputedStyle(node);
        return style.opacity === "0";
      }).length,
    }));

    if (!route.h1.test(details.h1)) addIssue(route.path, `unexpected h1 "${details.h1}"`);
    if (details.overflow > 1) addIssue(route.path, `horizontal overflow ${details.overflow}px`);
    if (route.path === "/404.html") {
      if (!details.robots.some((value) => value?.includes("noindex"))) addIssue(route.path, "404 is not noindex");
      if (details.canonical) addIssue(route.path, "404 has a canonical URL");
    } else {
      if (!details.canonical) addIssue(route.path, "missing canonical URL");
      if (!details.robots.length) addIssue(route.path, "missing robots meta");
      if (!details.robots.some((value) => value?.includes("noindex")) && details.hreflang !== 3) {
        addIssue(route.path, `indexable page has ${details.hreflang} hreflang links`);
      }
    }
    if (!["zh-CN", "zh", "en"].includes(details.lang)) addIssue(route.path, `unexpected html lang ${details.lang}`);
    if (details.theme !== "dark") addIssue(route.path, `unexpected initial theme ${details.theme}`);
    if (details.emptyReveals > 0) notes.push(`${route.path}: ${details.emptyReveals} reveal node(s) still hidden after load`);
  }
  for (const response of badResponses) addIssue("network", `bad response ${response}`);

  // Mobile layout and navigation.
  const mobile = await browser.newContext({
    viewport: environment.mobile,
    colorScheme: "dark",
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobile.newPage();
  await serveDist(mobilePage, origin);
  attachDiagnostics(mobilePage);
  for (const route of ["/", "/research/", "/cv/", "/zh/"]) {
    await goto(mobilePage, route);
    const overflow = await mobilePage.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) addIssue(`mobile ${route}`, `horizontal overflow ${overflow}px`);
    const menuButton = mobilePage.getByRole("button", { name: /menu/i }).first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await mobilePage.waitForTimeout(300);
      const menuVisible = await mobilePage.getByRole("navigation").first().isVisible().catch(() => false);
      if (!menuVisible) addIssue(`mobile ${route}`, "menu overlay did not show navigation");
      await mobilePage.keyboard.press("Escape");
      await mobilePage.waitForTimeout(200);
    }
  }
  await mobile.close();

  // Theme preference, locale routing and reduced motion.
  await goto(page, "/");
  const themeButton = page.getByRole("button", { name: /theme|light|dark/i }).first();
  if (await themeButton.isVisible()) {
    const before = await page.evaluate(() => document.documentElement.dataset.theme);
    await themeButton.click();
    await page.waitForTimeout(250);
    const after = await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      stored: localStorage.getItem("yr.theme"),
    }));
    if (after.theme === before) addIssue("/", "theme toggle did not change data-theme");
    if (!after.stored) addIssue("/", "theme preference was not stored");
    await page.reload({ waitUntil: "networkidle" });
    const persisted = await page.evaluate(() => document.documentElement.dataset.theme);
    if (persisted !== after.theme) addIssue("/", "theme preference did not survive reload");
    // Restore dark for the remaining checks.
    if (persisted !== "dark") {
      await page.getByRole("button", { name: /theme|light|dark/i }).first().click();
      await page.waitForTimeout(200);
    }
  } else {
    addIssue("/", "theme toggle is not visible");
  }

  await goto(page, "/cv/");
  const localeButton = page.getByRole("button", { name: "中文" }).first();
  if (await localeButton.isVisible()) {
    await localeButton.click();
    await page.waitForTimeout(500);
    const state = await page.evaluate(() => ({
      path: window.location.pathname,
      lang: document.documentElement.lang,
      h1: document.querySelector("h1")?.textContent?.trim() || "",
    }));
    if (!state.path.startsWith("/zh/")) addIssue("/cv/", `locale switch produced ${state.path}`);
    if (state.lang !== "zh-CN") addIssue("/cv/", `locale switch produced html lang ${state.lang}`);
    if (!/一页/.test(state.h1)) addIssue("/cv/", `locale switch produced h1 ${state.h1}`);
  } else {
    addIssue("/cv/", "locale toggle is not visible");
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await goto(page, "/");
  const motion = await page.evaluate(() => document.documentElement.dataset.motion);
  if (motion !== "reduced") addIssue("/", `reduced motion setting is ${motion}`);
  await page.emulateMedia({ reducedMotion: "no-preference" });

  // Demo preview: no hydration mismatch, labelled samples, noindex.
  await goto(page, "/publications/?demo=1");
  const preview = await page.evaluate(() => ({
    banner: document.body.textContent?.includes("Preview mode") || false,
    samples: document.querySelectorAll(".sample-badge, [data-sample]").length,
    text: document.body.innerText.slice(0, 600),
    robots: [...document.querySelectorAll('meta[name="robots"]')].map((node) => node.getAttribute("content")),
  }));
  if (!preview.banner && !/preview mode/i.test(preview.text)) addIssue("preview", "preview banner missing");
  if (!preview.robots.some((value) => value?.includes("noindex"))) addIssue("preview", "preview is indexable");
  const sampleBadges = await page.getByText(/^sample$/i).count();
  if (sampleBadges < 1) addIssue("preview", "no sample badges rendered");

  // Scientific controls change their measured outputs.
  await goto(page, "/research/");
  const ranges = page.locator('input[type="range"]');
  if ((await ranges.count()) >= 2) {
    await ranges.nth(0).fill("30");
    await ranges.nth(1).fill("0.62");
    await page.waitForTimeout(250);
    const readings = await page.locator("text=/30\\.0°|0\\.62/").count();
    if (readings < 1) addIssue("/research/", "array-factor sliders do not update the readout");
  } else {
    addIssue("/research/", "array-factor sliders are missing");
  }
  const preset = page.getByRole("button", { name: /undercoupled/i }).first();
  if (await preset.isVisible()) {
    await preset.click();
    await page.waitForTimeout(250);
    const absorption = await page.evaluate(() => document.body.innerText);
    if (!/undercoupled/i.test(absorption)) addIssue("/research/", "resonance preset did not update the model");
  } else {
    addIssue("/research/", "resonance presets are missing");
  }

  // Accessibility on representative pages (desktop and Chinese).
  for (const route of ["/", "/research/", "/cv/", "/about/", "/zh/research/"]) {
    await goto(page, route);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact || ""),
    );
    for (const violation of serious) {
      addIssue(route, `axe ${violation.impact}: ${violation.id} (${violation.nodes.length} nodes)`);
      notes.push(
        `${route}: ${violation.id} targets ${violation.nodes
          .map((node) => node.target.join(" "))
          .slice(0, 4)
          .join(" | ")}`,
      );
    }
    if (results.violations.length) {
      notes.push(`${route}: axe violations ${results.violations.map((v) => v.id).join(", ")}`);
    }
  }

  // JavaScript-disabled static content.
  const staticContext = await browser.newContext({ viewport: environment.desktop, javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await serveDist(staticPage, origin);
  for (const route of ["/", "/zh/research/"]) {
    await staticPage.goto(`${origin}${route}`, { waitUntil: "load" });
    const text = await staticPage.locator("body").innerText();
    if (text.length < 400) addIssue(`no-js ${route}`, "static content is too short");
    if (!/Yurripe/.test(text)) addIssue(`no-js ${route}`, "brand content missing without JavaScript");
  }
  await staticContext.close();

  await context.close();
});

if (notes.length) {
  console.log(`notes (${notes.length})`);
  for (const note of notes) console.log(`  - ${note}`);
}

if (issues.length) {
  console.error(`qa: ${issues.length} issue(s)`);
  for (const issue of issues.slice(0, 60)) console.error(`  - ${issue}`);
  process.exit(1);
}

console.log("qa: rendering, hydration, routing, theme, motion, preview and a11y checks passed");
