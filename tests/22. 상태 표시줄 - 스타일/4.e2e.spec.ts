import { expect, test } from "@playwright/test";

test("4. PC와 모바일에서 상태 표시줄 높이와 패딩을 적용한다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const statusBar = page.locator(".status-bar");
  await expect(statusBar).toHaveCSS("padding", "3px 21px 6px 16px");
  expect((await statusBar.boundingBox())!.height).toBe(42);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(statusBar).toHaveCSS("padding", "3px 15px 6px 10px");
  expect((await statusBar.boundingBox())!.height).toBe(42);
});
