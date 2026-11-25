import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const CHROME_PATH =
  process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const CDP_PORT = Number(process.env.CDP_PORT || 9333);

async function waitForCdp(port, timeoutMs = 20000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {
      /* not ready yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Chrome did not expose CDP on port ${port} within ${timeoutMs}ms`);
}

/**
 * Connect to the system Chrome over CDP, run the callback, then tear down.
 *
 * Set CDP_URL (for example http://127.0.0.1:9333) to attach to a Chrome that is
 * already running. In restricted environments where spawning Chrome from Node is
 * blocked, launch it first:
 *   Start-Process chrome --headless=new --remote-debugging-port=9333 --user-data-dir=.cache/chrome-profile
 * and then run the script with CDP_URL set.
 */
export async function withChrome(fn) {
  if (process.env.CDP_URL) {
    const browser = await chromium.connectOverCDP(process.env.CDP_URL);
    const context = browser.contexts()[0] ?? (await browser.newContext());
    try {
      return await fn({ browser, context });
    } finally {
      await browser.close().catch(() => {});
    }
  }

  const profileDir = path.resolve(".cache/chrome-profile");
  await mkdir(profileDir, { recursive: true });

  const child = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      `--remote-debugging-port=${CDP_PORT}`,
      `--user-data-dir=${profileDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--window-size=1440,900",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  try {
    await waitForCdp(CDP_PORT);
    const browser = await chromium.connectOverCDP(`http://127.0.0.1:${CDP_PORT}`);
    const context = browser.contexts()[0] ?? (await browser.newContext());
    try {
      return await fn({ browser, context });
    } finally {
      await browser.close().catch(() => {});
    }
  } finally {
    child.kill();
  }
}

export function resolveBaseUrl() {
  return (process.env.BASE_URL || "http://127.0.0.1:4173").replace(/\/$/, "");
}
