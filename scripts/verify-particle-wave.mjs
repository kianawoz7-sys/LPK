import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, expect } from "@playwright/test";

const output = resolve("artifacts/particle-wave");
const screenshots = resolve(output, "screenshots");
await mkdir(screenshots, { recursive: true });
const origin = "http://127.0.0.1:3114";
const server = spawn(process.execPath, ["scripts/serve.mjs"], {
  env: { ...process.env, PORT: "3114" }, stdio: ["ignore", "pipe", "pipe"],
});
let browser;
const errors = [];
const results = [];

async function ready(page) {
  await page.waitForLoadState("networkidle");
  await page.locator('.site-particle-background:not([data-renderer="loading"])').waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) { image.loading = "eager"; await image.decode(); }
  });
}

try {
  await new Promise((done, fail) => {
    const timeout = setTimeout(() => fail(new Error("Particle preview did not start")), 15000);
    server.stdout.on("data", (chunk) => { if (chunk.toString().includes("Local:")) { clearTimeout(timeout); done(); } });
    server.on("error", fail);
  });
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome", headless: true });
  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: viewport.name === "mobile" ? 3 : 1, reducedMotion: "no-preference", isMobile: viewport.name === "mobile", hasTouch: viewport.name === "mobile" });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(origin + "/galeri/");
    await ready(page);
    const layer = page.locator(".site-particle-background");
    const canvas = page.locator(".particle-wave-canvas");
    assert.equal(await canvas.count(), 1);
    assert.equal(await layer.getAttribute("aria-hidden"), "true");
    const state = await layer.evaluate((element) => {
      const canvas = element.querySelector("canvas");
      const box = element.getBoundingClientRect();
      return { renderer: element.dataset.renderer, pointerEvents: getComputedStyle(element).pointerEvents, width: box.width, height: box.height, bufferWidth: canvas.width, bufferHeight: canvas.height, overflow: document.documentElement.scrollWidth, mainBackground: getComputedStyle(document.querySelector(".photo-only-gallery")).backgroundColor };
    });
    assert.equal(state.pointerEvents, "none");
    assert.equal(state.width, viewport.width);
    assert.equal(state.height, viewport.height);
    assert.equal(state.overflow, viewport.width);
    assert.equal(state.mainBackground, "rgba(0, 0, 0, 0)");
    assert.ok(state.bufferWidth <= viewport.width * (viewport.name === "mobile" ? 1.25 : 1.5));

    const clip = { x: 1, y: 150, width: 12, height: viewport.height - 180 };
    let animation = "static-fallback";
    if (state.renderer === "webgl") {
      const first = await page.screenshot({ clip });
      await page.waitForTimeout(500);
      const second = await page.screenshot({ clip });
      assert.ok(!first.equals(second), "Wave pixels should change while animation is enabled");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.waitForTimeout(150);
      const stillFirst = await page.screenshot({ clip });
      await page.waitForTimeout(500);
      const stillSecond = await page.screenshot({ clip });
      assert.ok(stillFirst.equals(stillSecond), "Reduced motion should keep wave pixels still");
      animation = "animated-and-reduced-motion-passed";
    }

    // A transparent decorative layer must not intercept the gallery.
    await page.locator('.photo-only-gallery button[aria-haspopup="dialog"]').first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Tutup foto" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    const originalCanvas = await canvas.elementHandle();
    if (viewport.name === "mobile") await page.locator(".mobile-menu-button").click();
    await page.getByRole("navigation", { name: viewport.name === "mobile" ? "Menu mobile" : "Menu utama" }).getByRole("link", { name: "Program Pelatihan", exact: true }).click();
    await page.waitForURL(origin + "/program/");
    await ready(page);
    assert.equal(await canvas.evaluate((element, original) => element === original, originalCanvas), true);
    assert.equal(await canvas.count(), 1);
    assert.equal(await page.locator(".program-card").count(), 4);
    assert.equal(await page.locator(".program-card").first().evaluate((element) => getComputedStyle(element).backgroundColor), "rgb(255, 255, 255)");
    await page.screenshot({ path: resolve(screenshots, `texture-program-${viewport.name}.png`), fullPage: true });
    await page.screenshot({ path: resolve(screenshots, `texture-program-${viewport.name}-viewport.png`) });
    if (viewport.name === "mobile") await page.locator(".mobile-menu-button").click();
    await page.getByRole("navigation", { name: viewport.name === "mobile" ? "Menu mobile" : "Menu utama" }).getByRole("link", { name: "Beranda", exact: true }).click();
    await page.waitForURL(origin + "/");
    await ready(page);
    await page.screenshot({ path: resolve(screenshots, `texture-home-${viewport.name}-viewport.png`) });
    results.push({ viewport, state, animation, navigation: "passed", galleryClicks: "passed", singleCanvasAcrossNavigation: "passed" });
    console.log(`${viewport.name}: ${state.renderer}; ${animation}; navigation and gallery passed`);
    await context.close();
  }

  const fallbackContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await fallbackContext.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      if (type === "webgl" || type === "webgl2") return null;
      return original.call(this, type, ...args);
    };
  });
  const fallbackPage = await fallbackContext.newPage();
  await fallbackPage.goto(origin + "/program/");
  await ready(fallbackPage);
  await expect(fallbackPage.locator(".site-particle-background")).toHaveAttribute("data-renderer", "fallback");
  assert.match(await fallbackPage.locator(".site-particle-background").evaluate((element) => getComputedStyle(element).backgroundImage), /radial-gradient/);
  await fallbackPage.locator(".program-card").first().click();
  await fallbackPage.waitForURL(origin + "/program/bahasa-jepang/");
  await fallbackPage.screenshot({ path: resolve(screenshots, "texture-fallback-mobile.png"), fullPage: true });
  await fallbackContext.close();
  assert.deepEqual(errors, []);
  await writeFile(resolve(output, "texture-verification.json"), JSON.stringify({ status: "passed", results, unavailableWebGL: "static texture and links passed", errors }, null, 2));
  console.log("Particle wave, reduced motion and static fallback passed.");
} finally {
  await browser?.close();
  server.kill();
}
