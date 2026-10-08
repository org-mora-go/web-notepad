import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../__constant__";
import { activeTabItem } from "../__util__";

test("6. 탭 최소 너비를 PC와 모바일에서 2px 늘린다", async ({ page }) => {
  await page.goto("/");
  const tab = activeTabItem(page);
  const readMinWidth = () =>
    tab.evaluate((element) => parseFloat(getComputedStyle(element).minWidth));
  expect(await readMinWidth()).toBeCloseTo(130.485, 2);

  await page.setViewportSize(MOBILE_VIEWPORT);
  expect(await readMinWidth()).toBeCloseTo(107.406, 2);
});
