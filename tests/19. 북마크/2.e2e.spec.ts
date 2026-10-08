import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "../__util__";

test("2. 원본 탭의 내용과 색상 및 줄 선택 변경을 북마크에 반영한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  await bookmarkActiveTab(page, "original\nsecond\nthird");
  const editor = page.locator("textarea");
  await editor.fill("updated\nsecond\nthird");
  await page.locator(".tab-item.is-active .dirty-dot").click();
  const lines = page.locator('.line-rail [role="button"]');
  await lines.nth(1).click();
  await lines.nth(2).click();
  await lines.nth(1).click();
  await editor.fill("prefix\nupdated\nsecond\nthird");
  await expect(lines.nth(3)).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => page.evaluate(() => {
    const saved = JSON.parse(localStorage.getItem("web-notepad-storage")!);
    const bookmark = saved.state.groups[0].bookmarks[0];
    return {
      title: bookmark.title,
      content: bookmark.content,
      tabColor: bookmark.tabColor,
      selectedLines: bookmark.selectedLines,
    };
  })).toEqual({
    title: "prefix",
    content: "prefix\nupdated\nsecond\nthird",
    tabColor: "gray",
    selectedLines: [3],
  });
  await page.locator('button[aria-controls="bookmarks-panel"]').click();
  await expect(page.locator(".bookmark-item")).toContainText("updated");
});
