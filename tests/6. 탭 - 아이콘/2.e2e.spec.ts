import { expect, test } from "@playwright/test";

test("2. 핀·북마크 아이콘을 클릭하면 탭을 선택하고 상태를 유지한다", async ({ page }) => {
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

  const pinIcon = pinnedTab.locator(".tab-pin-indicator");
  const bookmarkIcon = bookmarkedTab.locator(".tab-bookmark-indicator");
  await expect(pinnedTab.locator('[role="tab"] .tab-pin-indicator')).toHaveCount(1);
  await expect(bookmarkedTab.locator('[role="tab"] .tab-bookmark-indicator')).toHaveCount(1);
  await pinIcon.click();
  await expect(editor).toHaveValue("pinned note");
  await expect(pinnedTab).toHaveClass(/is-pinned/);
  await bookmarkIcon.click();
  await expect(editor).toHaveValue("bookmarked note");
  await expect(bookmarkedTab).toHaveClass(/is-bookmarked/);
  await expect(page.getByRole("menu")).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await pinIcon.click();
  await expect(editor).toHaveValue("pinned note");
  await expect(pinnedTab).toHaveClass(/is-pinned/);
  await bookmarkIcon.click();
  await expect(editor).toHaveValue("bookmarked note");
  await expect(bookmarkedTab).toHaveClass(/is-bookmarked/);
  await expect(page.getByRole("menu")).toHaveCount(0);
});
