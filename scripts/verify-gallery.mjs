import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, expect } from "@playwright/test";

const output = resolve("artifacts/shared-element-gallery");
const screenshots = resolve(output, "screenshots");
await mkdir(screenshots, { recursive: true });
const origin = "http://127.0.0.1:3110";
const results = [];
const errors = [];
const server = spawn(process.execPath, ["scripts/serve.mjs"], {
  env: { ...process.env, PORT: "3110" },
  stdio: ["ignore", "pipe", "pipe"],
});
let browser;

async function prepare(page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.querySelectorAll(".photo-only-gallery img")) {
      image.loading = "eager";
      await image.decode();
    }
  });
}

async function openPhoto(page, index = 0) {
  const trigger = page.locator('.photo-only-gallery button[aria-haspopup="dialog"]').nth(index);
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.locator("img").evaluate((image) => image.decode());
  // Shared element spring settling is part of this visual interaction test.
  await page.waitForTimeout(650);
  return { trigger, dialog };
}

async function assertClosed(page, trigger) {
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  assert.equal(await page.locator("main").evaluate((element) => element.inert), false);
}

try {
  await new Promise((ready, reject) => {
    const timeout = setTimeout(() => reject(new Error("Gallery preview did not start")), 15000);
    server.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Local:")) { clearTimeout(timeout); ready(); }
    });
    server.on("error", reject);
  });
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome", headless: true });

  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
  ]) {
    const context = await browser.newContext({
      viewport, reducedMotion: "no-preference",
      isMobile: viewport.name === "mobile", hasTouch: viewport.name !== "desktop",
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(origin + "/galeri/");
    await prepare(page);
    assert.equal(await page.locator('.photo-only-gallery button[aria-haspopup="dialog"]').count(), 5);
    await page.screenshot({ path: resolve(screenshots, `gallery-${viewport.name}.png`), fullPage: true });
    await page.screenshot({ path: resolve(screenshots, `gallery-${viewport.name}-viewport.png`) });

    const { trigger, dialog } = await openPhoto(page, 1);
    assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
    assert.equal(await page.locator("main").evaluate((element) => element.inert), true);
    await expect(dialog.getByRole("button", { name: "Tutup foto" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Tutup foto" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("button", { name: "Tutup foto" })).toBeFocused();
    const bounds = await dialog.locator("img").boundingBox();
    assert.ok(bounds.width <= viewport.width * 0.95 + 1);
    assert.ok(bounds.height <= viewport.height * 0.9 + 1);
    assert.ok(bounds.x >= 0 && bounds.y >= 0);
    await page.screenshot({ path: resolve(screenshots, `gallery-${viewport.name}-expanded.png`) });
    await page.keyboard.press("Escape");
    await assertClosed(page, trigger);

    // All five real assets must open and close, including keyboard activation.
    for (let index = 0; index < 5; index++) {
      const button = page.locator('.photo-only-gallery button[aria-haspopup="dialog"]').nth(index);
      const expectedSrc = await button.locator("img").getAttribute("src");
      await button.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("dialog").locator("img")).toHaveAttribute("src", expectedSrc);
      await page.getByRole("button", { name: "Tutup foto" }).click();
      await assertClosed(page, button);
    }

    const backdrop = await openPhoto(page);
    await page.mouse.click(3, viewport.height - 3);
    await assertClosed(page, backdrop.trigger);

    const dragged = await openPhoto(page);
    await page.mouse.move(viewport.width / 2, viewport.height / 2);
    await page.mouse.down();
    await page.mouse.move(viewport.width / 2, viewport.height / 2 + 180, { steps: 14 });
    await page.mouse.up();
    await assertClosed(page, dragged.trigger);

    if (viewport.name === "mobile") {
      const button = page.locator('.photo-only-gallery button[aria-haspopup="dialog"]').first();
      await button.scrollIntoViewIfNeeded();
      const box = await button.boundingBox();
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.getByRole("button", { name: "Tutup foto" }).tap();
      await assertClosed(page, button);
    }

    results.push({ viewport, status: "passed", interactions: ["open all five photos", "keyboard Enter", "focus trap", "Escape", "close button", "backdrop", "vertical drag", "scroll restoration", "image containment", ...(viewport.name === "mobile" ? ["touch tap"] : [])] });
    console.log(`${viewport.name}: gallery interactions passed`);
    await context.close();
  }

  const reduced = await browser.newContext({ reducedMotion: "reduce" });
  const page = await reduced.newPage();
  await page.goto(origin + "/galeri/");
  await prepare(page);
  const reducedOpened = await openPhoto(page);
  await page.keyboard.press("Escape");
  await assertClosed(page, reducedOpened.trigger);
  await reduced.close();

  const responsive = [];
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const responsivePage = await context.newPage();
  for (const width of [320, 640, 767, 768, 1023, 1024, 1920]) {
    await responsivePage.setViewportSize({ width, height: 900 });
    await responsivePage.goto(origin + "/galeri/");
    await prepare(responsivePage);
    const layout = await responsivePage.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      columns: Number(getComputedStyle(document.querySelector(".photo-only-gallery .columns-1")).columnCount),
    }));
    assert.equal(layout.width, width);
    assert.equal(layout.columns, width >= 1024 ? 4 : width >= 768 ? 3 : width >= 640 ? 2 : 1);
    responsive.push({ width, ...layout, status: "passed" });
  }
  await context.close();
  assert.deepEqual(errors, []);
  await writeFile(resolve(output, "interactions.json"), JSON.stringify({ status: "passed", results, responsive, reducedMotion: "passed", errors }, null, 2));
  console.log("Gallery desktop/mobile/tablet, reduced motion and masonry breakpoints passed.");
} finally {
  await browser?.close();
  server.kill();
}
