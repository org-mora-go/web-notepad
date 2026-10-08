import { expect, test } from "@playwright/test";

test("1. PC와 모바일에서 상태 표시줄에 BOOKMARK 라벨과 북마크 개수를 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.locator('.tab-item.is-active [role="tab"]').click({ button: "right" });
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  const bookmarkCommand = page.locator('.status-command[aria-controls="bookmarks-panel"]');
  const label = bookmarkCommand.locator(".status-label");
  const count = bookmarkCommand.locator(".status-count");

  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(label).toHaveText("BOOKMARK");
    await expect(label).toBeInViewport();
    await expect(count).toHaveText("(1)");
    await expect(count).toBeInViewport();
  }
});
