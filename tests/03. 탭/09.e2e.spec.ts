import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";

test("9. 모바일에서 탭 글자와 크기 및 왼쪽 색상 아이콘을 1px 증가한다", async ({ page }) => {
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
  await expect(tab).toHaveCSS("height", "38px");
  await expect(tab).toHaveCSS("min-width", "108.406px");
  await expect(tab).toHaveCSS("max-width", "247.65px");
  await expect(tab.getByRole("tab")).toHaveCSS("height", "38px");
  await expect(tab.locator(".tab-close")).toHaveCSS("height", "38px");
  await expect(title).toHaveCSS("font-size", "15px");
  expect(await iconWidth()).toBe("11px");
});