import { withChrome } from "./lib/chrome.mjs";
import { serveDist } from "./lib/site.mjs";

await withChrome(async ({ context }) => {
  const page = await context.newPage();
  const origin = await serveDist(page);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const desktop = await page.evaluate(() => {
    const hero = document.querySelector("#top");
    const rect = hero?.getBoundingClientRect();
    return {
      innerHeight: window.innerHeight,
      heroHeight: rect?.height,
      heroMinHeight: hero ? getComputedStyle(hero).minHeight : null,
      supportsSvh: CSS.supports("height", "100svh"),
      docHeight: document.documentElement.scrollHeight,
      h1: (() => {
        const el = document.querySelector("h1");
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { height: Math.round(r.height), top: Math.round(r.top) };
      })(),
    };
  });
  console.log("DESKTOP", JSON.stringify(desktop, null, 2));

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: ".screenshots/audit-mobile-header.png",
    clip: { x: 0, y: 0, width: 390, height: 64 },
  });
  const mobile = await page.evaluate(() => {
    const header = document.querySelector("header");
    const buttons = [...(header?.querySelectorAll("button, a") ?? [])].map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName,
        label: el.getAttribute("aria-label"),
        text: (el.textContent ?? "").trim().slice(0, 30),
        display: cs.display,
        rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
        visible: cs.display !== "none" && r.width > 0 && r.height > 0,
      };
    });
    return {
      headerButtons: buttons.filter((b) => b.visible),
      hiddenOnes: buttons.filter((b) => !b.visible).map((b) => `${b.tag}:${b.label ?? b.text}`),
    };
  });
  console.log("MOBILE HEADER", JSON.stringify(mobile, null, 2));

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${origin}/publications`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const empty = page.locator("main .relative.overflow-hidden").first();
  if (await empty.count()) {
    await empty.screenshot({ path: ".screenshots/audit-publications-empty.png" });
    const lineInfo = await page.evaluate(() => {
      const panel = document.querySelector("main .relative.overflow-hidden");
      if (!panel) return null;
      const hint = panel.querySelector("p.font-mono");
      if (!hint) return null;
      const r = hint.getBoundingClientRect();
      const y = r.top + r.height / 2;
      const x = Math.min(window.innerWidth - 20, r.left + r.width + 120);
      const stack = document.elementsFromPoint(x, y).slice(0, 6).map((el) => ({
        tag: el.tagName,
        cls: el.getAttribute("class")?.slice(0, 80),
        bg: getComputedStyle(el).backgroundColor,
        borderTop: getComputedStyle(el).borderTop,
        rect: (() => {
          const b = el.getBoundingClientRect();
          return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
        })(),
      }));
      const thin = [...panel.querySelectorAll("*")].filter((el) => {
        const b = el.getBoundingClientRect();
        return b.height <= 2 && b.width > 300;
      }).map((el) => ({ tag: el.tagName, cls: el.getAttribute("class")?.slice(0, 80) }));
      return { hint: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }, probe: { x: Math.round(x), y: Math.round(y) }, stack, thin };
    });
    console.log("EMPTY LINE", JSON.stringify(lineInfo, null, 2));
  }

  await page.goto(`${origin}/publications?demo=1`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const metas = await page.evaluate(() => {
    const robots = [...document.querySelectorAll('meta[name="robots"]')].map((m) => m.getAttribute("content"));
    const title = document.title;
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
    const og = document.querySelector('meta[property="og:url"]')?.getAttribute("content");
    return { robots, title, canonical, og };
  });
  console.log("PREVIEW META", JSON.stringify(metas, null, 2));
  await page.close();
});
