import { expect, test } from "@playwright/test";

test("2. PC에서는 더블클릭으로 탭 메뉴를 열지 않는다", async ({ page }) => {
  await page.goto("/");
  const tab = page.locator(".tab-item").first();

  await tab.locator('[role="tab"]').dblclick();
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(tab).not.toHaveClass(/is-pinned/);
  await expect(tab).not.toHaveClass(/is-bookmarked/);
});
