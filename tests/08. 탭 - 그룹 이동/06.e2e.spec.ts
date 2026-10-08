import { expect, test } from "@playwright/test";

import { readStoredState, seedMoveGroupState, switchGroup } from "../__util__";
import { moveTabToTarget } from "./__util__";

test("6. 분할 패널의 탭을 이동해도 대상 그룹의 오른쪽 패널과 나머지 탭을 유지한다", async ({ page }) => {
  const editors = page.locator("textarea");
  const expectTargetSplit = async () => {
    await expect(editors).toHaveCount(2);
    await expect(editors.first()).toHaveValue("Move me\nselected line");
    await expect(editors.last()).toHaveValue("Target right note");
  };
  for (const sourceRight of [true, false]) {
    await seedMoveGroupState(page, { splitSource: true, sourceRight, splitTarget: true });
    await moveTabToTarget(page);
    const target = (await readStoredState(page)).groups[1];
    expect(target.tabs.map((tab) => tab.id)).toEqual(["tab-2", "tab-4", "tab-1"]);
    expect(target.rightTabIds).toEqual(["tab-4"]);
    expect(target.activeRightTabId).toBe("tab-4");
    await switchGroup(page, "Target");
    await expectTargetSplit();
    await expect(page.getByRole("tab", { name: "Target note", exact: true })).toHaveCount(1);
    await page.reload();
    await expectTargetSplit();
  }
});
