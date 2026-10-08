import { expect, test } from "@playwright/test";

import { restoreStoredBookmark } from "../__util__";

test("2. 기존 블루 북마크를 레드로 복원하고 잘못된 선택 줄을 정리한다", async ({ page }) => {
  await restoreStoredBookmark(page, {
    tabColor: "blue",
    selectedLines: [2, 1, 1, -1, 3, 0.5, "0"],
  });
  await expect(page.locator("textarea")).toHaveValue("one\ntwo\nthree");
  await expect(page.locator(".tab-item.is-active")).toHaveAttribute("data-tab-color", "red");
  const lines = page.locator('.line-rail [role="button"]');
  await expect(lines.first()).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "true");
});