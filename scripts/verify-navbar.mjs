import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, expect } from "@playwright/test";

const output = resolve(process.env.VERIFY_OUTPUT || "artifacts/smooth-navbar");
const screenshots = resolve(output, "screenshots");
await mkdir(screenshots, { recursive: true });
const origin = "http://127.0.0.1:3128";
const server = spawn(process.execPath, ["scripts/serve.mjs"], {
  env: { ...process.env, PORT: "3128" }, stdio: ["ignore", "pipe", "pipe"],
});
const results = [];
const errors = [];
let browser;

async function scroll(page, y) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.evaluate(() => new Promise(requestAnimationFrame));
}

async function shown(nav) {
  await expect(nav).not.toHaveClass(/nav-hidden/);
  await expect.poll(async () => Math.abs((await nav.boundingBox()).y)).toBeLessThan(0.5);
}

async function closed(page) {
  await expect(page.getByRole("navigation", { name: "Menu mobile", exact: true })).toBeHidden();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
  assert.equal(await page.evaluate(() => document.documentElement.style.overflow), "");
  assert.equal(await page.locator("main").evaluate((element) => element.inert), false);
  assert.equal(await page.locator("footer").evaluate((element) => element.inert), false);
}

try {
  await new Promise((done, fail) => {
    const timer = setTimeout(() => fail(new Error("Navbar preview timeout")), 15000);
    server.stdout.on("data", (chunk) => {
      if (chunk.toString().includes("Local:")) { clearTimeout(timer); done(); }
    });
    server.on("error", (error) => { clearTimeout(timer); fail(error); });
  });
  browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || "chrome", headless: true });
  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "small-mobile", width: 320, height: 568 },
    { name: "landscape", width: 844, height: 390 },
  ]) {
    const context = await browser.newContext({ viewport, reducedMotion: "no-preference", isMobile: viewport.width <= 1000, hasTouch: viewport.width <= 1000 });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(origin + "/program/");
    await page.waitForLoadState("networkidle");
    const nav = page.locator("header.nav");
    await shown(nav);
    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);

    await scroll(page, 520);
    await expect(nav).toHaveClass(/nav-hidden/);
    await expect.poll(async () => (await nav.boundingBox()).y + (await nav.boundingBox()).height).toBeLessThanOrEqual(0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollHeight), pageHeight, "Hiding the header must not shift content");
    await page.screenshot({ path: resolve(screenshots, `scroll-down-${viewport.name}.png`) });
    await scroll(page, 516);
    await expect(nav).toHaveClass(/nav-hidden/);
    await scroll(page, 490);
    await shown(nav);
    await page.screenshot({ path: resolve(screenshots, `scroll-up-${viewport.name}.png`) });
    await scroll(page, 495);
    await shown(nav);

    if (viewport.width <= 1000) {
      const toggle = page.locator(".mobile-menu-button");
      await toggle.click();
      const panel = page.getByRole("navigation", { name: "Menu mobile", exact: true });
      await expect(panel).toBeVisible();
      await expect.poll(async () => Math.abs((await panel.boundingBox()).y - (await nav.boundingBox()).height)).toBeLessThan(0.5);
      const box = await panel.boundingBox();
      const header = await nav.boundingBox();
      assert.equal(box.width, viewport.width);
      assert.ok(Math.abs(header.height + box.height - viewport.height) < 1, "Menu must cover the full viewport");
      assert.deepEqual(await panel.locator("a").allTextContents(), ["Beranda", "Tentang Kami", "Program Pelatihan", "Galeri"]);
      assert.equal(await panel.locator('a[href="/kontak/"]').count(), 0);
      assert.equal(await page.locator("main").evaluate((element) => element.inert), true);
      assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
      const lockedY = await page.evaluate(() => window.scrollY);
      await page.mouse.move(10, viewport.height - 20);
      await page.mouse.wheel(0, 300);
      await page.evaluate(() => new Promise(requestAnimationFrame));
      assert.equal(await page.evaluate(() => window.scrollY), lockedY);
      await page.screenshot({ path: resolve(screenshots, `fullscreen-menu-${viewport.name}.png`) });

      await panel.getByRole("link", { name: "Galeri", exact: true }).focus();
      await page.keyboard.press("Tab");
      await expect(page.locator("header .brand")).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(panel.getByRole("link", { name: "Galeri", exact: true })).toBeFocused();
      await page.keyboard.press("Escape");
      await closed(page);
      await expect(toggle).toBeFocused();
      assert.equal(await page.evaluate(() => window.scrollY), lockedY, "Closing must preserve the scroll position");

      await toggle.click();
      await page.getByRole("button", { name: "Tutup menu", exact: true }).click();
      await closed(page);
      await toggle.click();
      await panel.getByRole("link", { name: "Galeri", exact: true }).click();
      await page.waitForURL(origin + "/galeri/");
      await closed(page);
      await shown(nav);
      await page.locator('.photo-only-gallery button[aria-haspopup="dialog"]').first().click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toBeHidden();
      await closed(page);

      // Clicking a lower gallery thumbnail may scroll down and hide the navbar.
      // Reveal it with the same upward gesture a visitor uses before reopening.
      const galleryY = await page.evaluate(() => window.scrollY);
      await scroll(page, Math.max(0, galleryY - 48));
      await shown(nav);
      await toggle.click();
      await expect(panel).toBeVisible();
      await page.setViewportSize({ width: 1440, height: 900 });
      await closed(page);
      await expect(toggle).toBeHidden();
      await page.setViewportSize(viewport);
      await expect(panel).toBeHidden();
    } else {
      await scroll(page, 0);
      await shown(nav);
      await page.locator(".nav-links").getByRole("link", { name: "Tentang Kami", exact: true }).click();
      await page.waitForURL(origin + "/tentang/");
      await shown(nav);
    }
    results.push({ viewport, scrollDirections: "passed", smallScrollStability: "passed", contentPosition: "unchanged", fullscreenMenu: viewport.width <= 1000 ? "coverage, lock, focus, close, navigation, resize and gallery passed" : "desktop navigation passed" });
    await context.close();
    console.log(`${viewport.name}: scroll and menu checks passed`);
  }
  const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await reduced.newPage();
  await page.goto(origin + "/program/");
  await page.waitForLoadState("networkidle");
  assert.equal(await page.locator("header.nav").evaluate((element) => getComputedStyle(element).transitionDuration), "0s");
  await page.getByRole("button", { name: "Buka menu", exact: true }).click();
  await expect(page.getByRole("navigation", { name: "Menu mobile", exact: true })).toHaveCSS("opacity", "1");
  await page.keyboard.press("Escape");
  await closed(page);
  await reduced.close();
  assert.deepEqual(errors, []);
  await writeFile(resolve(output, "navbar-verification.json"), JSON.stringify({ status: "passed", results, reducedMotion: "passed", errors }, null, 2));
} catch (error) {
  await writeFile(resolve(output, "navbar-verification.json"), JSON.stringify({ status: "failed", message: error.message, results, errors }, null, 2));
  throw error;
} finally {
  await browser?.close();
  server.kill();
}
