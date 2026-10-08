import { expect, test } from "@playwright/test";

import { seedMoveGroupState } from "../__util__";

test("1. PC와 모바일 탭 메뉴에 Move Group을 표시하고 현재 그룹을 제외한 목록을 연다", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await seedMoveGroupState(page);
    const tab = page.getByRole("tab", { name: "Move me", exact: true });
    if (width === 1280) await tab.click({ button: "right" });
    else await tab.dblclick();
    const moveGroup = page.getByRole("menuitem", { name: "Move Group", exact: true });
    await expect(moveGroup).toBeVisible();
    await expect(moveGroup).toBeEnabled();
    await moveGroup.click();
    const menu = page.getByRole("menu", { name: "Move Group", exact: true });
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Ungrouped", exact: true })).toHaveCount(0);
    await expect(menu.getByRole("menuitem", { name: "Target", exact: true })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Target", exact: true })).toBeFocused();
  }
});
