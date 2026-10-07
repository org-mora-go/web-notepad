import { expect, test } from "@playwright/test";

test("2. 탭 최소 너비를 PC와 모바일에서 2px 늘린다", async ({ page }) => {
  await page.goto("http://localhost:3000");
  const tab = page.locator(".tab-item.is-active");
  const desktopMinWidth = await tab.evaluate((element) =>
    parseFloat(getComputedStyle(element).minWidth),
  );
  expect(desktopMinWidth).toBeCloseTo(130.485, 2);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileMinWidth = await tab.evaluate((element) =>
    parseFloat(getComputedStyle(element).minWidth),
  );
  expect(mobileMinWidth).toBeCloseTo(107.406, 2);
});
