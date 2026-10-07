import { expect, test } from "@playwright/test";

test("5. PC와 모바일에서 명령 사이에만 구분자를 표시한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const shortcut = page.locator(".shortcut-command");
  const bookmark = page.locator('.status-command[aria-controls="bookmarks-panel"]');
  const group = page.locator(".group-status-command");
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(shortcut.locator(".status-separator")).toHaveCount(1);
    await expect(bookmark.locator(".status-separator")).toHaveCount(1);
    await expect(group.locator(".status-separator")).toHaveCount(0);
    await expect(bookmark.locator(".status-separator")).toHaveText("|");
    const expectedMargin = width === 1280 ? "9px" : "6px";
    await expect(shortcut.locator(".status-separator")).toHaveCSS("margin-left", expectedMargin);
    await expect(shortcut.locator(".status-separator")).toHaveCSS("margin-right", expectedMargin);
    await expect(bookmark.locator(".status-separator")).toHaveCSS("margin-left", expectedMargin);
    await expect(bookmark.locator(".status-separator")).toHaveCSS("margin-right", expectedMargin);
    if (width === 1280) {
      await expect(shortcut.locator(".status-separator")).toBeVisible();
      await expect(page.locator(".status-meta .status-separator:visible")).toHaveCount(2);
    } else {
      await expect(shortcut).toBeHidden();
      await expect(shortcut.locator(".status-separator")).toBeHidden();
      await expect(page.locator(".status-meta .status-separator:visible")).toHaveCount(1);
    }
  }
});
