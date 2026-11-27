#!/usr/bin/env node
/**
 * Repeatable mobile Lighthouse measurement for the deployed site.
 *
 * Runs the *same* mobile preset several times and reports the median, so a
 * single noisy run cannot decide whether a release is fast. Diagnostic variants
 * isolate the cost of network latency, JavaScript/hydration, fonts and WebGL:
 *
 *   baseline      mobile simulation (slow 4G + 4x CPU), the official number
 *   fast-network  same CPU throttle, simulated latency removed -> network cost
 *   no-cpu        same network, CPU throttle removed -> JS/hydration cost
 *   no-js         JavaScript requests blocked -> prerendered paint cost
 *   no-fonts      web fonts blocked -> font loading cost
 *
 * Usage:
 *   node scripts/lighthouse.mjs --url https://example.com/ --runs 5
 *   node scripts/lighthouse.mjs --url http://127.0.0.1:4173/ --runs 3 --enforce
 */
import fs from "node:fs/promises";
import path from "node:path";
import chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const argv = process.argv.slice(2);
const args = {};
for (let index = 0; index < argv.length; index += 1) {
  const arg = argv[index];
  if (!arg.startsWith("--")) continue;
  const body = arg.slice(2);
  if (body.includes("=")) {
    const [key, ...rest] = body.split("=");
    args[key] = rest.join("=");
  } else if (index + 1 < argv.length && !argv[index + 1].startsWith("--")) {
    args[body] = argv[++index];
  } else {
    args[body] = "true";
  }
}

const url = args.url ?? "http://127.0.0.1:4173/";
if (args.url === "true" || !/^https?:\/\//.test(url)) {
  throw new Error(`Expected --url <http(s) URL>, received: ${args.url ?? "(none)"}`);
}
const runCount = (name, fallback) => {
  const value = Number(args[name] ?? fallback);
  if (!Number.isInteger(value) || value < 1 || value > 10) {
    throw new Error(`Expected --${name} to be an integer between 1 and 10, received: ${args[name] ?? "(none)"}`);
  }
  return value;
};
const baselineRuns = runCount("runs", 5);
const diagnosticRuns = runCount("diagnostic-runs", 2);
const outDir = path.resolve(args.out ?? ".cache/lighthouse");
const label = args.label ?? new URL(url).host;
const enforce = args.enforce === "true";
const only = args.only ? String(args.only).split(",") : null;

const MOBILE_THROTTLING = {
  rttMs: 150,
  throughputKbps: 1638.4,
  requestLatencyMs: 562.5,
  downloadThroughputKbps: 1474.56,
  uploadThroughputKbps: 675,
  cpuSlowdownMultiplier: 4,
};

const VARIANTS = {
  baseline: {
    title: "Baseline (slow 4G, 4x CPU)",
    settings: {},
    runs: baselineRuns,
  },
  "fast-network": {
    title: "Fast network, 4x CPU",
    settings: {
      throttling: { ...MOBILE_THROTTLING, rttMs: 20, requestLatencyMs: 20 },
    },
    runs: diagnosticRuns,
  },
  "no-cpu": {
    title: "Slow 4G, no CPU throttle",
    settings: {
      throttling: { ...MOBILE_THROTTLING, cpuSlowdownMultiplier: 1 },
    },
    runs: diagnosticRuns,
  },
  "no-js": {
    title: "JavaScript blocked",
    settings: { blockedUrlPatterns: ["*.js", "*.mjs"] },
    runs: diagnosticRuns,
  },
  "no-fonts": {
    title: "Web fonts blocked",
    settings: { blockedUrlPatterns: ["*.woff", "*.woff2", "*.ttf"] },
    runs: diagnosticRuns,
  },
};

const median = (values) => {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const round = (value) => (value === null || value === undefined ? null : Math.round(value));

const pct = (score) => (score === null || score === undefined ? null : Math.round(score * 100));

function extract(lhr) {
  const audit = (id) => lhr.audits[id] ?? {};
  const metrics = audit("metrics").details?.items?.[0] ?? {};
  const mainThread = {};
  for (const item of audit("mainthread-work-breakdown").details?.items ?? []) {
    mainThread[item.group] = Math.round(item.duration);
  }
  const scripts = [];
  const fonts = [];
  const webgl = [];
  for (const request of audit("network-requests").details?.items ?? []) {
    const clean = request.url.replace(/^https?:\/\/[^/]+/, "");
    if (request.resourceType === "Script") scripts.push({ url: clean, bytes: request.transferSize });
    if (request.resourceType === "Font") fonts.push({ url: clean, bytes: request.transferSize });
    if (/herofield|resonancelab|three|\.glb|\.gltf/i.test(clean)) webgl.push(clean);
  }
  const lcpItems = audit("lcp-breakdown-insight").details?.items ?? [];
  const lcpNode = lcpItems.find((item) => item.type === "node");
  const lcpPhases = Object.fromEntries(
    lcpItems
      .filter((item) => item.type === "table")
      .flatMap((item) => item.items)
      .map((item) => [item.subpart, Math.round(item.duration)]),
  );
  const runWarnings = lhr.runWarnings ?? [];
  return {
    scores: {
      performance: pct(lhr.categories.performance?.score),
      accessibility: pct(lhr.categories.accessibility?.score),
      "best-practices": pct(lhr.categories["best-practices"]?.score),
      seo: pct(lhr.categories.seo?.score),
    },
    metrics: {
      fcp: round(metrics.firstContentfulPaint),
      lcp: round(metrics.largestContentfulPaint),
      tbt: round(metrics.totalBlockingTime),
      cls: Number((metrics.cumulativeLayoutShift ?? 0).toFixed(3)),
      si: round(metrics.speedIndex),
      tti: round(metrics.interactive),
    },
    benchmarkIndex: round(lhr.environment?.benchmarkIndex),
    mainThread,
    scriptsBytes: scripts.reduce((sum, item) => sum + item.bytes, 0),
    scriptCount: scripts.length,
    fontBytes: fonts.reduce((sum, item) => sum + item.bytes, 0),
    fontCount: fonts.length,
    fonts,
    webgl,
    lcpElement: lcpNode
      ? { selector: lcpNode.selector, snippet: lcpNode.snippet, label: lcpNode.nodeLabel }
      : null,
    lcpPhases,
    runWarnings,
  };
}

async function runOnce(variant, index, port) {
  const settings = VARIANTS[variant].settings;
  const started = Date.now();
  const runner = await lighthouse(url, {
    port,
    output: "json",
    logLevel: "error",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    formFactor: "mobile",
    screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
    throttlingMethod: "simulate",
    ...settings,
  });
  if (!runner) throw new Error(`Lighthouse returned no result for ${variant}`);
  const result = extract(runner.lhr);
  result.durationMs = Date.now() - started;
  result.variant = variant;
  result.run = index;
  return { result, lhr: runner.lhr };
}

function summarize(variant, results) {
  const pick = (fn) => median(results.map(fn));
  return {
    variant,
    title: VARIANTS[variant].title,
    runs: results.length,
    performance: median(results.map((r) => r.scores.performance)),
    accessibility: median(results.map((r) => r.scores.accessibility)),
    bestPractices: median(results.map((r) => r.scores["best-practices"])),
    seo: median(results.map((r) => r.scores.seo)),
    fcp: pick((r) => r.metrics.fcp),
    lcp: pick((r) => r.metrics.lcp),
    tbt: pick((r) => r.metrics.tbt),
    cls: pick((r) => r.metrics.cls),
    si: pick((r) => r.metrics.si),
    tti: pick((r) => r.metrics.tti),
    benchmarkIndex: pick((r) => r.benchmarkIndex),
    styleLayout: pick((r) => r.mainThread.styleLayout),
    scriptEvaluation: pick((r) => r.mainThread.scriptEvaluation),
    other: pick((r) => r.mainThread.other),
    scriptBytes: pick((r) => r.scriptsBytes),
    scriptCount: pick((r) => r.scriptCount),
    fontBytes: pick((r) => r.fontBytes),
    fontCount: pick((r) => r.fontCount),
    webglRequests: pick((r) => r.webgl.length),
    lcpElement: results[0]?.lcpElement ?? null,
    lcpPhases: results[0]?.lcpPhases ?? null,
  };
}

const table = (rows) => {
  const header = "| Variant | Runs | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | Style/layout | Script eval | Fonts |";
  const divider = "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |";
  const body = rows.map(
    (row) =>
      `| ${row.title} | ${row.runs} | ${row.performance ?? "–"} | ${row.accessibility ?? "–"} | ${row.bestPractices ?? "–"} | ${row.seo ?? "–"} | ${row.fcp ?? "–"} | ${row.lcp ?? "–"} | ${row.tbt ?? "–"} | ${row.cls ?? "–"} | ${row.styleLayout ?? "–"} | ${row.scriptEvaluation ?? "–"} | ${(row.fontBytes ? row.fontBytes / 1024 : 0).toFixed(1)} KiB |`,
  );
  return [header, divider, ...body].join("\n");
};

await fs.mkdir(outDir, { recursive: true });
const variants = only ?? ["baseline", "fast-network", "no-cpu", "no-js", "no-fonts"];
const summaries = [];
const allRuns = [];

const chrome = await chromeLauncher.launch({
  chromeFlags: [
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-extensions",
  ],
});
try {
  for (const variant of variants) {
    if (!VARIANTS[variant]) throw new Error(`Unknown variant: ${variant}`);
    const runs = VARIANTS[variant].runs;
    const results = [];
    for (let index = 1; index <= runs; index += 1) {
      process.stdout.write(`${label} · ${variant} run ${index}/${runs} … `);
      const { result, lhr } = await runOnce(variant, index, chrome.port);
      results.push(result);
      allRuns.push(result);
      const file = path.join(outDir, `${variant}-${index}.json`);
      await fs.writeFile(file, JSON.stringify(lhr));
      console.log(
        `perf ${result.scores.performance ?? "–"} · tbt ${result.metrics.tbt ?? "–"}ms · fcp ${result.metrics.fcp ?? "–"}ms · ${result.durationMs}ms`,
      );
    }
    summaries.push(summarize(variant, results));
  }
} finally {
  await chrome.kill();
}

const baseline = summaries.find((row) => row.variant === "baseline");
const diagnostic = summaries.filter((row) => row.variant !== "baseline");
const lines = [
  `# Lighthouse mobile — ${label}`,
  "",
  `Measured ${new Date().toISOString()} against ${url}. Baseline: ${baseline?.runs ?? 0} runs; diagnostics: ${diagnostic[0]?.runs ?? 0} runs each. Median values.`,
  "",
  table(summaries),
  "",
  baseline
    ? `Baseline median: **${baseline.performance}** performance, **${baseline.accessibility}** accessibility, **${baseline.bestPractices}** best practices, **${baseline.seo}** SEO.`
    : "",
  "",
  "## Run-by-run",
  "",
  "| Variant | Run | Perf | TBT | FCP | LCP | Bench |",
  "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  ...allRuns.map(
    (run) =>
      `| ${run.variant} | ${run.run} | ${run.scores.performance ?? "–"} | ${run.metrics.tbt ?? "–"} | ${run.metrics.fcp ?? "–"} | ${run.metrics.lcp ?? "–"} | ${run.benchmarkIndex ?? "–"} |`,
  ),
  "",
  "## Diagnostics",
  "",
  ...summaries.map(
    (row) =>
      `- **${row.title}** — FCP ${row.fcp} ms, LCP ${row.lcp} ms, TBT ${row.tbt} ms, style/layout ${row.styleLayout} ms, script eval ${row.scriptEvaluation} ms, fonts ${(row.fontBytes / 1024).toFixed(1)} KiB in ${row.fontCount} request(s), WebGL requests ${row.webglRequests}.`,
  ),
  "",
  baseline?.lcpElement
    ? `LCP element: \`${baseline.lcpElement.selector}\` — ${baseline.lcpElement.label ?? ""}. LCP phases: ${JSON.stringify(baseline.lcpPhases)}.`
    : "",
  "",
];
const report = lines.join("\n");
await fs.writeFile(path.join(outDir, "summary.md"), report);
await fs.writeFile(path.join(outDir, "summary.json"), JSON.stringify({ url, label, summaries, runs: allRuns }, null, 2));
console.log(`\n${report}`);

if (process.env.GITHUB_STEP_SUMMARY) {
  await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);
}

if (enforce && baseline) {
  const failures = [];
  if (!(baseline.performance >= 90)) failures.push(`performance ${baseline.performance} < 90`);
  for (const key of ["accessibility", "bestPractices", "seo"]) {
    if (baseline[key] !== 100) failures.push(`${key} ${baseline[key]} != 100`);
  }
  if (failures.length) {
    console.error(`\nPerformance budget failed: ${failures.join("; ")}`);
    process.exit(1);
  }
}
