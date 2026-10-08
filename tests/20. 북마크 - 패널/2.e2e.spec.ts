import { expect, test } from "@playwright/test";

import { bookmarkActiveTab, bookmarksCommand } from "../__util__";

test("2. 북마크 패널에서 북마크를 제거할 수 있다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "bookmark to remove");
  await bookmarksCommand(page).click();
  await page.locator(".bookmark-item .remove-bookmark").click();
  await expect(page.locator(".bookmark-item")).toHaveCount(0);
});
