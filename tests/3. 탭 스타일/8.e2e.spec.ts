import { expect, test } from "@playwright/test";

test("8. 핀과 북마크 아이콘으로 탭을 선택하고 드래그하되 상태는 유지한다", async ({ page }) => {
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
  await page.getByRole("button", { name: "새 탭 추가" }).click();
  await editor.fill("other note");
  const otherTab = page.locator(".tab-item").filter({ hasText: "other note" });
  const pinIcon = pinnedTab.locator(".tab-pin-indicator");
  const bookmarkIcon = bookmarkedTab.locator(".tab-bookmark-indicator");

  await expect(pinIcon).not.toHaveAttribute("draggable", "true");
  await expect(bookmarkIcon).not.toHaveAttribute("draggable", "true");
  await expect(pinnedTab.locator('[role="tab"] .tab-pin-indicator')).toHaveCount(1);
  await expect(bookmarkedTab.locator('[role="tab"] .tab-bookmark-indicator')).toHaveCount(1);
  await pinIcon.locator("svg").click();
  await expect(editor).toHaveValue("pinned note");
  await expect(pinnedTab).toHaveClass(/is-pinned/);
  await bookmarkIcon.locator("svg").click();
  await expect(editor).toHaveValue("bookmarked note");
  await expect(bookmarkedTab).toHaveClass(/is-bookmarked/);

  await pinnedTab.evaluate((element) => {
    element.addEventListener("dragstart", (event) => {
      element.setAttribute("data-drag-source-is-tab", String(event.target === element));
    }, { once: true });
  });
  await pinIcon.dragTo(otherTab);
  await expect(pinnedTab).toHaveAttribute("data-drag-source-is-tab", "true");
  await expect(page.locator(".tab-title")).toHaveText(["bookmarked note", "other note", "pinned note"]);
  await bookmarkedTab.evaluate((element) => {
    element.addEventListener("dragstart", (event) => {
      element.setAttribute("data-drag-source-is-tab", String(event.target === element));
    }, { once: true });
  });
  await bookmarkIcon.dragTo(pinnedTab);
  await expect(bookmarkedTab).toHaveAttribute("data-drag-source-is-tab", "true");
  await expect(page.locator(".tab-title")).toHaveText(["other note", "pinned note", "bookmarked note"]);
  await expect(pinnedTab).toHaveClass(/is-pinned/);
  await expect(bookmarkedTab).toHaveClass(/is-bookmarked/);
  await expect(page.getByRole("menu")).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await otherTab.locator('[role="tab"]').click();
  await pinIcon.click();
  await expect(editor).toHaveValue("pinned note");
  await bookmarkIcon.click();
  await expect(editor).toHaveValue("bookmarked note");
  await expect(pinnedTab).toHaveClass(/is-pinned/);
  await expect(bookmarkedTab).toHaveClass(/is-bookmarked/);
  await expect(page.getByRole("menu")).toHaveCount(0);
  await pinnedTab.locator('[role="tab"]').click();
  await pinIcon.dblclick();
  await expect(page.getByRole("menuitem", { name: "Unpin", exact: true })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Bookmark", exact: true })).toBeVisible();
  await expect(pinnedTab).toHaveClass(/is-pinned/);
  await page.keyboard.press("Escape");
  await bookmarkedTab.locator('[role="tab"]').click();
  await bookmarkIcon.dblclick();
  await expect(page.getByRole("menuitem", { name: "Pin", exact: true })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Remove bookmark", exact: true })).toBeVisible();
  await expect(bookmarkedTab).toHaveClass(/is-bookmarked/);
  await page.keyboard.press("Escape");
});