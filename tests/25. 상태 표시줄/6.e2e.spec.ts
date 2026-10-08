import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { bookmarkActiveTab, closeActiveTabWithContent } from "../__util__";

test("6. PC와 모바일에서 닫은 탭·북마크·그룹 라벨, 개수와 구분자를 14px로 표시한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "closed note");
  await bookmarkActiveTab(page, "note");
  const labels = page.locator(".status-meta .status-command > span");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    for (const label of await labels.all()) {
      await expect(label).toHaveCSS("font-size", "14px");
    }
  }
});
