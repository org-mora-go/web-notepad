import { expect, test } from "@playwright/test";

test.use({ hasTouch: true });

test("3. 모바일에서 탭 제목을 더블탭하면 고정·북마크 메뉴를 열고 상태를 전환한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "새 탭 추가" }).tap();
  const tab = page.locator(".tab-item").first();
  const tabButton = tab.locator('[role="tab"]');

  await tabButton.tap();
  await tabButton.tap();
  await expect(page.getByRole("menu")).toBeVisible();
  await page.getByRole("menuitem", { name: "Pin", exact: true }).tap();
  await expect(tab).toHaveClass(/is-pinned/);
  await tabButton.dblclick();
  await page.getByRole("menuitem", { name: "Unpin", exact: true }).tap();
  await expect(tab).not.toHaveClass(/is-pinned/);
  await tabButton.dblclick();
  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).tap();
  await expect(tab).toHaveClass(/is-bookmarked/);
  await tabButton.dblclick();
  await page.getByRole("menuitem", { name: "Remove bookmark", exact: true }).tap();
  await expect(tab).not.toHaveClass(/is-bookmarked/);
});
