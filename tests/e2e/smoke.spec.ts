import { test, expect } from "@playwright/test";

test.describe("Non-Destructive Release Smoke Suite", () => {
  test.beforeEach(async ({ page }) => {
    // Collect console errors
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
  });

  test("GET /login renders properly without console errors or framework overlays", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/login");
    await expect(page).toHaveTitle(/HDA-StudioOS|HDA StudioOS|Studio OS|Login/i);

    // Verify main brand heading renders
    const heading = page.locator("h1, h2").first();
    await expect(heading).toBeVisible();

    // Verify no Next.js error overlays
    const errorOverlay = page.locator("[data-nextjs-dialog-header], #nextjs__container_errors");
    await expect(errorOverlay).toHaveCount(0);

    // Verify no application console errors
    expect(consoleErrors).toEqual([]);
  });

  test("Signed-out GET /dashboard redirects to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("Authenticated workflow (skipped unless E2E_USER_EMAIL & E2E_USER_PASSWORD supplied)", async ({ page }) => {
    const email = process.env.E2E_USER_EMAIL;
    const password = process.env.E2E_USER_PASSWORD;

    if (!email || !password) {
      test.skip(true, "E2E_USER_EMAIL and E2E_USER_PASSWORD environment variables are not supplied.");
      return;
    }

    await page.goto("/login");
    await page.fill('#login-email', email);
    await page.fill('#login-password', password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText("HDA StudioOS").first()).toBeVisible();

    // Verify Sign Out control is visible by accessible name
    const signOutButton = page.getByRole("button", { name: /sign out/i }).first();
    await expect(signOutButton).toBeVisible();

    // Verify /projects/new displays HDA-26018 placeholder
    await page.goto("/projects/new");
    await expect(page.getByPlaceholder("HDA-26018")).toBeVisible();

    // Verify Sign Out redirects to /login
    await page.goto("/dashboard");
    const activeSignOut = page.getByRole("button", { name: /sign out/i }).first();
    await activeSignOut.click();
    await expect(page).toHaveURL(/\/login/);

    // Verify attempting /dashboard after sign-out redirects to /login
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
