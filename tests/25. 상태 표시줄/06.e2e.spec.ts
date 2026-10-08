import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { bookmarkActiveTab, closeActiveTabWithContent } from "../__util__";

test("6. 모바일에서 상태 표시줄 글자를 16px로 표시하고 PC에서는 14px로 표시한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "closed note");
  await bookmarkActiveTab(page, "note");
  const labels = page.locator(".status-meta .status-command > span");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const expectedFontSize = viewport.width <= 640 ? "16px" : "14px";
    for (const label of await labels.all()) {
      await expect(label).toHaveCSS("font-size", expectedFontSize);
    }
  }
});
