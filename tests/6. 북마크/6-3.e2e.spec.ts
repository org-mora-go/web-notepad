import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "./__util__";

test("6-3. 북마크 검색, 펼치기, 원본 열기, 제거를 지원한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await bookmarkActiveTab(
    page,
    Array.from({ length: 10 }, (_, i) => `line ${i}`).join("\n"),
  );
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await page.getByRole("searchbox", { name: "북마크 검색" }).fill("line 1");
  await expect(page.locator(".bookmark-item")).toHaveCount(1);
  await page.getByRole("searchbox", { name: "북마크 검색" }).fill("");
  await page.getByRole("button", { name: "더보기" }).click();
  await expect(page.getByRole("button", { name: "간소화" })).toBeVisible();
  await page.getByRole("button", { name: "간소화" }).click();
  await page.getByRole("button", { name: "열기" }).click();
  await expect(page.locator("textarea")).toContainText("line 1");
});
