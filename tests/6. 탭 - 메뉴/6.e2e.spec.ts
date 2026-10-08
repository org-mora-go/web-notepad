import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { openTabMenu } from "../__util__";

test("6. 탭 메뉴의 Pin과 Bookmark 글자 크기를 14px로 표시한다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const tab = page.getByRole("tab").first();

    for (const name of ["Pin", "Bookmark", "Unpin", "Remove bookmark"]) {
      await openTabMenu(tab, viewport);
      const item = page.getByRole("menuitem", { name, exact: true });
      await expect(item).toBeVisible();
      await expect(item).toHaveCSS("font-size", "14px");
      await expect(item.locator("span")).toHaveCSS("font-size", "14px");
      await expect(item.locator("svg")).toHaveAttribute("width", "14");
      await expect(item.locator("svg")).toHaveAttribute("height", "14");
      await item.click();
    }
  }
});
