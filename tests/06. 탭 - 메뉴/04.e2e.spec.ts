import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { addTabButton } from "../__util__";

test.use({ hasTouch: true });

test("4. 모바일에서는 한 번 탭하거나 우클릭·길게 누르기로 탭 메뉴를 열지 않는다", async ({ page }) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await page.goto("/");
  await addTabButton(page).tap();
  const tab = page.locator(".tab-item").first();
  const tabButton = tab.locator('[role="tab"]');
  const menu = page.getByRole("menu");

  await tabButton.tap();
  await expect(tabButton).toHaveAttribute("aria-selected", "true");
  await expect(menu).toHaveCount(0);
  await tabButton.click({ button: "right" });
  await expect(menu).toHaveCount(0);
  await tabButton.dispatchEvent("contextmenu", { clientX: 60, clientY: 20 });
  await expect(menu).toHaveCount(0);
  await expect(tab).not.toHaveClass(/is-pinned/);
  await expect(tab).not.toHaveClass(/is-bookmarked/);
});
