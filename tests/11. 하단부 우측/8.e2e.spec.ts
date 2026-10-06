import { expect, test } from "@playwright/test";

test("8. PC와 모바일에서 상태 표시줄 높이와 상하 및 좌우 패딩을 적용한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const statusBar = page.locator(".status-bar");
  await expect(statusBar).toHaveCSS("padding", "1px 14px");
  expect((await statusBar.boundingBox())!.height).toBe(36);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(statusBar).toHaveCSS("padding", "1px 8px");
  expect((await statusBar.boundingBox())!.height).toBe(36);
});