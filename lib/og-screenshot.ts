import chromium from "@sparticuz/chromium";
import { chromium as playwright } from "playwright-core";

const VIEWPORT = { width: 1200, height: 630 };

function getSiteOrigin() {
  return (
    process.env.OG_SCREENSHOT_ORIGIN ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://yashvanth.com"
  );
}

export async function captureOgScreenshot(path: "/" | "/work", origin?: string) {
  const targetUrl = new URL(path, origin || getSiteOrigin()).toString();
  const executablePath = await chromium.executablePath();

  const browser = await playwright.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage({ viewport: VIEWPORT });
    await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForTimeout(900);

    const png = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
    });

    return new Uint8Array(png);
  } finally {
    await browser.close();
  }
}
