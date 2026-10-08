import { expect, test } from "@playwright/test";

import { readStoredState, seedMoveGroupState } from "../__util__";
import { moveTabToTarget } from "./__util__";

test("5. 분할 패널의 탭을 이동하면 원래 그룹의 활성 탭을 조정하고 분할을 해제한다", async ({ page }) => {
  const editors = page.locator("textarea");
  for (const sourceRight of [true, false]) {
    await seedMoveGroupState(page, { splitSource: true, sourceRight });
    await expect(editors).toHaveCount(2);
    await moveTabToTarget(page);
    await expect(editors).toHaveCount(1);
    await expect(editors).toHaveValue("Keep source note");
    const [source] = (await readStoredState(page)).groups;
    expect(source.tabs.map((tab) => tab.id)).toEqual(["tab-3"]);
    expect(source.rightTabIds).toEqual([]);
    expect(source.activeRightTabId).toBeNull();
    expect(source.activeTabId).toBe("tab-3");
    expect(source.activePane).toBe("left");
    await page.reload();
    await expect(editors).toHaveCount(1);
    await expect(editors).toHaveValue("Keep source note");
  }
});
