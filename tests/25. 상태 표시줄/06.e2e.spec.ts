import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { bookmarkActiveTab, closeActiveTabWithContent } from "../__util__";

test("6. PC 글자는 14px, 모바일 라벨은 12px, 개수 배지는 10px로 표시한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "closed note");
  await bookmarkActiveTab(page, "note");
  const labels = page.locator(".status-controls .status-label, .global-search-label, .group-status-label, .group-status-name");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const expectedFontSize = viewport.width <= 640 ? "12px" : "14px";
    for (const label of await labels.all()) {
      await expect(label).toHaveCSS("font-size", expectedFontSize);
    }
    for (const count of await page.locator(".status-count").all()) {
      await expect(count).toHaveCSS("font-size", viewport.width <= 640 ? "10px" : "14px");
    }
  }
});
