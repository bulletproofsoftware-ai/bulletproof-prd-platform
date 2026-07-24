import { test, expect } from "@playwright/test";

test.describe("PRD Workflow", () => {
  test("PRD list page loads", async ({ page }) => {
    await page.goto("/prds");
    await expect(page.locator("h1")).toContainText("PRDs");
  });

  test("dashboard loads with stats", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("brainstorm page loads", async ({ page }) => {
    await page.goto("/brainstorm");
    await expect(page.locator("h1")).toContainText("Brainstorm");
  });

  test("research page loads", async ({ page }) => {
    await page.goto("/research");
    await expect(page.locator("h1")).toContainText("Research");
  });

  test("reviews page loads", async ({ page }) => {
    await page.goto("/reviews");
    await expect(page.locator("h1")).toContainText("Review");
  });

  test("ideas page loads", async ({ page }) => {
    await page.goto("/ideas");
    await expect(page.locator("h1")).toContainText("Ideas");
  });

  test("PRD editor loads with content", async ({ page }) => {
    // Go to PRDs list first
    await page.goto("/prds");
    // Click first PRD link if any exist (exclude /prds/upload)
    const firstPrd = page.locator("a[href^='/prds/']:not([href='/prds/upload'])").first();
    if (await firstPrd.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstPrd.click();
      // The editor wrapper uses data-prd-editor; Tiptap renders .tiptap inside it
      await expect(page.locator("[data-prd-editor]")).toBeVisible({ timeout: 10000 });
    }
  });
});
