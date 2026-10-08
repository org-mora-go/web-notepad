import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "../__util__";

test("3. 북마크 패널에서 북마크를 제거할 수 있다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await bookmarkActiveTab(page, "bookmark to remove");
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await page.locator(".bookmark-item .remove-bookmark").click();
  await expect(page.locator(".bookmark-item")).toHaveCount(0);
});
