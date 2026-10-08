import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { moveGroupSourceTab, openTabMenu, seedMoveGroupState } from "../__util__";

test("2. 다른 그룹이 없으면 Move Group을 비활성화한다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedMoveGroupState(page, { withTarget: false });
    await openTabMenu(moveGroupSourceTab(page), viewport);
    await expect(page.getByRole("menuitem", { name: "Move Group", exact: true })).toBeDisabled();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toHaveCount(0);
  }
});
