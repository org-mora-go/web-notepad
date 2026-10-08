import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("7. PC와 모바일에서 상태 표시줄 높이와 패딩을 적용한다", async ({ page }) => {
  await page.goto("/");
  const statusBar = page.locator(".status-bar");
  await expect(statusBar).toHaveCSS("padding-top", "3px");
  await expect(statusBar).toHaveCSS("padding-right", "21px");
  await expect(statusBar).toHaveCSS("padding-bottom", "6px");
  await expect(statusBar).toHaveCSS("padding-left", "21px");
  expect((await statusBar.boundingBox())!.height).toBe(42);
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(statusBar).toHaveCSS("padding-top", "3px");
  await expect(statusBar).toHaveCSS("padding-right", "15px");
  await expect(statusBar).toHaveCSS("padding-bottom", "6px");
  await expect(statusBar).toHaveCSS("padding-left", "10px");
  expect((await statusBar.boundingBox())!.height).toBe(52);
});
