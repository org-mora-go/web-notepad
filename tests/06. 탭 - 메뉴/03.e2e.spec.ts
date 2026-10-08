import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { addTabButton } from "../__util__";

test.use({ hasTouch: true });

test("3. 모바일에서 탭 제목을 더블탭하면 고정·북마크 메뉴를 열고 상태를 전환한다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await addTabButton(page).tap();
  const tab = page.locator(".tab-item").first();
  const tabButton = tab.locator('[role="tab"]');
  const menuItem = (name: string) => page.getByRole("menuitem", { name, exact: true });

  await tabButton.tap();
  await tabButton.tap();
  await expect(page.getByRole("menu")).toBeVisible();
  await menuItem("Pin").tap();
  await expect(tab).toHaveClass(/is-pinned/);
  await tabButton.dblclick();
  await menuItem("Unpin").tap();
  await expect(tab).not.toHaveClass(/is-pinned/);
  await tabButton.dblclick();
  await menuItem("Bookmark").tap();
  await expect(tab).toHaveClass(/is-bookmarked/);
  await tabButton.dblclick();
  await menuItem("Remove bookmark").tap();
  await expect(tab).not.toHaveClass(/is-bookmarked/);
});
