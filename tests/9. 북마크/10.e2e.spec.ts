import { expect, test } from "@playwright/test";

import { restoreStoredBookmark } from "./__util__";

test("10. 기존 북마크의 그레이 색상과 첫 줄 선택을 유지한다", async ({ page }) => {
  await restoreStoredBookmark(page, { tabColor: "gray", selectedLines: [0] });
  await expect(page.locator("textarea")).toHaveValue("one\ntwo\nthree");
  await expect(page.locator(".tab-item.is-active")).toHaveAttribute("data-tab-color", "gray");
  const lines = page.locator('.line-rail [role="button"]');
  await expect(lines.first()).toHaveAttribute("aria-pressed", "true");
  await expect(lines.nth(1)).toHaveAttribute("aria-pressed", "false");
  await expect(lines.nth(2)).toHaveAttribute("aria-pressed", "false");
});