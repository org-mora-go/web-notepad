import { expect, test } from "@playwright/test";

test("5. 모바일에서 핀·북마크 아이콘을 더블탭하면 해당 탭의 메뉴를 연다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const editor = page.locator("textarea");
  await editor.fill("pinned note");
  const pinnedTab = page.locator(".tab-item").filter({ hasText: "pinned note" });
  await pinnedTab.locator('[role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Pin", exact: true }).click();

  await page.getByRole("button", { name: "새 탭 추가" }).click();
  await editor.fill("bookmarked note");
  const bookmarkedTab = page.locator(".tab-item").filter({ hasText: "bookmarked note" });
  await bookmarkedTab.locator('[role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark", exact: true }).click();

  await page.setViewportSize({ width: 390, height: 844 });
  const pinIcon = pinnedTab.locator(".tab-pin-indicator");
  await pinnedTab.locator('[role="tab"]').click();
  await pinIcon.dblclick();
  await expect(page.getByRole("menuitem", { name: "Unpin", exact: true })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Bookmark", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");

  const bookmarkIcon = bookmarkedTab.locator(".tab-bookmark-indicator");
  await bookmarkedTab.locator('[role="tab"]').click();
  await bookmarkIcon.dblclick();
  await expect(page.getByRole("menuitem", { name: "Pin", exact: true })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Remove bookmark", exact: true })).toBeVisible();
});
