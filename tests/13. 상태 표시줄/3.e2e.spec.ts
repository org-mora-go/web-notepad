import { expect, test } from "@playwright/test";

test("3. PC와 모바일에서 상태 표시줄 높이와 상하 및 좌우 패딩을 적용한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const statusBar = page.locator(".status-bar");
  await expect(statusBar).toHaveCSS("padding", "3px 16px");
  expect((await statusBar.boundingBox())!.height).toBe(40);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(statusBar).toHaveCSS("padding", "3px 10px");
  expect((await statusBar.boundingBox())!.height).toBe(40);
});
