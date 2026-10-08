import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("7. PC와 모바일에서 상태 표시줄 높이와 패딩을 적용한다", async ({ page }) => {
  await page.goto("/");
  const statusBar = page.locator(".status-bar");
  await expect(statusBar).toHaveCSS("padding", "3px 21px 6px 16px");
  expect((await statusBar.boundingBox())!.height).toBe(42);
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(statusBar).toHaveCSS("padding", "3px 15px 6px 10px");
  expect((await statusBar.boundingBox())!.height).toBe(42);
});
