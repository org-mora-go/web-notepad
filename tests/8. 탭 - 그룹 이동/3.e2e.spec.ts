import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../__constant__";
import { readStoredState, seedMoveGroupState } from "../__util__";
import { moveTabToTarget } from "./__util__";

test("3. 원래 그룹의 마지막 탭을 이동하면 빈 탭을 새로 만든다", async ({ page }) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await seedMoveGroupState(page);
    await moveTabToTarget(page, viewport);
    await expect(page.getByRole("tab")).toHaveCount(1);
    await expect(page.locator("textarea")).toHaveValue("");

    const [source] = (await readStoredState(page)).groups;
    expect(source.tabs).toHaveLength(1);
    expect(source.tabs[0].id).not.toBe("tab-1");
    expect(source.tabs[0].content).toBe("");
    expect(source.activeTabId).toBe(source.tabs[0].id);
  }
});
