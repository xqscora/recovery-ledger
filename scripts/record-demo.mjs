import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const url = process.env.DEMO_URL || "https://xqscora.github.io/recovery-ledger/";
await mkdir("artifacts", { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: "artifacts", size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(8000);

// Let each state remain readable long enough for a short narrated walkthrough.
await page.locator("#taskName").fill("Audit the neighborhood recycling stream");
await page.locator("#dueHours").fill("4");
await page.locator("#effort").fill("50");
await page.locator("#dependency").selectOption("data");
await page.getByRole("button", { name: "Add to ledger" }).click();
await page.waitForTimeout(18000);
await page.getByRole("button", { name: "Mark current task missed" }).click();
await page.waitForTimeout(18000);
await page.locator("#availableTime").fill("15");
await page.waitForTimeout(18000);
await page.locator("#availableTime").fill("75");
await page.waitForTimeout(18000);
await page.getByRole("button", { name: "Reset demo" }).click();
await page.waitForTimeout(12000);

await context.close();
await browser.close();
console.log("Recorded Recovery Ledger demo from", url);
