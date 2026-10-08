import { expect, test } from "@playwright/test";

import { bookmarkActiveTab } from "../__util__";

test("9. 모바일에서 SEARCH와 그룹은 고정하고 가운데 명령을 스크롤하며 fog를 표시한다", async ({ page }) => {
  await page.goto("/");
  await bookmarkActiveTab(page, "mobile note");
  await page.setViewportSize({ width: 180, height: 844 });

  const search = page.locator(".global-search-command");
  const scrollArea = page.locator(".status-scroll-area");
  const group = page.locator(".group-status-command");

  const positions = await page.evaluate(() => {
    const bar = document.querySelector(".status-bar")!;
    const searchCommand = document.querySelector(".global-search-command")!;
    const groupCommand = document.querySelector(".group-status-command")!;
    const barBounds = bar.getBoundingClientRect();
    const searchBounds = searchCommand.getBoundingClientRect();
    const groupBounds = groupCommand.getBoundingClientRect();
    const style = getComputedStyle(bar);
    return {
      searchLeft: searchBounds.left,
      expectedSearchLeft: barBounds.left + parseFloat(style.paddingLeft),
      groupRight: groupBounds.right,
      expectedGroupRight: barBounds.right - parseFloat(style.paddingRight),
    };
  });

  expect(Math.abs(positions.searchLeft - positions.expectedSearchLeft)).toBeLessThan(1);
  expect(Math.abs(positions.groupRight - positions.expectedGroupRight)).toBeLessThan(1);
  await expect(search).toBeVisible();
  await expect(group.locator(".group-status-name")).toBeVisible();
  await expect(scrollArea).toHaveClass(/has-right-fog/);
  expect(
    await scrollArea.evaluate((element) => element.scrollWidth > element.clientWidth),
  ).toBe(true);

  await scrollArea.evaluate((element) => {
    element.scrollLeft = element.scrollWidth;
  });
  await expect(scrollArea).toHaveClass(/has-left-fog/);
  await expect(scrollArea).not.toHaveClass(/has-right-fog/);
});