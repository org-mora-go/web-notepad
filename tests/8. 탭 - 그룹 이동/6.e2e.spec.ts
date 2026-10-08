import { expect, test } from "@playwright/test";

import { readMoveGroupState, seedMoveGroupState } from "../__util__";

test("6. 분할 패널의 탭을 이동해도 대상 그룹의 오른쪽 패널과 나머지 탭을 유지한다", async ({ page }) => {
  for (const sourceRight of [true, false]) {
    await seedMoveGroupState(page, { splitSource: true, sourceRight, splitTarget: true });
    await page.getByRole("tab", { name: "Move me", exact: true }).click({ button: "right" });
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await page.getByRole("menuitem", { name: "Target", exact: true }).click();
    await expect(page.getByRole("menu")).toHaveCount(0);
    const state = await readMoveGroupState(page);
    expect(state.groups[1].tabs.map((tab) => tab.id)).toEqual(["tab-2", "tab-4", "tab-1"]);
    expect(state.groups[1].rightTabIds).toEqual(["tab-4"]);
    expect(state.groups[1].activeRightTabId).toBe("tab-4");
    await page.locator('button[aria-controls="groups-panel"]').click();
    await page.getByRole("button", { name: "Target", exact: true }).click();
    await expect(page.locator("textarea")).toHaveCount(2);
    await expect(page.locator("textarea").first()).toHaveValue("Move me\nselected line");
    await expect(page.locator("textarea").last()).toHaveValue("Target right note");
    await expect(page.getByRole("tab", { name: "Target note", exact: true })).toHaveCount(1);
    await page.reload();
    await expect(page.locator("textarea")).toHaveCount(2);
    await expect(page.locator("textarea").first()).toHaveValue("Move me\nselected line");
    await expect(page.locator("textarea").last()).toHaveValue("Target right note");
  }
});
