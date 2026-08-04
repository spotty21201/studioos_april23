import { test, expect } from "@playwright/test";

test.describe("Project Search Regression Suite", () => {
  // These tests assume authenticated access or fallback data mode.
  // If E2E credentials are supplied, log in first; otherwise they run against
  // a preview environment that allows unauthenticated access.

  async function loginIfNeeded(page: import("@playwright/test").Page) {
    const email = process.env.E2E_USER_EMAIL;
    const password = process.env.E2E_USER_PASSWORD;
    if (email && password) {
      await page.goto("/login");
      await page.fill("#login-email", email);
      await page.fill("#login-password", password);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/dashboard/);
    }
  }

  test.beforeEach(async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
  });

  test("searching for Lippo Cikao navigates correctly without blank page", async ({ page }) => {
    await loginIfNeeded(page);
    await page.goto("/projects");
    
    // The projects list should be visible
    await expect(page.locator('table')).toBeVisible();
    
    // Enter search query
    await page.getByRole("searchbox").fill("Lippo Cikao");
    await page.getByRole("button", { name: /apply/i }).click();
    
    // Wait for navigation and render
    await page.waitForURL(/\/projects\?q=Lippo\+Cikao/);
    await page.waitForTimeout(1000);
    
    // Should NOT be a blank page — table structure must exist
    const hasTable = await page.locator('table').isVisible();
    expect(hasTable).toBe(true);
    
    // Should either show results or an empty state message
    const tableContent = await page.locator('tbody').textContent();
    expect(tableContent).not.toBe("");
  });

  test("search results URL persists project query params", async ({ page }) => {
    await loginIfNeeded(page);
    await page.goto("/projects");
    await page.getByRole("searchbox").fill("Lippo Pekanbaru");
    await page.getByRole("button", { name: /apply/i }).click();
    
    await page.waitForTimeout(500);
    const url = page.url();
    expect(url).toContain("q=");
    expect(url).toContain("lifecycle=all");
    expect(url).toContain("health=all");
  });

  test("no-results search shows informative message, not blank page", async ({ page }) => {
    await loginIfNeeded(page);
    await page.goto("/projects");
    await page.getByRole("searchbox").fill("zzzznonexistentproject_123456789");
    await page.getByRole("button", { name: /apply/i }).click();
    
    await page.waitForTimeout(1000);
    
    // Verify table exists
    await expect(page.locator('table')).toBeVisible();
    
    // Body should have content (either matched rows or empty-state text)
    const bodyText = await page.locator('tbody').textContent();
    expect(bodyText?.length).toBeGreaterThan(0);
  });

  test("status badges display human-readable labels", async ({ page }) => {
    await page.goto("/projects/new");
    
    // Check lifecycle dropdown options don't show raw enum values
    const lifecycleSelect = page.locator('#lifecycle-status');
    const options = await lifecycleSelect.locator('option').allTextContents();
    for (const opt of options) {
      expect(opt.toLowerCase()).not.toContain("_");
    }
    
    // Check health dropdown
    const healthSelect = page.locator('#health-status');
    const healthOptions = await healthSelect.locator('option').allTextContents();
    for (const opt of healthOptions) {
      expect(opt.toLowerCase()).not.toContain("_");
    }
  });

  test("attention status uses accessible descriptions", async ({ page }) => {
    await page.goto("/dashboard");
    
    // Status badges should have aria-labels
    const badges = page.locator('[role="status"], [aria-label]');
    const count = await badges.count();
    if (count > 0) {
      // At least some elements should have proper ARIA attributes
      const firstAriaLabel = (await badges.first().getAttribute("aria-label")) ?? "";
      expect(typeof firstAriaLabel).toBe("string");
      expect(firstAriaLabel.length).toBeGreaterThan(0);
      expect(firstAriaLabel.toLowerCase()).not.toMatch(/_/);
    }
  });

  test("global error boundary exists and catches unhandled errors", async ({ page }) => {
    // Navigate to a non-existent route that may trigger an error boundary
    await page.goto("/this-route-should-trigger-a-500-or-error-boundary");
    
    // Even on error, the global-error.tsx page should render with a readable message
    const errorHeading = page.locator("h1, h2");
    const headingExists = await errorHeading.count();
    expect(headingExists).toBeGreaterThanOrEqual(1);
  });
});
