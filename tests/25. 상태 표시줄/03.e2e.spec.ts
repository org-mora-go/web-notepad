import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("3. 모바일에서 SHORTCUT 버튼과 구분자를 숨긴다", async ({ page }) => {
  await page.goto("/");
  const shortcut = page.locator(".shortcut-command");
  await expect(shortcut).toBeVisible();
  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(shortcut).toBeHidden();
  await expect(shortcut.locator(".status-separator")).toBeHidden();
});