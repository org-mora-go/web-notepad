import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { bookmarkActiveTab, closeActiveTabWithContent } from "../__util__";

test("6. PC 하단 라벨은 14px·개수는 12px, 모바일은 각각 12px·10px다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "closed note");
  await bookmarkActiveTab(page, "note");
  const labels = page.locator(".status-meta .status-command > span:not(.status-separator):not(.status-count)");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const label of await labels.all()) {
      await expect(label).toHaveCSS("font-size", viewport.width <= 640 ? "12px" : "14px");
    }
    for (const count of await page.locator(".status-count").all()) {
      await expect(count).toHaveCSS("font-size", viewport.width <= 640 ? "10px" : "12px");
    }
  }
});
