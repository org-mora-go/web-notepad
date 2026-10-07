import { expect, test } from "@playwright/test";

import { restoreStoredBookmark } from "../__util__";

test("3. 색상과 줄 선택 정보가 없는 기존 북마크는 그린과 선택 없음으로 복원한다", async ({ page }) => {
  await restoreStoredBookmark(page, {});
  await expect(page.locator("textarea")).toHaveValue("one\ntwo\nthree");
  await expect(page.locator(".tab-item.is-active")).toHaveAttribute("data-tab-color", "green");
  const lines = page.locator('.line-rail [role="button"]');
  for (let index = 0; index < 3; index += 1) {
    await expect(lines.nth(index)).toHaveAttribute("aria-pressed", "false");
  }
});