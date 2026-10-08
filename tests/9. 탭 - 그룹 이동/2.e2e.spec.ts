import { expect, test } from "@playwright/test";

import { readMoveGroupState, seedMoveGroupState } from "../__util__";

test("2. 그룹 이동 후 현재 그룹 화면을 유지하고 대상 그룹에서 옮긴 탭을 왼쪽 활성 탭으로 지정한다", async ({ page }) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await seedMoveGroupState(page, { splitSource: true, sourceRight: false });
    const tab = page.getByRole("tab", { name: "Move me", exact: true });
    if (width === 1280) await tab.click({ button: "right" });
    else await tab.dblclick();
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();
    await page.getByRole("menuitem", { name: "Target", exact: true }).click();
    await expect(page.getByRole("menu")).toHaveCount(0);
    await expect(page.locator("textarea")).toHaveValue("Keep source note");

    const moved = await readMoveGroupState(page);
    expect(moved.activeGroupId).toBe("ungrouped");
    expect(moved.groups[1].activeTabId).toBe("tab-1");
    expect(moved.groups[1].activePane).toBe("left");
    expect(moved.groups[1].rightTabIds).not.toContain("tab-1");

    await page.locator('button[aria-controls="groups-panel"]').click();
    await page.getByRole("button", { name: "Target", exact: true }).click();
    await expect(page.locator(".tab-item.is-active")).toHaveCount(1);
    await expect(page.locator("textarea")).toHaveValue("Move me\nselected line");
  }
});
