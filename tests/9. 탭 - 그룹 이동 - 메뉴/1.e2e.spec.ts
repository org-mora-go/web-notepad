import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { moveGroupSourceTab, openTabMenu, seedMoveGroupState } from "../__util__";

test("1. PC와 모바일 탭 메뉴에 Move Group을 표시하고 현재 그룹을 제외한 목록을 연다", async ({ page }) => {
  const moveGroup = page.getByRole("menuitem", { name: "Move Group", exact: true });
  const menu = page.getByRole("menu", { name: "Move Group", exact: true });
  const targetOption = menu.getByRole("menuitem", { name: "Target", exact: true });
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedMoveGroupState(page);
    await openTabMenu(moveGroupSourceTab(page), viewport);
    await expect(moveGroup).toBeVisible();
    await expect(moveGroup).toBeEnabled();
    await moveGroup.click();
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Ungrouped", exact: true })).toHaveCount(0);
    await expect(targetOption).toBeVisible();
    await expect(targetOption).toBeFocused();
  }
});
