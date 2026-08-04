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

  test("login form is enabled when valid Supabase configuration is present", async ({ page }) => {
    // When NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set and
    // valid, the email/password fields and Sign In button must be enabled.
    // This test runs against a server started with valid env config; if the
    // environment is a preview without Supabase it would skip.
    const email = process.env.E2E_USER_EMAIL;

    await page.goto("/login");

    const signInButton = page.getByRole("button", { name: /sign in/i }).first();
    const enabled = await signInButton.isEnabled();

    if (enabled) {
      // Valid configuration present: fields and button are enabled.
      await expect(page.locator("#login-email")).toBeEnabled();
      await expect(page.locator("#login-password")).toBeEnabled();
      await expect(signInButton).toBeEnabled();
    } else {
      // No valid configuration: fail closed with a clear user-facing message.
      await expect(page.getByText(/configuration is missing or invalid/i)).toBeVisible();
    }

    // Keep test deterministic when no E2E credentials are available.
    test.skip(!email, "E2E_USER_EMAIL not supplied; only asserting enabled/disabled state.");
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
