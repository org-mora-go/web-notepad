import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { moveGroupSourceTab, readStoredState, seedMoveGroupState } from "../__util__";
import { moveTabToTarget, openTargetGroup } from "./__util__";

test("4. 그룹 이동 결과는 새로고침 후에도 유지한다", async ({ page }) => {
  const movedTab = moveGroupSourceTab(page);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedMoveGroupState(page);
    await moveTabToTarget(page, viewport);

    const moved = await readStoredState(page);
    await page.reload();
    expect(await readStoredState(page)).toEqual(moved);
    await expect(movedTab).toHaveCount(0);
    await openTargetGroup(page);
    await expect(movedTab).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("textarea")).toHaveValue("Move me\nselected line");
  }
});
