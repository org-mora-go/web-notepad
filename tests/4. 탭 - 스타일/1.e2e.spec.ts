import { expect, test } from "@playwright/test";

test("1. 탭 제목의 길이와 표기 및 최소 너비를 일관되게 유지한다", async ({
  page,
}) => {
  await page.goto("http://localhost:3000");
  const title = page.locator(".tab-item.is-active .tab-title");
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
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.locator("textarea").fill("  First title  \nsecond line");
  await expect(title).toHaveText("First title");
  await page.locator("textarea").fill("A".repeat(40));
  await expect(title).toHaveText("A".repeat(28));
  await page.locator("textarea").fill("");
  await expect(title).toHaveText("-");
});
