import { expect, test } from "@playwright/test";

import { readMoveGroupState, seedMoveGroupState } from "../__util__";

test("5. 분할 패널의 탭을 이동하면 원래 그룹의 활성 탭을 조정하고 분할을 해제한다", async ({ page }) => {
  for (const sourceRight of [true, false]) {
    await seedMoveGroupState(page, { splitSource: true, sourceRight });
    await expect(page.locator("textarea")).toHaveCount(2);
    await page.getByRole("tab", { name: "Move me", exact: true }).click({ button: "right" });
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await page.getByRole("menuitem", { name: "Target", exact: true }).click();
    await expect(page.locator("textarea")).toHaveCount(1);
    await expect(page.locator("textarea")).toHaveValue("Keep source note");
    const state = await readMoveGroupState(page);
    expect(state.groups[0].tabs.map((tab) => tab.id)).toEqual(["tab-3"]);
    expect(state.groups[0].rightTabIds).toEqual([]);
    expect(state.groups[0].activeRightTabId).toBeNull();
    expect(state.groups[0].activeTabId).toBe("tab-3");
    expect(state.groups[0].activePane).toBe("left");
    await page.reload();
    await expect(page.locator("textarea")).toHaveCount(1);
    await expect(page.locator("textarea")).toHaveValue("Keep source note");
  }
});
