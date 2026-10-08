import { expect, test } from "@playwright/test";

test("2. PC에서는 더블클릭으로 탭 메뉴를 열지 않는다", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item").first();
  const tabButton = tab.locator('[role="tab"]');

  await tabButton.dblclick();
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(tab).not.toHaveClass(/is-pinned/);
  await expect(tab).not.toHaveClass(/is-bookmarked/);
});
