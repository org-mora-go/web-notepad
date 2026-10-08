import { expect, test } from "@playwright/test";

import { restoreStoredBookmark } from "../__util__";

test("2. 북마크 패널은 제목과 내용을 대소문자 구분 없이 부분 검색하며 placeholder는 Search bookmarks다", async ({ page }) => {
  await restoreStoredBookmark(page, {});
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  const search = page.getByRole("searchbox", { name: "북마크 검색" });
  const items = page.locator(".bookmark-item");
  await expect(search).toHaveAttribute("placeholder", "Search bookmarks");
  await expect(items).toHaveCount(1);

  await search.fill("OLD BOOK");
  await expect(items).toHaveCount(1);
  await search.fill("TWO");
  await expect(items).toHaveCount(1);
  await search.fill("hre");
  await expect(items).toHaveCount(1);
  await search.fill("missing");
  await expect(items).toHaveCount(0);
  await search.fill("");
  await expect(items).toHaveCount(1);
});
