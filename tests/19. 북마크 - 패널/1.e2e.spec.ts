import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "../__util__";

test("1. 북마크 패널에서 북마크를 검색한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await bookmarkActiveTab(
    page,
    Array.from({ length: 10 }, (_, i) => `line ${i}`).join("\n"),
  );
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await expect(page.getByRole("searchbox", { name: "북마크 검색" })).toHaveAttribute("placeholder", "Search bookmarks");
  await page.getByRole("searchbox", { name: "북마크 검색" }).fill("line 1");
  await expect(page.locator(".bookmark-item")).toHaveCount(1);
  await page.getByRole("searchbox", { name: "북마크 검색" }).fill("");
  await page.getByRole("searchbox", { name: "북마크 검색" }).fill("missing");
  await expect(page.locator(".bookmark-item")).toHaveCount(0);
});
