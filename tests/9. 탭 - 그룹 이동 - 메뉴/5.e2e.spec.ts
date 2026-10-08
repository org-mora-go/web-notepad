import { expect, type Locator, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { moveGroupSourceTab, openTabMenu, seedMoveGroupState } from "../__util__";

test("5. 그룹 선택 화면과 기본 탭 메뉴의 너비를 201px, 항목 최소 높이를 39px로 유지한다", async ({ page }) => {
  const tabActions = page.getByRole("menu", { name: "Tab actions", exact: true });
  const menu = page.getByRole("menu", { name: "Move Group", exact: true });
  const expectMenuSize = async (target: Locator) => {
    await expect(target).toHaveCSS("width", "201px");
    await expect(target.getByRole("menuitem").first()).toHaveCSS("min-height", "39px");
  };
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedMoveGroupState(page);
    await openTabMenu(moveGroupSourceTab(page), viewport);
    await expectMenuSize(tabActions);
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await expectMenuSize(menu);
    await menu.getByRole("menuitem", { name: "Back to tab actions" }).click();
    await expectMenuSize(tabActions);
  }
});
