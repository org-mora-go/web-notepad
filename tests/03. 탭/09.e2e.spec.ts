import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("9. 모바일 탭 높이는 44px, 최소 너비는 114.406px, 색상 아이콘은 13px이다", async ({ page }) => {
  await page.goto("/");

  const tab = page.locator(".tab-item").first();
  const title = tab.locator(".tab-title");
  const colorIcon = tab.locator(".dirty-dot");
  const iconWidth = () => colorIcon.evaluate((element) =>
    getComputedStyle(element, "::before").width,
  );

  await expect(tab).toHaveCSS("height", "37px");
  await expect(tab).toHaveCSS("min-width", "130.485px");
  await expect(tab).toHaveCSS("max-width", "300.655px");
  await expect(title).toHaveCSS("font-size", "14px");
  expect(await iconWidth()).toBe("10px");

  await page.setViewportSize(MOBILE_VIEWPORT);
  await expect(tab).toHaveCSS("height", "44px");
  await expect(tab).toHaveCSS("min-width", "114.406px");
  await expect(tab).toHaveCSS("max-width", "247.65px");
  await expect(tab.getByRole("tab")).toHaveCSS("height", "44px");
  await expect(tab.locator(".tab-close")).toHaveCSS("height", "44px");
  await expect(title).toHaveCSS("font-size", "15px");
  expect(await iconWidth()).toBe("13px");
});