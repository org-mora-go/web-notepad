import { expect, test } from "@playwright/test";

import { chooseTabMenuItem } from "../__util__";

test("1. PC 우클릭 메뉴에서 탭의 고정과 북마크를 전환할 수 있다", async ({
  page,
}) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();

  await chooseTabMenuItem(page, "Pin");
  await expect(tab).toHaveClass(/is-pinned/);

  await chooseTabMenuItem(page, "Unpin");
  await expect(tab).not.toHaveClass(/is-pinned/);

  await chooseTabMenuItem(page, "Bookmark");
  await expect(tab).toHaveClass(/is-bookmarked/);

  await chooseTabMenuItem(page, "Remove bookmark");
  await expect(tab).not.toHaveClass(/is-bookmarked/);
});
