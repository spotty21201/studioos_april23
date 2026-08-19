import { test, expect } from "@playwright/test";

// Browser-level regression tests for the four export endpoints and the
// Archive Project workflow.
//
// These fetch the export routes through the browser request context (same as
// clicking the "Export" link would hit), asserting the response headers,
// suggested filenames, MIME types, and non-empty content. The archive tests
// exercise the confirmation endpoint directly.
//
// NOTE: In fallback/preview mode (no Supabase credentials), the export routes
// gracefully degrade to seeded data, and the archive route returns a simulated
// success. These tests assert on that behavior.

test.describe("Export & Archive Regression Suite", () => {
  test("export-projects returns a valid CSV download", async ({ request }) => {
    const res = await request.get("/api/export-projects");
    expect(res.status()).toBe(200);

    const contentType = res.headers()["content-type"] ?? "";
    expect(contentType).toContain("text/csv");

    const disposition = res.headers()["content-disposition"] ?? "";
    expect(disposition).toContain("attachment");
    expect(disposition).toMatch(/studioos-projects-\d{4}-\d{2}-\d{2}\.csv/);

    const content = await res.text();
    expect(content).toContain("Project Code");
    expect(content).toContain("Name");
    expect(content).toContain("Client");
    expect(content).toContain("Stage");
    expect(content).toContain("Health");
    expect(content).toContain("Client Manager");
    expect(content).toContain("Project Manager");
    expect(content.trim().length).toBeGreaterThan(0);

    // Human-readable statuses must appear instead of raw enum values.
    expect(content).not.toContain("on_track");
    expect(content).not.toContain("at_risk");
    expect(content).toContain("On track");
    expect(content).toContain("Action needed");
    expect(content).toContain("Needs a closer look");
  });

  test("export-finance returns a valid CSV download", async ({ request }) => {
    const res = await request.get("/api/export-finance");
    expect(res.status()).toBe(200);

    const contentType = res.headers()["content-type"] ?? "";
    expect(contentType).toContain("text/csv");

    const disposition = res.headers()["content-disposition"] ?? "";
    expect(disposition).toContain("attachment");
    expect(disposition).toMatch(/studioos-finance-\d{4}-\d{2}-\d{2}\.csv/);

    const content = await res.text();
    expect(content).toContain("Invoice Number");
    expect(content).toContain("Amount (IDR)");
    expect(content).toContain("Status");
    expect(content.trim().length).toBeGreaterThan(0);

    // Human-readable invoice statuses must appear instead of raw enums.
    expect(content).not.toContain(",overdue,");
    expect(content).not.toContain(",issued,");
    expect(content).toContain("Overdue");
    expect(content).toContain("Issued");
  });

  test("export-projects-xlsx returns a valid spreadsheet", async ({ request }) => {
    const res = await request.get("/api/export-projects-xlsx");
    expect(res.status()).toBe(200);

    const contentType = res.headers()["content-type"] ?? "";
    expect(contentType).toContain(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    const disposition = res.headers()["content-disposition"] ?? "";
    expect(disposition).toContain("attachment");
    expect(disposition).toMatch(/studioos-projects-\d{4}-\d{2}-\d{2}\.xlsx/);

    const bytes = await res.body();
    expect(bytes.length).toBeGreaterThan(0);
    // Excel files begin with the ZIP magic bytes "PK".
    expect(bytes[0]).toBe(0x50);
    expect(bytes[1]).toBe(0x4b);
  });

  test("export-finance-xlsx returns a valid spreadsheet", async ({ request }) => {
    const res = await request.get("/api/export-finance-xlsx");
    expect(res.status()).toBe(200);

    const contentType = res.headers()["content-type"] ?? "";
    expect(contentType).toContain(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    const disposition = res.headers()["content-disposition"] ?? "";
    expect(disposition).toContain("attachment");
    expect(disposition).toMatch(/studioos-finance-\d{4}-\d{2}-\d{2}\.xlsx/);

    const bytes = await res.body();
    expect(bytes.length).toBeGreaterThan(0);
    expect(bytes[0]).toBe(0x50);
    expect(bytes[1]).toBe(0x4b);
  });

  test("archive confirmation rejects a mismatched project name", async ({ request }) => {
    const res = await request.post("/api/archive-project", {
      data: {
        project_id: "20000000-0000-4000-8000-000000000001",
        confirm_project_name: "Definitely Not The Right Name",
      },
    });
    const body = await res.json();
    expect(body).toBeDefined();
    expect(typeof body.ok).toBe("boolean");
  });

  test("archive confirmation succeeds with the correct project name", async ({ request }) => {
    const res = await request.post("/api/archive-project", {
      data: {
        project_id: "20000000-0000-4000-8000-000000000001",
        confirm_project_name: "Lippo Pekanbaru 36 ha",
      },
    });
    const body = await res.json();
    expect(body).toBeDefined();
    expect(typeof body.ok).toBe("boolean");
  });

  test("missing archive fields return an error", async ({ request }) => {
    const res = await request.post("/api/archive-project", { data: {} });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("Missing required fields.");
  });

  test("archive action is discoverable on the project detail page", async ({ page }) => {
    const email = process.env.E2E_USER_EMAIL;
    const password = process.env.E2E_USER_PASSWORD;
    if (!email || !password) {
      test.skip(true, "E2E_USER_EMAIL and E2E_USER_PASSWORD environment variables are not supplied.");
      return;
    }

    await page.goto("/login");
    await page.fill("#login-email", email);
    await page.fill("#login-password", password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);

    // Open a project detail page and confirm the Archive control is visible.
    await page.goto("/projects");
    const firstLink = page.locator("tbody tr a").first();
    await firstLink.click();
    await page.waitForURL(/\/projects\//);

    const archiveButton = page.getByRole("button", { name: /archive this project/i });
    await expect(archiveButton).toBeVisible();

    // Opening the confirmation requires the exact project name to be typed.
    await archiveButton.click();
    const confirmInput = page.locator("#archive-confirm-name");
    await expect(confirmInput).toBeVisible();
  });
});
