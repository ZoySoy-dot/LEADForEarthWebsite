import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "..", "screenshots");
mkdirSync(outDir, { recursive: true });

const url = process.argv[2] ?? "http://localhost:3000/community";
const label = process.argv[3] ?? "screenshot";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
// Small pause so any hero animations / lazy imports settle
await page.waitForTimeout(1500);
const outFile = resolve(outDir, `${label}.png`);
await page.screenshot({ path: outFile, fullPage: true });
console.log(`saved ${outFile}`);
await browser.close();
