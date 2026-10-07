import { expect, test } from "@playwright/test";

test("3. 모바일에서도 북마크 개수를 표시한다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000");
  await page.locator('.tab-item.is-active [role="tab"]').dblclick();
  await page.getByRole("menuitem", { name: "Bookmark" }).click();
  const count = page.locator('.status-command[aria-controls="bookmarks-panel"] .status-count');
  await expect(count).toHaveText("(1)");
  await expect(count).toBeInViewport();
});
