import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { moveGroupSourceTab, openTabMenu, seedMoveGroupState } from "../__util__";

test("5. 그룹 선택 화면과 기본 탭 메뉴의 너비를 188px로 유지한다", async ({ page }) => {
  const tabActions = page.getByRole("menu", { name: "Tab actions", exact: true });
  const menu = page.getByRole("menu", { name: "Move Group", exact: true });
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedMoveGroupState(page);
    await openTabMenu(moveGroupSourceTab(page), viewport);
    await expect(tabActions).toHaveCSS("width", "188px");
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await expect(menu).toHaveCSS("width", "188px");
    await menu.getByRole("menuitem", { name: "Back to tab actions" }).click();
    await expect(tabActions).toHaveCSS("width", "188px");
  }
});
