import { expect, test } from "@playwright/test";

test.use({ hasTouch: true });

test("10. 모바일에서는 더블탭으로만 탭의 고정과 북마크 메뉴를 연다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");
  await page.getByRole("button", { name: "새 탭 추가" }).tap();
  const tab = page.locator(".tab-item").first();
  const tabButton = tab.locator('[role="tab"]');
  await tabButton.tap();
  await expect(tabButton).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await tabButton.click({ button: "right" });
  await expect(page.getByRole("menu")).toHaveCount(0);
  await tabButton.dispatchEvent("contextmenu", { clientX: 60, clientY: 20 });
  await expect(page.getByRole("menu")).toHaveCount(0);

  await page.locator("textarea").tap();
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