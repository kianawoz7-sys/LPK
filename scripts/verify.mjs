import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, expect } from "@playwright/test";

const output = resolve(process.env.VERIFY_OUTPUT || "artifacts/multipage");
const screenshots = resolve(output, "screenshots");
await mkdir(screenshots, { recursive: true });
const origin = "http://127.0.0.1:3100";
const routes = [
  { path: "/", key: "beranda", title: "LANGKAH", nav: "Beranda" },
  {
    path: "/tentang/",
    key: "tentang",
    title: "LPK J.A.T",
    nav: "Tentang Kami",
  },
  {
    path: "/program/",
    key: "program",
    title: "Program Pelatihan",
    nav: "Program Pelatihan",
  },
  {
    path: "/galeri/",
    key: "galeri",
    title: "Galeri kegiatan",
    nav: "Galeri",
  },
  { path: "/kontak/", key: "kontak", title: "Perjalanan besar", nav: "Kontak" },
  {
    path: "/program/bahasa-jepang/",
    key: "bahasa-jepang",
    title: "Bahasa Jepang",
    nav: "Program Pelatihan",
    program: "Bahasa Jepang (Gakkou)",
  },
  {
    path: "/program/tokutei-ginou/",
    key: "tokutei-ginou",
    title: "Tokutei Ginou",
    nav: "Program Pelatihan",
    program: "Tokutei Ginou (TG)",
  },
  {
    path: "/program/magang-jepang/",
    key: "magang-jepang",
    title: "Magang Jepang",
    nav: "Program Pelatihan",
    program: "Magang Jepang (Ginou Jisshusei)",
  },
  {
    path: "/program/engineering/",
    key: "engineering",
    title: "Engineering",
    nav: "Program Pelatihan",
    program: "Engineering",
  },
];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
];
const errors = [];
const results = [];
const internalLinks = new Set();
const responsiveChecks = [];
let server;
let browser;

async function startServer() {
  server = spawn(process.execPath, ["scripts/serve.mjs"], {
    env: { ...process.env, PREVIEW_ROOT: "out", PORT: "3100" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  await new Promise((ready, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Production preview did not start")),
      15000,
    );
    server.stdout.on("data", (data) => {
      if (data.toString().includes("Local:")) {
        clearTimeout(timeout);
        ready();
      }
    });
    server.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    server.on("exit", (code) => {
      if (code !== null && code !== 0) {
        clearTimeout(timeout);
        reject(new Error(`Preview exited: ${code}`));
      }
    });
    server.stderr.on("data", (data) => errors.push(data.toString()));
  });
}

async function ready(page) {
  await page.waitForLoadState("networkidle");
  await page.locator('.site-particle-background:not([data-renderer="loading"])').waitFor({ state: "attached" });
  // Scroll through the whole rendered page before capturing so lazy photographs also load.
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (
      let y = 0;
      y < document.documentElement.scrollHeight;
      y += innerHeight * 0.8
    ) {
      scrollTo(0, y);
      await new Promise(requestAnimationFrame);
    }
    await Promise.all([...document.images].map((image) => image.decode()));
    scrollTo(0, 0);
    await new Promise(requestAnimationFrame);
  });
  assert.equal(
    await page
      .locator("img")
      .evaluateAll((images) =>
        images.every((image) => image.complete && image.naturalWidth > 0),
      ),
    true,
  );
}

async function layout(page) {
  return page.evaluate(() => ({
    viewport: innerWidth,
    width: document.documentElement.scrollWidth,
    textOverflow: [
      ...document.querySelectorAll("h1,h2,h3,.program-name,.admin-number"),
    ]
      .filter((element) => !element.classList.contains("sr-only") && element.scrollWidth > element.clientWidth + 1)
      .map((element) => element.textContent),
    badAnchors: [...document.querySelectorAll('a[href^="#"]')]
      .map((element) => element.getAttribute("href"))
      .filter((href) => !document.getElementById(href.slice(1))),
  }));
}

async function screenshot(page, name) {
  await page.screenshot({
    path: resolve(screenshots, `${name}.png`),
    fullPage: true,
    animations: "disabled",
  });
  await page.screenshot({
    path: resolve(screenshots, `${name}-viewport.png`),
    animations: "disabled",
  });
}

try {
  await startServer();
  browser = await chromium.launch({
    channel: process.env.BROWSER_CHANNEL || "chrome",
    headless: true,
  });
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
      isMobile: viewport.name === "mobile",
      hasTouch: viewport.name !== "desktop",
    });
    const page = await context.newPage();
    let currentPath = "/";
    page.on("pageerror", (error) =>
      errors.push(`${viewport.name} ${currentPath}: ${error.message}`),
    );
    page.on("console", (message) => {
      if (message.type() === "error")
        errors.push(`${viewport.name} ${currentPath}: ${message.text()}`);
    });
    for (const route of routes) {
      currentPath = route.path;
      const response = await page.goto(origin + route.path);
      assert.equal(response.status(), 200, route.path);
      await ready(page);
      assert.equal(await page.locator("h1").count(), 1);
      assert.ok((await page.locator("h1").innerText()).includes(route.title));
      assert.equal(await page.locator("html").getAttribute("lang"), "id");
      assert.match(
        await page.locator('meta[name="robots"]').getAttribute("content"),
        /noindex.*nofollow/,
      );
      assert.equal(
        await page
          .locator("header .nav-cta, header .btn-orange, header .btn-outline")
          .count(),
        0,
      );
      assert.deepEqual(
        await page.locator(".nav-links a").allTextContents(),
        routes.slice(0, 4).map((item) => item.nav),
      );
      assert.deepEqual(
        await page
          .locator(".nav-links a")
          .evaluateAll((links) =>
            links.map((link) => link.getAttribute("href")),
          ),
        routes.slice(0, 4).map((item) => item.path),
      );
      assert.equal(await page.locator('header a[href="/kontak/"]').count(), 0);
      if (route.key === "kontak") {
        assert.equal(await page.locator('.nav-links a[aria-current="page"]').count(), 0);
      } else {
        assert.equal(
          await page.locator('.nav-links a[aria-current="page"]').innerText(),
          route.nav,
        );
      }
      assert.equal(
        await page
          .locator(".admin-unverified a, a[href*='0821'], a[href*='62821']")
          .count(),
        0,
      );
      for (const link of await page
        .locator("a[href^='https://wa.me/']")
        .all()) {
        const url = new URL(await link.getAttribute("href"));
        assert.equal(url.pathname, "/6285743347760");
        assert.equal(await link.getAttribute("target"), "_blank");
        assert.match(await link.getAttribute("rel"), /noopener noreferrer/);
        if (route.program)
          assert.ok(url.searchParams.get("text").includes(route.program));
      }
      if (route.program) {
        assert.equal(await page.locator(".detail-facts > div").count(), 4);
        assert.equal(await page.locator(".question-list li").count(), 0);
        assert.equal(await page.locator(".related-programs a").count(), 3);
        assert.equal(
          await page
            .locator(".detail-facts dd")
            .evaluateAll((items) =>
              items.every((item) =>
                item.textContent.includes("Belum tersedia"),
              ),
            ),
          true,
        );
      }
      if (route.key === "beranda" || route.key === "program") {
        assert.deepEqual(
          await page.locator(".program-card h3").allTextContents(),
          routes.slice(5).map((item) => item.program),
        );
        assert.deepEqual(
          await page
            .locator(".program-card")
            .evaluateAll((links) =>
              links.map((link) => link.getAttribute("href")),
            ),
          routes.slice(5).map((item) => item.path),
        );
        assert.equal(await page.locator(".program-no, .program-tag, .how-it-works p").count(), 0);
      }
      if (route.key === "galeri") {
        assert.equal(await page.locator('.photo-only-gallery button[aria-haspopup="dialog"]').count(), 5);
        assert.equal(await page.locator(".photo-placeholder").count(), 0);
        assert.equal(await page.locator('img[src*="tokyo-"]').count(), 0);
        assert.equal(await page.locator('.photo-only-gallery img[src^="/images/jat-"]').count(), 5);
        assert.equal(await page.locator("main p, main figcaption, main h2, main h3").count(), 0);
        assert.equal(await page.locator("main h1").getAttribute("class"), "sr-only");
        assert.equal((await page.locator("main").innerText()).trim(), await page.locator("main h1").textContent());
      }
      if (route.key === "beranda") {
        assert.equal(await page.locator(".gallery-teaser .activity-photo").count(), 3);
        assert.equal(await page.locator('.gallery-teaser img[src*="tokyo-"]').count(), 0);
        assert.equal(await page.locator(".hero-buttons").count(), 0);
      }
      const sizes = await layout(page);
      assert.equal(
        sizes.width,
        viewport.width,
        `${route.path} ${viewport.name}: horizontal overflow`,
      );
      assert.deepEqual(
        sizes.textOverflow,
        [],
        `${route.path} ${viewport.name}: text overflow`,
      );
      assert.deepEqual(sizes.badAnchors, []);
      assert.equal(
        await page.evaluate(
          () => getComputedStyle(document.documentElement).scrollBehavior,
        ),
        "auto",
      );
      const links = await page
        .locator('a[href^="/"]')
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute("href")),
        );
      for (const href of links) internalLinks.add(href);
      await screenshot(page, `${route.key}-${viewport.name}`);
      results.push({
        route: route.path,
        viewport,
        layout: sizes,
        status: "passed",
      });
      await writeFile(
        resolve(output, "verification.json"),
        JSON.stringify({ status: "in-progress", results, errors }, null, 2),
      );
      console.log(`${viewport.name} ${route.path}: passed`);
    }

    // Exercise actual client navigation, not only direct page loads.
    await page.goto(origin);
    if (viewport.name === "desktop") {
      for (const route of routes.slice(1, 4)) {
        await page
          .locator(".nav-links")
          .getByRole("link", { name: route.nav, exact: true })
          .click();
        await page.waitForURL(origin + route.path);
        await page
          .getByRole("heading", { level: 1, name: new RegExp(route.title) })
          .waitFor();
        assert.equal(
          await page.locator('.nav-links a[aria-current="page"]').innerText(),
          route.nav,
        );
      }
      await page
        .locator(".nav-links")
        .getByRole("link", { name: "Program Pelatihan", exact: true })
        .click();
      await page.waitForURL(origin + "/program/");
      for (const route of routes.slice(5)) {
        await page.locator(`.program-card[href='${route.path}']`).click();
        await page.waitForURL(origin + route.path);
        await page
          .getByRole("heading", { level: 1, name: new RegExp(route.title) })
          .waitFor();
        await page
          .getByRole("navigation", { name: "Jejak navigasi" })
          .getByRole("link", { name: "Program Pelatihan", exact: true })
          .click();
        await page.waitForURL(origin + "/program/");
      }
    } else {
      const toggle = page.locator(".mobile-menu-button");
      const panel = page.getByRole("navigation", { name: "Menu mobile" });
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
      await expect(panel).toBeHidden();
      await toggle.focus();
      await page.keyboard.press("Enter");
      assert.equal(await toggle.getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Tab");
      assert.equal(
        await panel
          .getByRole("link", { name: "Beranda", exact: true })
          .evaluate((link) => link === document.activeElement),
        true,
      );
      await page.keyboard.press("Escape");
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
      await expect(panel).toBeHidden();
      assert.equal(
        await toggle.evaluate((button) => button === document.activeElement),
        true,
      );
      assert.ok(
        await toggle.evaluate(
          (button) => parseFloat(getComputedStyle(button).outlineWidth) >= 2,
        ),
      );
      await page.keyboard.press("Space");
      await panel
        .getByRole("link", { name: "Tentang Kami", exact: true })
        .click();
      await page.waitForURL(origin + "/tentang/");
      await page
        .getByRole("heading", { level: 1, name: /LPK J.A.T/ })
        .waitFor();
      assert.equal(await toggle.getAttribute("aria-expanded"), "false");
      await expect(panel).toBeHidden();
      for (const route of routes.slice(2, 4)) {
        await toggle.click();
        await panel.getByRole("link", { name: route.nav, exact: true }).click();
        await page.waitForURL(origin + route.path);
        await page
          .getByRole("heading", { level: 1, name: new RegExp(route.title) })
          .waitFor();
        await expect(panel).toBeHidden();
      }
      await toggle.click();
      await page.screenshot({
        path: resolve(screenshots, `menu-${viewport.name}.png`),
        animations: "disabled",
      });
      await page.keyboard.press("Escape");
      await toggle.click();
      await page.setViewportSize({ width: 1440, height: 900 });
      assert.equal(await toggle.isVisible(), false);
      await page.setViewportSize(viewport);
      await expect(panel).toBeHidden();
    }
    await context.close();
    console.log(`${viewport.name}: client navigation passed`);
  }

  for (const href of internalLinks)
    assert.equal(
      (await fetch(origin + href)).status,
      200,
      `Broken internal link: ${href}`,
    );
  assert.equal((await fetch(origin + "/program/tidak-ada/")).status, 404);
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const width of [320, 360, 700, 701, 1000, 1001, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(origin + route.path);
      await ready(page);
      const sizes = await layout(page);
      assert.equal(sizes.width, width, `${route.path}: overflow at ${width}px`);
      assert.deepEqual(
        sizes.textOverflow,
        [],
        `${route.path}: clipped text at ${width}px`,
      );
      responsiveChecks.push({ path: route.path, width, status: "passed" });
    }
    console.log(`All routes at ${width}px: passed`);
  }
  await context.close();
  assert.deepEqual(errors, [], "Browser runtime/console errors");
  await writeFile(
    resolve(output, "verification.json"),
    JSON.stringify(
      {
        status: "passed",
        browser: await browser.version(),
        results,
        internalLinks: [...internalLinks],
        responsiveChecks,
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "All nine routes, direct loads, client navigation, keyboard menu, links, photos and responsive checks passed.",
  );
} catch (error) {
  await writeFile(
    resolve(output, "verification.json"),
    JSON.stringify(
      { status: "failed", message: error.message, results, errors },
      null,
      2,
    ),
  );
  throw error;
} finally {
  await browser?.close();
  server?.kill();
}
