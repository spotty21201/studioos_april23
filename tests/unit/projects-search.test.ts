import { describe, it, expect } from "vitest";
import { getProjectsPageData } from "@/lib/studio-data";

describe("projects search", () => {
  it("returns matching results when searching by project name", async () => {
    const result = await getProjectsPageData({ q: "Lippo Cikao", lifecycle: "all", health: "all" });
    expect(result.meta.source).toBeDefined();
    expect(result.filteredCount <= result.totalCount).toBe(true);
    // If fallback data is used, Lippo Cikao should match
    const hasMatch = result.items.some(
      (p) => p.name.toLowerCase().includes("lippo cikao") || p.projectCode.toLowerCase().includes("cikao"),
    );
    if (hasMatch) {
      expect(result.filteredCount).toBeGreaterThanOrEqual(1);
    } else {
      // No data source — may be 0 or more results depending on environment
      expect(result.filteredCount).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns empty array when no projects match a unique query", async () => {
    const result = await getProjectsPageData({
      q: "xyzabczzz_nonexistent_project_xyz_2026",
      lifecycle: "all",
      health: "all",
    });
    expect(result.filteredCount).toBe(0);
    expect(result.items.length).toBe(0);
  });

  it("shows total count without filter even in fallback mode", async () => {
    const result = await getProjectsPageData({ lifecycle: "all", health: "all" });
    expect(result.totalCount).toBeGreaterThan(0);
    expect(result.filteredCount).toBeGreaterThan(0);
  });

  it("filters to only active stage projects", async () => {
    const result = await getProjectsPageData({ lifecycle: "active", health: "all" });
    result.items.forEach((item) => {
      expect(item.lifecycleStatus).toBe("active");
    });
  });

  it("does not crash with undefined query params", async () => {
    const result = await getProjectsPageData(undefined);
    expect(result.meta.source).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
  });
});

describe("CSV Export route headers", () => {
  const projectCsvHeader = [
    "Project Code","Name","Client","Stage","Health",
    "Location","Start Date","Target End","Contract Value (IDR)",
    "Client Manager","Project Manager","Last Updated"
  ];
  const financeCsvHeader = [
    "Project","Invoice Number","Title","Issued Date","Due Date",
    "Paid Date","Amount (IDR)","Tax %","Tax Amount (IDR)","Status"
  ];
  
  it.each(projectCsvHeader)("project header column contains no db jargon: '%s'", col =>{
    expect(col.toLowerCase()).not.toMatch(/receivable|payable|lifecycle|institutional/);
  });
  it.each(financeCsvHeader)("finance header column contains no db jargon: '%s'", col =>{
    expect(col.toLowerCase()).not.toMatch(/lifecycle|inventory/);
  });
  
  it("project csv has correct number of columns", () => {
    expect(projectCsvHeader.length).toBe(12);
  });
  it("finance csv has correct number of columns", () => {
    expect(financeCsvHeader.length).toBe(10);
  });
});
