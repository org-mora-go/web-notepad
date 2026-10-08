import { expect, test } from "@playwright/test";

import { readMoveGroupState, seedMoveGroupState } from "./__util__";

test("3. 분할 탭의 그룹 이동 시 원본 분할을 정리하고 대상 분할을 유지한다", async ({ page }) => {
  for (const sourceRight of [true, false]) {
    await seedMoveGroupState(page, { splitSource: true, sourceRight, splitTarget: true });
    await expect(page.locator("textarea")).toHaveCount(2);
    await page.getByRole("tab", { name: "Move me", exact: true }).click({ button: "right" });
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await page.getByRole("menuitem", { name: "Target", exact: true }).click();
    await expect(page.locator("textarea")).toHaveCount(1);
    await expect(page.locator("textarea")).toHaveValue("Keep source note");
    const state = await readMoveGroupState(page);
    expect(state.groups[0].rightTabIds).toEqual([]);
    expect(state.groups[0].activeRightTabId).toBeNull();
    expect(state.groups[0].activeTabId).toBe("tab-3");
    expect(state.groups[0].activePane).toBe("left");
    expect(state.groups[1].rightTabIds).toEqual(["tab-4"]);
    expect(state.groups[1].activeRightTabId).toBe("tab-4");
    await page.locator('button[aria-controls="groups-panel"]').click();
    await page.getByRole("button", { name: "Target", exact: true }).click();
    await expect(page.locator("textarea")).toHaveCount(2);
    await expect(page.locator("textarea").first()).toHaveValue("Move me\nselected line");
    await expect(page.locator("textarea").last()).toHaveValue("Target right note");
    await page.reload();
    await expect(page.locator("textarea")).toHaveCount(2);
    await expect(page.locator("textarea").first()).toHaveValue("Move me\nselected line");
  }
});